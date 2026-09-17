"use client";

import { useCallback, useMemo, useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { ScanErrorPanel } from "@/components/compare/ScanErrorPanel";
import { SectionContent } from "@/components/report/SectionContent";
import { SimpleReport } from "@/components/report/SimpleReport";
import { StrategyTabs } from "@/components/StrategyTabs";
import { displayHost } from "@/lib/extract-compare-summary";
import { extractSimpleReport } from "@/lib/extract-simple-report";
import { REPORT_SECTIONS } from "@/lib/report-sections";
import type { ReportSectionId } from "@/lib/report-sections";
import { getSectionBackground } from "@/lib/section-styles";
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
  const host = displayHost(url);

  const simpleReport = useMemo(
    () => (scan?.data ? extractSimpleReport(scan.data) : null),
    [scan?.data]
  );

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

  if (!scan?.data || !simpleReport) return null;

  const reportData = scan.data;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex justify-center">
        <StrategyTabs value={strategy} onChange={onStrategyChange} />
      </div>

      <SimpleReport report={simpleReport} />

      <div className="space-y-3">
        <div className="px-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Advanced
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            Full Lighthouse audits, raw metrics, and JSON for deeper analysis.
          </p>
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
            <SectionContent sectionId={section.id} data={reportData} />
          </Accordion>
        ))}
      </div>
    </div>
  );
}
