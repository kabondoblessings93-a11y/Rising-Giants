import type { CSSProperties, ReactNode } from "react";
import type { NavDestination } from "../types/domain";
import { AiOrbButton } from "./AiOrbButton";
import {
  CommunityIcon,
  HomeIcon,
  MinistryIcon,
  MoonIcon,
  PlusIcon,
  ProductivityIcon,
  SettingsIcon,
  SunIcon,
  AlertIcon,
  PauseIcon,
} from "./Icons";

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
  ministry: { title: "Ministry Workspace", subtitle: "Weekly focus, programmes, and content drafts." },
  productivity: { title: "Productivity", subtitle: "Private rhythms, focus, and screen time." },
  ai: { title: "AI Assistant", subtitle: "Ask, reflect, and prepare with care." },
  settings: { title: "Settings", subtitle: "Privacy, capture preferences, and activity." },
};

export function AppShell({
  activeDest,
  onNavigate,
  onOpenCapture,
  onOpenAssistant,
  darkMode,
  onToggleDarkMode,
  needsReviewCount,
  allCapturePaused,
  children,
}: AppShellProps) {
  const current = TITLES[activeDest];
  const activeIndex = NAV.findIndex(({ id }) => id === activeDest);

  return (
    <div className="rg-app-shell min-h-screen">
      <header className="rg-app-header sticky top-0 z-30">
        <div className="rg-app-header__inner mx-auto flex max-w-7xl items-center gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
                {current.title}
              </h1>
              {allCapturePaused && (
                <span className="rg-status-warning hidden items-center gap-1 sm:inline-flex">
                  <PauseIcon width={11} height={11} />
                  Capture paused
                </span>
              )}
            </div>
            <p className="hidden truncate text-xs text-slate-500 sm:block dark:text-slate-400">
              {current.subtitle}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {needsReviewCount > 0 && (
              <button
                type="button"
                onClick={() => onNavigate("community")}
                className="rg-review-pill"
                aria-label={`${needsReviewCount} community items to review`}
              >
                <AlertIcon width={14} height={14} />
                <span>{needsReviewCount} to review</span>
              </button>
            )}

            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="rg-icon-button"
            >
              {darkMode ? (
                <SunIcon width={17} height={17} />
              ) : (
                <MoonIcon width={17} height={17} />
              )}
            </button>

            <button
              type="button"
              onClick={onOpenCapture}
              className="rg-capture-button hidden sm:inline-flex"
            >
              <PlusIcon width={16} height={16} />
              Capture
            </button>
          </div>
        </div>
      </header>

      <main className="rg-main-content px-4 py-6 pb-36 sm:px-6 lg:px-8">
        <div key={activeDest} className="rg-page-enter mx-auto max-w-7xl">
          {children}
        </div>
      </main>

      <AiOrbButton onClick={onOpenAssistant} hidden={activeDest === "ai"} />

      <nav
        className="rg-bottom-dock"
        aria-label="Main navigation"
        style={{ "--active-index": Math.max(0, activeIndex) } as CSSProperties}
      >
        <div className="rg-bottom-dock__surface" aria-hidden="true" />
        <div className="rg-bottom-dock__items">
          {activeIndex >= 0 && (
            <span className="rg-nav-active-bubble" aria-hidden="true" />
          )}
          {NAV.map(({ id, label, Icon }) => {
            const active = activeDest === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={active ? "page" : undefined}
                className={`rg-nav-item ${active ? "is-active" : ""}`}
              >
                <span className="rg-nav-item__icon">
                  <Icon width={20} height={20} />
                  {id === "community" && needsReviewCount > 0 && (
                    <span className="rg-nav-item__badge" />
                  )}
                </span>
                <span className="rg-nav-item__label">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
