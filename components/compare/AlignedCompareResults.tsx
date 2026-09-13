"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { SiteSectionPanel } from "@/components/report/SiteSectionPanel";
import { StrategyTabs } from "@/components/StrategyTabs";
import { Badge } from "@/components/ui/Badge";
import { REPORT_SECTIONS } from "@/lib/report-sections";
import type { ReportSectionId } from "@/lib/report-sections";
import { getSectionBackground } from "@/lib/section-styles";
import type { ScanState, Strategy } from "@/lib/types";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface AlignedCompareResultsProps {
  scans: ScanState[];
  urlA: string;
  urlB: string;
  strategy: Strategy;
  onStrategyChange: (strategy: Strategy) => void;
}

function getScan(
  scans: ScanState[],
  url: string,
  strategy: Strategy
): ScanState | undefined {
  return scans.find((s) => s.url === url && s.strategy === strategy);
}

export function AlignedCompareResults({
  scans,
  urlA,
  urlB,
  strategy,
  onStrategyChange,
}: AlignedCompareResultsProps) {
  const [openSection, setOpenSection] = useState<ReportSectionId | null>(
    "overview"
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const scanA = useMemo(
    () => getScan(scans, urlA, strategy),
    [scans, urlA, strategy]
  );
  const scanB = useMemo(
    () => getScan(scans, urlB, strategy),
    [scans, urlB, strategy]
  );

  const handleSectionToggle = useCallback((sectionId: ReportSectionId) => {
    const scrollY = window.scrollY;
    setOpenSection((prev) => (prev === sectionId ? null : sectionId));
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  }, []);

  const renderStatus = (scan?: ScanState) => {
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

  const renderSitePanel = (scan: ScanState | undefined, siteLabel: string) => {
    if (scan?.status === "loading") {
      return (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-12 dark:border-slate-700">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600 dark:text-teal-400" />
          <p className="mt-3 text-sm text-slate-500">Analyzing {siteLabel}...</p>
        </div>
      );
    }

    if (scan?.status === "error") {
      return (
        <div className="min-h-[120px] rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/30">
          <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
            {siteLabel} — failed
          </p>
          <p className="mt-1 text-sm text-rose-600 dark:text-rose-400">
            {scan.error}
          </p>
        </div>
      );
    }

    return (
      <p className="py-8 text-center text-sm text-slate-400">
        Expand a section above to view {siteLabel} data
      </p>
    );
  };

  const bothReady =
    scanA?.status === "done" &&
    scanB?.status === "done" &&
    scanA.data &&
    scanB.data;

  return (
    <div ref={containerRef} className="[overflow-anchor:none]">
      {/* Column headers — aligned row */}
      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                Site A
              </h2>
              {renderStatus(scanA)}
            </div>
            <p className="mt-1 truncate text-xs text-slate-500">{urlA}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                Site B
              </h2>
              {renderStatus(scanB)}
            </div>
            <p className="mt-1 truncate text-xs text-slate-500">{urlB}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex justify-center">
        <StrategyTabs value={strategy} onChange={onStrategyChange} />
      </div>

      {/* Shared accordion rows — one section, two columns side by side */}
      {bothReady && (
        <div className="space-y-3">
          {REPORT_SECTIONS.map((section, index) => (
            <Accordion
              key={section.id}
              title={section.title}
              subtitle={section.subtitle}
              open={openSection === section.id}
              onToggle={() => handleSectionToggle(section.id)}
              className={getSectionBackground(index)}
            >
              <div className="grid items-start gap-4 lg:grid-cols-2">
                <SiteSectionPanel
                  siteLabel="Site A"
                  url={urlA}
                  sectionId={section.id}
                  data={scanA.data!}
                  compareData={scanB.data}
                />
                <SiteSectionPanel
                  siteLabel="Site B"
                  url={urlB}
                  sectionId={section.id}
                  data={scanB.data!}
                  compareData={scanA.data}
                />
              </div>
            </Accordion>
          ))}
        </div>
      )}

      {/* Loading / error states when not both ready */}
      {!bothReady && (
        <div className="grid gap-4 lg:grid-cols-2">
          {renderSitePanel(scanA, "Site A")}
          {renderSitePanel(scanB, "Site B")}
        </div>
      )}
    </div>
  );
}
