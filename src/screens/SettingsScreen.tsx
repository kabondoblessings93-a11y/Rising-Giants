import type { AuditEvent, CaptureSourceConfig, MoodCheckInRecord } from "../types/domain";

export type RetentionDays = 30 | 90 | 180;

interface SettingsScreenProps {
  captureSources: CaptureSourceConfig[];
  auditEvents: AuditEvent[];
  retentionDays: RetentionDays;
  onToggleCaptureSource: (id: string) => void;
  onRetentionChange: (days: RetentionDays) => void;
  onExportData: () => void;
  moodRecords: MoodCheckInRecord[];
  onDeleteMoodNote: (id: string) => void;
  onDeleteMoodRecord: (id: string) => void;
  onClearMoodHistory: () => void;
}

const panel =
  "rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#151A24]";

export function SettingsScreen({
  captureSources,
  auditEvents,
  retentionDays,
  onToggleCaptureSource,
  onRetentionChange,
  onExportData,
  moodRecords,
  onDeleteMoodNote,
  onDeleteMoodRecord,
  onClearMoodHistory,
}: SettingsScreenProps) {
  return (
    <main className="mx-auto max-w-6xl space-y-7 p-5 sm:p-8">
      <header>
        <p className="text-sm font-semibold tracking-wider text-amber-600">
          RISING GIANTS
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
          Settings & Privacy
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
          Manage workspace preferences, understand how information is handled,
          and keep track of administrative activity.
        </p>
      </header>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/20 dark:bg-amber-500/10">
        <h2 className="font-semibold text-amber-950 dark:text-amber-200">
          Important privacy information
        </h2>
        <p className="mt-2 text-sm leading-6 text-amber-900 dark:text-amber-100">
          Workspace data is currently stored in this browser's local storage.
          It is not encrypted by this application and is not synchronised
          between devices. Anyone who can access this browser profile may be
          able to access its data. Avoid entering members' identifying,
          confidential or highly sensitive information.
        </p>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Privacy overview
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Current application behaviour, not promises about future features.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className={panel}>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Storage
            </p>
            <h3 className="mt-2 font-semibold text-slate-900 dark:text-white">
              This browser
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Workspace information is saved locally in this browser. There is
              currently no user account or cloud backup.
            </p>
          </article>

          <article className={panel}>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              AI processing
            </p>
            <h3 className="mt-2 font-semibold text-slate-900 dark:text-white">
              Disabled
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              External AI processing is not enabled. The Assistant backend
              exists, but no provider credentials are configured.
            </p>
          </article>

          <article className={panel}>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Background collection
            </p>
            <h3 className="mt-2 font-semibold text-slate-900 dark:text-white">
              Not connected
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              The application does not currently read notifications, messages
              or device screen-time data automatically.
            </p>
          </article>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Capture source preferences
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            These switches save workspace preferences only. They do not grant
            device permissions, connect external services or start collecting
            information.
          </p>
        </div>

        <div className="space-y-3">
          {captureSources.map((source) => (
            <article
              key={source.id}
              className={`${panel} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
            >
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {source.name}
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {source.description}
                </p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Permission requirement: {source.permission}
                </p>
              </div>

              <label className="flex shrink-0 cursor-pointer items-center gap-3">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {source.enabled ? "Preference on" : "Preference off"}
                </span>
                <input
                  type="checkbox"
                  checked={source.enabled}
                  onChange={() => onToggleCaptureSource(source.id)}
                  aria-label={`Enable ${source.name} preference`}
                  className="h-5 w-5 accent-[#2E47A3]"
                />
              </label>
            </article>
          ))}
        </div>
      </section>

      <section className={panel}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Data retention preference
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          Choose the period the workspace should use as its intended retention
          policy.
        </p>

        <label className="mt-4 block max-w-sm text-sm font-medium text-slate-700 dark:text-slate-300">
          Preferred retention period
          <select
            value={retentionDays}
            onChange={(event) =>
              onRetentionChange(Number(event.target.value) as RetentionDays)
            }
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm dark:border-white/10 dark:bg-[#101620] dark:text-white"
          >
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
            <option value={180}>180 days</option>
          </select>
        </label>

        <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600 dark:bg-white/5 dark:text-slate-400">
          This is a saved preference only. Automatic deletion, expiry
          enforcement and backups are not implemented yet. Changing this
          setting will not delete existing information.
        </p>
      </section>

      <section className={panel}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Mood history & privacy
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Your mood check-ins and notes are stored in this browser. You can
              remove a note while keeping its mood entry, delete an entire
              check-in, or clear all mood history.
            </p>
          </div>
          <button
            type="button"
            disabled={moodRecords.length === 0}
            onClick={onClearMoodHistory}
            className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-rose-500/20 dark:text-rose-300 dark:hover:bg-rose-500/10"
          >
            Clear all history
          </button>
        </div>

        {moodRecords.length === 0 ? (
          <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-white/5 dark:text-slate-400">
            No mood check-ins are currently saved.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {moodRecords.map((record) => (
              <article
                key={record.id}
                className="rounded-xl border border-slate-100 p-4 dark:border-white/5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold capitalize text-slate-900 dark:text-white">
                      {record.mood.replace("_", " ")}
                    </p>
                    <time className="text-xs text-slate-500">
                      {record.dateKey}
                    </time>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteMoodRecord(record.id)}
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
                  >
                    Delete entry
                  </button>
                </div>

                {record.note ? (
                  <div className="mt-3 rounded-lg bg-slate-50 p-3 dark:bg-white/5">
                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {record.note}
                    </p>
                    <button
                      type="button"
                      onClick={() => onDeleteMoodNote(record.id)}
                      className="mt-3 text-xs font-semibold text-rose-700 hover:underline dark:text-rose-300"
                    >
                      Delete note only
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-slate-400">
                    No personal note saved for this check-in.
                  </p>
                )}
              </article>
            ))}
          </div>
        )}

        <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
          Deleting a note does not delete its mood entry. Deleting an entry
          removes its mood and note. Clearing history removes all check-ins
          and their associated daily plans. These actions cannot be undone
          unless you have a separate export.
        </p>
      </section>

      <section className={panel}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Export workspace data
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Download a JSON copy of the current workspace information.
            </p>
          </div>
          <button
            type="button"
            onClick={onExportData}
            className="rounded-xl bg-[#2E47A3] px-4 py-3 text-sm font-semibold text-white hover:bg-[#263c8f]"
          >
            Export data
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Workspace activity log
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Recent administrative actions recorded by this application.
            This local log is not an immutable security audit.
          </p>
        </div>

        <div className={panel}>
          {auditEvents.length === 0 ? (
            <p className="text-sm text-slate-500">
              No workspace activity has been recorded yet.
            </p>
          ) : (
            <div className="space-y-4">
              {auditEvents.slice(0, 20).map((event) => (
                <article
                  key={event.id}
                  className="border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-white/5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {event.action.replaceAll("_", " ")}
                    </p>
                    <time className="text-xs text-slate-500">
                      {event.timestamp}
                    </time>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {event.resourceType} · {event.actor}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {event.detail}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
