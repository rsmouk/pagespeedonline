"use client";

import { useCallback, useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { ScanErrorPanel } from "@/components/compare/ScanErrorPanel";
import { SectionContent } from "@/components/report/SectionContent";
import { StrategyTabs } from "@/components/StrategyTabs";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { displayHost } from "@/lib/extract-compare-summary";
import { formatCategoryLabel, formatDate } from "@/lib/formatters";
import { REPORT_SECTIONS } from "@/lib/report-sections";
import type { ReportSectionId } from "@/lib/report-sections";
import { getSectionBackground } from "@/lib/section-styles";
import { LIGHTHOUSE_CATEGORIES } from "@/lib/types";
import type { ScanState, Strategy } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface SingleSiteResultsProps {
  scan?: ScanState;
  url: string;
  strategy: Strategy;
  onStrategyChange: (strategy: Strategy) => void;
  onRetry?: () => void;
}

export function SingleSiteResults({
  scan,
  url,
  strategy,
  onStrategyChange,
  onRetry,
}: SingleSiteResultsProps) {
  const [openSection, setOpenSection] = useState<ReportSectionId | null>(null);

  const strategyLabel =
    strategy.charAt(0).toUpperCase() + strategy.slice(1);
  const host = displayHost(url);

  const handleSectionToggle = useCallback((sectionId: ReportSectionId) => {
    const scrollY = window.scrollY;
    setOpenSection((prev) => (prev === sectionId ? null : sectionId));
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  }, []);

  if (scan?.status === "loading") {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <StrategyTabs value={strategy} onChange={onStrategyChange} />
        </div>
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-16 dark:border-slate-700">
          <Loader2 className="h-10 w-10 animate-spin text-teal-600 dark:text-teal-400" />
          <p className="mt-4 text-sm text-slate-500">Analyzing {host}…</p>
        </div>
      </div>
    );
  }

  if (scan?.status === "error") {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <StrategyTabs value={strategy} onChange={onStrategyChange} />
        </div>
        <ScanErrorPanel
          label="Site"
          url={url}
          message={scan.error}
          errorKind={scan.errorKind}
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (!scan?.data) return null;

  const reportData = scan.data;
  const categories = reportData.lighthouseResult.categories ?? {};

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex justify-center">
        <StrategyTabs value={strategy} onChange={onStrategyChange} />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 bg-teal-50/50 px-5 py-4 dark:border-slate-800 dark:bg-teal-950/20">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-xs font-bold text-white">
              1
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                {host}
              </p>
              <p className="text-xs text-slate-500">
                {strategyLabel} · Analyzed {formatDate(reportData.analysisUTCTimestamp)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Category Scores
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {LIGHTHOUSE_CATEGORIES.map((key) => (
              <ScoreRing
                key={key}
                score={categories[key]?.score}
                label={formatCategoryLabel(key)}
                size="sm"
              />
            ))}
          </div>
        </div>

      </div>

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
            <SectionContent sectionId={section.id} data={reportData} />
          </Accordion>
        ))}
      </div>
    </div>
  );
}
