import { useState } from "react";
import type {
  ActivityItem,
  ActivityLifecycle,
  ContentDraft,
  DraftStatus,
  GroupProfile,
} from "../types/domain";

interface MinistryScreenProps {
  profile: GroupProfile;
  activities: ActivityItem[];
  drafts: ContentDraft[];
  onUpdateProfile: (profile: GroupProfile) => void;
  onUpdateActivity: (id: string, status: ActivityLifecycle) => void;
  onUpdateDraft: (draft: ContentDraft) => void;
  onCreateDraft: () => string;
}

const panel =
  "rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#151A24]";
const field =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-500 dark:border-white/10 dark:bg-[#101620] dark:text-white";
const button =
  "rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-900";

const draftStatusLabels: Record<DraftStatus, string> = {
  draft: "Draft",
  awaiting_approval: "Awaiting approval",
  approved_for_user_sharing: "Approved for sharing",
  shared_manually: "Shared manually",
};

export function MinistryScreen({
  profile,
  activities,
  drafts,
  onUpdateProfile,
  onUpdateActivity,
  onUpdateDraft,
  onCreateDraft,
}: MinistryScreenProps) {
  const [theme, setTheme] = useState(profile.weeklyFocusTheme);
  const [scripture, setScripture] = useState(profile.weeklyFocusScripture);
  const [objective, setObjective] = useState(profile.weeklyFocusObjective);
  const [selectedId, setSelectedId] = useState<string | null>(
    drafts[0]?.id ?? null
  );

  const selectedDraft = drafts.find((draft) => draft.id === selectedId);

  const updateSelected = (changes: Partial<ContentDraft>) => {
    if (selectedDraft) {
      onUpdateDraft({ ...selectedDraft, ...changes });
    }
  };

  const createDraft = () => {
    const id = onCreateDraft();
    setSelectedId(id);
  };

  const saveDraft = () => {
    if (!selectedDraft) return;
    onUpdateDraft({
      ...selectedDraft,
      version: selectedDraft.version + 1,
      updatedAt: new Date().toISOString(),
    });
  };

  const advanceDraft = () => {
    if (!selectedDraft) return;
    const next: Partial<Record<DraftStatus, DraftStatus>> = {
      draft: "awaiting_approval",
      awaiting_approval: "approved_for_user_sharing",
      approved_for_user_sharing: "shared_manually",
    };
    const status = next[selectedDraft.status];
    if (status) {
      onUpdateDraft({
        ...selectedDraft,
        status,
        version: selectedDraft.version + 1,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <main className="mx-auto max-w-6xl space-y-7 p-5 sm:p-8">
      <header>
        <p className="text-sm font-semibold tracking-wider text-amber-600">
          RISING GIANTS
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
          Ministry Workspace
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Keep the ministry focused, organised and ready to serve.
        </p>
      </header>

      <section className={panel}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
              This week's focus
            </p>
            <h2 className="mt-1 text-xl font-bold dark:text-white">
              Weekly direction
            </h2>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            {profile.preferredTranslation}
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Focus theme
            <input
              className={field}
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
            />
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Scripture reference
            <input
              className={field}
              value={scripture}
              onChange={(event) => setScripture(event.target.value)}
              placeholder="e.g. Luke 16:10"
            />
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 md:col-span-2">
            Objective for the group
            <textarea
              className={field}
              rows={3}
              value={objective}
              onChange={(event) => setObjective(event.target.value)}
            />
          </label>
        </div>
        <button
          type="button"
          className={`${button} mt-4`}
          onClick={() =>
            onUpdateProfile({
              ...profile,
              weeklyFocusTheme: theme.trim(),
              weeklyFocusScripture: scripture.trim(),
              weeklyFocusObjective: objective.trim(),
            })
          }
        >
          Save weekly focus
        </button>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Ministry programmes
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track the programmes and gatherings organised by the team.
          </p>
        </div>

        {activities.length === 0 ? (
          <div className={panel}>
            <p className="text-sm text-slate-500">No programmes have been added yet.</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {activities.map((activity) => (
              <article key={activity.id} className={panel}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {activity.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {activity.type} · {activity.owner}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-300">
                    {activity.nextOccurrence}
                  </span>
                </div>
                <label className="mt-4 block text-xs font-medium text-slate-500">
                  Programme status
                  <select
                    className={field}
                    value={activity.status}
                    onChange={(event) =>
                      onUpdateActivity(
                        activity.id,
                        event.target.value as ActivityLifecycle
                      )
                    }
                  >
                    <option value="planned">Planned</option>
                    <option value="in_progress">In progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </label>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Content drafts
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Prepare, review and manage ministry content.
            </p>
          </div>
          <button type="button" className={button} onClick={createDraft}>
            + New draft
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)]">
          <div className="space-y-3">
            {drafts.length === 0 && (
              <div className={panel}>
                <p className="text-sm text-slate-500">
                  No drafts yet. Create your first content draft.
                </p>
              </div>
            )}
            {drafts.map((draft) => (
              <button
                key={draft.id}
                type="button"
                onClick={() => setSelectedId(draft.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selectedId === draft.id
                    ? "border-[#2E47A3] bg-[#2E47A3]/5 dark:bg-[#2E47A3]/15"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-[#151A24]"
                }`}
              >
                <span className="text-xs font-medium text-amber-600">
                  {draft.kind.replaceAll("_", " ")}
                </span>
                <span className="mt-1 block font-semibold text-slate-900 dark:text-white">
                  {draft.title || "Untitled draft"}
                </span>
                <span className="mt-2 block text-xs text-slate-500 dark:text-slate-400">
                  {draft.targetProgram || "No programme selected"}
                </span>
                <span className="mt-3 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600 dark:bg-white/10 dark:text-slate-300">
                  {draftStatusLabels[draft.status]}
                </span>
              </button>
            ))}
          </div>

          <div className={panel}>
            {selectedDraft ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Edit content
                  </h3>
                  <span className="text-xs text-slate-500">
                    Version {selectedDraft.version}
                  </span>
                </div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Draft title
                  <input
                    className={field}
                    value={selectedDraft.title}
                    onChange={(event) =>
                      updateSelected({ title: event.target.value })
                    }
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Target programme
                  <input
                    className={field}
                    value={selectedDraft.targetProgram}
                    onChange={(event) =>
                      updateSelected({ targetProgram: event.target.value })
                    }
                    placeholder="e.g. Truth Tuesdays"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Draft content
                  <textarea
                    className={field}
                    rows={10}
                    value={selectedDraft.body}
                    onChange={(event) =>
                      updateSelected({ body: event.target.value })
                    }
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Leader's notes
                  <textarea
                    className={field}
                    rows={2}
                    value={selectedDraft.userNotes}
                    onChange={(event) =>
                      updateSelected({ userNotes: event.target.value })
                    }
                  />
                </label>

                <div className="flex flex-wrap gap-2">
                  <button type="button" className={button} onClick={saveDraft}>
                    Save version
                  </button>

                  {selectedDraft.status !== "shared_manually" && (
                    <button
                      type="button"
                      className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-white/20 dark:text-slate-200"
                      onClick={advanceDraft}
                    >
                      {selectedDraft.status === "draft"
                        ? "Submit for review"
                        : selectedDraft.status === "awaiting_approval"
                          ? "Approve draft"
                          : "Mark shared manually"}
                    </button>
                  )}
                </div>

                <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Approval does not publish or send content. Sharing remains a
                  separate manual action. Check scripture references and
                  practical details before sharing.
                </p>
              </div>
            ) : (
              <div className="flex min-h-48 items-center justify-center text-center text-sm text-slate-500">
                Select a draft to edit it, or create a new one.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
