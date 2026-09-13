"use client";

import { SectionContent } from "@/components/report/SectionContent";
import type { ReportSectionId } from "@/lib/report-sections";
import type { PageSpeedResult } from "@/lib/types";

interface SiteSectionPanelProps {
  siteLabel: string;
  url: string;
  sectionId: ReportSectionId;
  data: PageSpeedResult;
  compareData?: PageSpeedResult;
  differencesOnly?: boolean;
}

export function SiteSectionPanel({
  siteLabel,
  url,
  sectionId,
  data,
  compareData,
  differencesOnly = false,
}: SiteSectionPanelProps) {
  return (
    <div className="min-w-0 rounded-lg border border-white/60 bg-white/70 p-3 dark:border-slate-700/60 dark:bg-slate-950/30">
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400">
          {siteLabel}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-slate-400" title={url}>
          {url}
        </p>
      </div>
      <SectionContent
        sectionId={sectionId}
        data={data}
        compareData={compareData}
        differencesOnly={differencesOnly}
      />
    </div>
  );
}
