"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Clock, GitCompare, Globe, Search, Upload } from "lucide-react";
import { UrlCompareInputs } from "@/components/UrlCompareInputs";
import { JsonFileUpload } from "@/components/ui/JsonFileUpload";
import {
  clearBeforeSnapshot,
  getBeforeSnapshot,
  hasBeforeForUrl,
} from "@/lib/before-after-storage";
import type { CompareMode, InputMode } from "@/lib/compare-mode";
import {
  SESSION_IMPORT_A,
  SESSION_IMPORT_B,
  SESSION_IMPORT_MODE,
} from "@/lib/compare-mode";
import { normalizeUrl } from "@/lib/formatters";
import {
  parseComparisonPairJson,
  parseReportJson,
  readJsonFile,
} from "@/lib/report-import";
import { cn } from "@/lib/cn";

const MODE_TABS: { id: CompareMode; label: string; icon: typeof GitCompare }[] = [
  { id: "two-sites", label: "Two Sites", icon: GitCompare },
  { id: "single-site", label: "Single Site", icon: Globe },
  { id: "before-after", label: "Before & After", icon: Clock },
];

export function LighthouseCompareForm() {
  const router = useRouter();
  const [compareMode, setCompareMode] = useState<CompareMode>("two-sites");
  const [inputMode, setInputMode] = useState<InputMode>("url");
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");
  const [singleUrl, setSingleUrl] = useState("");
  const [jsonFileA, setJsonFileA] = useState<File | null>(null);
  const [jsonFileB, setJsonFileB] = useState<File | null>(null);
  const [jsonBefore, setJsonBefore] = useState<File | null>(null);
  const [jsonAfter, setJsonAfter] = useState<File | null>(null);
  const [jsonSingle, setJsonSingle] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [beforeSavedAt, setBeforeSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const snap = getBeforeSnapshot();
    setBeforeSavedAt(snap?.savedAt ?? null);
    if (snap?.url && !singleUrl) setSingleUrl(snap.url);
  }, [singleUrl]);

  const toggleInputMode = () => {
    setInputMode((m) => (m === "url" ? "json" : "url"));
    setError(null);
  };

  const goImport = (mode: CompareMode, payloadA: unknown, payloadB: unknown) => {
    sessionStorage.setItem(SESSION_IMPORT_A, JSON.stringify(payloadA));
    sessionStorage.setItem(SESSION_IMPORT_B, JSON.stringify(payloadB));
    sessionStorage.setItem(SESSION_IMPORT_MODE, mode);
    router.push(`/compare?source=import&mode=${mode}`);
  };

  const handleTwoSitesSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (inputMode === "url") {
      const a = normalizeUrl(urlA);
      const b = normalizeUrl(urlB);
      if (!a || !b) return;
      router.push(
        `/compare?mode=two-sites&a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`
      );
      return;
    }

    if (!jsonFileA || !jsonFileB) {
      setError("Upload JSON for both Site A and Site B.");
      return;
    }

    Promise.all([readJsonFile(jsonFileA), readJsonFile(jsonFileB)])
      .then(([rawA, rawB]) => {
        const { a, b } = parseComparisonPairJson(rawA, rawB);
        goImport("two-sites", a, b);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Import failed.")
      );
  };

  const handleBeforeCapture = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const url = normalizeUrl(singleUrl);
    if (!url) return;
    router.push(
      `/compare?mode=before-after&action=capture&url=${encodeURIComponent(url)}`
    );
  };

  const handleBeforeCompare = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const url = normalizeUrl(singleUrl);
    if (!url) return;
    if (!hasBeforeForUrl(url)) {
      setError("Capture a Before snapshot for this URL first.");
      return;
    }
    router.push(
      `/compare?mode=before-after&action=compare&url=${encodeURIComponent(url)}`
    );
  };

  const handleSingleSiteSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const url = normalizeUrl(singleUrl);
    if (!url) return;
    router.push(
      `/compare?mode=single-site&url=${encodeURIComponent(url)}`
    );
  };

  const handleSingleSiteJson = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!jsonSingle) {
      setError("Upload a Lighthouse JSON report.");
      return;
    }
    readJsonFile(jsonSingle)
      .then((raw) => {
        const report = parseReportJson(raw);
        sessionStorage.setItem(SESSION_IMPORT_A, JSON.stringify(report));
        sessionStorage.setItem(SESSION_IMPORT_MODE, "single-site");
        router.push("/compare?source=import&mode=single-site");
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Import failed.")
      );
  };

  const handleBeforeAfterJson = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!jsonBefore || !jsonAfter) {
      setError("Upload both Before and After JSON reports.");
      return;
    }
    Promise.all([readJsonFile(jsonBefore), readJsonFile(jsonAfter)])
      .then(([rawBefore, rawAfter]) => {
        const before = parseReportJson(rawBefore);
        const after = parseReportJson(rawAfter);
        goImport("before-after", before, after);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Import failed.")
      );
  };

  const urlReady = Boolean(normalizeUrl(singleUrl));
  const hasBefore =
    urlReady && hasBeforeForUrl(normalizeUrl(singleUrl)!);

  return (
    <form
      onSubmit={
        compareMode === "two-sites"
          ? handleTwoSitesSubmit
          : compareMode === "single-site"
            ? inputMode === "json"
              ? handleSingleSiteJson
              : handleSingleSiteSubmit
            : inputMode === "json"
              ? handleBeforeAfterJson
              : handleBeforeCompare
      }
      className="mx-auto mt-10 max-w-4xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        {MODE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setCompareMode(tab.id);
              setError(null);
            }}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition",
              compareMode === tab.id
                ? "bg-white text-teal-700 shadow-sm dark:bg-slate-900 dark:text-teal-300"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
            )}
          >
            <tab.icon className="h-4 w-4 shrink-0" />
            {tab.label}
          </button>
        ))}
      </div>

      {compareMode === "two-sites" && inputMode === "url" && (
        <UrlCompareInputs
          idPrefix="lighthouse"
          urlA={urlA}
          urlB={urlB}
          onUrlAChange={setUrlA}
          onUrlBChange={setUrlB}
        />
      )}

      {compareMode === "two-sites" && inputMode === "json" && (
        <div className="grid gap-4 md:grid-cols-2">
          <JsonFileUpload
            id="json-site-a"
            label="Site A — JSON report"
            file={jsonFileA}
            onFileChange={setJsonFileA}
            accent="teal"
          />
          <JsonFileUpload
            id="json-site-b"
            label="Site B — JSON report"
            file={jsonFileB}
            onFileChange={setJsonFileB}
            accent="slate"
          />
        </div>
      )}

      {compareMode === "single-site" && inputMode === "url" && (
        <div className="rounded-2xl border-2 border-teal-200/80 bg-gradient-to-br from-teal-50/90 via-white to-emerald-50/60 p-5 dark:border-teal-900/50 dark:from-teal-950/30 dark:via-slate-900 dark:to-emerald-950/20">
          <label
            htmlFor="single-site-url"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-600 text-xs font-bold text-white">
              URL
            </span>
            Website URL
          </label>
          <input
            id="single-site-url"
            type="url"
            value={singleUrl}
            onChange={(e) => setSingleUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="w-full rounded-xl border-2 border-slate-200/80 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 dark:border-slate-600 dark:bg-slate-800 dark:focus:border-teal-400"
          />
        </div>
      )}

      {compareMode === "single-site" && inputMode === "json" && (
        <JsonFileUpload
          id="json-single-site"
          label="Lighthouse JSON report"
          file={jsonSingle}
          onFileChange={setJsonSingle}
          accent="teal"
        />
      )}

      {compareMode === "before-after" && inputMode === "url" && (
        <div className="space-y-4">
          <div className="rounded-2xl border-2 border-amber-200/80 bg-gradient-to-br from-amber-50/90 via-white to-orange-50/60 p-5 dark:border-amber-900/50 dark:from-amber-950/30 dark:via-slate-900 dark:to-orange-950/20">
            <label
              htmlFor="before-after-url"
              className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500 text-xs font-bold text-white">
                URL
              </span>
              Website URL (same site, before & after changes)
            </label>
            <input
              id="before-after-url"
              type="url"
              value={singleUrl}
              onChange={(e) => setSingleUrl(e.target.value)}
              placeholder="https://yoursite.com"
              required
              className="w-full rounded-xl border-2 border-slate-200/80 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 dark:border-slate-600 dark:bg-slate-800 dark:focus:border-amber-400"
            />
          </div>

          {hasBefore && beforeSavedAt && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
              <span>
                Before snapshot saved{" "}
                {new Date(beforeSavedAt).toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => {
                  clearBeforeSnapshot();
                  setBeforeSavedAt(null);
                }}
                className="font-medium underline hover:no-underline"
              >
                Clear snapshot
              </button>
            </div>
          )}
        </div>
      )}

      {compareMode === "before-after" && inputMode === "json" && (
        <div className="grid gap-4 md:grid-cols-2">
          <JsonFileUpload
            id="json-before"
            label="Before — JSON report"
            file={jsonBefore}
            onFileChange={setJsonBefore}
            accent="amber"
          />
          <JsonFileUpload
            id="json-after"
            label="After — JSON report"
            file={jsonAfter}
            onFileChange={setJsonAfter}
            accent="teal"
          />
        </div>
      )}

      <button
        type="button"
        onClick={toggleInputMode}
        className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-teal-600 hover:underline dark:text-teal-400"
      >
        <Upload className="h-4 w-4" />
        {inputMode === "url"
          ? "Upload JSON reports instead"
          : "Enter URLs instead"}
      </button>

      {compareMode === "two-sites" && (
        <button
          type="submit"
          disabled={
            inputMode === "url"
              ? !normalizeUrl(urlA) || !normalizeUrl(urlB)
              : !jsonFileA || !jsonFileB
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50 dark:bg-teal-500 dark:text-teal-950 dark:hover:bg-teal-400"
        >
          <Search className="h-4 w-4" />
          Compare Lighthouse
        </button>
      )}

      {compareMode === "single-site" && (
        <button
          type="submit"
          disabled={
            inputMode === "url" ? !normalizeUrl(singleUrl) : !jsonSingle
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50 dark:bg-teal-500 dark:text-teal-950 dark:hover:bg-teal-400"
        >
          <Search className="h-4 w-4" />
          Analyze Site
        </button>
      )}

      {compareMode === "before-after" && inputMode === "url" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleBeforeCapture}
            disabled={!urlReady}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-amber-400 bg-amber-50 py-3.5 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 disabled:opacity-50 dark:border-amber-600 dark:bg-amber-950/40 dark:text-amber-200 dark:hover:bg-amber-950/60"
          >
            <Clock className="h-4 w-4" />
            Capture Before
          </button>
          <button
            type="submit"
            disabled={!hasBefore}
            className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50 dark:bg-teal-500 dark:text-teal-950 dark:hover:bg-teal-400"
          >
            <Search className="h-4 w-4" />
            Compare After
          </button>
        </div>
      )}

      {compareMode === "before-after" && inputMode === "json" && (
        <button
          type="submit"
          disabled={!jsonBefore || !jsonAfter}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50 dark:bg-teal-500 dark:text-teal-950 dark:hover:bg-teal-400"
        >
          <Search className="h-4 w-4" />
          Compare Before & After
        </button>
      )}

      {error && (
        <p className="text-center text-sm text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}
    </form>
  );
}
