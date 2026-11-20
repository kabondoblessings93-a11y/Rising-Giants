import { useState, type FormEvent } from "react";
import type { AiChatMessage } from "../types/domain";
import type { AssistantHealth } from "../lib/api/assistant";

interface AssistantScreenProps {
  messages: AiChatMessage[];
  health: AssistantHealth | null;
  isSending: boolean;
  error: string | null;
  onSendMessage: (content: string) => Promise<void>;
  onClearConversation: () => void;
}

const suggestions = [
  "Help me prepare a short devotional on faithfulness.",
  "Suggest discussion questions for our weekly Bible study.",
  "Help me write a warm announcement for our next gathering.",
];

export function AssistantScreen({
  messages,
  health,
  isSending,
  error,
  onSendMessage,
  onClearConversation,
}: AssistantScreenProps) {
  const [draft, setDraft] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = draft.trim();

    if (!content || isSending) return;

    setDraft("");
    await onSendMessage(content);
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-5xl flex-col gap-5 p-5 sm:p-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-wider text-amber-600">
            RISING GIANTS
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            AI Assistant
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
            A ministry writing and planning companion, designed to support
            thoughtful work rather than replace human leadership.
          </p>
        </div>
        <button
          type="button"
          onClick={onClearConversation}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
        >
          New conversation
        </button>
      </header>

      {!health ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
          The backend has not been reached. Start it in your terminal with{" "}
          <code>npm run server</code>, then refresh this page.
        </div>
      ) : !health.configured ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
          The Assistant interface is connected, but Gemini is not configured
          yet. Add <code>GEMINI_API_KEY</code> to the backend environment.
          Never paste the key into this chat or into frontend code.
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Gemini connected · {health.model}
        </div>
      )}

      <section
        aria-label="Conversation"
        aria-live="polite"
        className="flex-1 space-y-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-white/10 dark:bg-[#151A24]"
      >
        {messages.map((message) => (
          <article
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[92%] rounded-2xl px-4 py-3 sm:max-w-[82%] ${
                message.role === "user"
                  ? "bg-[#2E47A3] text-white"
                  : "bg-slate-100 text-slate-800 dark:bg-[#202938] dark:text-slate-100"
              }`}
            >
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider opacity-65">
                {message.role === "user" ? "You" : "Rising Giants Assistant"}
              </p>
              <p className="whitespace-pre-wrap text-sm leading-7">
                {message.content}
              </p>
              <p className="mt-2 text-right text-[10px] opacity-60">
                {message.timestamp}
              </p>
            </div>
          </article>
        ))}

        {isSending && (
          <div className="text-sm text-slate-500 dark:text-slate-400">
            The Assistant is preparing a response...
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200"
          >
            {error}
          </div>
        )}
      </section>

      {messages.length <= 1 && (
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Suggested starting points
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                disabled={isSending}
                onClick={() => void onSendMessage(suggestion)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-600 transition hover:border-amber-400 dark:border-white/10 dark:bg-[#151A24] dark:text-slate-300"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </section>
      )}

      <form
        onSubmit={submit}
        className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#151A24]"
      >
        <label htmlFor="assistant-message" className="sr-only">
          Message the Rising Giants Assistant
        </label>
        <textarea
          id="assistant-message"
          rows={3}
          maxLength={6000}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask a question or describe what you're preparing..."
          className="w-full resize-y border-0 bg-transparent px-2 py-2 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0 dark:text-white"
        />
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-white/5">
          <p className="text-[11px] text-slate-400">
            Responses are suggestions. Review Scripture and details before use.
          </p>
          <button
            type="submit"
            disabled={!draft.trim() || isSending}
            className="rounded-xl bg-[#2E47A3] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#263c8f] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </main>
  );
}
