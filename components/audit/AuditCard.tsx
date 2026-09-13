import { DetailsRenderer } from "@/components/audit/DetailsRenderer";
import { Badge } from "@/components/ui/Badge";
import type { Audit } from "@/lib/types";
import { formatScore, scoreBgClass, scoreColorClass } from "@/lib/formatters";
import { cn } from "@/lib/cn";

interface AuditCardProps {
  audit: Audit;
}

export function AuditCard({ audit }: AuditCardProps) {
  const extraFields = Object.entries(audit).filter(
    ([key]) =>
      ![
        "id",
        "title",
        "description",
        "score",
        "scoreDisplayMode",
        "displayValue",
        "numericValue",
        "numericUnit",
        "metricSavings",
        "warnings",
        "explanation",
        "details",
      ].includes(key)
  );

  return (
    <div
      className={cn(
        "rounded-lg border p-4 print-break",
        scoreBgClass(audit.score)
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-slate-800 dark:text-slate-100">
            {audit.title}
          </h4>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {audit.id}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {audit.scoreDisplayMode && (
            <Badge variant="muted">{audit.scoreDisplayMode}</Badge>
          )}
          <span className={cn("text-lg font-bold", scoreColorClass(audit.score))}>
            {formatScore(audit.score)}
          </span>
        </div>
      </div>

      {audit.description && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {audit.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-3 text-sm">
        {audit.displayValue && (
          <span className="text-slate-700 dark:text-slate-200">
            <strong>Value:</strong> {audit.displayValue}
          </span>
        )}
        {audit.numericValue != null && (
          <span className="text-slate-700 dark:text-slate-200">
            <strong>Numeric:</strong> {audit.numericValue}
            {audit.numericUnit ? ` ${audit.numericUnit}` : ""}
          </span>
        )}
      </div>

      {audit.metricSavings && (
        <div className="mt-2">
          <p className="text-xs font-medium text-slate-500">Metric Savings</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {Object.entries(audit.metricSavings).map(([k, v]) => (
              <Badge key={k} variant="muted">
                {k}: {v}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {audit.warnings && audit.warnings.length > 0 && (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-700 dark:text-amber-300">
          {audit.warnings.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      )}

      {audit.explanation && (
        <p className="mt-2 text-sm italic text-slate-600 dark:text-slate-300">
          {audit.explanation}
        </p>
      )}

      {audit.details && (
        <div className="mt-4 border-t border-slate-200/60 pt-4 dark:border-slate-700/60">
          <DetailsRenderer details={audit.details} />
        </div>
      )}

      {extraFields.length > 0 && (
        <div className="mt-4 border-t border-slate-200/60 pt-4 dark:border-slate-700/60">
          <p className="mb-2 text-xs font-semibold text-slate-500">
            Additional fields
          </p>
          <dl className="space-y-1 text-sm">
            {extraFields.map(([key, value]) => (
              <div key={key}>
                <dt className="inline font-medium text-slate-600 dark:text-slate-400">
                  {key}:
                </dt>{" "}
                <dd className="inline break-all text-slate-800 dark:text-slate-200">
                  {typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
