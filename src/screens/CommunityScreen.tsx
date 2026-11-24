import { useMemo, useState } from "react";
import type {
  CommunityItem,
  CommunityItemCategory,
  CommunityItemStatus,
} from "../types/domain";

interface CommunityScreenProps {
  items: CommunityItem[];
  onUpdateStatus: (id: string, status: CommunityItemStatus) => void;
}

type Filter = "all" | "needs_review" | CommunityItemStatus;

const categories: Record<CommunityItemCategory, string> = {
  question: "Question",
  prayer_request: "Prayer request",
  testimony: "Testimony",
  announcement: "Announcement",
  concern: "Concern",
};

const statusLabels: Record<CommunityItemStatus, string> = {
  open: "Open",
  review_required: "Needs review",
  draft_prepared: "Draft prepared",
  answered: "Answered",
  archived: "Archived",
};

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All submissions" },
  { id: "needs_review", label: "Needs attention" },
  { id: "open", label: "Open" },
  { id: "review_required", label: "Review required" },
  { id: "draft_prepared", label: "Draft prepared" },
  { id: "answered", label: "Answered" },
  { id: "archived", label: "Archived" },
];

const panel =
  "rounded-2xl border border-[var(--rg-border)] bg-[var(--rg-surface)] shadow-[var(--rg-shadow-soft)]";

function statusStyle(status: CommunityItemStatus) {
  switch (status) {
    case "review_required":
      return "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300";
    case "open":
      return "bg-blue-50 text-blue-800 dark:bg-blue-500/10 dark:text-blue-300";
    case "draft_prepared":
      return "bg-violet-50 text-violet-800 dark:bg-violet-500/10 dark:text-violet-300";
    case "answered":
      return "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300";
    case "archived":
      return "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400";
  }
}

function categoryStyle(category: CommunityItemCategory) {
  switch (category) {
    case "question":
      return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300";
    case "prayer_request":
      return "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300";
    case "testimony":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
    case "announcement":
      return "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300";
    case "concern":
      return "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300";
  }
}

