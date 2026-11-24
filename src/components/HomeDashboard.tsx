import type { ReactNode } from "react";
import type {
  ActivityItem,
  CommunityItem,
  DailyProductivityRecord,
  FocusSessionRecord,
  GroupProfile,
  NavDestination,
  RoutineItem,
  MoodCheckInRecord,
  MoodPlanItem,
} from "../types/domain";

import { COMMUNITY_CATEGORY, COMMUNITY_STATUS } from "./meta";
import { Badge, card } from "./ui";
import { MoodDashboardSection } from "./MoodDashboardSection";

import {
  AlertIcon,
  ArrowRightIcon,
  BookIcon,
  CheckIcon,
  ClockIcon,
  PlusIcon,
  TargetIcon,
} from "./Icons";

interface HomeDashboardProps {
  groupProfile: GroupProfile;
  communityItems: CommunityItem[];
  activities: ActivityItem[];
  todayProductivity: DailyProductivityRecord;
  routines: RoutineItem[];
  focusSessions: FocusSessionRecord[];
  todayMood: MoodCheckInRecord | null;
  moodRecords: MoodCheckInRecord[];
  todayPlanItems: MoodPlanItem[];
  onOpenMoodCheckIn: () => void;
  onAddMoodPlanItem: (title: string) => void;
  onToggleMoodPlanItem: (id: string) => void;
  onNavigate: (dest: NavDestination, itemId?: string) => void;
  onToggleRoutine: (routineId: string) => void;
  onOpenCapture: () => void;
}

function StatCard({
  icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
  accent: string;
}) {
  return (
    <article className={`${card} rg-stat-card p-4 sm:p-5`}>
      <div className={`mb-4 grid h-10 w-10 place-items-center rounded-xl ${accent}`}>
        {icon}
      </div>
      <p className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
        {value}
      </p>
      <p className="mt-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </p>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {hint}
      </p>
    </article>
  );
}

