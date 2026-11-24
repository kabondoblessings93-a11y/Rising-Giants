import type { ReactNode } from "react";

export function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`rg-badge inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

export const card =
  "rg-card rounded-2xl border border-[var(--rg-border)] bg-[var(--rg-surface)] shadow-[var(--rg-shadow-soft)]";

export const input =
  "rg-input w-full rounded-xl border border-[var(--rg-border)] bg-[var(--rg-surface-strong)] px-3.5 py-3 text-sm text-[var(--rg-ink)] outline-none transition placeholder:text-slate-400 focus:border-[#2E47A3] focus:ring-4 focus:ring-[#2E47A3]/10 dark:placeholder:text-slate-500";

export const label =
  "mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--rg-muted)]";

export const primaryBtn =
  "rg-button-primary inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E47A3] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#263c8f] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E47A3] disabled:cursor-not-allowed disabled:opacity-50";

export const ghostBtn =
  "rg-button-ghost inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--rg-border)] bg-[var(--rg-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--rg-ink)] transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E47A3] disabled:opacity-50 dark:hover:bg-white/5";
