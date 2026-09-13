"use client";

import { cn } from "@/lib/cn";
import { useHeaderHover, type HeaderHoverTarget } from "@/components/headers/HeaderHoverContext";

interface HeaderTableProps {
  title: string;
  sectionType: "response" | "request";
  headers: Record<string, string>;
  highlightKeys?: Set<string>;
  diffOnly?: boolean;
  compareHeaders?: Record<string, string>;
}

export function HeaderTable({
  title,
  sectionType,
  headers,
  highlightKeys,
  diffOnly = false,
  compareHeaders,
}: HeaderTableProps) {
  const { setHovered, isActive } = useHeaderHover();

  const entries = Object.entries(headers)
    .sort(([a], [b]) => a.localeCompare(b))
    .filter(([key, value]) => {
      if (!diffOnly || !compareHeaders) return true;
      const other = compareHeaders[key];
      return other === undefined || other !== value;
    });

  const hoverTarget = (key: string): HeaderHoverTarget => ({
    type: sectionType,
    key,
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
        {entries.map(([key, value]) => {
          const target = hoverTarget(key);
          const paired = isActive(target);

          return (
            <div
              key={key}
              className={cn(
                "grid gap-1 px-3 py-2 transition-colors sm:grid-cols-[minmax(140px,34%)_1fr]",
                highlightKeys?.has(key) &&
                  !paired &&
                  "bg-amber-50/80 dark:bg-amber-950/20",
                paired &&
                  "bg-teal-100/90 ring-1 ring-inset ring-teal-300/80 dark:bg-teal-950/50 dark:ring-teal-700/80"
              )}
              onMouseEnter={() => setHovered(target)}
              onMouseLeave={() => setHovered(null)}
            >
              <span
                className={cn(
                  "break-all text-xs font-medium text-slate-600 dark:text-slate-300",
                  paired && "text-teal-800 dark:text-teal-200"
                )}
              >
                {key}
              </span>
              <span className="break-all text-xs text-slate-700 dark:text-slate-200">
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
