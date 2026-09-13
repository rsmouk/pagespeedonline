"use client";

import { Loader2, AlertCircle } from "lucide-react";
import { HeaderTable } from "@/components/headers/HeaderTable";
import type { HeaderHop, HeaderInspectResult } from "@/lib/header-types";

interface HeaderSitePanelProps {
  siteLabel: string;
  url: string;
  result?: HeaderInspectResult;
  loading?: boolean;
  compareHop?: HeaderHop;
}

function getDiffKeys(
  a: Record<string, string>,
  b: Record<string, string>
): Set<string> {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  const diff = new Set<string>();
  for (const key of keys) {
    if (a[key] !== b[key]) diff.add(key);
  }
  return diff;
}

export function HeaderSitePanel({
  siteLabel,
  url,
  result,
  loading,
  compareHop,
}: HeaderSitePanelProps) {
  if (loading) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-12 dark:border-slate-700">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600 dark:text-teal-400" />
        <p className="mt-3 text-sm text-slate-500">Fetching headers for {siteLabel}...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-400">No data yet.</p>
      </div>
    );
  }

  if (result.error && result.hops.length === 0) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/30">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p className="text-sm font-medium">{siteLabel} — failed</p>
        </div>
        <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">{result.error}</p>
      </div>
    );
  }

  const finalHop = result.hops[result.hops.length - 1];
  const responseDiff = compareHop
    ? getDiffKeys(finalHop.responseHeaders, compareHop.responseHeaders)
    : undefined;
  const requestDiff = compareHop
    ? getDiffKeys(finalHop.requestHeaders, compareHop.requestHeaders)
    : undefined;

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400">
          {siteLabel}
        </p>
        <p className="mt-1 truncate text-xs text-slate-500" title={url}>
          {url}
        </p>
      </div>

      {result.error && (
        <p className="text-xs text-amber-600 dark:text-amber-400">{result.error}</p>
      )}

      <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/40">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          General
        </p>
        <dl className="space-y-1.5 text-xs">
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <dt className="text-slate-500">Request URL</dt>
            <dd className="break-all text-slate-800 dark:text-slate-100">
              {finalHop.requestUrl}
            </dd>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <dt className="text-slate-500">Request Method</dt>
            <dd className="text-slate-800 dark:text-slate-100">
              {finalHop.requestMethod}
            </dd>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <dt className="text-slate-500">Status Code</dt>
            <dd className="text-slate-800 dark:text-slate-100">
              {finalHop.status} {finalHop.statusText}
            </dd>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <dt className="text-slate-500">Remote Address</dt>
            <dd className="text-slate-800 dark:text-slate-100">
              {finalHop.remoteAddress ?? "—"}
            </dd>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <dt className="text-slate-500">Final URL</dt>
            <dd className="break-all text-slate-800 dark:text-slate-100">
              {result.finalUrl}
            </dd>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <dt className="text-slate-500">Duration</dt>
            <dd className="text-slate-800 dark:text-slate-100">
              {finalHop.durationMs} ms
            </dd>
          </div>
          {result.hops.length > 1 && (
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="text-slate-500">Redirects</dt>
              <dd className="text-slate-800 dark:text-slate-100">
                {result.hops.length - 1} hop(s)
              </dd>
            </div>
          )}
        </dl>
      </div>

      {result.hops.length > 1 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Redirect Chain
          </p>
          {result.hops.slice(0, -1).map((hop, index) => (
            <div
              key={`${hop.requestUrl}-${index}`}
              className="rounded border border-slate-100 px-3 py-2 text-xs dark:border-slate-800"
            >
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {hop.status} {hop.statusText}
              </span>
              <span className="mx-2 text-slate-300">→</span>
              <span className="break-all text-slate-500">{hop.requestUrl}</span>
            </div>
          ))}
        </div>
      )}

      <HeaderTable
        title="Response Headers"
        headers={finalHop.responseHeaders}
        highlightKeys={responseDiff}
        compareHeaders={compareHop?.responseHeaders}
      />

      <HeaderTable
        title="Request Headers"
        headers={finalHop.requestHeaders}
        highlightKeys={requestDiff}
        compareHeaders={compareHop?.requestHeaders}
      />
    </div>
  );
}
