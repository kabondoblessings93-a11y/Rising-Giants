import type { ReactNode } from "react";
import type { NavDestination } from "../types/domain";
import { AiOrbButton } from "./AiOrbButton";
import { CommunityIcon, HomeIcon, MinistryIcon, MoonIcon, PlusIcon, ProductivityIcon, SettingsIcon, SunIcon, AlertIcon, PauseIcon } from "./Icons";

interface AppShellProps {
  activeDest: NavDestination;
  onNavigate: (dest: NavDestination) => void;
  onOpenCapture: () => void;
  onOpenAssistant: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  needsReviewCount: number;
  allCapturePaused: boolean;
  children: ReactNode;
}

const NAV = [
  { id: "home" as const, label: "Home", Icon: HomeIcon },
  { id: "community" as const, label: "Community", Icon: CommunityIcon },
  { id: "ministry" as const, label: "Ministry", Icon: MinistryIcon },
  { id: "productivity" as const, label: "Productivity", Icon: ProductivityIcon },
  { id: "settings" as const, label: "Settings", Icon: SettingsIcon },
];

const TITLES: Record<NavDestination, { title: string; subtitle: string }> = {
  home: { title: "Home", subtitle: "A calm view of what needs your attention today." },
  community: { title: "Community Intelligence", subtitle: "Captured questions, prayers, and testimonies." },
  ministry: { title: "Ministry Workspace", subtitle: "Weekly focus, programs, and content drafts." },
  productivity: { title: "Productivity", subtitle: "Private rhythms, focus, and screen time." },
  ai: { title: "AI Assistant", subtitle: "Ask, summarize, and draft — with evidence." },
  settings: { title: "Settings", subtitle: "Privacy, capture sources, and audit trail." },
};

export function AppShell({ activeDest, onNavigate, onOpenCapture, onOpenAssistant, darkMode, onToggleDarkMode, needsReviewCount, allCapturePaused, children }: AppShellProps) {
  const current = TITLES[activeDest];
  return (
    <div className="min-h-screen">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-black/5 bg-[#F4F5F7]/85 backdrop-blur dark:border-white/5 dark:bg-[#0D1017]/85">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display truncate text-base font-semibold sm:text-lg">{current.title}</h1>
                {allCapturePaused && (
                  <span className="hidden items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700 sm:inline-flex dark:bg-amber-500/15 dark:text-amber-300">
                    <PauseIcon width={11} height={11} /> Capture paused
                  </span>
                )}
              </div>
              <p className="hidden truncate text-xs text-slate-500 sm:block dark:text-slate-400">{current.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              {needsReviewCount > 0 && (
                <button onClick={() => onNavigate("community")} className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300">
                  <AlertIcon width={14} height={14} /> {needsReviewCount} to review
                </button>
              )}
              <button onClick={onToggleDarkMode} aria-label="Toggle dark mode" className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#151A24] dark:text-slate-300 dark:hover:bg-[#1B2130]">
                {darkMode ? <SunIcon width={17} height={17} /> : <MoonIcon width={17} height={17} />}
              </button>
              <button onClick={onOpenCapture} className="hidden items-center gap-2 rounded-xl bg-[#2E47A3] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#263c8f] active:scale-[0.98] sm:inline-flex">
                <PlusIcon width={16} height={16} /> Capture
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 pb-32 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      <AiOrbButton onClick={onOpenAssistant} hidden={activeDest === "ai"} />

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-white/5 dark:bg-[#11151E]/95">
        <div className="mx-auto grid max-w-5xl grid-cols-5 gap-1 px-2 sm:px-6">
          {NAV.map(({ id, label, Icon }) => {
            const active = activeDest === id;
            return (
              <button key={id} onClick={() => onNavigate(id)} className={`relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2.5 text-[9px] font-medium transition sm:text-[11px] ${active ? "text-[#2E47A3] dark:text-[#93A6F0]" : "text-slate-500 dark:text-slate-400"}`}>
                <Icon width={20} height={20} />
                {label}
                {id === "community" && needsReviewCount > 0 && (
                  <span className="absolute right-3 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
