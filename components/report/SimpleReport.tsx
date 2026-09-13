"use client";

import { ScoreRing } from "@/components/ui/ScoreRing";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/formatters";
import type { SimpleReportData, MetricStatus } from "@/lib/extract-simple-report";
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, Smartphone, Monitor } from "lucide-react";
import { cn } from "@/lib/cn";

interface SimpleReportProps {
  report: SimpleReportData;
}

function statusLabel(status: MetricStatus): string {
  switch (status) {
    case "good":
      return "Good";
    case "needs-improvement":
      return "Needs work";
    case "poor":
      return "Poor";
    default:
      return "No data";
  }
}

function statusBadgeVariant(status: MetricStatus): "success" | "warning" | "danger" | "default" {
  switch (status) {
    case "good":
      return "success";
    case "needs-improvement":
      return "warning";
    case "poor":
      return "danger";
    default:
      return "default";
  }
}

function StatusIcon({ status }: { status: MetricStatus }) {
  switch (status) {
    case "good":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case "needs-improvement":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case "poor":
      return <XCircle className="h-4 w-4 text-rose-500" />;
    default:
      return <HelpCircle className="h-4 w-4 text-slate-400" />;
  }
}

function MetricCard({
  label,
  description,
  value,
  status,
}: {
  label: string;
  description: string;
  value: string;
  status: MetricStatus;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        status === "good" && "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/20",
        status === "needs-improvement" && "border-amber-200 bg-amber-50/60 dark:border-amber-900 dark:bg-amber-950/20",
        status === "poor" && "border-rose-200 bg-rose-50/60 dark:border-rose-900 dark:bg-rose-950/20",
        status === "unknown" && "border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40"
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <StatusIcon status={status} />
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</span>
        </div>
        <Badge variant={statusBadgeVariant(status)}>{statusLabel(status)}</Badge>
      </div>
      <p className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}

function CoreWebVitalsBanner({ passed }: { passed: boolean | null }) {
  if (passed === null) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50">
        <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Core Web Vitals assessment unavailable
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Not enough real-user data to evaluate LCP, INP, and CLS for this page.
          </p>
        </div>
      </div>
    );
  }

  if (passed) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950/30">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div>
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
            Passed Core Web Vitals assessment
          </p>
          <p className="mt-0.5 text-xs text-emerald-700/80 dark:text-emerald-300/80">
            Real users experience good loading, interactivity, and visual stability.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950/30">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
      <div>
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
          Core Web Vitals need improvement
        </p>
        <p className="mt-0.5 text-xs text-amber-700/80 dark:text-amber-300/80">
          One or more metrics are rated poor or need work for real users.
        </p>
      </div>
    </div>
  );
}

export function SimpleReport({ report }: SimpleReportProps) {
  const StrategyIcon = report.strategy === "mobile" ? Smartphone : Monitor;
  const strategyLabel = report.strategy === "mobile" ? "Mobile" : "Desktop";
  const scannedCategoryCount = report.categories.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              PageSpeed Report
            </p>
            <p className="mt-1 break-all text-base font-semibold text-slate-900 dark:text-slate-100">
              {report.url}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <StrategyIcon className="h-3.5 w-3.5" />
                {strategyLabel}
              </span>
              <span>·</span>
              <span>Analyzed {formatDate(report.analyzedAt)}</span>
              {report.lighthouseVersion && (
                <>
                  <span>·</span>
                  <span>Lighthouse {report.lighthouseVersion}</span>
                </>
              )}
            </div>
          </div>

          {report.performanceScore != null && (
            <div className="shrink-0">
              <ScoreRing
                score={report.performanceScore / 100}
                label="Performance"
                size="lg"
              />
            </div>
          )}
        </div>

        {scannedCategoryCount > 1 && (
          <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              All categories
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {report.categories.map((cat) => (
                <ScoreRing
                  key={cat.key}
                  score={cat.score != null ? cat.score / 100 : null}
                  label={cat.label}
                  size="sm"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Field data — Core Web Vitals */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Discover what your real users experience
          </h2>
          {report.fieldDataNote && (
            <p
              className="mt-1 text-xs text-slate-500 dark:text-slate-400"
              spellCheck={false}
            >
              {report.fieldDataNote}
              {report.fieldDataSource && (
                <>
                  {" "}
                  <span className="text-slate-500 dark:text-slate-400">
                    ({report.fieldDataSource})
                  </span>
                  .
                </>
              )}
            </p>
          )}
        </div>

        <CoreWebVitalsBanner passed={report.coreWebVitalsPassed} />

        {report.fieldMetrics.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {report.fieldMetrics.map((metric) => (
              <MetricCard
                key={metric.id}
                label={metric.label}
                description={metric.description}
                value={metric.value}
                status={metric.status}
              />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            No field data available. Lab results below show a simulated test only.
          </p>
        )}
      </section>

      {/* Lab data */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Lab data — simulated page load
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Single test from Lighthouse on {strategyLabel.toLowerCase()}. Useful for debugging, but may differ from real users.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {report.labMetrics.map((metric) => (
            <MetricCard
              key={metric.id}
              label={metric.label}
              description={metric.description}
              value={metric.value}
              status={metric.status}
            />
          ))}
        </div>
      </section>

      {/* Opportunities */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Top opportunities
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Fix these first for the biggest performance gains.
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
                      {item.displayValue}
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
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 dark:bg-emerald-950/30">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <p className="text-sm text-emerald-800 dark:text-emerald-200">
              No major issues found — performance looks good in this test.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
