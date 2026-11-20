import type {
  ActivityLifecycle,
  AppCategory,
  CommunityItemCategory,
  CommunityItemSensitivity,
  CommunityItemStatus,
  DraftKind,
  DraftStatus,
} from "../types/domain";

type Meta = { label: string; badge: string; dot?: string };

export const COMMUNITY_STATUS: Record<CommunityItemStatus, Meta> = {
  open: { label: "Open", badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300", dot: "bg-amber-500" },
  review_required: { label: "Review required", badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300", dot: "bg-rose-500" },
  draft_prepared: { label: "Draft prepared", badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300", dot: "bg-blue-500" },
  answered: { label: "Answered", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300", dot: "bg-emerald-500" },
  archived: { label: "Archived", badge: "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300", dot: "bg-slate-400" },
};

export const COMMUNITY_CATEGORY: Record<CommunityItemCategory, Meta> = {
  question: { label: "Question", badge: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300" },
  prayer_request: { label: "Prayer", badge: "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300" },
  testimony: { label: "Testimony", badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" },
  announcement: { label: "Announcement", badge: "bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
  concern: { label: "Concern", badge: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300" },
};

export const SENSITIVITY: Record<CommunityItemSensitivity, Meta> = {
  normal: { label: "Normal", badge: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300" },
  sensitive: { label: "Sensitive", badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
  restricted: { label: "Restricted", badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" },
};

export const DRAFT_STATUS: Record<DraftStatus, Meta> = {
  draft: { label: "Draft", badge: "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300" },
  awaiting_approval: { label: "Awaiting approval", badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
  approved_for_user_sharing: { label: "Approved", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" },
  shared_manually: { label: "Shared", badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300" },
};

export const DRAFT_KIND: Record<DraftKind, string> = {
  question_response: "Question response",
  reflection: "Reflection",
  announcement: "Announcement",
  devotional: "Devotional",
};

export const ACTIVITY_STATUS: Record<ActivityLifecycle, Meta> = {
  planned: { label: "Planned", badge: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300" },
  in_progress: { label: "In progress", badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300" },
  completed: { label: "Completed", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" },
  cancelled: { label: "Cancelled", badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" },
};

export const APP_CATEGORY: Record<AppCategory, Meta> = {
  productive: { label: "Productive", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300", dot: "bg-emerald-500" },
  neutral: { label: "Neutral", badge: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300", dot: "bg-sky-500" },
  distracting: { label: "Distracting", badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300", dot: "bg-rose-500" },
  unclassified: { label: "Unclassified", badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300", dot: "bg-amber-500" },
};
