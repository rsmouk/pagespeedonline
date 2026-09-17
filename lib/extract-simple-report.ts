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
  /** Beginner-friendly target for a “good” rating */
  recommendedValue?: string;
}

export interface SimpleReportOpportunity {
  id: string;
  title: string;
  displayValue?: string;
  savingsMs?: number;
  savingsBytes?: number;
  score: number;
  tip?: string;
  recommendedValue?: string;
}

export interface SimpleReportPassedItem {
  id: string;
  title: string;
  displayValue?: string;
}

export interface SimpleReportRecommendation {
  id: string;
  title: string;
  currentValue: string;
  recommendedValue: string;
  tip: string;
  savingsMs?: number;
  priority: "high" | "medium" | "low";
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
  fieldDataSource?: string;
  opportunities: SimpleReportOpportunity[];
  passedItems: SimpleReportPassedItem[];
  recommendations: SimpleReportRecommendation[];
  passedAudits: number;
  failedAudits: number;
}

/** Google “good” thresholds (CrUX / Core Web Vitals). */
const METRIC_TARGETS: Record<
  string,
  { recommendedValue: string; tip: string }
> = {
  lcp: {
    recommendedValue: "≤ 2.5 s",
    tip: "Make the largest image or text block appear within 2.5 seconds.",
  },
  inp: {
    recommendedValue: "≤ 200 ms",
    tip: "Keep taps and clicks responding within 200 ms.",
  },
  cls: {
    recommendedValue: "≤ 0.1",
    tip: "Reserve space for images and ads so the layout does not jump.",
  },
  fcp: {
    recommendedValue: "≤ 1.8 s",
    tip: "Show the first text or image within 1.8 seconds.",
  },
  tbt: {
    recommendedValue: "≤ 200 ms",
    tip: "Reduce long JavaScript tasks that block the main thread.",
  },
  "speed-index": {
    recommendedValue: "≤ 3.4 s",
    tip: "Load above-the-fold content faster so the page feels complete sooner.",
  },
  "largest-contentful-paint": {
    recommendedValue: "≤ 2.5 s",
    tip: "Optimize the largest visible element (often a hero image).",
  },
  "interaction-to-next-paint": {
    recommendedValue: "≤ 200 ms",
    tip: "Keep the page responsive when users interact.",
  },
  "cumulative-layout-shift": {
    recommendedValue: "≤ 0.1",
    tip: "Set width/height on images and avoid inserting content above existing content.",
  },
  "first-contentful-paint": {
    recommendedValue: "≤ 1.8 s",
    tip: "Reduce render-blocking CSS and server wait time.",
  },
  "total-blocking-time": {
    recommendedValue: "≤ 200 ms",
    tip: "Break up or defer heavy JavaScript work.",
  },
};

/** Beginner targets for common Lighthouse opportunity audits. */
const AUDIT_RECOMMENDATIONS: Record<
  string,
  { recommendedValue: string; tip: string }
> = {
  "image-delivery-insight": {
    recommendedValue: "≈ 0 KiB wasted",
    tip: "Compress images, use modern formats (WebP/AVIF), and serve the right size.",
  },
  "render-blocking-insight": {
    recommendedValue: "No render-blocking critical requests",
    tip: "Defer non-critical CSS/JS or inline the tiny critical CSS.",
  },
  "unused-javascript": {
    recommendedValue: "≈ 0 KiB unused JS",
    tip: "Remove unused code and load scripts only when needed.",
  },
  "unused-css-rules": {
    recommendedValue: "≈ 0 KiB unused CSS",
    tip: "Remove unused styles or split CSS so above-the-fold loads first.",
  },
  "unminified-javascript": {
    recommendedValue: "All JS minified",
    tip: "Enable minification in your build or CDN.",
  },
  "unminified-css": {
    recommendedValue: "All CSS minified",
    tip: "Enable CSS minification in your build or CDN.",
  },
  "legacy-javascript-insight": {
    recommendedValue: "No unnecessary polyfills",
    tip: "Target modern browsers so extra polyfills are not shipped.",
  },
  "duplicated-javascript-insight": {
    recommendedValue: "No duplicate JS modules",
    tip: "Deduplicate bundles so the same library is not downloaded twice.",
  },
  "cache-insight": {
    recommendedValue: "Long cache lifetimes (e.g. ≥ 1 year for static assets)",
    tip: "Set Cache-Control for images, fonts, and JS/CSS that rarely change.",
  },
  "font-display-insight": {
    recommendedValue: "font-display: swap or optional",
    tip: "Show fallback text quickly while custom fonts load.",
  },
  "document-latency-insight": {
    recommendedValue: "TTFB ≤ 800 ms",
    tip: "Speed up the server / CDN response for the HTML document.",
  },
  "server-response-time": {
    recommendedValue: "≤ 800 ms",
    tip: "Improve hosting, caching, or backend time for the first HTML response.",
  },
  redirects: {
    recommendedValue: "0 extra redirects",
    tip: "Link straight to the final URL (avoid http→https or www chains).",
  },
  "bootup-time": {
    recommendedValue: "JS execution as low as practical",
    tip: "Ship less JavaScript and defer non-critical scripts.",
  },
  "mainthread-work-breakdown": {
    recommendedValue: "Main-thread work under ~2 s",
    tip: "Reduce parsing, style, and script work on the main thread.",
  },
  "total-byte-weight": {
    recommendedValue: "Total transfer ideally under ~1,600 KiB",
    tip: "Compress assets and remove large unused downloads.",
  },
  "unsized-images": {
    recommendedValue: "Every image has width & height",
    tip: "Set explicit dimensions (or aspect-ratio) to prevent layout shift.",
  },
  "uses-responsive-images": {
    recommendedValue: "Correctly sized images",
    tip: "Serve images that match the display size (srcset / sizes).",
  },
  "offscreen-images": {
    recommendedValue: "Offscreen images lazy-loaded",
    tip: "Lazy-load images below the fold.",
  },
  "uses-text-compression": {
    recommendedValue: "Gzip or Brotli enabled",
    tip: "Enable text compression on the server or CDN.",
  },
  "uses-long-cache-ttl": {
    recommendedValue: "Long cache TTL on static files",
    tip: "Cache static assets aggressively with versioned filenames.",
  },
  "dom-size": {
    recommendedValue: "DOM nodes preferably under ~800–1,400",
    tip: "Simplify the page structure; large DOMs slow rendering.",
  },
  "third-party-summary": {
    recommendedValue: "Minimal third-party blocking time",
    tip: "Defer or remove heavy analytics, ads, and widgets.",
  },
  "network-rtt": {
    recommendedValue: "Low latency via nearby CDN",
    tip: "Serve content from a CDN close to users.",
  },
  "speed-index": {
    recommendedValue: "≤ 3.4 s",
    tip: "Prioritize visible content so the page looks ready sooner.",
  },
};

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

