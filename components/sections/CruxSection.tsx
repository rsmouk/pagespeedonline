import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { KeyValueGrid } from "@/components/ui/KeyValueGrid";
import type { LoadingExperience } from "@/lib/types";
import { formatCruxMetricName } from "@/lib/formatters";

interface CruxSectionProps {
  experience?: LoadingExperience;
  title: string;
}

export function CruxSection({ experience, title }: CruxSectionProps) {
  if (!experience) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No {title} data available for this URL.
      </p>
    );
  }

  const meta = {
    id: experience.id,
    initial_url: experience.initial_url,
    overall_category: experience.overall_category,
    origin_fallback: experience.origin_fallback,
  };

  const metrics = experience.metrics ?? {};

  return (
    <div className="space-y-4">
      <KeyValueGrid data={meta as Record<string, unknown>} />

      {Object.entries(experience).filter(
        ([k]) => !["id", "initial_url", "overall_category", "origin_fallback", "metrics"].includes(k)
      ).length > 0 && (
        <KeyValueGrid
          data={Object.fromEntries(
            Object.entries(experience).filter(
              ([k]) =>
                !["id", "initial_url", "overall_category", "origin_fallback", "metrics"].includes(k)
            )
          ) as Record<string, unknown>}
        />
      )}

      {Object.entries(metrics).map(([metricKey, metric]) => (
        <div
          key={metricKey}
          className="rounded-lg border border-slate-100 p-3 dark:border-slate-800"
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {formatCruxMetricName(metricKey)}
            </h4>
            {metric.category && (
              <Badge
                variant={
                  metric.category === "FAST"
                    ? "success"
                    : metric.category === "AVERAGE"
                      ? "warning"
                      : "danger"
                }
              >
                {metric.category}
              </Badge>
            )}
            {metric.percentile != null && (
              <span className="text-xs text-slate-500">
                P75: {metric.percentile}
              </span>
            )}
          </div>

          {metric.distributions && metric.distributions.length > 0 && (
            <DataTable
              columns={[
                { key: "min", label: "Min" },
                { key: "max", label: "Max" },
                { key: "proportion", label: "Proportion" },
              ]}
              rows={metric.distributions.map((d) => ({
                min: d.min ?? "—",
                max: d.max ?? "—",
                proportion: `${(d.proportion * 100).toFixed(1)}%`,
              }))}
            />
          )}

          {Object.entries(metric).filter(
            ([k]) => !["percentile", "category", "distributions"].includes(k)
          ).length > 0 && (
            <div className="mt-2">
              <KeyValueGrid
                data={Object.fromEntries(
                  Object.entries(metric).filter(
                    ([k]) => !["percentile", "category", "distributions"].includes(k)
                  )
                ) as Record<string, unknown>}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
