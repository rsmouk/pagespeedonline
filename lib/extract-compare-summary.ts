import { formatCategoryLabel } from "@/lib/formatters";
import { LIGHTHOUSE_CATEGORIES } from "@/lib/types";
import type { PageSpeedResult } from "@/lib/types";

export interface CompareSummaryCategory {
  key: string;
  label: string;
  scoreA: number | null;
  scoreB: number | null;
}

export interface CompareSummaryCwvRow {
  label: string;
  displayA: string;
  displayB: string;
  winner: "a" | "b" | "tie";
}

export interface CompareSummaryData {
  perfScoreA: number | null;
  perfScoreB: number | null;
  categories: CompareSummaryCategory[];
  cwv: CompareSummaryCwvRow[];
}

const CWV_AUDITS: {
  id: string;
  label: string;
  fallbackId?: string;
}[] = [
  { id: "largest-contentful-paint", label: "LCP" },
  {
    id: "interaction-to-next-paint",
    label: "INP",
    fallbackId: "max-potential-fid",
  },
  { id: "cumulative-layout-shift", label: "CLS" },
  { id: "first-contentful-paint", label: "FCP" },
  { id: "total-blocking-time", label: "TBT" },
];

function getAuditValues(
  data: PageSpeedResult,
  auditId: string
): { display: string; numeric: number | null } {
  const audit = data.lighthouseResult.audits?.[auditId];
  if (!audit) return { display: "—", numeric: null };
  return {
    display: audit.displayValue?.trim() || "—",
    numeric:
      typeof audit.numericValue === "number" ? audit.numericValue : null,
  };
}

function pickWinner(
  numericA: number | null,
  numericB: number | null
): "a" | "b" | "tie" {
  if (numericA == null || numericB == null) return "tie";
  if (numericA < numericB) return "a";
  if (numericB < numericA) return "b";
  return "tie";
}

function toPct(score: number | null | undefined): number | null {
  if (score == null) return null;
  return Math.round(score * 100);
}

export function extractCompareSummary(
  dataA: PageSpeedResult,
  dataB: PageSpeedResult
): CompareSummaryData {
  const catsA = dataA.lighthouseResult.categories ?? {};
  const catsB = dataB.lighthouseResult.categories ?? {};

  const categories = LIGHTHOUSE_CATEGORIES.map((key) => ({
    key,
    label: formatCategoryLabel(key),
    scoreA: toPct(catsA[key]?.score),
    scoreB: toPct(catsB[key]?.score),
  }));

  const cwv = CWV_AUDITS.map(({ id, label, fallbackId }) => {
    let valuesA = getAuditValues(dataA, id);
    let valuesB = getAuditValues(dataB, id);
    let rowLabel = label;

    if (valuesA.display === "—" && fallbackId) {
      valuesA = getAuditValues(dataA, fallbackId);
      if (label === "INP") rowLabel = "FID";
    }
    if (valuesB.display === "—" && fallbackId) {
      valuesB = getAuditValues(dataB, fallbackId);
    }

    return {
      label: rowLabel,
      displayA: valuesA.display,
      displayB: valuesB.display,
      winner: pickWinner(valuesA.numeric, valuesB.numeric),
    };
  });

  return {
    perfScoreA: toPct(catsA.performance?.score),
    perfScoreB: toPct(catsB.performance?.score),
    categories,
    cwv,
  };
}

export function displayHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return url.replace(/^https?:\/\//i, "").split("/")[0] || url;
  }
}