function stripAuditDescription(description?: string): string {
  if (!description) return "";
  return description
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\.\s*$/, "");
}

function shortTip(description?: string, fallback?: string): string {
  const plain = stripAuditDescription(description);
  if (!plain) return fallback ?? "Fix this item to improve page experience.";
  const sentence = plain.split(/(?<=\.)\s+/)[0] ?? plain;
  return sentence.length > 140 ? `${sentence.slice(0, 137)}…` : sentence;
}

function recommendationForAudit(audit: Audit): {
  recommendedValue: string;
  tip: string;
} {
  const mapped = AUDIT_RECOMMENDATIONS[audit.id];
  if (mapped) return mapped;

  if (audit.details?.overallSavingsMs && audit.details.overallSavingsMs > 0) {
    return {
      recommendedValue: "≈ 0 ms estimated savings",
      tip: shortTip(audit.description, "Remove the delay this audit reports."),
    };
  }
  if (audit.details?.overallSavingsBytes && audit.details.overallSavingsBytes > 0) {
    return {
      recommendedValue: "≈ 0 KiB wasted",
      tip: shortTip(audit.description, "Reduce the download size this audit reports."),
    };
  }
  return {
    recommendedValue: "Pass (score 100%)",
    tip: shortTip(audit.description),
  };
}

function priorityForAudit(audit: Audit): "high" | "medium" | "low" {
  const savingsMs = audit.details?.overallSavingsMs ?? 0;
  const score = audit.score ?? 1;
  if (savingsMs >= 300 || score < 0.5) return "high";
  if (savingsMs >= 50 || score < 0.9) return "medium";
  return "low";
}

