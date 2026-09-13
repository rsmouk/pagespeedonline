import { formatCategoryLabel } from "@/lib/formatters";
import { LIGHTHOUSE_CATEGORIES } from "@/lib/types";
import type { Audit, LoadingExperience, PageSpeedResult, Strategy } from "@/lib/types";

export type MetricStatus = "good" | "needs-improvement" | "poor" | "unknown";

export interface SimpleReportMetric {
  id: string;
  label: string;
  description: string;
  value: string;
  status: MetricStatus;
  source: "field" | "lab";
}

export interface SimpleReportOpportunity {
  id: string;
  title: string;
  displayValue?: string;
  savingsMs?: number;
  score: number;
}

export interface SimpleReportData {
  url: string;
  analyzedAt: string;
  strategy: Strategy;
  lighthouseVersion?: string;
  performanceScore: number | null;
  categories: { key: string; label: string; score: number | null }[];
  fieldMetrics: SimpleReportMetric[];
  labMetrics: SimpleReportMetric[];
  coreWebVitalsPassed: boolean | null;
  fieldDataNote?: string;
  opportunities: SimpleReportOpportunity[];
  passedAudits: number;
  failedAudits: number;
}

const CRUX_FIELD_METRICS: {
  key: string;
  id: string;
  label: string;
  description: string;
  isCls?: boolean;
}[] = [
  {
    key: "LARGEST_CONTENTFUL_PAINT_MS",
    id: "lcp",
    label: "LCP",
    description: "Largest Contentful Paint — how fast main content appears",
  },
  {
    key: "INTERACTION_TO_NEXT_PAINT",
    id: "inp",
    label: "INP",
    description: "Interaction to Next Paint — page responsiveness",
  },
  {
    key: "CUMULATIVE_LAYOUT_SHIFT_SCORE",
    id: "cls",
    label: "CLS",
    description: "Cumulative Layout Shift — visual stability",
    isCls: true,
  },
];

const LAB_METRICS: {
  id: string;
  label: string;
  description: string;
  fallbackId?: string;
}[] = [
  {
    id: "largest-contentful-paint",
    label: "LCP",
    description: "Largest Contentful Paint",
  },
  {
    id: "interaction-to-next-paint",
    label: "INP",
    description: "Interaction to Next Paint",
    fallbackId: "max-potential-fid",
  },
  {
    id: "cumulative-layout-shift",
    label: "CLS",
    description: "Cumulative Layout Shift",
  },
  {
    id: "first-contentful-paint",
    label: "FCP",
    description: "First Contentful Paint",
  },
  {
    id: "total-blocking-time",
    label: "TBT",
    description: "Total Blocking Time",
  },
  {
    id: "speed-index",
    label: "Speed Index",
    description: "How quickly content becomes visible",
  },
];

function toPct(score: number | null | undefined): number | null {
  if (score == null) return null;
  return Math.round(score * 100);
}

function cruxCategoryToStatus(category?: string): MetricStatus {
  switch (category) {
    case "FAST":
      return "good";
    case "AVERAGE":
      return "needs-improvement";
    case "SLOW":
    case "POOR":
      return "poor";
    default:
      return "unknown";
  }
}

function auditScoreToStatus(score: number | null | undefined): MetricStatus {
  if (score == null) return "unknown";
  if (score >= 0.9) return "good";
  if (score >= 0.5) return "needs-improvement";
  return "poor";
}

function formatCruxValue(key: string, percentile: number, isCls?: boolean): string {
  if (isCls || key === "CUMULATIVE_LAYOUT_SHIFT_SCORE") {
    return (percentile / 100).toFixed(2);
  }
  if (percentile >= 1000) {
    return `${(percentile / 1000).toFixed(1)} s`;
  }
  return `${Math.round(percentile)} ms`;
}

function extractFieldMetrics(experience?: LoadingExperience): SimpleReportMetric[] {
  if (!experience?.metrics) return [];

  return CRUX_FIELD_METRICS.flatMap(({ key, id, label, description, isCls }) => {
    const metric = experience.metrics?.[key];
    if (!metric || metric.percentile == null) return [];

    return [
      {
        id,
        label,
        description,
        value: formatCruxValue(key, metric.percentile, isCls),
        status: cruxCategoryToStatus(metric.category),
        source: "field" as const,
      },
    ];
  });
}

function getAudit(audits: Record<string, Audit>, id: string, fallbackId?: string) {
  return audits[id] ?? (fallbackId ? audits[fallbackId] : undefined);
}

function extractLabMetrics(audits: Record<string, Audit>): SimpleReportMetric[] {
  return LAB_METRICS.flatMap(({ id, label, description, fallbackId }) => {
    const audit = getAudit(audits, id, fallbackId);
    if (!audit) return [];

    let rowLabel = label;
    if (id === "interaction-to-next-paint" && !audits[id] && fallbackId) {
      rowLabel = "FID";
    }

    return [
      {
        id,
        label: rowLabel,
        description,
        value: audit.displayValue?.trim() || "—",
        status: auditScoreToStatus(audit.score),
        source: "lab" as const,
      },
    ];
  });
}

