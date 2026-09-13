"use client";

import type { FormEvent } from "react";
import { Loader2, Search } from "lucide-react";
import { UrlCompareInputs } from "@/components/UrlCompareInputs";
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
      <UrlCompareInputs
        idPrefix="form"
        urlA={urlA}
        urlB={urlB}
        onUrlAChange={onUrlAChange}
        onUrlBChange={onUrlBChange}
      />

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
