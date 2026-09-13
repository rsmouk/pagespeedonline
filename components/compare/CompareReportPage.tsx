"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Download, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScanProgress } from "@/components/ScanProgress";
import { AlignedCompareResults } from "@/components/compare/AlignedCompareResults";
import { ScanErrorPanel } from "@/components/compare/ScanErrorPanel";
import { CopyUrlButton } from "@/components/ui/CopyUrlButton";
import { DownloadJsonButton } from "@/components/ui/DownloadJsonButton";
import {
  buildFullComparisonExport,
  fullComparisonToJson,
} from "@/lib/extract-section-data";
import { fetchPageSpeed } from "@/lib/pagespeed-client";
import { normalizeUrl } from "@/lib/formatters";
import { sanitizePageSpeedResult } from "@/lib/sanitize-pagespeed";
import { parsePageSpeedError, sleep } from "@/lib/pagespeed-errors";
import {
  clearScan,
  createLoadingScan,
  getScanState,
  needsScan,
  upsertScan,
} from "@/lib/scan-store";
import {
  saveBeforeSnapshot,
  getBeforeSnapshot,
} from "@/lib/before-after-storage";
import type { CompareMode } from "@/lib/compare-mode";
import {
  SESSION_IMPORT_A,
  SESSION_IMPORT_B,
  SESSION_IMPORT_MODE,
} from "@/lib/compare-mode";
import type { ImportedReport } from "@/lib/report-import";
import { importedReportToScans, mergeImportedScans } from "@/lib/import-to-scans";
import { phaseScanUrl } from "@/lib/scan-keys";
import { jsonFilename } from "@/lib/download-json";
import type { PageSpeedResult, ScanState, Strategy } from "@/lib/types";
import { scanKey } from "@/lib/types";

const STRATEGIES: Strategy[] = ["mobile", "desktop"];
const MAX_SCAN_ATTEMPTS = 3;

