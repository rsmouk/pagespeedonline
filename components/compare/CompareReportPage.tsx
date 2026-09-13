"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Download, Loader2, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScanProgress } from "@/components/ScanProgress";
import { AlignedCompareResults } from "@/components/compare/AlignedCompareResults";
import { GoogleAttribution } from "@/components/GoogleAttribution";
import { fetchPageSpeed } from "@/lib/pagespeed-client";
import { normalizeUrl } from "@/lib/formatters";
import { sanitizePageSpeedResult } from "@/lib/sanitize-pagespeed";
import {
  createLoadingScan,
  getScanState,
  needsScan,
  upsertScan,
} from "@/lib/scan-store";
import type { ScanState, Strategy } from "@/lib/types";
import { scanKey } from "@/lib/types";

export function CompareReportPage() {
  const searchParams = useSearchParams();
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");
  const [scans, setScans] = useState<ScanState[]>([]);
  const [strategy, setStrategy] = useState<Strategy>("mobile");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const inFlight = useRef(new Set<string>());

  const patchScan = useCallback((scan: ScanState) => {
    setScans((prev) => upsertScan(prev, scan));
  }, []);

  const runScan = useCallback(
    async (url: string, scanStrategy: Strategy, label: string) => {
      const key = scanKey(url, scanStrategy);
      if (inFlight.current.has(key)) return;

      inFlight.current.add(key);
      setLoading(true);

      const loading = createLoadingScan(url, scanStrategy, label);
      patchScan(loading);

      try {
        const raw = await fetchPageSpeed(url, scanStrategy);
        const data = sanitizePageSpeedResult(raw);
        patchScan({
          ...loading,
          status: "done",
          data,
          error: undefined,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        patchScan({
          ...loading,
          status: "error",
          error: message,
        });
      } finally {
        inFlight.current.delete(key);
        if (inFlight.current.size === 0) setLoading(false);
      }
    },
    [patchScan]
  );

  useEffect(() => {
    const paramA = searchParams.get("a") ?? "";
    const paramB = searchParams.get("b") ?? "";
    const a = normalizeUrl(paramA);
    const b = normalizeUrl(paramB);
    if (a) setUrlA(a);
    if (b) setUrlB(b);
  }, [searchParams]);

  useEffect(() => {
    if (!urlA || !urlB) return;

    if (needsScan(scans, urlA, strategy)) {
      runScan(urlA, strategy, `Site A · ${strategy}`);
    }
    if (needsScan(scans, urlB, strategy)) {
      runScan(urlB, strategy, `Site B · ${strategy}`);
    }
  }, [urlA, urlB, strategy, scans, runScan]);

  const handleStrategyChange = useCallback((next: Strategy) => {
    setStrategy(next);
  }, []);

  const handleExportPdf = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const { exportReportToPdf } = await import("@/lib/export-pdf");
      await exportReportToPdf("report-container");
    } catch (error) {
      setExportError(
        error instanceof Error ? error.message : "PDF export failed"
      );
    } finally {
      setExporting(false);
    }
  };

  const scanA = getScanState(scans, urlA, strategy);
  const scanB = getScanState(scans, urlB, strategy);
  const canShowReport =
    scanA?.status === "done" &&
    scanB?.status === "done" &&
    scanA.data &&
    scanB.data;
  const missingUrls = !urlA || !urlB;
  const visibleScans = scans.filter(
    (s) =>
      (s.url === urlA || s.url === urlB) &&
      (s.strategy === strategy || s.status === "loading")
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header
        actions={
          <>
            {canShowReport && (
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={exporting}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export PDF
              </button>
            )}
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </>
        }
      />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 sm:px-6">
        <div className="no-print">
          <GoogleAttribution compact />
        </div>

        {missingUrls && !loading && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900 dark:bg-amber-950/30">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Missing URLs. Please start a comparison from the home page.
            </p>
            <Link
              href="/"
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:underline dark:text-teal-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        )}

        {!missingUrls && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Comparing
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <p className="truncate text-xs text-slate-500">
                <span className="font-medium text-slate-600 dark:text-slate-400">
                  A:
                </span>{" "}
                {urlA}
              </p>
              <p className="truncate text-xs text-slate-500">
                <span className="font-medium text-slate-600 dark:text-slate-400">
                  B:
                </span>{" "}
                {urlB}
              </p>
            </div>
          </div>
        )}

        {loading && <ScanProgress scans={visibleScans} />}

        {exportError && (
          <p className="text-sm text-rose-600 dark:text-rose-400">
            {exportError}
          </p>
        )}

        {!missingUrls &&
          (canShowReport ||
            scanA?.status === "loading" ||
            scanB?.status === "loading") && (
            <div id="report-container">
              <AlignedCompareResults
                scans={scans}
                urlA={urlA}
                urlB={urlB}
                strategy={strategy}
                onStrategyChange={handleStrategyChange}
              />
            </div>
          )}

        {!loading && !canShowReport && !missingUrls && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
            {scanA?.status === "error" && <p>Site A: {scanA.error}</p>}
            {scanB?.status === "error" && <p>Site B: {scanB.error}</p>}
            {!scanA?.error && !scanB?.error && (
              <p>Unable to load comparison results. Please try again.</p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