function extractFieldMetrics(experience?: LoadingExperience): SimpleReportMetric[] {
  if (!experience?.metrics) return [];

  return CRUX_FIELD_METRICS.flatMap(({ key, id, label, description, isCls }) => {
    const metric = experience.metrics?.[key];
    if (!metric || metric.percentile == null) return [];
    const target = METRIC_TARGETS[id];

    return [
      {
        id,
        label,
        description,
        value: formatCruxValue(key, metric.percentile, isCls),
        status: cruxCategoryToStatus(metric.category),
        source: "field" as const,
        recommendedValue: target?.recommendedValue,
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
    let targetKey = id;
    if (id === "interaction-to-next-paint" && !audits[id] && fallbackId) {
      rowLabel = "FID";
      targetKey = "inp";
    }

    const target = METRIC_TARGETS[targetKey] ?? METRIC_TARGETS[id];

    return [
      {
        id,
        label: rowLabel,
        description,
        value: audit.displayValue?.trim() || "—",
        status: auditScoreToStatus(audit.score),
        source: "lab" as const,
        recommendedValue: target?.recommendedValue,
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

function isActionablePerfAudit(
  lh: PageSpeedResult["lighthouseResult"],
  audit: Audit
): boolean {
  if (!getPerformanceAuditIds(lh).has(audit.id)) return false;
  if (audit.scoreDisplayMode === "notApplicable") return false;
  if (audit.scoreDisplayMode === "informative") return false;
  if (audit.score == null) return false;

  const group = getAuditGroup(lh, audit.id);
  return group === "insights" || group === "diagnostics" || group === "metrics";
}

function extractOpportunities(
  lh: PageSpeedResult["lighthouseResult"],
  limit = 8
): SimpleReportOpportunity[] {
  const audits = lh.audits ?? {};

  const candidates = Object.values(audits)
    .filter((audit) => {
      if (!isActionablePerfAudit(lh, audit)) return false;
      if ((audit.score ?? 1) >= 1) return false;

      const group = getAuditGroup(lh, audit.id);
      // Prefer insights/diagnostics for “opportunities”; include weak metrics too
      return group === "insights" || group === "diagnostics" || group === "metrics";
    })
    .map((audit) => {
      const rec = recommendationForAudit(audit);
      return {
        id: audit.id,
        title: audit.title,
        displayValue: audit.displayValue,
        savingsMs: audit.details?.overallSavingsMs,
        savingsBytes: audit.details?.overallSavingsBytes,
        score: audit.score ?? 0,
        tip: rec.tip,
        recommendedValue: rec.recommendedValue,
      };
    })
    .sort((a, b) => {
      const savingsDiff = (b.savingsMs ?? 0) - (a.savingsMs ?? 0);
      if (savingsDiff !== 0) return savingsDiff;
      return a.score - b.score;
    });

  return candidates.slice(0, limit);
}

function extractPassedItems(
  lh: PageSpeedResult["lighthouseResult"],
  limit = 24
): SimpleReportPassedItem[] {
  const audits = lh.audits ?? {};
  const items: SimpleReportPassedItem[] = [];

  for (const id of getPerformanceAuditIds(lh)) {
    const audit = audits[id];
    if (!audit || !isActionablePerfAudit(lh, audit)) continue;
    if ((audit.score ?? 0) < 1) continue;

    const group = getAuditGroup(lh, id);
    if (group !== "insights" && group !== "diagnostics") continue;

    items.push({
      id: audit.id,
      title: audit.title,
      displayValue: audit.displayValue,
    });
  }

  return items.slice(0, limit);
}

function extractRecommendations(
  lh: PageSpeedResult["lighthouseResult"],
  fieldMetrics: SimpleReportMetric[],
  labMetrics: SimpleReportMetric[],
  limit = 10
): SimpleReportRecommendation[] {
  const rows: SimpleReportRecommendation[] = [];
  const seen = new Set<string>();

  const pushMetricRec = (metric: SimpleReportMetric) => {
    if (metric.status === "good" || metric.status === "unknown") return;
    if (seen.has(metric.id)) return;
    seen.add(metric.id);
    const target = METRIC_TARGETS[metric.id];
    rows.push({
      id: metric.id,
      title: `${metric.label} needs improvement`,
      currentValue: metric.value,
      recommendedValue: metric.recommendedValue ?? target?.recommendedValue ?? "Meet the “good” threshold",
      tip: target?.tip ?? "Improve this metric toward the recommended target.",
      priority: metric.status === "poor" ? "high" : "medium",
    });
  };

  for (const metric of fieldMetrics) pushMetricRec(metric);
  for (const metric of labMetrics) pushMetricRec(metric);

  const audits = lh.audits ?? {};
  const failing = Object.values(audits)
    .filter((audit) => {
      if (!isActionablePerfAudit(lh, audit)) return false;
      if ((audit.score ?? 1) >= 1) return false;
      const group = getAuditGroup(lh, audit.id);
      return group === "insights" || group === "diagnostics";
    })
    .sort((a, b) => {
      const savingsDiff =
        (b.details?.overallSavingsMs ?? 0) - (a.details?.overallSavingsMs ?? 0);
      if (savingsDiff !== 0) return savingsDiff;
      return (a.score ?? 0) - (b.score ?? 0);
    });

  for (const audit of failing) {
    if (seen.has(audit.id)) continue;
    seen.add(audit.id);
    const rec = recommendationForAudit(audit);
    rows.push({
      id: audit.id,
      title: audit.title,
      currentValue: audit.displayValue?.trim() || "Needs work",
      recommendedValue: rec.recommendedValue,
      tip: rec.tip,
      savingsMs: audit.details?.overallSavingsMs,
      priority: priorityForAudit(audit),
    });
  }

  const priorityRank = { high: 0, medium: 1, low: 2 };
  return rows
    .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority])
    .slice(0, limit);
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

function buildFieldDataNote(experience?: LoadingExperience): {
  note?: string;
  source?: string;
} {
  if (!experience) {
    return { note: "No real-user data available for this URL." };
  }
  if (experience.origin_fallback) {
    return {
      note: "Showing origin-level data — this page does not have enough Chrome user visits for its own report.",
    };
  }
  return {
    note: "Based on Chrome User Experience Report",
    source: "real users, last 28 days",
  };
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
  const fieldData = buildFieldDataNote(data.loadingExperience);
  const opportunities = extractOpportunities(lh);
  const passedItems = extractPassedItems(lh);
  const recommendations = extractRecommendations(lh, fieldMetrics, labMetrics);

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
    fieldDataNote: fieldData.note,
    fieldDataSource: fieldData.source,
    opportunities,
    passedItems,
    recommendations,
    passedAudits: passed,
    failedAudits: failed,
  };
}
