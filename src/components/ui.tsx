import type { ReactNode } from "react";

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

export const card = "rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/5 dark:bg-[#151A24]";
export const input = "w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-[#141824] outline-none transition placeholder:text-slate-400 focus:border-[#2E47A3] focus:ring-2 focus:ring-[#2E47A3]/20 dark:border-white/10 dark:bg-[#0F141D] dark:text-[#F1F3F8] dark:placeholder:text-slate-500";
export const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400";
export const primaryBtn = "inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E47A3] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#263c8f] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";
export const ghostBtn = "inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#141824] transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-[#151A24] dark:text-[#F1F3F8] dark:hover:bg-[#1B2130]";
