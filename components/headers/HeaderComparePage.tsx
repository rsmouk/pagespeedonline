"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { NavIconLink } from "@/components/ui/NavIconButton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeaderHoverProvider } from "@/components/headers/HeaderHoverContext";
import { HeaderSitePanel } from "@/components/headers/HeaderSitePanel";
import { DownloadJsonButton } from "@/components/ui/DownloadJsonButton";
import { jsonFilename } from "@/lib/download-json";
import { fetchUrlHeaders } from "@/lib/headers-client";
import {
  buildHeaderCompareExport,
  headerCompareToJson,
} from "@/lib/header-export";
import { normalizeUrl } from "@/lib/formatters";
import type { CompareMode } from "@/lib/compare-mode";
import {
  getHeaderBeforeSnapshot,
  saveHeaderBeforeSnapshot,
} from "@/lib/headers-before-after-storage";
import type { HeaderInspectResult } from "@/lib/header-types";

export function HeaderComparePage() {
  const searchParams = useSearchParams();
  const [compareMode, setCompareMode] = useState<CompareMode>("two-sites");
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [labelA, setLabelA] = useState("Site A");
  const [labelB, setLabelB] = useState("Site B");
  const [resultA, setResultA] = useState<HeaderInspectResult | undefined>();
  const [resultB, setResultB] = useState<HeaderInspectResult | undefined>();
  const [loading, setLoading] = useState(false);
  const [captureDone, setCaptureDone] = useState(false);
  const processedQuery = useRef("");

  const runSingle = useCallback(async (url: string) => {
    setLoading(true);
    setResultA(undefined);
    setResultB(undefined);
    try {
      const headers = await fetchUrlHeaders(url);
      setResultA(headers);
    } finally {
      setLoading(false);
    }
  }, []);

  const runCompare = useCallback(async (a: string, b: string) => {
    setLoading(true);
    setResultA(undefined);
    setResultB(undefined);

    try {
      const [headersA, headersB] = await Promise.all([
        fetchUrlHeaders(a),
        fetchUrlHeaders(b),
      ]);
      setResultA(headersA);
      setResultB(headersB);
    } finally {
      setLoading(false);
    }
  }, []);

  const runCapture = useCallback(async (url: string) => {
    setLoading(true);
    setResultA(undefined);
    setResultB(undefined);
    setCaptureDone(false);
    try {
      const headers = await fetchUrlHeaders(url);
      setResultA(headers);
      if (!headers.error || headers.hops.length > 0) {
        saveHeaderBeforeSnapshot(url, headers);
        setCaptureDone(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const runBeforeAfterCompare = useCallback(async (url: string) => {
    setLoading(true);
    setResultA(undefined);
    setResultB(undefined);
    try {
      const snap = getHeaderBeforeSnapshot();
      if (snap?.url === url) {
        setResultA(snap.result);
      }
      const after = await fetchUrlHeaders(url);
      setResultB(after);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const queryKey = searchParams.toString();
    if (!queryKey || processedQuery.current === queryKey) return;
    processedQuery.current = queryKey;

    setCaptureDone(false);
    setResultA(undefined);
    setResultB(undefined);

    const mode = (searchParams.get("mode") as CompareMode) || "two-sites";
    const action = searchParams.get("action");
    setCompareMode(mode);

    if (mode === "before-after") {
      const url = normalizeUrl(searchParams.get("url") ?? "");
      if (!url) return;

      setBaseUrl(url);
      setLabelA("Before");
      setLabelB("After");
      setUrlA(url);
      setUrlB(url);

      if (action === "capture") {
        setUrlB("");
        runCapture(url);
      } else {
        runBeforeAfterCompare(url);
      }
      return;
    }

    if (mode === "single-site") {
      const url = normalizeUrl(searchParams.get("url") ?? "");
      if (!url) return;
      setUrlA(url);
      setUrlB("");
      setBaseUrl("");
      setLabelA("Site");
      setLabelB("");
      runSingle(url);
      return;
    }

    const a = normalizeUrl(searchParams.get("a") ?? "");
    const b = normalizeUrl(searchParams.get("b") ?? "");
    if (a && b) {
      setUrlA(a);
      setUrlB(b);
      setBaseUrl("");
      setLabelA("Site A");
      setLabelB("Site B");
      runCompare(a, b);
    }
  }, [searchParams, runCompare, runSingle, runCapture, runBeforeAfterCompare]);

  const isSingleSite = compareMode === "single-site";
  const isBeforeAfter = compareMode === "before-after";
  const missingUrls = isSingleSite
    ? !urlA
    : isBeforeAfter
      ? !baseUrl
      : !urlA || !urlB;

  const canCopy = isSingleSite
    ? Boolean(resultA && !loading)
    : Boolean((resultA || resultB) && !loading && !captureDone);

  const getPayload = useCallback(() => {
    if (isSingleSite) {
      return JSON.stringify(resultA ?? {}, null, 2);
    }
    return headerCompareToJson(
      buildHeaderCompareExport({
        urlA: isBeforeAfter ? baseUrl : urlA,
        urlB: isBeforeAfter ? baseUrl : urlB,
        resultA,
        resultB,
      })
    );
  }, [isSingleSite, isBeforeAfter, baseUrl, urlA, urlB, resultA, resultB]);

  const hopA = resultA?.hops[resultA.hops.length - 1];
  const hopB = resultB?.hops[resultB.hops.length - 1];

  const displayUrlA = isBeforeAfter ? baseUrl || urlA : urlA;
  const displayUrlB = isBeforeAfter ? baseUrl || urlB : urlB;

  const title =
    isSingleSite
      ? "HTTP Header Inspect"
      : isBeforeAfter
        ? "HTTP Header Before & After"
        : "HTTP Header Compare";

  const subtitle = isSingleSite
    ? "Browser-like GET request with Chrome-style request headers for a single URL."
    : isBeforeAfter
      ? "Compare headers for the same URL before and after your changes. Differs are amber; hover to highlight matches in teal."
      : "Browser-like GET requests with Chrome-style request headers. Differs are amber; hover a row to highlight the matching field on the other site in teal.";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header
        actions={
          <>
            {canCopy && (
              <div className="hidden sm:contents">
                <DownloadJsonButton
                  getPayload={getPayload}
                  filename={jsonFilename(
                    isSingleSite ? "header-inspect" : "header-compare"
                  )}
                  label="Download JSON"
                />
              </div>
            )}
            <NavIconLink href="/headers" label="Header Tool">
              <ArrowLeft className="h-4 w-4" />
            </NavIconLink>
          </>
        }
        mobileBar={
          canCopy ? (
            <DownloadJsonButton
              getPayload={getPayload}
              filename={jsonFilename(
                isSingleSite ? "header-inspect" : "header-compare"
              )}
              label="Download JSON"
              alwaysShowLabel
              className="w-full justify-center"
            />
          ) : undefined
        }
      />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>

        {missingUrls && !loading && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900 dark:bg-amber-950/30">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Missing URLs. Start from the header compare tool.
            </p>
            <Link
              href="/headers"
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Header Compare
            </Link>
          </div>
        )}

        {captureDone && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900 dark:bg-emerald-950/30">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            <p className="mt-3 text-sm font-medium text-emerald-800 dark:text-emerald-200">
              Before snapshot saved for this URL.
            </p>
            <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
              Make your changes, then return and click Compare After.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/headers/compare?mode=before-after&action=compare&url=${encodeURIComponent(baseUrl)}`}
                className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 dark:bg-violet-500 dark:text-violet-950 dark:hover:bg-violet-400"
              >
                Compare After now
              </Link>
              <Link
                href="/headers"
                className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to form
              </Link>
            </div>
          </div>
        )}

        {!missingUrls && !captureDone && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            <div
              className={`grid min-w-0 flex-1 gap-1 ${isSingleSite ? "" : "sm:grid-cols-2"}`}
            >
              <p className="truncate text-xs text-slate-500">
                <span className="font-medium text-slate-600 dark:text-slate-400">
                  {labelA}:
                </span>{" "}
                {displayUrlA}
              </p>
              {!isSingleSite && (
                <p className="truncate text-xs text-slate-500">
                  <span className="font-medium text-slate-600 dark:text-slate-400">
                    {labelB}:
                  </span>{" "}
                  {displayUrlB}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {loading && (
                <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Inspecting headers...
                </span>
              )}
              {canCopy && (
                <DownloadJsonButton
                  getPayload={getPayload}
                  filename={jsonFilename(
                    isSingleSite ? "header-inspect" : "header-compare"
                  )}
                  label="Download JSON"
                />
              )}
            </div>
          </div>
        )}

        {!missingUrls && !captureDone && (
          <HeaderHoverProvider>
            <div
              className={`grid items-start gap-4 ${isSingleSite ? "" : "lg:grid-cols-2"}`}
            >
              <HeaderSitePanel
                siteLabel={labelA}
                url={displayUrlA}
                result={resultA}
                loading={loading && !resultA}
                compareHop={isSingleSite ? undefined : hopB}
              />
              {!isSingleSite && (
                <HeaderSitePanel
                  siteLabel={labelB}
                  url={displayUrlB}
                  result={resultB}
                  loading={loading && !resultB}
                  compareHop={hopA}
                />
              )}
            </div>
          </HeaderHoverProvider>
        )}
      </main>

      <Footer />
    </div>
  );
}
