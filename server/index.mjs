import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { GeminiProvider } from "./ai/GeminiProvider.mjs";

if (existsSync(".env") && typeof process.loadEnvFile === "function") {
  process.loadEnvFile(".env");
}

const provider = new GeminiProvider();
const HOST = process.env.API_HOST || "127.0.0.1";
const PORT = Number(process.env.API_PORT || 8787);
const MAX_BODY_BYTES = 24 * 1024;
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 12;
const rateBuckets = new Map();

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(data));
}

function withinRateLimit(req) {
  const key = req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const entry = rateBuckets.get(key);

  if (!entry || now - entry.startedAt >= WINDOW_MS) {
    rateBuckets.set(key, { startedAt: now, count: 1 });
    return true;
  }

  entry.count += 1;
  return entry.count <= MAX_REQUESTS;
}

async function readJson(req) {
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error("Request body is too large.");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Request body must be valid JSON.");
    error.statusCode = 400;
    throw error;
  }
}

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 12) {
    return "Send between 1 and 12 conversation messages.";
  }

  let total = 0;
  for (const message of messages) {
    if (!message || !["user", "assistant"].includes(message.role)) {
      return "A message has an invalid role.";
    }
    if (
      typeof message.content !== "string" ||
      !message.content.trim() ||
      message.content.length > 6000
    ) {
      return "Each message must contain 1 to 6,000 characters.";
    }
    total += message.content.length;
  }

  if (total > 18_000) return "Conversation is too long. Start a new conversation.";
  if (messages.at(-1).role !== "user") return "The final message must be from the user.";
  return null;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && url.pathname === "/api/health") {
    return sendJson(res, 200, {
      ok: true,
      provider: "gemini",
      model: provider.model,
      configured: provider.isConfigured(),
    });
  }

  if (req.method !== "POST" || url.pathname !== "/api/assistant/chat") {
    return sendJson(res, 404, { error: "Endpoint not found." });
  }

  if (!withinRateLimit(req)) {
    return sendJson(res, 429, { error: "Too many requests. Wait a moment and try again." });
  }

  try {
    const body = await readJson(req);
    const invalid = validateMessages(body.messages);
    if (invalid) return sendJson(res, 400, { error: invalid });

    const result = await provider.generateReply(body.messages);
    return sendJson(res, 200, { reply: result.text, model: result.model });
  } catch (error) {
    const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    if (status >= 500) console.error("Assistant API error:", error.message);

    return sendJson(res, status, {
      error: status >= 500 && status !== 503
        ? "The assistant could not complete that request. Try again."
        : error.message,
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Rising Giants API listening at http://${HOST}:${PORT}`);
  console.log(`Gemini model: ${provider.model}`);
  console.log(`API key: ${provider.isConfigured() ? "configured" : "not configured yet"}`);
});