export function CommunityScreen({
  items,
  onUpdateStatus,
}: CommunityScreenProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | CommunityItemCategory>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visibleItems = useMemo(() => {
    const term = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "needs_review" &&
          (item.status === "review_required" || item.status === "open")) ||
        item.status === filter;

      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;

      const matchesSearch =
        !term ||
        [
          item.summary,
          item.sourceText,
          item.source,
          ...item.topics,
          ...item.scriptureRefs,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      return matchesFilter && matchesCategory && matchesSearch;
    });
  }, [items, filter, categoryFilter, query]);

  const selectedItem = items.find((item) => item.id === selectedId);

  const needsReviewCount = items.filter(
    (item) => item.status === "review_required" || item.status === "open"
  ).length;

  const answeredCount = items.filter(
    (item) => item.status === "answered"
  ).length;

  const draftCount = items.filter(
    (item) => item.status === "draft_prepared"
  ).length;

  return (
    <main className="mx-auto max-w-6xl space-y-7 p-5 sm:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-amber-600">
            RISING GIANTS · COMMUNITY
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Community intelligence
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            A thoughtful place to organise member questions, prayer requests,
            testimonies and concerns.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--rg-border)] bg-[var(--rg-surface)] px-4 py-3 shadow-sm">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total submissions
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {items.length}
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <article className={`${panel} p-4`}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Needs attention
            </p>
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            {needsReviewCount}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Open or awaiting review
          </p>
        </article>

        <article className={`${panel} p-4`}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Draft prepared
            </p>
            <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            {draftCount}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Content ready for review
          </p>
        </article>

        <article className={`${panel} p-4`}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Answered
            </p>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            {answeredCount}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Marked as followed up
          </p>
        </article>
      </section>

      <section className={`${panel} p-4 sm:p-5`}>
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Search community submissions
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search messages, topics, sources or Scripture..."
              aria-label="Search community submissions"
              className="rg-input"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Submission category
            </span>
            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value as "all" | CommunityItemCategory)
              }
              className="rg-input"
            >
              <option value="all">All categories</option>
              {Object.entries(categories).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {filters.map((option) => {
            const active = filter === option.id;
            const count =
              option.id === "all"
                ? items.length
                : option.id === "needs_review"
                  ? needsReviewCount
                  : items.filter((item) => item.status === option.id).length;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setFilter(option.id)}
                aria-pressed={active}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  active
                    ? "border-[#2E47A3] bg-[#2E47A3] text-white shadow-sm"
                    : "border-[var(--rg-border)] bg-[var(--rg-surface)] text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                }`}
              >
                {option.label}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Submissions
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Showing {visibleItems.length} of {items.length}
            </p>
          </div>
        </div>

        {visibleItems.length === 0 ? (
          <div className={`${panel} px-5 py-14 text-center`}>
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300">
              <span className="text-xl">⌕</span>
            </div>
            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
              No submissions found
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              Try a different search term or adjust your category and status filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFilter("all");
                setCategoryFilter("all");
              }}
              className="mt-4 text-sm font-semibold text-[#2E47A3] hover:underline dark:text-[#A8B8FF]"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {visibleItems.map((item) => (
              <article
                key={item.id}
                className={`${panel} group min-w-0 p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--rg-shadow-raised)]`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${categoryStyle(item.category)}`}>
                      {categories[item.category]}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle(item.status)}`}>
                      {statusLabels[item.status]}
                    </span>
                  </div>
                  <time className="text-[11px] text-slate-400">
                    {item.capturedAt}
                  </time>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className="mt-4 block w-full text-left"
                >
                  <h3 className="text-sm font-bold leading-6 text-slate-900 transition group-hover:text-[#2E47A3] dark:text-white dark:group-hover:text-[#A8B8FF]">
                    {item.summary}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {item.sourceText}
                  </p>
                </button>

                {item.topics.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.topics.slice(0, 4).map((topic) => (
                      <span
                        key={topic}
                        className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500 dark:bg-white/5 dark:text-slate-400"
                      >
                        #{topic}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--rg-border)] pt-4">
                  <span className="truncate text-[11px] text-slate-400">
                    Source: {item.source}
                  </span>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className="rounded-lg border border-[var(--rg-border)] px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                    >
                      Details
                    </button>

                    {item.status !== "answered" && item.status !== "archived" && (
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(item.id, "answered")}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                      >
                        Mark answered
                      </button>
                    )}

                    {item.status === "archived" && (
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(item.id, "open")}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                      >
                        Reopen
                      </button>
                    )}

                    {item.status !== "archived" && (
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(item.id, "archived")}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
                      >
                        Archive
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedItem && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onClick={() => setSelectedId(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="community-detail-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-[var(--rg-border)] bg-[var(--rg-surface)] p-6 shadow-2xl sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${categoryStyle(selectedItem.category)}`}>
                  {categories[selectedItem.category]}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(selectedItem.status)}`}>
                  {statusLabels[selectedItem.status]}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close submission details"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15"
              >
                ×
              </button>
            </div>

            <h2
              id="community-detail-title"
              className="mt-5 text-xl font-bold leading-7 text-slate-900 dark:text-white"
            >
              {selectedItem.summary}
            </h2>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Source: {selectedItem.source}</span>
              <span>Captured: {selectedItem.capturedAt}</span>
              <span>Sensitivity: {selectedItem.sensitivity}</span>
            </div>

            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Original submission
              </h3>
              <p className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:bg-white/5 dark:text-slate-300">
                {selectedItem.sourceText || "No original text was provided."}
              </p>
            </div>

            {selectedItem.topics.length > 0 && (
              <div className="mt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Topics
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedItem.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedItem.scriptureRefs.length > 0 && (
              <div className="mt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Scripture references
                </h3>
                <p className="mt-2 text-sm font-semibold text-[#2E47A3] dark:text-[#A8B8FF]">
                  {selectedItem.scriptureRefs.join(" · ")}
                </p>
              </div>
            )}

            <div className="mt-7 flex flex-wrap justify-end gap-2 border-t border-[var(--rg-border)] pt-5">
              {selectedItem.status !== "answered" && selectedItem.status !== "archived" && (
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStatus(selectedItem.id, "answered");
                    setSelectedId(null);
                  }}
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Mark answered
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded-xl border border-[var(--rg-border)] px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
