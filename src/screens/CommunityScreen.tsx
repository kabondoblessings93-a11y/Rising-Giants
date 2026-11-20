import { useMemo, useState } from "react";
import type { CommunityItem, CommunityItemStatus } from "../types/domain";

interface CommunityScreenProps {
  items: CommunityItem[];
  onUpdateStatus: (id: string, status: CommunityItemStatus) => void;
}

type Filter = "all" | "needs_review" | "open" | "answered" | "archived";

const categories: Record<CommunityItem["category"], string> = {
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
  { id: "all", label: "All items" },
  { id: "needs_review", label: "Needs review" },
  { id: "open", label: "Open" },
  { id: "answered", label: "Answered" },
  { id: "archived", label: "Archived" },
];

export function CommunityScreen({
  items,
  onUpdateStatus,
}: CommunityScreenProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visibleItems = useMemo(() => {
    const term = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "needs_review" &&
          (item.status === "review_required" || item.status === "open")) ||
        item.status === filter;

      const matchesSearch =
        !term ||
        [item.summary, item.sourceText, item.source, ...item.topics]
          .join(" ")
          .toLowerCase()
          .includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [items, filter, query]);

  const selectedItem = items.find((item) => item.id === selectedId);
  const reviewCount = items.filter(
    (item) => item.status === "review_required" || item.status === "open"
  ).length;
  const answeredCount = items.filter(
    (item) => item.status === "answered"
  ).length;

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-5 sm:p-8">
      <header>
        <p className="text-sm font-semibold tracking-wider text-amber-600">
          RISING GIANTS
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
          Community
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Gather, organise and follow up on what members share.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#151A24]">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total submissions</p>
          <p className="mt-2 text-3xl font-bold dark:text-white">{items.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#151A24]">
          <p className="text-sm text-slate-500 dark:text-slate-400">Awaiting attention</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{reviewCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#151A24]">
          <p className="text-sm text-slate-500 dark:text-slate-400">Answered</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{answeredCount}</p>
        </div>
      </div>

      <section className="space-y-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search submissions, topics or source..."
          aria-label="Search community submissions"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500 dark:border-white/10 dark:bg-[#151A24] dark:text-white"
        />

        <div className="flex flex-wrap gap-2">
          {filters.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                filter === option.id
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "border border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-[#151A24] dark:text-slate-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {visibleItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-white/10">
            <h2 className="font-semibold text-slate-800 dark:text-white">
              No submissions found
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Try another search or choose a different filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {visibleItems.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#151A24]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                      {categories[item.category]}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      {statusLabels[item.status]}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {item.capturedAt}
                  </span>
                </div>

                <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  {item.summary}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Source: {item.source}
                </p>

                {item.topics.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-xs text-slate-500 dark:text-slate-400"
                      >
                        #{topic}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 dark:border-white/10 dark:text-slate-200"
                  >
                    View details
                  </button>
                  {item.status !== "answered" && item.status !== "archived" && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(item.id, "answered")}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
                    >
                      Mark answered
                    </button>
                  )}
                  {item.status !== "archived" && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(item.id, "archived")}
                      className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-white/10 dark:text-slate-200"
                    >
                      Archive
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedId(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="community-detail-title"
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 dark:bg-[#151A24]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-amber-600">
                  {categories[selectedItem.category]}
                </p>
                <h2
                  id="community-detail-title"
                  className="mt-2 text-xl font-bold dark:text-white"
                >
                  {selectedItem.summary}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                Close
              </button>
            </div>
            <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-300">
              {selectedItem.sourceText || "No original text was provided."}
            </p>
            {selectedItem.scriptureRefs.length > 0 && (
              <p className="mt-4 text-sm text-amber-700 dark:text-amber-400">
                Scripture references: {selectedItem.scriptureRefs.join(", ")}
              </p>
            )}
            <p className="mt-4 text-xs text-slate-500">
              Sensitivity: {selectedItem.sensitivity} · Status: {statusLabels[selectedItem.status]}
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
