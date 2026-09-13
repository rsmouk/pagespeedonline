"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { CompareScreenshotsSection } from "@/components/compare/CompareScreenshotsSection";
import { CompareSummaryCard } from "@/components/compare/CompareSummaryCard";
import { ScanErrorPanel } from "@/components/compare/ScanErrorPanel";
import { SiteSectionPanel } from "@/components/report/SiteSectionPanel";
import { StrategyTabs } from "@/components/StrategyTabs";
import { Badge } from "@/components/ui/Badge";
import {
  displayHost,
  extractCompareSummary,
} from "@/lib/extract-compare-summary";
import { extractScreenshot } from "@/lib/extract-screenshot";
import { REPORT_SECTIONS } from "@/lib/report-sections";
import type { ReportSectionId } from "@/lib/report-sections";
import { getSectionBackground } from "@/lib/section-styles";
import type { ScanState, Strategy } from "@/lib/types";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const AUDIT_SECTIONS = new Set<ReportSectionId>([
  "metrics",
  "insights",
  "diagnostics",
  "all-audits",
]);

interface AlignedCompareResultsProps {
  scans: ScanState[];
  urlA: string;
  urlB: string;
  labelA?: string;
  labelB?: string;
  displayUrlA?: string;
  displayUrlB?: string;
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
  labelA = "Site A",
  labelB = "Site B",
  displayUrlA,
  displayUrlB,
  strategy,
  onStrategyChange,
}: AlignedCompareResultsProps) {
  const showUrlA = displayUrlA ?? urlA;
  const showUrlB = displayUrlB ?? urlB;
  const [openSection, setOpenSection] = useState<ReportSectionId | null>(
    "overview"
  );
  const [differencesOnly, setDifferencesOnly] = useState(false);
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

  const renderSitePanel = (
    scan: ScanState | undefined,
    siteLabel: string,
    siteUrl: string
  ) => {
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
        <ScanErrorPanel
          label={siteLabel}
          url={siteUrl}
          message={scan.error}
          errorKind={scan.errorKind}
        />
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

  const summary = useMemo(() => {
    const dataA = scanA?.data;
    const dataB = scanB?.data;
    if (!bothReady || !dataA || !dataB) return null;
    return extractCompareSummary(dataA, dataB);
  }, [bothReady, scanA?.data, scanB?.data]);

  const screenshots = useMemo(() => {
    const dataA = scanA?.data;
    const dataB = scanB?.data;
    if (!bothReady || !dataA || !dataB) return null;
    return {
      a: extractScreenshot(dataA),
      b: extractScreenshot(dataB),
    };
  }, [bothReady, scanA?.data, scanB?.data]);

  const strategyLabel =
    strategy.charAt(0).toUpperCase() + strategy.slice(1);

  return (
    <div ref={containerRef} className="[overflow-anchor:none]">
      <div className="mb-6 flex justify-center">
        <StrategyTabs value={strategy} onChange={onStrategyChange} />
      </div>

      {bothReady && summary && (
        <div className="mb-6 space-y-6">
          <CompareSummaryCard
            siteLabelA={displayHost(showUrlA)}
            siteLabelB={displayHost(showUrlB)}
            subtitleA={`${strategyLabel} · ${labelA}`}
            subtitleB={`${strategyLabel} · ${labelB}`}
            winnerLabelA={labelA}
            winnerLabelB={labelB}
            perfScoreA={summary.perfScoreA}
            perfScoreB={summary.perfScoreB}
            categories={summary.categories}
            cwv={summary.cwv}
          />

          {screenshots && (
            <CompareScreenshotsSection
              siteLabelA={displayHost(showUrlA)}
              siteLabelB={displayHost(showUrlB)}
              subtitleA={`${strategyLabel} · ${labelA}`}
              subtitleB={`${strategyLabel} · ${labelB}`}
              screenshotA={screenshots.a}
              screenshotB={screenshots.b}
            />
          )}
        </div>
      )}

      {!bothReady && (scanA || scanB) && (
        <div className="mb-4 grid gap-4 lg:grid-cols-2">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                  {labelA}
                </h2>
                {renderStatus(scanA)}
              </div>
              <p className="mt-1 truncate text-xs text-slate-500">{showUrlA}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                  {labelB}
                </h2>
                {renderStatus(scanB)}
              </div>
              <p className="mt-1 truncate text-xs text-slate-500">{showUrlB}</p>
            </div>
          </div>
        </div>
      )}

      {/* Shared accordion rows — one section, two columns side by side */}
      {bothReady && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-teal-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-700">
              <input
                type="checkbox"
                checked={differencesOnly}
                onChange={(e) => setDifferencesOnly(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-600"
              />
              Show audit differences only
            </label>
          </div>

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
                  siteLabel={labelA}
                  url={showUrlA}
                  sectionId={section.id}
                  data={scanA.data!}
                  compareData={scanB.data}
                  differencesOnly={
                    differencesOnly && AUDIT_SECTIONS.has(section.id)
                  }
                />
                <SiteSectionPanel
                  siteLabel={labelB}
                  url={showUrlB}
                  sectionId={section.id}
                  data={scanB.data!}
                  compareData={scanA.data}
                  differencesOnly={
                    differencesOnly && AUDIT_SECTIONS.has(section.id)
                  }
                />
              </div>
            </Accordion>
          ))}
        </div>
      )}

      {/* Loading / error states when not both ready */}
      {!bothReady && (
        <div className="grid gap-4 lg:grid-cols-2">
          {renderSitePanel(scanA, labelA, showUrlA)}
          {renderSitePanel(scanB, labelB, showUrlB)}
        </div>
      )}
    </div>
  );
}
