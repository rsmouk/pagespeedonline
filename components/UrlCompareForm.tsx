"use client";

import type { FormEvent } from "react";
import { Loader2, Search } from "lucide-react";
import { normalizeUrl } from "@/lib/formatters";

interface UrlCompareFormProps {
  urlA: string;
  urlB: string;
  onUrlAChange: (value: string) => void;
  onUrlBChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export function UrlCompareForm({
  urlA,
  urlB,
  onUrlAChange,
  onUrlBChange,
  onSubmit,
  loading,
}: UrlCompareFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="no-print rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="url-a"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Site A — First URL
          </label>
          <input
            id="url-a"
            type="url"
            value={urlA}
            onChange={(e) => onUrlAChange(e.target.value)}
            placeholder="https://example.com"
            required
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-500/30 transition focus:border-teal-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
        <div>
          <label
            htmlFor="url-b"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Site B — Second URL
          </label>
          <input
            id="url-b"
            type="url"
            value={urlB}
            onChange={(e) => onUrlBChange(e.target.value)}
            placeholder="https://another-site.com"
            required
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none ring-teal-500/30 transition focus:border-teal-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Runs mobile + desktop scans with Performance, Accessibility, Best
          Practices, and SEO categories.
        </p>
        <button
          type="submit"
          disabled={loading || !normalizeUrl(urlA) || !normalizeUrl(urlB)}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-teal-500 dark:text-teal-950 dark:hover:bg-teal-400"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Compare Both Sites
            </>
          )}
        </button>
      </div>
    </form>
  );
}
