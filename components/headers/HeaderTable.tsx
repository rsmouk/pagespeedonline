import { cn } from "@/lib/cn";

interface HeaderTableProps {
  title: string;
  headers: Record<string, string>;
  highlightKeys?: Set<string>;
  diffOnly?: boolean;
  compareHeaders?: Record<string, string>;
}

export function HeaderTable({
  title,
  headers,
  highlightKeys,
  diffOnly = false,
  compareHeaders,
}: HeaderTableProps) {
  const entries = Object.entries(headers)
    .sort(([a], [b]) => a.localeCompare(b))
    .filter(([key, value]) => {
      if (!diffOnly || !compareHeaders) return true;
      const other = compareHeaders[key];
      return other === undefined || other !== value;
    });

  if (!entries.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white/80 p-3 dark:border-slate-700 dark:bg-slate-900/80">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </p>
        <p className="text-sm text-slate-400">No headers to display.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white/80 dark:border-slate-700 dark:bg-slate-900/80">
      <p className="border-b border-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800">
        {title}
      </p>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className={cn(
              "grid gap-1 px-3 py-2 sm:grid-cols-[minmax(140px,34%)_1fr]",
              highlightKeys?.has(key) &&
                "bg-amber-50/80 dark:bg-amber-950/20"
            )}
          >
            <span className="break-all text-xs font-medium text-slate-600 dark:text-slate-300">
              {key}
            </span>
            <span className="break-all text-xs text-slate-700 dark:text-slate-200">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
