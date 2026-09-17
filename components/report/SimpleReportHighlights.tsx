"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import type {
  SimpleReportData,
  SimpleReportRecommendation,
} from "@/lib/extract-simple-report";
import { CheckCircle2, ChevronDown, Lightbulb } from "lucide-react";
import { cn } from "@/lib/cn";

interface SimpleReportHighlightsProps {
  report: SimpleReportData;
}

function priorityBadge(priority: SimpleReportRecommendation["priority"]) {
  switch (priority) {
    case "high":
      return (
        <Badge variant="danger" className="shrink-0">
          High
        </Badge>
      );
    case "medium":
      return (
        <Badge variant="warning" className="shrink-0">
          Medium
        </Badge>
      );
    default:
      return (
        <Badge variant="default" className="shrink-0">
          Low
        </Badge>
      );
  }
}

/** Opportunities, recommendations, and passed checks — for compare layouts. */
export function SimpleReportHighlights({ report }: SimpleReportHighlightsProps) {
  const [showPassed, setShowPassed] = useState(false);

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
        <div className="mb-3 flex items-start gap-2">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Recommendations
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Current value vs the “good” target beginners should aim for.
            </p>
          </div>
        </div>

        {report.recommendations.length > 0 ? (
          <ul className="space-y-3">
            {report.recommendations.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {item.title}
                  </p>
                  {priorityBadge(item.priority)}
                </div>
                <div className="mt-2 grid gap-1 text-xs sm:grid-cols-2">
                  <p className="text-slate-500">
                    Now:{" "}
                    <span className="font-semibold text-amber-700 dark:text-amber-300">
                      {item.currentValue}
                    </span>
                  </p>
                  <p className="text-slate-500">
                    Aim for:{" "}
                    <span className="font-semibold text-teal-700 dark:text-teal-300">
                      {item.recommendedValue}
                    </span>
                  </p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.tip}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 dark:bg-emerald-950/30">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <p className="text-sm text-emerald-800 dark:text-emerald-200">
              No urgent recommendations.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Top opportunities
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Highest-impact items to fix first.
            </p>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {report.passedAudits} passed
            </span>
            {report.failedAudits > 0 && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                {report.failedAudits} to improve
              </span>
            )}
          </div>
        </div>

        {report.opportunities.length > 0 ? (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {report.opportunities.map((item, index) => (
              <li key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {item.title}
                  </p>
                  {item.displayValue && (
                    <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">
                      Now: {item.displayValue}
                    </p>
                  )}
                  {item.recommendedValue && (
                    <p className="mt-0.5 text-xs text-teal-700 dark:text-teal-300">
                      Aim for: {item.recommendedValue}
                    </p>
                  )}
                  {item.tip && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {item.tip}
                    </p>
                  )}
                </div>
                {item.savingsMs != null && item.savingsMs > 0 && (
                  <span className="shrink-0 text-xs tabular-nums text-slate-500">
                    ~{Math.round(item.savingsMs)} ms
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 dark:bg-emerald-950/30">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <p className="text-sm text-emerald-800 dark:text-emerald-200">
              No major opportunities in this test.
            </p>
          </div>
        )}

        {report.passedItems.length > 0 && (
          <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowPassed((v) => !v)}
              className="flex w-full items-center justify-between gap-2 text-start"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                Passed checks ({report.passedItems.length})
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-slate-400 transition-transform",
                  showPassed && "rotate-180"
                )}
              />
            </button>
            {showPassed && (
              <ul className="mt-3 space-y-2">
                {report.passedItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="min-w-0">
                      <span className="font-medium">{item.title}</span>
                      {item.displayValue && (
                        <span className="mt-0.5 block text-xs text-slate-500">
                          {item.displayValue}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
