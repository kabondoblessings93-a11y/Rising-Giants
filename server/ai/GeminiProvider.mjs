import { AiProvider } from "./AiProvider.mjs";

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";

const SYSTEM_INSTRUCTION = `You are the Rising Giants Ministry Assistant, a careful and helpful assistant for a Christ-centred community.

Guidelines:
- Respond warmly, clearly and practically. Avoid shaming language.
- Use Scripture responsibly. Give references and translations where known. Never invent Bible quotations.
- Clearly label suggestions as suggestions. Never claim spiritual authority or certainty about God's private will.
- Respect different Christian traditions and acknowledge reasonable differences of interpretation.
- You are not a pastor, counsellor, doctor or emergency service. For serious personal, safety or mental-health concerns, encourage someone to speak with a trusted responsible adult, pastor or qualified professional.
- Protect privacy. Never ask for members' names, phone numbers, addresses or other identifying information.
- You provide suggestions and text only. Never claim to have sent, published or approved anything.`;

function providerError(message, statusCode = 502) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export class GeminiProvider extends AiProvider {
  constructor({
    apiKey = process.env.GEMINI_API_KEY,
    model = process.env.GEMINI_MODEL || "gemini-3.8-flash",
  } = {}) {
    super();
    this.apiKey = apiKey?.trim() || "";
    this.model = model;
  }

  isConfigured() {
    return this.apiKey.length > 0;
  }

  async generateReply(messages) {
    if (!this.isConfigured()) {
      throw providerError("AI is not configured. Set GEMINI_API_KEY in the backend environment.", 503);
    }

    const transcript = messages
      .slice(-12)
      .map((message) =>
        `${message.role === "assistant" ? "Assistant" : "Member"}: ${message.content}`
      )
      .join("\\n\\n");

    let response;
    try {
      response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": this.apiKey,
        },
        body: JSON.stringify({
          model: this.model,
          system_instruction: SYSTEM_INSTRUCTION,
          input: transcript,
          store: false,
        }),
        signal: AbortSignal.timeout(45000),
      });
    } catch (error) {
      if (error?.name === "TimeoutError" || error?.name === "AbortError") {
        throw providerError("The AI request timed out. Please try again.", 504);
      }
      throw providerError("Could not reach Gemini. Check the backend connection.", 502);
    }

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Gemini provider returned HTTP", response.status);
      if (response.status === 429) {
        throw providerError("Gemini's rate limit has been reached. Try again later.", 429);
      }
      if (response.status === 401 || response.status === 403) {
        throw providerError("Gemini rejected the server credentials or model access. Check the backend configuration.", 502);
      }
      throw providerError("Gemini could not complete the request. Check the backend logs.", 502);
    }

    const stepText = Array.isArray(payload.steps)
      ? payload.steps
          .filter((step) => step?.type === "model_output" && Array.isArray(step.content))
          .flatMap((step) => step.content)
          .filter((part) => part?.type === "text" && typeof part.text === "string")
          .map((part) => part.text)
          .join("\\n")
      : "";

    const reply =
      typeof payload.output_text === "string" ? payload.output_text : stepText;

    if (!reply.trim()) {
      throw providerError("Gemini returned an empty response. Try again.", 502);
    }

    return { text: reply.trim(), model: this.model };
  }
}
