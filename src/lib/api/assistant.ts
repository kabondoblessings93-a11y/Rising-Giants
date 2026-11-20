import type { AiChatMessage } from "../../types/domain";

export interface AssistantHealth {
  ok: boolean;
  provider: string;
  model: string;
  configured: boolean;
}

export interface AssistantReply {
  reply: string;
  model: string;
}

async function readResponse(response: Response) {
  return response.json().catch(() => ({})) as Promise<Record<string, unknown>>;
}

export async function getAssistantHealth(): Promise<AssistantHealth> {
  const response = await fetch("/api/health", { cache: "no-store" });
  const data = await readResponse(response);

  if (!response.ok || data.ok !== true) {
    throw new Error("The Rising Giants API is unavailable.");
  }

  return data as unknown as AssistantHealth;
}

export async function requestAssistantReply(
  messages: Pick<AiChatMessage, "role" | "content">[]
): Promise<AssistantReply> {
  const response = await fetch("/api/assistant/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      typeof data.error === "string"
        ? data.error
        : "The assistant could not complete your request."
    );
  }

  if (typeof data.reply !== "string" || !data.reply.trim()) {
    throw new Error("The assistant returned an empty response.");
  }

  return {
    reply: data.reply.trim(),
    model: typeof data.model === "string" ? data.model : "Gemini",
  };
}