function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h3 className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function HomeDashboard({
  groupProfile,
  communityItems,
  activities,
  todayProductivity,
  routines,
  focusSessions,
  todayMood,
  moodRecords,
  todayPlanItems,
  onOpenMoodCheckIn,
  onAddMoodPlanItem,
  onToggleMoodPlanItem,
  onNavigate,
  onToggleRoutine,
  onOpenCapture,
}: HomeDashboardProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const needsReview = communityItems.filter(
    (item) => item.status === "open" || item.status === "review_required"
  );

  const upcoming = activities
    .filter((activity) =>
      activity.status === "planned" || activity.status === "in_progress"
    )
    .slice(0, 4);

  const routinesDone = routines.filter(
    (routine) => routine.checkedInToday
  ).length;

  const focusMinutes = focusSessions.reduce(
    (sum, session) => sum + session.durationMinutes,
    0
  );

  const todayLabel = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-7 sm:space-y-8">
      {/* Welcome */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {greeting},
          </p>
          <h2 className="font-display mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {groupProfile.name}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            {groupProfile.tagline}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-[var(--rg-border)] bg-[var(--rg-surface)] px-3 py-2 text-xs font-medium text-slate-500 shadow-sm dark:text-slate-300 sm:self-auto">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {todayLabel}
        </div>
      </section>

      {/* Weekly focus hero */}
      <section className="rg-weekly-hero relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#304CA9] via-[#263D91] to-[#142454] p-6 text-white shadow-[0_16px_42px_rgba(35,61,145,.2)] sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-5 -top-12 h-52 w-52 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-28 right-1/4 h-64 w-64 rounded-full bg-[#8CA5FF]/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-white/80 backdrop-blur">
            <BookIcon width={13} height={13} />
            Weekly focus
          </div>

          <h3 className="font-display mt-5 text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
            {groupProfile.weeklyFocusTheme}
          </h3>

          <p className="mt-2 text-sm font-semibold text-blue-100">
            {groupProfile.weeklyFocusScripture}
            <span className="mx-2 text-white/40">·</span>
            {groupProfile.preferredTranslation}
          </p>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">
            {groupProfile.weeklyFocusObjective}
          </p>

          <button
            type="button"
            onClick={() => onNavigate("ministry")}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
          >
            Explore weekly focus
            <ArrowRightIcon width={16} height={16} />
          </button>
        </div>
      </section>

      {/* Snapshot metrics */}
      <section>
        <div className="mb-4">
          <h3 className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-white">
            Your workspace at a glance
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            A quick overview of today's activity.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          <StatCard
            icon={<AlertIcon width={19} height={19} />}
            accent="bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300"
            label="Needs review"
            value={String(needsReview.length)}
            hint="Community submissions"
          />
          <StatCard
            icon={<TargetIcon width={19} height={19} />}
            accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
            label="Routines done"
            value={`${routinesDone}/${routines.length}`}
            hint="Today's recurring rhythms"
          />
          <StatCard
            icon={<ClockIcon width={19} height={19} />}
            accent="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300"
            label="Focus minutes"
            value={String(focusMinutes)}
            hint="Recorded focus sessions"
          />
          <StatCard
            icon={<PlusIcon width={19} height={19} />}
            accent="bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"
            label="Screen time"
            value={`${Math.floor(todayProductivity.totalMinutes / 60)}h ${todayProductivity.totalMinutes % 60}m`}
            hint="Available usage record"
          />
        </div>
      </section>

      {/* Mood experience */}
      <MoodDashboardSection
        todayMood={todayMood}
        moodRecords={moodRecords}
        todayPlanItems={todayPlanItems}
        onOpenMoodCheckIn={onOpenMoodCheckIn}
        onAddPlanItem={onAddMoodPlanItem}
        onTogglePlanItem={onToggleMoodPlanItem}
      />

      {/* Community and recurring routines */}
      <section className="grid gap-5 xl:grid-cols-[1.35fr_.85fr]">
        <div className={`${card} min-w-0 p-5 sm:p-6`}>
          <SectionHeading
            title="Needs your attention"
            subtitle="Community submissions waiting for a response or review."
            action={
              <button
                type="button"
                onClick={() => onNavigate("community")}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2E47A3] hover:underline dark:text-[#93A6F0]"
              >
                View all
                <ArrowRightIcon width={14} height={14} />
              </button>
            }
          />

          {needsReview.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--rg-border)] bg-slate-50/60 p-7 text-center dark:bg-white/[.025]">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                <CheckIcon width={19} height={19} />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
                You're all caught up
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                No community submissions need your attention right now.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {needsReview.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate("community", item.id)}
                    className="group flex w-full items-start gap-3 rounded-xl border border-transparent p-3 text-left transition hover:border-[var(--rg-border)] hover:bg-slate-50 dark:hover:bg-white/[.035]"
                  >
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#2E47A3]/10 text-[#2E47A3] dark:bg-[#2E47A3]/20 dark:text-[#A8B8FF]">
                      <AlertIcon width={16} height={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {item.summary}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-1.5">
                        <Badge className={COMMUNITY_CATEGORY[item.category].badge}>
                          {COMMUNITY_CATEGORY[item.category].label}
                        </Badge>
                        <Badge className={COMMUNITY_STATUS[item.status].badge}>
                          {COMMUNITY_STATUS[item.status].label}
                        </Badge>
                        <span className="text-[10px] text-slate-400">
                          {item.capturedAt}
                        </span>
                      </span>
                    </span>
                    <ArrowRightIcon
                      width={16}
                      height={16}
                      className="mt-1 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#2E47A3] dark:text-slate-600"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={onOpenCapture}
            className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#2E47A3]/30 px-4 py-2.5 text-sm font-semibold text-[#2E47A3] transition hover:bg-[#2E47A3]/5 dark:border-[#93A6F0]/30 dark:text-[#A8B8FF]"
          >
            <PlusIcon width={16} height={16} />
            Capture something new
          </button>
        </div>

        <div className={`${card} min-w-0 p-5 sm:p-6`}>
          <SectionHeading
            title="Today's rhythms"
            subtitle="Small faithfulness, repeated."
            action={
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                {routinesDone}/{routines.length} done
              </span>
            }
          />

          {routines.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-white/5 dark:text-slate-400">
              Your routines will appear here when you add them.
            </p>
          ) : (
            <ul className="space-y-1">
              {routines.map((routine) => (
                <li key={routine.id}>
                  <button
                    type="button"
                    onClick={() => onToggleRoutine(routine.id)}
                    className="flex w-full items-center gap-3 rounded-xl px-2.5 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-white/[.035]"
                  >
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${
                        routine.checkedInToday
                          ? "border-[#2E47A3] bg-[#2E47A3] text-white"
                          : "border-slate-300 dark:border-white/20"
                      }`}
                    >
                      {routine.checkedInToday && (
                        <CheckIcon width={13} height={13} />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-sm font-medium ${
                          routine.checkedInToday
                            ? "text-slate-400 line-through dark:text-slate-500"
                            : "text-slate-800 dark:text-slate-100"
                        }`}
                      >
                        {routine.title}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-slate-400">
                        {routine.cadence}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Programs and focus sessions */}
      <section className="grid gap-5 xl:grid-cols-2">
        <div className={`${card} min-w-0 p-5 sm:p-6`}>
          <SectionHeading
            title="Upcoming programmes"
            subtitle="What's coming up in the ministry."
            action={
              <button
                type="button"
                onClick={() => onNavigate("ministry")}
                className="text-xs font-bold text-[#2E47A3] hover:underline dark:text-[#93A6F0]"
              >
                Manage
              </button>
            }
          />

          {upcoming.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-white/5 dark:text-slate-400">
              No upcoming programmes have been scheduled.
            </p>
          ) : (
            <ul className="space-y-2">
              {upcoming.map((activity) => (
                <li
                  key={activity.id}
                  className="flex items-center gap-3 rounded-xl border border-[var(--rg-border)] p-3 transition hover:bg-slate-50/70 dark:hover:bg-white/[.025]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#2E47A3]/8 text-[#2E47A3] dark:bg-[#2E47A3]/20 dark:text-[#A8B8FF]">
                    <BookIcon width={17} height={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {activity.title}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                      {activity.type} · {activity.nextOccurrence}
                    </span>
                  </span>
                  <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold capitalize text-slate-600 dark:bg-white/10 dark:text-slate-300 sm:inline-block">
                    {activity.status.replace("_", " ")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`${card} min-w-0 p-5 sm:p-6`}>
          <SectionHeading
            title="Recent focus"
            subtitle="Time set aside for intentional work."
            action={
              <button
                type="button"
                onClick={() => onNavigate("productivity")}
                className="text-xs font-bold text-[#2E47A3] hover:underline dark:text-[#93A6F0]"
              >
                View productivity
              </button>
            }
          />

          {focusSessions.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-white/5 dark:text-slate-400">
              Completed focus sessions will appear here.
            </p>
          ) : (
            <ul className="space-y-2">
              {focusSessions.slice(0, 4).map((session) => (
                <li
                  key={session.id}
                  className="flex items-center gap-3 rounded-xl border border-[var(--rg-border)] p-3"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <ClockIcon width={17} height={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {session.label}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                      {session.completedAt}
                    </span>
                  </span>
                  <span className="font-mono-data text-sm font-bold text-slate-600 dark:text-slate-300">
                    {session.durationMinutes}m
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