export function CompareReportPage() {
  const searchParams = useSearchParams();
  const [compareMode, setCompareMode] = useState<CompareMode>("two-sites");
  const [baseUrl, setBaseUrl] = useState("");
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");
  const [labelA, setLabelA] = useState("Site A");
  const [labelB, setLabelB] = useState("Site B");
  const [scans, setScans] = useState<ScanState[]>([]);
  const [strategy, setStrategy] = useState<Strategy>("mobile");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [captureDone, setCaptureDone] = useState(false);
  const [importReady, setImportReady] = useState(false);
  const inFlight = useRef(new Set<string>());
  const processedQuery = useRef("");

  const patchScan = useCallback((scan: ScanState) => {
    setScans((prev) => upsertScan(prev, scan));
  }, []);

  const runScan = useCallback(
    async (
      displayUrl: string,
      scanUrl: string,
      scanStrategy: Strategy,
      label: string,
      options?: { force?: boolean; maxAttempts?: number }
    ) => {
      const key = scanKey(scanUrl, scanStrategy);
      if (inFlight.current.has(key) && !options?.force) return;

      inFlight.current.add(key);
      setLoading(true);

      const loading = createLoadingScan(scanUrl, scanStrategy, label);
      patchScan(loading);

      const maxAttempts = options?.maxAttempts ?? MAX_SCAN_ATTEMPTS;
      let lastError = parsePageSpeedError(new Error("Unknown error"));

      try {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          try {
            if (attempt > 1) {
              patchScan({ ...loading, status: "loading" });
              await sleep(2000 * attempt);
            }

            const raw = await fetchPageSpeed(displayUrl, scanStrategy);
            const data = sanitizePageSpeedResult(raw);
            patchScan({
              ...loading,
              status: "done",
              data,
              error: undefined,
              errorKind: undefined,
            });
            return data;
          } catch (error) {
            lastError = parsePageSpeedError(error);
            if (
              !lastError.retryable ||
              attempt === maxAttempts ||
              lastError.kind === "quota"
            ) {
              break;
            }
          }
        }

        patchScan({
          ...loading,
          status: "error",
          error: lastError.userMessage,
          errorKind: lastError.kind,
        });
        return undefined;
      } finally {
        inFlight.current.delete(key);
        if (inFlight.current.size === 0) setLoading(false);
      }
    },
    [patchScan]
  );

  const retryScan = useCallback(
    (side: "a" | "b") => {
      const scanUrl = side === "a" ? urlA : urlB;
      if (!scanUrl) return;

      const fetchUrl =
        compareMode === "before-after" ? baseUrl : scanUrl;
      const siteLabel = side === "a" ? labelA : labelB;

      inFlight.current.delete(scanKey(scanUrl, strategy));
      setScans((prev) => clearScan(prev, scanUrl, strategy));
      runScan(
        fetchUrl,
        scanUrl,
        strategy,
        `${siteLabel} · ${strategy}`,
        { force: true }
      );
    },
    [
      urlA,
      urlB,
      baseUrl,
      compareMode,
      labelA,
      labelB,
      strategy,
      runScan,
    ]
  );

  const loadFromImport = useCallback(() => {
    try {
      const rawA = sessionStorage.getItem(SESSION_IMPORT_A);
      const rawB = sessionStorage.getItem(SESSION_IMPORT_B);
      const mode =
        (sessionStorage.getItem(SESSION_IMPORT_MODE) as CompareMode) ??
        "two-sites";
      if (!rawA || !rawB) return;

      const reportA = JSON.parse(rawA) as ImportedReport;
      const reportB = JSON.parse(rawB) as ImportedReport;

      let scansA = importedReportToScans(
        reportA,
        mode === "before-after" ? "Before" : "Site A"
      );
      let scansB = importedReportToScans(
        reportB,
        mode === "before-after" ? "After" : "Site B"
      );

      if (mode === "before-after") {
        const beforeUrl = phaseScanUrl(reportA.url, "before");
        const afterUrl = phaseScanUrl(reportB.url, "after");
        scansA = scansA.map((s) => ({
          ...s,
          url: beforeUrl,
          key: scanKey(beforeUrl, s.strategy),
        }));
        scansB = scansB.map((s) => ({
          ...s,
          url: afterUrl,
          key: scanKey(afterUrl, s.strategy),
        }));
        setBaseUrl(reportA.url);
        setUrlA(beforeUrl);
        setUrlB(afterUrl);
      } else {
        setUrlA(scansA[0]?.url ?? reportA.url);
        setUrlB(scansB[0]?.url ?? reportB.url);
      }

      setCompareMode(mode);
      setScans(mergeImportedScans(scansA, scansB));
      setLabelA(mode === "before-after" ? "Before" : "Site A");
      setLabelB(mode === "before-after" ? "After" : "Site B");
      setImportReady(true);

      sessionStorage.removeItem(SESSION_IMPORT_A);
      sessionStorage.removeItem(SESSION_IMPORT_B);
      sessionStorage.removeItem(SESSION_IMPORT_MODE);
    } catch {
      setExportError("Failed to load imported JSON reports.");
    }
  }, []);

  const loadBeforeFromStorage = useCallback(
    (url: string) => {
      const snap = getBeforeSnapshot();
      if (!snap || snap.url !== url) return false;

      const beforeUrl = phaseScanUrl(url, "before");
      const loaded: ScanState[] = [];

      for (const s of STRATEGIES) {
        const data = snap.reports[s];
        if (!data) continue;
        loaded.push({
          key: scanKey(beforeUrl, s),
          url: beforeUrl,
          strategy: s,
          label: `Before · ${s}`,
          status: "done",
          data,
        });
      }

      if (!loaded.length) return false;
      setScans((prev) => {
        let next = prev;
        for (const scan of loaded) next = upsertScan(next, scan);
        return next;
      });
      return true;
    },
    []
  );

  useEffect(() => {
    const queryKey = searchParams.toString();
    if (processedQuery.current === queryKey) return;
    processedQuery.current = queryKey;

    setCaptureDone(false);
    setImportReady(false);
    setExportError(null);
    setScans([]);
    inFlight.current.clear();

    const source = searchParams.get("source");
    if (source === "import") {
      loadFromImport();
      return;
    }

    const mode = (searchParams.get("mode") as CompareMode) ?? "two-sites";
    setCompareMode(mode);

    if (mode === "before-after") {
      const url = normalizeUrl(searchParams.get("url") ?? "");
      const action = searchParams.get("action");
      if (!url) return;

      setBaseUrl(url);
      setLabelA("Before");
      setLabelB("After");
      const beforeScanUrl = phaseScanUrl(url, "before");
      const afterScanUrl = phaseScanUrl(url, "after");

      if (action === "capture") {
        setUrlA(beforeScanUrl);
        setUrlB("");
        (async () => {
          const reports: Partial<Record<Strategy, PageSpeedResult>> = {};
          for (const s of STRATEGIES) {
            const data = await runScan(url, beforeScanUrl, s, `Before · ${s}`);
            if (data) reports[s] = data;
          }
          if (reports.mobile || reports.desktop) {
            saveBeforeSnapshot(url, reports);
            setCaptureDone(true);
          }
        })();
      } else if (action === "compare") {
        setUrlA(beforeScanUrl);
        setUrlB(afterScanUrl);
        loadBeforeFromStorage(url);
      }
      return;
    }

    const a = normalizeUrl(searchParams.get("a") ?? "");
    const b = normalizeUrl(searchParams.get("b") ?? "");
    if (a && b) {
      setUrlA(a);
      setUrlB(b);
      setLabelA("Site A");
      setLabelB("Site B");
    }
  }, [searchParams, loadFromImport, loadBeforeFromStorage, runScan]);

  useEffect(() => {
    if (importReady || captureDone) return;
    if (!urlA || !urlB) return;
    if (compareMode === "before-after" && !baseUrl) return;

    const fetchUrlA = compareMode === "before-after" ? baseUrl : urlA;
    const fetchUrlB = compareMode === "before-after" ? baseUrl : urlB;

    if (needsScan(scans, urlA, strategy)) {
      runScan(fetchUrlA, urlA, strategy, `${labelA} · ${strategy}`);
    }
    if (needsScan(scans, urlB, strategy)) {
      runScan(fetchUrlB, urlB, strategy, `${labelB} · ${strategy}`);
    }
  }, [
    urlA,
    urlB,
    baseUrl,
    strategy,
    scans,
    runScan,
    compareMode,
    labelA,
    labelB,
    importReady,
    captureDone,
  ]);

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
  const missingData = !urlA || !urlB;
  const visibleScans = scans.filter(
    (s) =>
      (s.url === urlA || s.url === urlB) &&
      (s.strategy === strategy || s.status === "loading")
  );

  const displayUrlA =
    compareMode === "before-after" ? baseUrl || urlA.split("#")[0] : urlA;
  const displayUrlB =
    compareMode === "before-after" ? baseUrl || urlB.split("#")[0] : urlB;

  const getComparisonJson = useCallback(() => {
    if (!scanA?.data || !scanB?.data) return "{}";
    return fullComparisonToJson(
      buildFullComparisonExport({
        urlA: displayUrlA,
        urlB: displayUrlB,
        strategy,
        dataA: scanA.data,
        dataB: scanB.data,
      })
    );
  }, [displayUrlA, displayUrlB, strategy, scanA?.data, scanB?.data]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header
        actions={
          <>
            {!missingData && !captureDone && (
              <CopyUrlButton label="Copy link" />
            )}
            {canShowReport && (
              <>
                <DownloadJsonButton
                  getPayload={getComparisonJson}
                  filename={jsonFilename("lighthouse-compare")}
                  label="Download JSON"
                />
                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={exporting}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {exporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">Export PDF</span>
                </button>
              </>
            )}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </>
        }
      />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 sm:px-6">
        {captureDone && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/30">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="font-medium text-emerald-800 dark:text-emerald-200">
                  Before snapshot saved in your browser
                </p>
                <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                  Make your site changes, then run{" "}
                  <strong>Compare After</strong> for {baseUrl}
                </p>
                <Link
                  href={`/compare?mode=before-after&action=compare&url=${encodeURIComponent(baseUrl)}`}
                  className="mt-3 inline-flex rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 dark:bg-teal-500 dark:text-teal-950"
                >
                  Compare After Now
                </Link>
              </div>
            </div>
          </div>
        )}

        {missingData && !loading && !importReady && !captureDone && (
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

        {!missingData && !captureDone && !canShowReport && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {compareMode === "before-after" ? "Before & After" : "Comparing"}
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <p className="truncate text-xs text-slate-500">
                <span className="font-medium text-slate-600 dark:text-slate-400">
                  {labelA}:
                </span>{" "}
                {displayUrlA}
              </p>
              <p className="truncate text-xs text-slate-500">
                <span className="font-medium text-slate-600 dark:text-slate-400">
                  {labelB}:
                </span>{" "}
                {displayUrlB}
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

        {!captureDone &&
          !missingData &&
          (canShowReport ||
            scanA?.status === "loading" ||
            scanB?.status === "loading") && (
            <div id="report-container">
              <AlignedCompareResults
                scans={scans}
                urlA={urlA}
                urlB={urlB}
                labelA={labelA}
                labelB={labelB}
                displayUrlA={displayUrlA}
                displayUrlB={displayUrlB}
                strategy={strategy}
                onStrategyChange={handleStrategyChange}
              />
            </div>
          )}

        {!loading && !canShowReport && !missingData && !captureDone && (
          <div className="space-y-3">
            {scanA?.status === "error" && (
              <ScanErrorPanel
                label={labelA}
                url={displayUrlA}
                message={scanA.error}
                errorKind={scanA.errorKind}
                onRetry={() => retryScan("a")}
              />
            )}
            {scanB?.status === "error" && (
              <ScanErrorPanel
                label={labelB}
                url={displayUrlB}
                message={scanB.error}
                errorKind={scanB.errorKind}
                onRetry={() => retryScan("b")}
              />
            )}
            {!scanA?.error && !scanB?.error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
                Unable to load comparison results. Please try again.
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
