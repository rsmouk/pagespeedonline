import { OverviewSection } from "@/components/sections/OverviewSection";
import { CruxSection } from "@/components/sections/CruxSection";
import { LighthouseMetaSection } from "@/components/sections/LighthouseMetaSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { AuditsSection } from "@/components/sections/AuditsSection";
import { StackPacksSection } from "@/components/sections/StackPacksSection";
import { EntitiesSection } from "@/components/sections/EntitiesSection";
import { ScreenshotSection } from "@/components/sections/ScreenshotSection";
import { RawJsonSection } from "@/components/sections/RawJsonSection";
import type { PageSpeedResult } from "@/lib/types";
import type { ReportSectionId } from "@/lib/report-sections";

interface SectionContentProps {
  sectionId: ReportSectionId;
  data: PageSpeedResult;
  compareData?: PageSpeedResult;
}

export function SectionContent({
  sectionId,
  data,
  compareData,
}: SectionContentProps) {
  const lh = data.lighthouseResult;

  switch (sectionId) {
    case "overview":
      return <OverviewSection data={data} compareData={compareData} />;
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
        <AuditsSection lighthouse={lh} groupFilter="metrics" title="Metrics" />
      );
    case "insights":
      return (
        <AuditsSection lighthouse={lh} groupFilter="insights" title="Insights" />
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
}
