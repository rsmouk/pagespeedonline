"use client";

import { Accordion } from "@/components/ui/Accordion";
import { CruxSection } from "@/components/sections/CruxSection";
import { LighthouseMetaSection } from "@/components/sections/LighthouseMetaSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { AuditsSection } from "@/components/sections/AuditsSection";
import { StackPacksSection } from "@/components/sections/StackPacksSection";
import { EntitiesSection } from "@/components/sections/EntitiesSection";
import { ScreenshotSection } from "@/components/sections/ScreenshotSection";
import { RawJsonSection } from "@/components/sections/RawJsonSection";
import type { PageSpeedResult } from "@/lib/types";

interface SiteReportProps {
  data: PageSpeedResult;
  compareData?: PageSpeedResult;
  siteLabel: string;
  openSections?: Record<string, boolean>;
  onSectionToggle?: (sectionId: string) => void;
}

const SECTIONS = [
  { id: "crux", title: "Field Data (CrUX)", subtitle: "Chrome User Experience Report — page URL" },
  { id: "origin-crux", title: "Origin Field Data", subtitle: "CrUX data for the origin" },
  { id: "meta", title: "Lighthouse Metadata", subtitle: "URLs, version, environment, config" },
  { id: "categories", title: "Category Scores & Groups", subtitle: "All categories and audit references" },
  { id: "metrics", title: "Metrics Audits", subtitle: "Core Web Vitals and performance metrics" },
  { id: "insights", title: "Insights Audits", subtitle: "Performance insights and opportunities" },
  { id: "diagnostics", title: "Diagnostics Audits", subtitle: "Additional diagnostic information" },
  { id: "all-audits", title: "All Audits (A–Z)", subtitle: "Complete audit list with full details" },
  { id: "stack-packs", title: "Stack Packs", subtitle: "Detected frameworks and recommendations" },
  { id: "entities", title: "Entities", subtitle: "First and third party origins" },
  { id: "screenshot", title: "Full Page Screenshot", subtitle: "Visual capture and DOM node bounds" },
  { id: "raw-json", title: "Raw JSON", subtitle: "Complete API response" },
] as const;

export function SiteReport({
  data,
  compareData,
  siteLabel,
  openSections,
  onSectionToggle,
}: SiteReportProps) {
  const lh = data.lighthouseResult;

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "crux":
        return <CruxSection experience={data.loadingExperience} title="Field Data" />;
      case "origin-crux":
        return (
          <CruxSection
            experience={data.originLoadingExperience}
            title="Origin Field Data"
          />
        );
      case "meta":
        return <LighthouseMetaSection lighthouse={lh} />;
      case "categories":
        return <CategoriesSection lighthouse={lh} />;
      case "metrics":
        return (
          <AuditsSection
            lighthouse={lh}
            groupFilter="metrics"
            title="Metrics"
          />
        );
      case "insights":
        return (
          <AuditsSection
            lighthouse={lh}
            groupFilter="insights"
            title="Insights"
          />
        );
      case "diagnostics":
        return (
          <AuditsSection
            lighthouse={lh}
            groupFilter="diagnostics"
            title="Diagnostics"
          />
        );
      case "all-audits":
        return <AuditsSection lighthouse={lh} title="All audits" />;
      case "stack-packs":
        return <StackPacksSection stackPacks={lh.stackPacks} />;
      case "entities":
        return <EntitiesSection entities={lh.entities} />;
      case "screenshot":
        return <ScreenshotSection lighthouse={lh} />;
      case "raw-json":
        return <RawJsonSection data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {siteLabel}
        </p>
        <p className="mt-1 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
          {data.id ?? lh.requestedUrl}
        </p>
      </div>

      {SECTIONS.map((section) => (
        <Accordion
          key={section.id}
          title={section.title}
          subtitle={section.subtitle}
          open={openSections?.[section.id]}
          onToggle={() => onSectionToggle?.(section.id)}
        >
          {renderSection(section.id)}
        </Accordion>
      ))}
    </div>
  );
}
