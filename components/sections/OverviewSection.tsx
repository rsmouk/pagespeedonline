import { ScoreRing } from "@/components/ui/ScoreRing";
import { KeyValueGrid } from "@/components/ui/KeyValueGrid";
import type { PageSpeedResult } from "@/lib/types";
import { formatCategoryLabel, formatDate, scoreDelta } from "@/lib/formatters";

interface OverviewSectionProps {
  data: PageSpeedResult;
  compareData?: PageSpeedResult;
}

export function OverviewSection({ data, compareData }: OverviewSectionProps) {
  const categories = data.lighthouseResult.categories ?? {};

  return (
    <div className="space-y-4">
      <KeyValueGrid
        data={{
          captchaResult: data.captchaResult,
          kind: data.kind,
          id: data.id,
          analysisUTCTimestamp: formatDate(data.analysisUTCTimestamp),
        }}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Object.entries(categories).map(([key, cat]) => {
          const otherScore = compareData?.lighthouseResult.categories?.[key]?.score;
          const delta = scoreDelta(cat.score, otherScore);
          return (
            <ScoreRing
              key={key}
              score={cat.score}
              label={formatCategoryLabel(key)}
              delta={delta}
            />
          );
        })}
      </div>
    </div>
  );
}
