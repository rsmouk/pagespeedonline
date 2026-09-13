import { CompareSummaryCard } from "@/components/compare/CompareSummaryCard";
import type { CompareSummaryCategory, CompareSummaryCwvRow } from "@/lib/extract-compare-summary";

const SITE_A = "shopfast.io";
const SITE_B = "megastore.com";

const CATEGORIES: CompareSummaryCategory[] = [
  { key: "performance", label: "Performance", scoreA: 94, scoreB: 71 },
  { key: "accessibility", label: "Accessibility", scoreA: 89, scoreB: 92 },
  { key: "best-practices", label: "Best Practices", scoreA: 96, scoreB: 83 },
  { key: "seo", label: "SEO", scoreA: 98, scoreB: 88 },
];

const CWV: CompareSummaryCwvRow[] = [
  { label: "LCP", displayA: "1.8s", displayB: "3.4s", winner: "a" },
  { label: "INP", displayA: "120ms", displayB: "280ms", winner: "a" },
  { label: "CLS", displayA: "0.04", displayB: "0.18", winner: "a" },
  { label: "FCP", displayA: "1.2s", displayB: "2.1s", winner: "a" },
  { label: "TBT", displayA: "90ms", displayB: "340ms", winner: "a" },
];

export function MockCharts() {
  return (
    <CompareSummaryCard
      siteLabelA={SITE_A}
      siteLabelB={SITE_B}
      subtitleA="Mobile · Demo"
      subtitleB="Mobile · Demo"
      winnerLabelA="Site A"
      winnerLabelB="Site B"
      perfScoreA={94}
      perfScoreB={71}
      categories={CATEGORIES}
      cwv={CWV}
    />
  );
}
