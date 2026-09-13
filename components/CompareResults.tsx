"use client";

import { useMemo, useState } from "react";
import { SiteReport } from "@/components/SiteReport";
import { StrategyTabs } from "@/components/StrategyTabs";
import { Badge } from "@/components/ui/Badge";
import type { ScanState, Strategy } from "@/lib/types";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface CompareResultsProps {
  scans: ScanState[];
  urlA: string;
  urlB: string;
}

function getScan(
  scans: ScanState[],
  url: string,
  strategy: Strategy
): ScanState | undefined {
  return scans.find((s) => s.url === url && s.strategy === strategy);
}

export function CompareResults({ scans, urlA, urlB }: CompareResultsProps) {
  const [strategyA, setStrategyA] = useState<Strategy>("mobile");
  const [strategyB, setStrategyB] = useState<Strategy>("mobile");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const scanA = useMemo(
    () => getScan(scans, urlA, strategyA),
    [scans, urlA, strategyA]
  );
  const scanB = useMemo(
    () => getScan(scans, urlB, strategyB),
    [scans, urlB, strategyB]
  );

  const handleSectionToggle = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const renderScanStatus = (scan?: ScanState) => {
    if (!scan) return null;
    if (scan.status === "loading") {
      return (
        <Badge variant="warning" className="gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Loading
        </Badge>
      );
    }
    if (scan.status === "error") {
      return (
        <Badge variant="danger" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Error
        </Badge>
      );
    }
    if (scan.status === "done") {
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Complete
        </Badge>
      );
    }
    return null;
  };

  const renderColumn = (
    scan: ScanState | undefined,
    siteLabel: string,
    strategy: Strategy,
    onStrategyChange: (s: Strategy) => void,
    compareData?: ScanState
  ) => (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            {siteLabel}
          </h2>
          {renderScanStatus(scan)}
        </div>
        <StrategyTabs value={strategy} onChange={onStrategyChange} />
      </div>

      {scan?.status === "loading" && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-16 dark:border-slate-700">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600 dark:text-teal-400" />
          <p className="mt-3 text-sm text-slate-500">
            Running Lighthouse analysis ({strategy})...
          </p>
          <p className="mt-1 text-xs text-slate-400">This may take 15–40 seconds</p>
        </div>
      )}

      {scan?.status === "error" && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/30">
          <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
            Analysis failed
          </p>
          <p className="mt-1 text-sm text-rose-600 dark:text-rose-400">
            {scan.error}
          </p>
        </div>
      )}

      {scan?.status === "done" && scan.data && (
        <SiteReport
          data={scan.data}
          compareData={compareData?.data}
          siteLabel={siteLabel}
          openSections={openSections}
          onSectionToggle={handleSectionToggle}
        />
      )}
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {renderColumn(scanA, "Site A", strategyA, setStrategyA, scanB)}
      {renderColumn(scanB, "Site B", strategyB, setStrategyB, scanA)}
    </div>
  );
}
