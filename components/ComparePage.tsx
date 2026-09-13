"use client";

import { useCallback, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { UrlCompareForm } from "@/components/UrlCompareForm";
import { CompareResults } from "@/components/CompareResults";
import { ScanProgress } from "@/components/ScanProgress";
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

export function ComparePage() {
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");
  const [resolvedA, setResolvedA] = useState("");
  const [resolvedB, setResolvedB] = useState("");
  const [scans, setScans] = useState<ScanState[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const runCompare = useCallback(async () => {
    const a = normalizeUrl(urlA);
    const b = normalizeUrl(urlB);
    if (!a || !b) return;

    setResolvedA(a);
    setResolvedB(b);
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
  }, [urlA, urlB]);

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header
        actions={
          hasResults ? (
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
          ) : undefined
        }
      />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <UrlCompareForm
          urlA={urlA}
          urlB={urlB}
          onUrlAChange={setUrlA}
          onUrlBChange={setUrlB}
          onSubmit={runCompare}
          loading={loading}
        />

        {loading && <ScanProgress scans={scans} />}

        {exportError && (
          <p className="text-sm text-rose-600 dark:text-rose-400">
            {exportError}
          </p>
        )}

        {hasResults && (
          <div id="report-container">
            <CompareResults
              scans={scans}
              urlA={resolvedA}
              urlB={resolvedB}
            />
          </div>
        )}
      </main>
    </div>
  );
}