function getPerformanceAuditIds(lh: PageSpeedResult["lighthouseResult"]): Set<string> {
  const refs = lh.categories?.performance?.auditRefs ?? [];
  return new Set(refs.map((r) => r.id));
}

function getAuditGroup(
  lh: PageSpeedResult["lighthouseResult"],
  auditId: string
): string | undefined {
  return lh.categories?.performance?.auditRefs?.find((r) => r.id === auditId)?.group;
}

function extractOpportunities(
  lh: PageSpeedResult["lighthouseResult"],
  limit = 6
): SimpleReportOpportunity[] {
  const perfIds = getPerformanceAuditIds(lh);
  const audits = lh.audits ?? {};

  const candidates = Object.values(audits)
    .filter((audit) => {
      if (!perfIds.has(audit.id)) return false;
      if (audit.scoreDisplayMode === "notApplicable") return false;
      if (audit.score == null) return false;
      if (audit.score >= 1) return false;

      const group = getAuditGroup(lh, audit.id);
      return group === "insights" || group === "diagnostics";
    })
    .map((audit) => ({
      id: audit.id,
      title: audit.title,
      displayValue: audit.displayValue,
      savingsMs: audit.details?.overallSavingsMs,
      score: audit.score ?? 0,
    }))
    .sort((a, b) => {
      const savingsDiff = (b.savingsMs ?? 0) - (a.savingsMs ?? 0);
      if (savingsDiff !== 0) return savingsDiff;
      return a.score - b.score;
    });

  return candidates.slice(0, limit);
}

function countAuditResults(lh: PageSpeedResult["lighthouseResult"]) {
  const perfIds = getPerformanceAuditIds(lh);
  const audits = lh.audits ?? {};

  let passed = 0;
  let failed = 0;

  for (const id of perfIds) {
    const audit = audits[id];
    if (!audit || audit.scoreDisplayMode === "notApplicable") continue;
    if (audit.score == null) continue;

    const group = getAuditGroup(lh, id);
    if (group !== "insights" && group !== "diagnostics") continue;

    if (audit.score >= 1) passed += 1;
    else failed += 1;
  }

  return { passed, failed };
}

function buildFieldDataNote(experience?: LoadingExperience): string | undefined {
  if (!experience) {
    return "No real-user data available for this URL.";
  }
  if (experience.origin_fallback) {
    return "Showing origin-level data — this page does not have enough Chrome user visits for its own report.";
  }
  return "Based on Chrome User Experience Report (real users, last 28 days).";
}

function assessCoreWebVitals(fieldMetrics: SimpleReportMetric[]): boolean | null {
  const core = fieldMetrics.filter((m) => ["lcp", "inp", "cls"].includes(m.id));
  if (core.length === 0) return null;

  const hasPoor = core.some((m) => m.status === "poor");
  const hasUnknown = core.some((m) => m.status === "unknown");
  if (hasUnknown) return null;
  if (hasPoor) return false;

  const hasNeedsImprovement = core.some((m) => m.status === "needs-improvement");
  return !hasNeedsImprovement;
}

function detectStrategy(data: PageSpeedResult): Strategy {
  const formFactor = data.lighthouseResult.configSettings?.formFactor;
  if (formFactor === "desktop") return "desktop";
  if (formFactor === "mobile") return "mobile";
  const emulated = data.lighthouseResult.configSettings?.emulatedFormFactor;
  if (emulated === "desktop") return "desktop";
  return "mobile";
}

export function extractSimpleReport(data: PageSpeedResult): SimpleReportData {
  const lh = data.lighthouseResult;
  const categories = lh.categories ?? {};
  const fieldMetrics = extractFieldMetrics(data.loadingExperience);
  const labMetrics = extractLabMetrics(lh.audits ?? {});
  const { passed, failed } = countAuditResults(lh);

  return {
    url: data.id ?? lh.finalUrl ?? lh.requestedUrl ?? "—",
    analyzedAt: data.analysisUTCTimestamp ?? lh.fetchTime ?? "",
    strategy: detectStrategy(data),
    lighthouseVersion: lh.lighthouseVersion,
    performanceScore: toPct(categories.performance?.score),
    categories: LIGHTHOUSE_CATEGORIES.map((key) => ({
      key,
      label: formatCategoryLabel(key),
      score: toPct(categories[key]?.score),
    })).filter((c) => c.score != null),
    fieldMetrics,
    labMetrics,
    coreWebVitalsPassed: assessCoreWebVitals(fieldMetrics),
    fieldDataNote: buildFieldDataNote(data.loadingExperience),
    opportunities: extractOpportunities(lh),
    passedAudits: passed,
    failedAudits: failed,
  };
}
