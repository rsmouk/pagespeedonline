import type { ReportSectionId } from "@/lib/report-sections";
import { REPORT_SECTIONS } from "@/lib/report-sections";
import type { LighthouseResult, PageSpeedResult, Strategy } from "@/lib/types";

function auditsByGroup(
  lighthouse: LighthouseResult,
  groupFilter?: string
): Record<string, unknown> {
  const audits = lighthouse.audits ?? {};
  const auditRefs = Object.values(lighthouse.categories ?? {}).flatMap(
    (c) => c.auditRefs ?? []
  );
  const groupMap = new Map(auditRefs.map((r) => [r.id, r.group]));

  const filtered = Object.values(audits).filter(
    (a) => !groupFilter || groupMap.get(a.id) === groupFilter
  );

  return Object.fromEntries(filtered.map((a) => [a.id, a]));
}

function extractSectionPayload(
  sectionId: ReportSectionId,
  data: PageSpeedResult
): unknown {
  const lh = data.lighthouseResult;

  switch (sectionId) {
    case "overview":
      return {
        captchaResult: data.captchaResult,
        kind: data.kind,
        id: data.id,
        analysisUTCTimestamp: data.analysisUTCTimestamp,
        requestedUrl: lh.requestedUrl,
        finalUrl: lh.finalUrl,
        mainDocumentUrl: lh.mainDocumentUrl,
        finalDisplayedUrl: lh.finalDisplayedUrl,
        categories: lh.categories,
      };
    case "crux":
      return data.loadingExperience ?? null;
    case "origin-crux":
      return data.originLoadingExperience ?? null;
    case "meta":
      return {
        requestedUrl: lh.requestedUrl,
        finalUrl: lh.finalUrl,
        mainDocumentUrl: lh.mainDocumentUrl,
        finalDisplayedUrl: lh.finalDisplayedUrl,
        lighthouseVersion: lh.lighthouseVersion,
        userAgent: lh.userAgent,
        fetchTime: lh.fetchTime,
        environment: lh.environment,
        runWarnings: lh.runWarnings,
        configSettings: lh.configSettings,
        timing: lh.timing,
        i18n: lh.i18n,
      };
    case "categories":
      return {
        categories: lh.categories,
        categoryGroups: lh.categoryGroups,
      };
    case "metrics":
      return { audits: auditsByGroup(lh, "metrics") };
    case "insights":
      return { audits: auditsByGroup(lh, "insights") };
    case "diagnostics":
      return { audits: auditsByGroup(lh, "diagnostics") };
    case "all-audits":
      return { audits: lh.audits };
    case "stack-packs":
      return { stackPacks: lh.stackPacks ?? [] };
    case "entities":
      return { entities: lh.entities ?? [] };
    case "screenshot":
      return { fullPageScreenshot: lh.fullPageScreenshot ?? null };
    case "raw-json":
      return data;
    default:
      return null;
  }
}

export interface SectionExportPayload {
  url: string;
  finalUrl?: string;
  siteLabel: string;
  strategy: Strategy;
  section: ReportSectionId;
  sectionTitle: string;
  exportedAt: string;
  data: unknown;
}

export function buildSectionExportPayload(
  sectionId: ReportSectionId,
  data: PageSpeedResult,
  options: {
    url: string;
    siteLabel: string;
    strategy: Strategy;
  }
): SectionExportPayload {
  const sectionMeta = REPORT_SECTIONS.find((s) => s.id === sectionId);
  const lh = data.lighthouseResult;

  return {
    url: options.url,
    finalUrl: lh.finalUrl ?? lh.finalDisplayedUrl ?? options.url,
    siteLabel: options.siteLabel,
    strategy: options.strategy,
    section: sectionId,
    sectionTitle: sectionMeta?.title ?? sectionId,
    exportedAt: new Date().toISOString(),
    data: extractSectionPayload(sectionId, data),
  };
}

export function sectionExportToJson(payload: SectionExportPayload): string {
  return JSON.stringify(payload, null, 2);
}
