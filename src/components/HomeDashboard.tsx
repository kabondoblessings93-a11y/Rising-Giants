import type { ActivityItem, CommunityItem, DailyProductivityRecord, FocusSessionRecord, GroupProfile, NavDestination, RoutineItem } from "../types/domain";
import { COMMUNITY_CATEGORY, COMMUNITY_STATUS } from "./meta";
import { Badge, card } from "./ui";
import { AlertIcon, ArrowRightIcon, BookIcon, CheckIcon, ClockIcon, PlusIcon, TargetIcon } from "./Icons";

interface HomeDashboardProps {
  groupProfile: GroupProfile;
  communityItems: CommunityItem[];
  activities: ActivityItem[];
  todayProductivity: DailyProductivityRecord;
  routines: RoutineItem[];
  focusSessions: FocusSessionRecord[];
  onNavigate: (dest: NavDestination, itemId?: string) => void;
  onToggleRoutine: (routineId: string) => void;
  onOpenCapture: () => void;
}

function StatCard({ icon, label, value, hint, tint }: { icon: React.ReactNode; label: string; value: string; hint: string; tint: string }) {
  return (
    <div className={`${card} p-4`}>
      <div className={`mb-3 grid h-9 w-9 place-items-center rounded-xl ${tint}`}>{icon}</div>
      <p className="font-mono-data text-2xl font-semibold leading-none">{value}</p>
      <p className="mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">{hint}</p>
    </div>
  );
}

export function HomeDashboard({ groupProfile, communityItems, activities, todayProductivity, routines, focusSessions, onNavigate, onToggleRoutine, onOpenCapture }: HomeDashboardProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const needsReview = communityItems.filter((i) => i.status === "open" || i.status === "review_required");
  const upcoming = activities.filter((a) => a.status === "planned" || a.status === "in_progress").slice(0, 4);
  const routinesDone = routines.filter((r) => r.checkedInToday).length;
  const focusMinutes = focusSessions.reduce((s, f) => s + f.durationMinutes, 0);

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm text-slate-500 dark:text-slate-400">{greeting},</p>
        <h2 className="font-display mt-1 text-2xl font-semibold sm:text-3xl">{groupProfile.name}</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{groupProfile.tagline}</p>
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2E47A3] via-[#2A4297] to-[#1B2A6B] p-6 text-white shadow-lg shadow-[#2E47A3]/20 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-white/60">
            <BookIcon width={14} height={14} /> Weekly focus
          </div>
          <h3 className="font-display mt-2 text-2xl font-semibold sm:text-3xl">{groupProfile.weeklyFocusTheme}</h3>
          <p className="mt-1 text-sm text-white/80">{groupProfile.weeklyFocusScripture} · {groupProfile.preferredTranslation}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90">{groupProfile.weeklyFocusObjective}</p>
          <button onClick={() => onNavigate("ministry")} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25">
            Open ministry workspace <ArrowRightIcon width={16} height={16} />
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard icon={<AlertIcon width={17} height={17} />} tint="bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300" label="Needs review" value={String(needsReview.length)} hint="Captured items waiting" />
        <StatCard icon={<TargetIcon width={17} height={17} />} tint="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300" label="Routines done" value={`${routinesDone}/${routines.length}`} hint="Today's rhythms" />
        <StatCard icon={<ClockIcon width={17} height={17} />} tint="bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300" label="Focus minutes" value={String(focusMinutes)} hint="Completed sessions" />
        <StatCard icon={<PlusIcon width={17} height={17} />} tint="bg-[#2E47A3]/10 text-[#2E47A3] dark:bg-[#2E47A3]/25 dark:text-[#93A6F0]" label="Screen time" value={`${Math.round(todayProductivity.totalMinutes / 60)}h`} hint="Tracked today" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className={`${card} p-5 lg:col-span-2`}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold">Needs your attention</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Captured from your community — review or draft a response.</p>
            </div>
            <button onClick={() => onNavigate("community")} className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E47A3] hover:underline dark:text-[#93A6F0]">
              View all <ArrowRightIcon width={14} height={14} />
            </button>
          </div>
          {needsReview.length === 0 ? (
            <div className="rounded-xl border border-dashed border-black/10 p-6 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">You're all caught up. 🎉</div>
          ) : (
            <ul className="space-y-2">
              {needsReview.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <button onClick={() => onNavigate("community", item.id)} className="group flex w-full items-start gap-3 rounded-xl border border-transparent p-3 text-left transition hover:border-black/5 hover:bg-slate-50 dark:hover:border-white/5 dark:hover:bg-white/5">
                    <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#2E47A3]/10 text-[#2E47A3] dark:bg-[#2E47A3]/20 dark:text-[#93A6F0]">
                      <AlertIcon width={15} height={15} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{item.summary}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-1.5">
                        <Badge className={COMMUNITY_CATEGORY[item.category].badge}>{COMMUNITY_CATEGORY[item.category].label}</Badge>
                        <Badge className={COMMUNITY_STATUS[item.status].badge}>{COMMUNITY_STATUS[item.status].label}</Badge>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">{item.capturedAt}</span>
                      </span>
                    </span>
                    <ArrowRightIcon width={16} height={16} className="mt-1.5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#2E47A3] dark:text-slate-600" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button onClick={onOpenCapture} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#2E47A3]/30 px-4 py-2.5 text-sm font-semibold text-[#2E47A3] transition hover:bg-[#2E47A3]/5 dark:border-[#93A6F0]/30 dark:text-[#93A6F0]">
            <PlusIcon width={16} height={16} /> Capture something new
          </button>
        </section>

        <section className={`${card} p-5`}>
          <h3 className="font-display text-base font-semibold">Today's rhythms</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Small faithfulness, repeated.</p>
          <ul className="mt-4 space-y-1.5">
            {routines.map((r) => (
              <li key={r.id}>
                <button onClick={() => onToggleRoutine(r.id)} className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-white/5">
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${r.checkedInToday ? "border-[#2E47A3] bg-[#2E47A3] text-white" : "border-black/15 dark:border-white/20"}`}>
                    {r.checkedInToday && <CheckIcon width={13} height={13} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-sm ${r.checkedInToday ? "text-slate-400 line-through dark:text-slate-500" : "text-[#141824] dark:text-[#F1F3F8]"}`}>{r.title}</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">{r.cadence}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={`${card} p-5`}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Upcoming programs</h3>
            <button onClick={() => onNavigate("ministry")} className="text-xs font-semibold text-[#2E47A3] hover:underline dark:text-[#93A6F0]">Manage</button>
          </div>
          <ul className="space-y-2">
            {upcoming.map((a) => (
              <li key={a.id} className="flex items-center gap-3 rounded-xl border border-black/5 p-3 dark:border-white/5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"><BookIcon width={16} height={16} /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{a.type} · {a.nextOccurrence}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${card} p-5`}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Recent focus</h3>
            <button onClick={() => onNavigate("productivity")} className="text-xs font-semibold text-[#2E47A3] hover:underline dark:text-[#93A6F0]">Open</button>
          </div>
          <ul className="space-y-2">
            {focusSessions.slice(0, 4).map((f) => (
              <li key={f.id} className="flex items-center gap-3 rounded-xl border border-black/5 p-3 dark:border-white/5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"><ClockIcon width={16} height={16} /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{f.label}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{f.completedAt}</p>
                </div>
                <span className="font-mono-data text-sm font-semibold text-slate-500 dark:text-slate-300">{f.durationMinutes}m</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
