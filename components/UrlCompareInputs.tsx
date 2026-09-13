"use client";

import { cn } from "@/lib/cn";

interface UrlCompareInputsProps {
  urlA: string;
  urlB: string;
  onUrlAChange: (value: string) => void;
  onUrlBChange: (value: string) => void;
  idPrefix?: string;
  className?: string;
}

export function UrlCompareInputs({
  urlA,
  urlB,
  onUrlAChange,
  onUrlBChange,
  idPrefix = "url",
  className,
}: UrlCompareInputsProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border-2 border-teal-200/80 bg-gradient-to-br from-teal-50/90 via-white to-emerald-50/70 p-5 shadow-inner dark:border-teal-800/60 dark:from-teal-950/40 dark:via-slate-900 dark:to-emerald-950/20",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />

      <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-end">
        <div className="min-w-0 flex-1">
          <label
            htmlFor={`${idPrefix}-a`}
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-600 text-xs font-bold text-white dark:bg-teal-500 dark:text-teal-950">
              A
            </span>
            Site A — First URL
          </label>
          <input
            id={`${idPrefix}-a`}
            type="url"
            value={urlA}
            onChange={(e) => onUrlAChange(e.target.value)}
            placeholder="https://example.com"
            required
            className="w-full rounded-xl border-2 border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-teal-400"
          />
        </div>

        <div className="flex shrink-0 items-center justify-center md:pb-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-teal-300 bg-white text-sm font-bold tracking-tight text-teal-700 shadow-md dark:border-teal-700 dark:bg-slate-900 dark:text-teal-300">
            VS
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <label
            htmlFor={`${idPrefix}-b`}
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-600 text-xs font-bold text-white dark:bg-slate-500 dark:text-slate-900">
              B
            </span>
            Site B — Second URL
          </label>
          <input
            id={`${idPrefix}-b`}
            type="url"
            value={urlB}
            onChange={(e) => onUrlBChange(e.target.value)}
            placeholder="https://another-site.com"
            required
            className="w-full rounded-xl border-2 border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-teal-400"
          />
        </div>
      </div>
    </div>
  );
}
