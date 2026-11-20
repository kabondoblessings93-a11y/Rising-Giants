import { useMemo, useState } from "react";
import type {
  AppCategory,
  DailyProductivityRecord,
  FocusSessionRecord,
} from "../types/domain";

interface ProductivityScreenProps {
  days: DailyProductivityRecord[];
  focusSessions: FocusSessionRecord[];
  onUpdateCategory: (
    dayKey: string,
    packageName: string,
    category: AppCategory
  ) => void;
}

const categoryLabels: Record<AppCategory, string> = {
  productive: "Productive",
  neutral: "Neutral",
  distracting: "Distracting",
  unclassified: "Unclassified",
};

const categoryClasses: Record<AppCategory, string> = {
  productive: "bg-emerald-500",
  neutral: "bg-sky-500",
  distracting: "bg-amber-500",
  unclassified: "bg-slate-400",
};

const categoryOptions: AppCategory[] = [
  "productive",
  "neutral",
  "distracting",
  "unclassified",
];

const panel =
  "rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#151A24]";

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (hours === 0) return `${remaining} min`;
  if (remaining === 0) return `${hours} hr`;
  return `${hours} hr ${remaining} min`;
}

export function ProductivityScreen({
  days,
  focusSessions,
  onUpdateCategory,
}: ProductivityScreenProps) {
  const [selectedDay, setSelectedDay] = useState(days[0]?.dateKey ?? "");

  const activeDay = useMemo(
    () => days.find((day) => day.dateKey === selectedDay) ?? days[0],
    [days, selectedDay]
  );

  const totals = useMemo(() => {
    const result: Record<AppCategory, number> = {
      productive: 0,
      neutral: 0,
      distracting: 0,
      unclassified: 0,
    };

    for (const app of activeDay?.apps ?? []) {
      result[app.category] += app.minutes;
    }

    return result;
  }, [activeDay]);

  const totalMinutes = activeDay?.totalMinutes ?? 0;
  const categorisedMinutes = Object.values(totals).reduce(
    (sum, value) => sum + value,
    0
  );
  const maxAppMinutes = Math.max(
    1,
    ...(activeDay?.apps ?? []).map((app) => app.minutes)
  );

  return (
    <main className="mx-auto max-w-6xl space-y-7 p-5 sm:p-8">
      <header>
        <p className="text-sm font-semibold tracking-wider text-amber-600">
          RISING GIANTS
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
          Productivity
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
          Understand your digital habits, protect your focus and build
          healthier daily rhythms.
        </p>
      </header>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
        <strong>Data status:</strong> These are the workspace's available
        sample or imported records. Live Android screen-time collection
        has not been connected yet.
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              App usage
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Review usage and choose how each app should be categorised.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <button
                key={day.dateKey}
                type="button"
                onClick={() => setSelectedDay(day.dateKey)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  activeDay?.dateKey === day.dateKey
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "border border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-[#151A24] dark:text-slate-300"
                }`}
              >
                {day.dateKey}
              </button>
            ))}
          </div>
        </div>

        {!activeDay ? (
          <div className={`${panel} text-center`}>
            <p className="text-slate-500 dark:text-slate-400">
              No usage records are available yet.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className={panel}>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Total recorded app usage
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {formatDuration(totalMinutes)}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {activeDay.dateKey}
                </p>
              </div>
              <div className={panel}>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Productive app usage
                </p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">
                  {formatDuration(totals.productive)}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {categorisedMinutes > 0
                    ? Math.round((totals.productive / categorisedMinutes) * 100)
                    : 0}
                  % of categorised usage
                </p>
              </div>
            </div>

            <div className={panel}>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Usage breakdown
              </h3>
              <div className="mt-5 flex h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                {categoryOptions.map((category) => {
                  const width =
                    categorisedMinutes > 0
                      ? (totals[category] / categorisedMinutes) * 100
                      : 0;

                  return width > 0 ? (
                    <div
                      key={category}
                      title={`${categoryLabels[category]}: ${formatDuration(totals[category])}`}
                      className={categoryClasses[category]}
                      style={{ width: `${width}%` }}
                    />
                  ) : null;
                })}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {categoryOptions.map((category) => (
                  <div key={category} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <span className={`h-2.5 w-2.5 rounded-full ${categoryClasses[category]}`} />
                      {categoryLabels[category]}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {formatDuration(totals[category])}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={panel}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Apps and classifications
                </h3>
                <span className="text-xs text-slate-500">
                  {activeDay.apps.length} apps recorded
                </span>
              </div>

              {activeDay.apps.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  No app-level records are available for this day.
                </p>
              ) : (
                <div className="mt-4 divide-y divide-slate-100 dark:divide-white/5">
                  {[...activeDay.apps]
                    .sort((a, b) => b.minutes - a.minutes)
                    .map((app) => (
                      <div
                        key={app.packageName}
                        className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                              {app.appName}
                            </p>
                            <span className="shrink-0 text-sm font-medium text-slate-600 dark:text-slate-300">
                              {formatDuration(app.minutes)}
                            </span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                            <div
                              className={`h-full rounded-full ${categoryClasses[app.category]}`}
                              style={{
                                width: `${(app.minutes / maxAppMinutes) * 100}%`,
                              }}
                            />
                          </div>
                          <p className="mt-1 truncate text-[11px] text-slate-400">
                            {app.packageName}
                          </p>
                        </div>
                        <select
                          aria-label={`Classify ${app.appName}`}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-[#101620] dark:text-slate-200 sm:w-44"
                          value={app.category}
                          onChange={(event) =>
                            onUpdateCategory(
                              activeDay.dateKey,
                              app.packageName,
                              event.target.value as AppCategory
                            )
                          }
                        >
                          {categoryOptions.map((category) => (
                            <option key={category} value={category}>
                              {categoryLabels[category]}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Focus sessions
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            A record of completed periods of intentional focus.
          </p>
        </div>

        {focusSessions.length === 0 ? (
          <div className={panel}>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No completed focus sessions have been recorded yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {focusSessions.map((session) => (
              <article key={session.id} className={panel}>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {session.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-emerald-600">
                  {formatDuration(session.durationMinutes)}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Completed {session.completedAt}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
