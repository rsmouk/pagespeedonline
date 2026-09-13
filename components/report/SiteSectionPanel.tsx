"use client";

import { useCallback } from "react";
import { SectionContent } from "@/components/report/SectionContent";
import { CopyJsonButton } from "@/components/ui/CopyJsonButton";
import {
  buildSectionExportPayload,
  sectionExportToJson,
} from "@/lib/extract-section-data";
import type { ReportSectionId } from "@/lib/report-sections";
import type { PageSpeedResult, Strategy } from "@/lib/types";

interface SiteSectionPanelProps {
  siteLabel: string;
  url: string;
  strategy: Strategy;
  sectionId: ReportSectionId;
  data: PageSpeedResult;
  compareData?: PageSpeedResult;
}

export function SiteSectionPanel({
  siteLabel,
  url,
  strategy,
  sectionId,
  data,
  compareData,
}: SiteSectionPanelProps) {
  const getPayload = useCallback(
    () =>
      sectionExportToJson(
        buildSectionExportPayload(sectionId, data, {
          url,
          siteLabel,
          strategy,
        })
      ),
    [sectionId, data, url, siteLabel, strategy]
  );

  return (
    <div className="min-w-0 rounded-lg border border-slate-100 p-3 dark:border-slate-800">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400">
            {siteLabel}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-slate-400" title={url}>
            {url}
          </p>
        </div>
        <CopyJsonButton getPayload={getPayload} label="Copy JSON" />
      </div>
      <SectionContent
        sectionId={sectionId}
        data={data}
        compareData={compareData}
      />
    </div>
  );
}
