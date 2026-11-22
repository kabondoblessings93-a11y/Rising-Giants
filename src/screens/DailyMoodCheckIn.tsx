import { useState, type FormEvent } from "react";
import type { DailyMood, MoodCheckInRecord } from "../types/domain";

interface DailyMoodCheckInProps {
  existing: MoodCheckInRecord | null;
  onSave: (mood: DailyMood, note: string) => void;
  onContinue: () => void;
}

const moods: { id: DailyMood; label: string }[] = [
  { id: "bad", label: "Bad" },
  { id: "not_bad", label: "Not bad" },
  { id: "good", label: "Good" },
];

const suggestions: Record<DailyMood, string> = {
  good: "It's encouraging to have a good day. Choose one meaningful priority, enjoy the good moments and leave room to rest.",
  not_bad: "Take today at a balanced pace. Focus on one priority at a time and give yourself permission to pause.",
  bad: "Be gentle with yourself today. Keep expectations manageable, and consider checking in with someone you trust. You don't have to carry a difficult day alone.",
};

function MoodFace({ mood }: { mood: DailyMood }) {
  return (
    <svg
      key={mood}
      viewBox="0 0 100 100"
      role="img"
      aria-label={`${moods.find((item) => item.id === mood)?.label} expression`}
      className="mood-face"
    >
      {mood === "not_bad" ? (
        <>
          <rect x="14" y="29" width="29" height="13" rx="7" fill="currentColor" />
          <rect x="57" y="29" width="29" height="13" rx="7" fill="currentColor" />
          <path d="M40 70 Q50 64 60 70" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <circle cx="29" cy="35" r="14" fill="currentColor" />
          <circle cx="71" cy="35" r="14" fill="currentColor" />
          <path
            d={mood === "good" ? "M31 62 Q50 86 69 62" : "M31 76 Q50 53 69 76"}
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}
    </svg>
  );
}

export function DailyMoodCheckIn({
  existing,
  onSave,
  onContinue,
}: DailyMoodCheckInProps) {
  const [mood, setMood] = useState<DailyMood>(existing?.mood ?? "good");
  const [note, setNote] = useState(existing?.note ?? "");
  const [showNote, setShowNote] = useState(Boolean(existing?.note));
  const [submitted, setSubmitted] = useState(false);

  const label = moods.find((item) => item.id === mood)?.label ?? "Good";

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(mood, note.trim());
    setSubmitted(true);
  };

  return (
    <div className="mood-checkin" data-mood={mood} role="dialog" aria-modal="true" aria-labelledby="mood-checkin-title">
      <div className="mood-checkin-inner">
        <header className="mood-checkin-header">
          <span className="mood-brand">RISING GIANTS</span>
          <button type="button" onClick={onContinue} className="mood-skip">
            {submitted ? "Close" : "Skip for now"}
          </button>
        </header>

        {!submitted ? (
          <>
            <section className="mood-main">
              <p className="mood-eyebrow">A moment for yourself</p>
              <h1 id="mood-checkin-title" className="mood-title">
                How are you feeling today?
              </h1>

              <div className="mood-face-wrap">
                <MoodFace mood={mood} />
              </div>

              <div className="mood-expression" aria-live="polite">
                {label.toUpperCase()}
              </div>
            </section>

            <form onSubmit={submit} className="mood-controls">
              <div className="mood-options" aria-label="Choose your mood">
                {moods.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    aria-pressed={mood === item.id}
                    onClick={() => setMood(item.id)}
                    className={`mood-option ${mood === item.id ? "selected" : ""}`}
                  >
                    <span className="mood-option-dot">
                      {mood === item.id ? "✓" : ""}
                    </span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowNote((value) => !value)}
                className="mood-note-toggle"
              >
                {showNote ? "− Hide note" : "+ Add note"}
              </button>

              {showNote && (
                <div className="mood-note-wrap">
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    maxLength={500}
                    rows={3}
                    placeholder="Anything you'd like to reflect on today..."
                    aria-label="Optional personal mood note"
                    className="mood-note"
                  />
                  <p className="mood-note-count">{note.length}/500</p>
                </div>
              )}

              <button type="submit" className="mood-submit">
                Submit <span aria-hidden="true">→</span>
              </button>
              <p className="mood-privacy">
                Your check-in stays on this device. It is optional and is not
                sent to the AI assistant.
              </p>
            </form>
          </>
        ) : (
          <section className="mood-thanks">
            <MoodFace mood={mood} />
            <h2>Thank you for checking in!</h2>
            <p>{suggestions[mood]}</p>
            <button type="button" onClick={onContinue} className="mood-submit">
              Continue to Rising Giants <span aria-hidden="true">→</span>
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
