"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  GitCompare,
  Globe,
  Network,
  Search,
  Shield,
  Zap,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UrlCompareInputs } from "@/components/UrlCompareInputs";
import type { CompareMode } from "@/lib/compare-mode";
import { normalizeUrl } from "@/lib/formatters";
import {
  clearHeaderBeforeSnapshot,
  getHeaderBeforeSnapshot,
  hasHeaderBeforeForUrl,
} from "@/lib/headers-before-after-storage";
import { cn } from "@/lib/cn";

const FEATURES = [
  {
    icon: Network,
    title: "Request & Response Headers",
    description: "Full header tables like Chrome DevTools Network tab.",
  },
  {
    icon: Shield,
    title: "Browser-Like Requests",
    description: "Chrome User-Agent, Accept-Language, Sec-Fetch-* and more.",
  },
  {
    icon: Zap,
    title: "Side-by-Side Diff",
    description: "Hover to highlight matching headers across both sites.",
  },
];

const MODE_TABS: { id: CompareMode; label: string; icon: typeof GitCompare }[] =
  [
    { id: "two-sites", label: "Two Sites", icon: GitCompare },
    { id: "single-site", label: "Single Site", icon: Globe },
    { id: "before-after", label: "Before & After", icon: Clock },
  ];

export function HeaderLandingPage() {
  const router = useRouter();
  const [compareMode, setCompareMode] = useState<CompareMode>("two-sites");
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");
  const [singleUrl, setSingleUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [beforeSavedAt, setBeforeSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const snap = getHeaderBeforeSnapshot();
    setBeforeSavedAt(snap?.savedAt ?? null);
    if (snap?.url) setSingleUrl(snap.url);
    // Prefill once from saved Before snapshot; do not re-apply after the user clears the field.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTwoSitesSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const a = normalizeUrl(urlA);
    const b = normalizeUrl(urlB);
    if (!a || !b) return;
    router.push(
      `/headers/compare?mode=two-sites&a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`
    );
  };

  const handleSingleSiteSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const url = normalizeUrl(singleUrl);
    if (!url) return;
    router.push(
      `/headers/compare?mode=single-site&url=${encodeURIComponent(url)}`
    );
  };

  const handleBeforeCapture = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const url = normalizeUrl(singleUrl);
    if (!url) return;
    router.push(
      `/headers/compare?mode=before-after&action=capture&url=${encodeURIComponent(url)}`
    );
  };

  const handleBeforeCompare = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const url = normalizeUrl(singleUrl);
    if (!url) return;
    if (!hasHeaderBeforeForUrl(url)) {
      setError("Capture a Before snapshot for this URL first.");
      return;
    }
    router.push(
      `/headers/compare?mode=before-after&action=compare&url=${encodeURIComponent(url)}`
    );
  };

  const urlReady = Boolean(normalizeUrl(singleUrl));
  const hasBefore =
    urlReady && hasHeaderBeforeForUrl(normalizeUrl(singleUrl)!);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -start-24 -top-24 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl" />
            <div className="absolute -bottom-24 -end-24 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300">
                <Network className="h-4 w-4" />
                Independent HTTP Header Tool
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
                Compare HTTP{" "}
                <span className="text-violet-600 dark:text-violet-400">
                  Headers
                </span>
              </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                Inspect request and response headers for one or two URLs —
                redirects, status codes, and DevTools-style tables.
              </p>
            </div>

            <form
              onSubmit={
                compareMode === "two-sites"
                  ? handleTwoSitesSubmit
                  : compareMode === "single-site"
                    ? handleSingleSiteSubmit
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
                      "flex flex-1 flex-col items-center justify-center gap-1 rounded-lg px-2 py-2.5 text-[10px] font-medium leading-tight transition sm:flex-row sm:gap-2 sm:px-3 sm:py-2.5 sm:text-sm sm:leading-normal",
                      compareMode === tab.id
                        ? "bg-white text-violet-700 shadow-sm dark:bg-slate-900 dark:text-violet-300"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
                    )}
                  >
                    <tab.icon className="h-4 w-4 shrink-0" />
                    <span className="text-center">{tab.label}</span>
                  </button>
                ))}
              </div>

              {compareMode === "two-sites" && (
                <UrlCompareInputs
                  idPrefix="headers"
                  urlA={urlA}
                  urlB={urlB}
                  onUrlAChange={setUrlA}
                  onUrlBChange={setUrlB}
                />
              )}

              {compareMode === "single-site" && (
                <div className="rounded-2xl border-2 border-violet-200/80 bg-gradient-to-br from-violet-50/90 via-white to-sky-50/60 p-5 dark:border-violet-900/50 dark:from-violet-950/30 dark:via-slate-900 dark:to-sky-950/20">
                  <label
                    htmlFor="headers-single-url"
                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-600 text-xs font-bold text-white">
                      URL
                    </span>
                    Website URL
                  </label>
                  <input
                    id="headers-single-url"
                    type="url"
                    value={singleUrl}
                    onChange={(e) => setSingleUrl(e.target.value)}
                    placeholder="https://example.com"
                    required
                    className="w-full rounded-xl border-2 border-slate-200/80 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15 dark:border-slate-600 dark:bg-slate-800 dark:focus:border-violet-400"
                  />
                </div>
              )}

              {compareMode === "before-after" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border-2 border-amber-200/80 bg-gradient-to-br from-amber-50/90 via-white to-orange-50/60 p-5 dark:border-amber-900/50 dark:from-amber-950/30 dark:via-slate-900 dark:to-orange-950/20">
                    <label
                      htmlFor="headers-before-after-url"
                      className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500 text-xs font-bold text-white">
                        URL
                      </span>
                      Website URL (same site, before & after changes)
                    </label>
                    <input
                      id="headers-before-after-url"
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
                          clearHeaderBeforeSnapshot();
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

              {compareMode === "two-sites" && (
                <button
                  type="submit"
                  disabled={!normalizeUrl(urlA) || !normalizeUrl(urlB)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50 dark:bg-violet-500 dark:text-violet-950 dark:hover:bg-violet-400"
                >
                  <Search className="h-4 w-4" />
                  Compare Headers
                </button>
              )}

              {compareMode === "single-site" && (
                <button
                  type="submit"
                  disabled={!normalizeUrl(singleUrl)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50 dark:bg-violet-500 dark:text-violet-950 dark:hover:bg-violet-400"
                >
                  <Search className="h-4 w-4" />
                  Inspect Headers
                </button>
              )}

              {compareMode === "before-after" && (
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
                    className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50 dark:bg-violet-500 dark:text-violet-950 dark:hover:bg-violet-400"
                  >
                    <Search className="h-4 w-4" />
                    Compare After
                  </button>
                </div>
              )}

              {error && (
                <p className="text-center text-sm text-rose-600 dark:text-rose-400">
                  {error}
                </p>
              )}

              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                Server-side GET with browser-like headers — User-Agent,
                Accept-Language, Cache-Control, Sec-Fetch-*.
              </p>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
