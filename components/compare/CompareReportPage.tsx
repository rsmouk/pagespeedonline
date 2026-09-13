"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Download, Loader2, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScanProgress } from "@/components/ScanProgress";
import { AlignedCompareResults } from "@/components/compare/AlignedCompareResults";
import { GoogleAttribution } from "@/components/GoogleAttribution";
import { fetchPageSpeed } from "@/lib/pagespeed-client";
import { exportReportToPdf } from "@/lib/export-pdf";
import { normalizeUrl } from "@/lib/formatters";
import type { ScanState, Strategy } from "@/lib/types";
import { scanKey } from "@/lib/types";

function buildScans(urlA: string, urlB: string): ScanState[] {
  const strategies: Strategy[] = ["mobile", "desktop"];
  const scans: ScanState[] = [];

  for (const strategy of strategies) {
    scans.push({
      key: scanKey(urlA, strategy),
      url: urlA,
      strategy,
      label: `Site A · ${strategy}`,
      status: "idle",
    });
    scans.push({
      key: scanKey(urlB, strategy),
      url: urlB,
      strategy,
      label: `Site B · ${strategy}`,
      status: "idle",
    });
  }

  return scans;
}

export function CompareReportPage() {
  const searchParams = useSearchParams();
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");
  const [scans, setScans] = useState<ScanState[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  const runCompare = useCallback(async (a: string, b: string) => {
    setLoading(true);
    setExportError(null);

    const initialScans = buildScans(a, b).map((s) => ({
      ...s,
      status: "loading" as const,
    }));
    setScans(initialScans);

    await Promise.all(
      initialScans.map(async (scan) => {
        try {
          const data = await fetchPageSpeed(scan.url, scan.strategy);
          setScans((prev) =>
            prev.map((s) =>
              s.key === scan.key
                ? { ...s, status: "done" as const, data, error: undefined }
                : s
            )
          );
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown error";
          setScans((prev) =>
            prev.map((s) =>
              s.key === scan.key
                ? { ...s, status: "error" as const, error: message }
                : s
            )
          );
        }
      })
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    const paramA = searchParams.get("a") ?? "";
    const paramB = searchParams.get("b") ?? "";
    const a = normalizeUrl(paramA);
    const b = normalizeUrl(paramB);

    if (a && b && !started) {
      setUrlA(a);
      setUrlB(b);
      setStarted(true);
      runCompare(a, b);
    }
  }, [searchParams, started, runCompare]);

  const handleExportPdf = async () => {
    setExporting(true);
    setExportError(null);
    try {
      await exportReportToPdf("report-container");
    } catch (error) {
      setExportError(
        error instanceof Error ? error.message : "PDF export failed"
      );
    } finally {
      setExporting(false);
    }
  };

  const hasResults = scans.some((s) => s.status === "done");
  const missingUrls = !urlA || !urlB;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header
        actions={
          <>
            {hasResults && (
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

        {loading && <ScanProgress scans={scans} />}

        {exportError && (
          <p className="text-sm text-rose-600 dark:text-rose-400">
            {exportError}
          </p>
        )}

        {hasResults && urlA && urlB && (
          <div id="report-container">
            <AlignedCompareResults scans={scans} urlA={urlA} urlB={urlB} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
