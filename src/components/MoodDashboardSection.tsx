import type {
  DailyMood,
  MoodCheckInRecord,
  MoodPlanItem,
} from "../types/domain";

interface MoodDashboardSectionProps {
  todayMood: MoodCheckInRecord | null;
  moodRecords: MoodCheckInRecord[];
  todayPlanItems: MoodPlanItem[];
  onOpenMoodCheckIn: () => void;
  onAddPlanItem: (title: string) => void;
  onTogglePlanItem: (id: string) => void;
}

const moodLabels: Record<DailyMood, string> = {
  good: "Good",
  not_bad: "Not bad",
  bad: "Bad",
};

const moodGuidance: Record<
  DailyMood,
  { heading: string; message: string; actions: string[] }
> = {
  good: {
    heading: "Make room for what matters",
    message:
      "It's encouraging to have a good day. Use your energy thoughtfully, celebrate the small wins and leave room to rest.",
    actions: [
      "Choose one meaningful priority",
      "Protect one focused work session",
      "Make time to encourage someone",
    ],
  },
  not_bad: {
    heading: "Keep a balanced pace",
    message:
      "You don't have to do everything at once. Keep the day manageable and give yourself space to pause between tasks.",
    actions: [
      "Break one task into a smaller step",
      "Take a short pause between tasks",
      "Choose one realistic priority",
    ],
  },
  bad: {
    heading: "Give yourself some room today",
    message:
      "A difficult day doesn't define you. Keep expectations gentle, take things one step at a time and consider talking to someone you trust.",
    actions: [
      "Choose one small, manageable task",
      "Take a quiet break and reset",
      "Reach out to someone you trust",
    ],
  },
};

const panel =
  "rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#151A24]";

function formatMoodDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  if (!year || !month || !day) return dateKey;

  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function MoodDashboardSection({
  todayMood,
  moodRecords,
  todayPlanItems,
  onOpenMoodCheckIn,
  onAddPlanItem,
  onTogglePlanItem,
}: MoodDashboardSectionProps) {
  const guidance = todayMood ? moodGuidance[todayMood.mood] : null;
  const history = moodRecords.slice(0, 7);

  return (
    <section className="grid gap-5 lg:grid-cols-2">
      <article className={panel}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
              Your day, your pace
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
              Daily guidance
            </h3>
          </div>
          <button
            type="button"
            onClick={onOpenMoodCheckIn}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
          >
            {todayMood ? "Update check-in" : "Check in"}
          </button>
        </div>

        {!todayMood || !guidance ? (
          <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Your daily check-in is optional. Complete it whenever you're ready
            to see suggestions for your day.
          </p>
        ) : (
          <>
            <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-white/5">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                TODAY YOU FEEL · {moodLabels[todayMood.mood].toUpperCase()}
              </p>
              <h4 className="mt-2 font-semibold text-slate-900 dark:text-white">
                {guidance.heading}
              </h4>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {guidance.message}
              </p>
            </div>

            <div className="mt-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Ideas you can add to today's plan
              </p>
              <div className="space-y-2">
                {guidance.actions.map((action) => {
                  const added = todayPlanItems.some(
                    (item) => item.title === action
                  );
                  return (
                    <div
                      key={action}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2.5 dark:border-white/5"
                    >
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {action}
                      </span>
                      <button
                        type="button"
                        disabled={added}
                        onClick={() => onAddPlanItem(action)}
                        className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#2E47A3] hover:bg-[#2E47A3]/5 disabled:text-emerald-600 disabled:hover:bg-transparent dark:text-[#93A6F0] dark:disabled:text-emerald-400"
                      >
                        {added ? "Added" : "Add"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </article>

      <article className={panel}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
              Small steps, over time
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
              Today's plan
            </h3>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-300">
            {todayPlanItems.filter((item) => item.completed).length}/
            {todayPlanItems.length} done
          </span>
        </div>

        {todayPlanItems.length === 0 ? (
          <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Choose any suggestions that feel useful. They'll appear here as
            optional intentions for today.
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            {todayPlanItems.map((item) => (
              <label
                key={item.id}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-100 p-3 dark:border-white/5"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => onTogglePlanItem(item.id)}
                  className="mt-0.5 h-4 w-4 accent-[#2E47A3]"
                />
                <span
                  className={`text-sm ${
                    item.completed
                      ? "text-slate-400 line-through"
                      : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {item.title}
                </span>
              </label>
            ))}
          </div>
        )}

        <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
          These are optional daily intentions, separate from your recurring
          routines. You decide what to add and complete.
        </p>
      </article>

      <article className={`${panel} lg:col-span-2`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
              Personal reflection
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
              Recent mood history
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Last {history.length} check-ins
          </span>
        </div>

        {history.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Your check-ins will appear here when you choose to record them.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {history.map((record) => (
              <div
                key={record.id}
                className="rounded-xl border border-slate-100 p-4 dark:border-white/5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {moodLabels[record.mood]}
                  </span>
                  <time className="text-xs text-slate-500">
                    {formatMoodDate(record.dateKey)}
                  </time>
                </div>
                {record.note ? (
                  <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-5 text-slate-600 dark:text-slate-400">
                    {record.note}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-slate-400">
                    No personal note saved.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          This history is stored locally in this browser. It is not a
          psychological assessment or diagnosis.
        </p>
      </article>
    </section>
  );
}
