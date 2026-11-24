import { useEffect, useState } from "react";
import type {
  ActivityItem,
  ActivityLifecycle,
  ContentDraft,
  DraftStatus,
  GroupProfile,
} from "../types/domain";
import {
  Badge,
  card,
  input,
  label,
  primaryBtn,
  ghostBtn,
} from "../components/ui";

interface MinistryScreenProps {
  profile: GroupProfile;
  activities: ActivityItem[];
  drafts: ContentDraft[];
  onUpdateProfile: (profile: GroupProfile) => void;
  onUpdateActivity: (id: string, status: ActivityLifecycle) => void;
  onUpdateDraft: (draft: ContentDraft) => void;
  onCreateDraft: () => string;
}

const sectionTitle =
  "text-lg font-bold tracking-tight text-[var(--rg-ink)]";

const sectionDescription =
  "mt-1 text-sm leading-6 text-[var(--rg-muted)]";

const draftStatusLabels: Record<DraftStatus, string> = {
  draft: "Draft",
  awaiting_approval: "Awaiting approval",
  approved_for_user_sharing: "Approved for sharing",
  shared_manually: "Shared manually",
};

const activityStatusLabels: Record<ActivityLifecycle, string> = {
  planned: "Planned",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusStyles: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300",
  awaiting_approval:
    "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  approved_for_user_sharing:
    "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300",
  shared_manually:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  planned:
    "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300",
  in_progress:
    "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300",
  completed:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  cancelled:
    "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        statusStyles[status] ?? statusStyles.draft
      }`}
    >
      {draftStatusLabels[status as DraftStatus] ??
        activityStatusLabels[status as ActivityLifecycle] ??
        status}
    </span>
  );
}

function Metric({
  label: metricLabel,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className={`${card} p-4`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--rg-muted)]">
        {metricLabel}
      </p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--rg-ink)]">
        {value}
      </p>
      <p className="mt-1 text-xs text-[var(--rg-muted)]">{detail}</p>
    </div>
  );
}

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

  useEffect(() => {
    setTheme(profile.weeklyFocusTheme);
    setScripture(profile.weeklyFocusScripture);
    setObjective(profile.weeklyFocusObjective);
  }, [
    profile.weeklyFocusTheme,
    profile.weeklyFocusScripture,
    profile.weeklyFocusObjective,
  ]);

  useEffect(() => {
    if (selectedId && !drafts.some((draft) => draft.id === selectedId)) {
      setSelectedId(drafts[0]?.id ?? null);
    } else if (!selectedId && drafts.length > 0) {
      setSelectedId(drafts[0].id);
    }
  }, [drafts, selectedId]);

  const selectedDraft = drafts.find((draft) => draft.id === selectedId);

  const pendingActivities = activities.filter(
    (activity) =>
      activity.status === "planned" || activity.status === "in_progress"
  ).length;

  const awaitingApproval = drafts.filter(
    (draft) => draft.status === "awaiting_approval"
  ).length;

  const approvedDrafts = drafts.filter(
    (draft) => draft.status === "approved_for_user_sharing"
  ).length;

  const updateSelected = (changes: Partial<ContentDraft>) => {
    if (selectedDraft) {
      onUpdateDraft({ ...selectedDraft, ...changes });
    }
  };

  const createDraft = () => {
    const id = onCreateDraft();
    setSelectedId(id);
  };

  const saveWeeklyFocus = () => {
    onUpdateProfile({
      ...profile,
      weeklyFocusTheme: theme.trim(),
      weeklyFocusScripture: scripture.trim(),
      weeklyFocusObjective: objective.trim(),
    });
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
    <main className="mx-auto max-w-7xl space-y-8 p-4 pb-28 sm:p-6 lg:p-8">
      {/* Workspace heading */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#17264F] via-[#263F83] to-[#3155A5] p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full border-[35px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-28 right-32 h-56 w-56 rounded-full bg-[#D7A94B]/10 blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <Badge className="border border-white/20 bg-white/10 text-white">
            MINISTRY MANAGEMENT
          </Badge>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Ministry Workspace
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
            A place to organise the vision, coordinate programmes and prepare
            meaningful content for the people you serve.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium text-blue-100">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2">
              {profile.preferredTranslation}
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2">
              {activities.length} programmes
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2">
              {drafts.length} content drafts
            </span>
          </div>
        </div>
      </header>

      {/* Overview metrics */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric
          label="Programmes"
          value={activities.length}
          detail="Total activities"
        />
        <Metric
          label="In progress"
          value={pendingActivities}
          detail="Planned or ongoing"
        />
        <Metric
          label="Awaiting review"
          value={awaitingApproval}
          detail="Need approval"
        />
        <Metric
          label="Approved"
          value={approvedDrafts}
          detail="Ready for sharing"
        />
      </section>

      {/* Weekly focus */}
      <section className={`${card} overflow-hidden`}>
        <div className="border-b border-[var(--rg-border)] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
                WEEKLY DIRECTION
              </Badge>
              <h2 className={`${sectionTitle} mt-3 text-xl`}>
                This week's focus
              </h2>
              <p className={sectionDescription}>
                Keep the group centred around one shared spiritual direction.
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--rg-brand-soft)] p-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--rg-muted)]">
                Translation
              </p>
              <p className="mt-1 text-sm font-bold text-[var(--rg-brand)]">
                {profile.preferredTranslation}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-2xl bg-gradient-to-br from-[#17264F] to-[#3155A5] p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
              Current theme
            </p>

            <h3 className="mt-4 text-2xl font-bold leading-tight">
              {profile.weeklyFocusTheme || "Your weekly direction"}
            </h3>

            <div className="mt-6 h-px bg-white/20" />

            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-amber-300">
              Scripture
            </p>

            <p className="mt-2 text-lg font-semibold">
              {profile.weeklyFocusScripture || "Add a Scripture reference"}
            </p>

            <p className="mt-5 text-sm leading-6 text-blue-100">
              {profile.weeklyFocusObjective ||
                "Set a shared objective to help guide the group throughout the week."}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className={sectionTitle}>Edit weekly direction</h3>
              <p className={sectionDescription}>
                Update the theme, biblical foundation and group objective.
              </p>
            </div>

            <label className={label}>
              Focus theme
              <input
                className={`${input} mt-2`}
                value={theme}
                onChange={(event) => setTheme(event.target.value)}
                placeholder="e.g. Building a firm foundation"
              />
            </label>

            <label className={label}>
              Scripture reference
              <input
                className={`${input} mt-2`}
                value={scripture}
                onChange={(event) => setScripture(event.target.value)}
                placeholder="e.g. Luke 16:10"
              />
            </label>

            <label className={label}>
              Group objective
              <textarea
                className={`${input} mt-2 resize-y`}
                rows={3}
                value={objective}
                onChange={(event) => setObjective(event.target.value)}
                placeholder="What should the group learn or put into practice?"
              />
            </label>

            <button
              type="button"
              className={primaryBtn}
              onClick={saveWeeklyFocus}
            >
              Save weekly direction
            </button>
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Badge>ACTIVITY MANAGEMENT</Badge>
            <h2 className={`${sectionTitle} mt-2 text-xl`}>
              Ministry programmes
            </h2>
            <p className={sectionDescription}>
              Keep track of the activities and gatherings organised by your team.
            </p>
          </div>

          <p className="text-xs font-medium text-[var(--rg-muted)]">
            {activities.length} total programmes
          </p>
        </div>

        {activities.length === 0 ? (
          <div className={`${card} p-8 text-center`}>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--rg-brand-soft)] text-xl text-[var(--rg-brand)]">
              +
            </div>
            <h3 className="mt-4 font-semibold text-[var(--rg-ink)]">
              No programmes yet
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--rg-muted)]">
              Your ministry programmes will appear here once they have been
              added.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {activities.map((activity) => (
              <article key={activity.id} className={`${card} p-5`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--rg-brand)]">
                      {activity.type.replaceAll("_", " ")}
                    </p>
                    <h3 className="mt-2 font-bold text-[var(--rg-ink)]">
                      {activity.title}
                    </h3>
                    <p className="mt-1 text-xs text-[var(--rg-muted)]">
                      Coordinated by {activity.owner}
                    </p>
                  </div>

                  <StatusBadge status={activity.status} />
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-[var(--rg-canvas)] p-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--rg-muted)]">
                      Next occurrence
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--rg-ink)]">
                      {activity.nextOccurrence}
                    </p>
                  </div>

                  <label className="min-w-0 max-w-40 flex-1">
                    <span className={label}>Update status</span>
                    <select
                      className={`${input} py-2`}
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
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Content studio */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Badge>MINISTRY CONTENT</Badge>
            <h2 className={`${sectionTitle} mt-2 text-xl`}>
              Content studio
            </h2>
            <p className={sectionDescription}>
              Prepare, refine and review content before it reaches your community.
            </p>
          </div>

          <button
            type="button"
            className={primaryBtn}
            onClick={createDraft}
          >
            <span className="text-lg leading-none">+</span>
            New draft
          </button>
        </div>

        <div className="grid items-start gap-4 lg:grid-cols-[minmax(250px,0.8fr)_minmax(0,1.5fr)]">
          {/* Draft library */}
          <aside className={`${card} overflow-hidden`}>
            <div className="border-b border-[var(--rg-border)] p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-[var(--rg-ink)]">
                  Draft library
                </h3>
                <Badge>{drafts.length} drafts</Badge>
              </div>
              <p className="mt-1 text-xs text-[var(--rg-muted)]">
                Select an item to open the editor.
              </p>
            </div>

            <div className="space-y-2 p-3">
              {drafts.length === 0 ? (
                <div className="px-3 py-8 text-center">
                  <p className="text-sm font-semibold text-[var(--rg-ink)]">
                    Your library is empty
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[var(--rg-muted)]">
                    Create your first draft to start preparing ministry content.
                  </p>
                  <button
                    type="button"
                    className={`${primaryBtn} mt-4`}
                    onClick={createDraft}
                  >
                    Create a draft
                  </button>
                </div>
              ) : (
                drafts.map((draft) => {
                  const active = selectedId === draft.id;

                  return (
                    <button
                      key={draft.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedId(draft.id)}
                      className={`w-full rounded-xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E47A3] ${
                        active
                          ? "border-[#2E47A3] bg-[var(--rg-brand-soft)] shadow-sm"
                          : "border-[var(--rg-border)] bg-[var(--rg-surface)] hover:border-[#2E47A3]/50 hover:bg-[var(--rg-canvas)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--rg-brand)]">
                          {draft.kind.replaceAll("_", " ")}
                        </span>
                        {active && (
                          <span className="text-[10px] font-bold text-[var(--rg-brand)]">
                            SELECTED
                          </span>
                        )}
                      </div>

                      <p className="mt-2 font-semibold text-[var(--rg-ink)]">
                        {draft.title || "Untitled draft"}
                      </p>

                      <p className="mt-1 truncate text-xs text-[var(--rg-muted)]">
                        {draft.targetProgram || "No programme selected"}
                      </p>

                      <div className="mt-3">
                        <StatusBadge status={draft.status} />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Draft editor */}
          <div className={`${card} min-w-0 overflow-hidden`}>
            {selectedDraft ? (
              <>
                <div className="border-b border-[var(--rg-border)] p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--rg-brand)]">
                        Writing workspace
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-[var(--rg-ink)]">
                        Edit content
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={selectedDraft.status} />
                      <span className="rounded-lg bg-[var(--rg-canvas)] px-3 py-2 text-xs font-semibold text-[var(--rg-muted)]">
                        v{selectedDraft.version}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-4 sm:p-5">
                  <label className={label}>
                    Draft title
                    <input
                      className={`${input} mt-2`}
                      value={selectedDraft.title}
                      onChange={(event) =>
                        updateSelected({ title: event.target.value })
                      }
                      placeholder="Give your content a title"
                    />
                  </label>

                  <label className={label}>
                    Target programme
                    <input
                      className={`${input} mt-2`}
                      value={selectedDraft.targetProgram}
                      onChange={(event) =>
                        updateSelected({ targetProgram: event.target.value })
                      }
                      placeholder="e.g. Truth Tuesdays"
                    />
                  </label>

                  <label className={label}>
                    Content
                    <textarea
                      className={`${input} mt-2 min-h-64 resize-y leading-7`}
                      rows={10}
                      value={selectedDraft.body}
                      onChange={(event) =>
                        updateSelected({ body: event.target.value })
                      }
                      placeholder="Start writing your ministry content here..."
                    />
                  </label>

                  <label className={label}>
                    Leader's notes
                    <textarea
                      className={`${input} mt-2 resize-y`}
                      rows={3}
                      value={selectedDraft.userNotes}
                      onChange={(event) =>
                        updateSelected({ userNotes: event.target.value })
                      }
                      placeholder="Add private notes or reminders..."
                    />
                  </label>

                  <div className="rounded-2xl border border-[var(--rg-border)] bg-[var(--rg-canvas)] p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--rg-muted)]">
                      Approval journey
                    </p>

                    <div className="mt-4 grid grid-cols-4 gap-1">
                      {(
                        [
                          "draft",
                          "awaiting_approval",
                          "approved_for_user_sharing",
                          "shared_manually",
                        ] as DraftStatus[]
                      ).map((stage, index) => {
                        const stages: DraftStatus[] = [
                          "draft",
                          "awaiting_approval",
                          "approved_for_user_sharing",
                          "shared_manually",
                        ];

                        const currentIndex = stages.indexOf(
                          selectedDraft.status
                        );

                        const reached = index <= currentIndex;

                        return (
                          <div key={stage} className="min-w-0">
                            <div
                              className={`h-1.5 rounded-full ${
                                reached
                                  ? "bg-[#2E47A3]"
                                  : "bg-slate-200 dark:bg-white/10"
                              }`}
                            />
                            <p
                              className={`mt-2 text-[9px] leading-4 sm:text-[10px] ${
                                index === currentIndex
                                  ? "font-bold text-[var(--rg-brand)]"
                                  : "text-[var(--rg-muted)]"
                              }`}
                            >
                              {index === 0
                                ? "Draft"
                                : index === 1
                                  ? "Review"
                                  : index === 2
                                    ? "Approved"
                                    : "Shared"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={primaryBtn}
                      onClick={saveDraft}
                    >
                      Save new version
                    </button>

                    {selectedDraft.status !== "shared_manually" && (
                      <button
                        type="button"
                        className={ghostBtn}
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

                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/20 dark:bg-amber-500/5">
                    <p className="text-xs leading-5 text-amber-900 dark:text-amber-200">
                      <strong>Content responsibility:</strong> Approval does
                      not publish or distribute content. Sharing remains a
                      separate manual action. Always check Scripture
                      references and practical details before sharing.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--rg-brand-soft)] text-2xl font-semibold text-[var(--rg-brand)]">
                  +
                </div>

                <h3 className="mt-4 font-bold text-[var(--rg-ink)]">
                  Your writing space awaits
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--rg-muted)]">
                  Select an existing draft from your library or create a new
                  one to begin preparing content.
                </p>

                <button
                  type="button"
                  className={`${primaryBtn} mt-5`}
                  onClick={createDraft}
                >
                  Create new draft
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
