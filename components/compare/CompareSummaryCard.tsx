import type {
  CompareSummaryCategory,
  CompareSummaryCwvRow,
} from "@/lib/extract-compare-summary";

function scoreRingColor(score: number | null): string {
  if (score == null) return "text-slate-400";
  if (score >= 90) return "text-emerald-500";
  if (score >= 50) return "text-amber-500";
  return "text-rose-500";
}

function SummaryScoreRing({
  score,
  label,
  color,
  site,
}: {
  score: number | null;
  label: string;
  color: string;
  site: string;
}) {
  const circumference = 226;
  const pct = score ?? 0;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <p className="mb-2 truncate text-xs font-medium text-slate-500">{site}</p>
      <div className="relative h-20 w-20">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-slate-200 dark:text-slate-700"
          />
          {score != null && (
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={color}
            />
          )}
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${color}`}
        >
          {score ?? "—"}
        </span>
      </div>
      <p className="mt-2 text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </p>
    </div>
  );
}

function CategoryBar({
  label,
  scoreA,
  scoreB,
}: {
  label: string;
  scoreA: number | null;
  scoreB: number | null;
}) {
  const a = scoreA ?? 0;
  const b = scoreB ?? 0;
  const winner =
    scoreA != null && scoreB != null
      ? scoreA >= scoreB
        ? "a"
        : "b"
      : scoreA != null
        ? "a"
        : scoreB != null
          ? "b"
          : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600 dark:text-slate-300">
          {label}
        </span>
        <span className="tabular-nums text-slate-500">
          <span
            className={
              winner === "a"
                ? "font-semibold text-teal-600 dark:text-teal-400"
                : ""
            }
          >
            {scoreA ?? "—"}
          </span>
          {" · "}
          <span
            className={
              winner === "b"
                ? "font-semibold text-slate-700 dark:text-slate-200"
                : ""
            }
          >
            {scoreB ?? "—"}
          </span>
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400"
            style={{ width: `${a}%` }}
          />
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-slate-400 to-slate-500 dark:from-slate-500 dark:to-slate-400"
            style={{ width: `${b}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export interface CompareSummaryCardProps {
  siteLabelA: string;
  siteLabelB: string;
  subtitleA: string;
  subtitleB: string;
  analysisDate?: string;
  winnerLabelA: string;
  winnerLabelB: string;
  perfScoreA: number | null;
  perfScoreB: number | null;
  categories: CompareSummaryCategory[];
  cwv: CompareSummaryCwvRow[];
}

export function CompareSummaryCard({
  siteLabelA,
  siteLabelB,
  subtitleA,
  subtitleB,
  analysisDate,
  winnerLabelA,
  winnerLabelB,
  perfScoreA,
  perfScoreB,
  categories,
  cwv,
}: CompareSummaryCardProps) {
  const perfDelta =
    perfScoreA != null && perfScoreB != null
      ? perfScoreA - perfScoreB
      : null;

  let perfWinnerText: string | null = null;
  if (perfDelta != null && perfDelta !== 0) {
    perfWinnerText =
      perfDelta > 0
        ? `${winnerLabelA} wins by +${perfDelta} points`
        : `${winnerLabelB} wins by +${Math.abs(perfDelta)} points`;
  } else if (perfDelta === 0 && perfScoreA != null) {
    perfWinnerText = "Performance scores are tied";
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="grid border-b border-slate-200 lg:grid-cols-2 dark:border-slate-800">
        <div className="border-b border-slate-100 bg-teal-50/50 px-5 py-4 lg:border-b-0 lg:border-e dark:border-slate-800 dark:bg-teal-950/20">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-xs font-bold text-white">
              A
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                {siteLabelA}
              </p>
              <p className="text-xs text-slate-500">{subtitleA}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50/80 px-5 py-4 dark:bg-slate-800/30">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-600 text-xs font-bold text-white dark:bg-slate-500 dark:text-slate-900">
              B
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                {siteLabelB}
              </p>
              <p className="text-xs text-slate-500">{subtitleB}</p>
            </div>
          </div>
        </div>
      </div>

      {analysisDate && (
        <div className="border-b border-slate-200 px-5 py-2 text-center text-xs text-slate-500 dark:border-slate-800">
          Analyzed {analysisDate}
        </div>
      )}

      <div className="grid gap-0 lg:grid-cols-2">
        <div className="border-b border-slate-100 p-6 lg:border-b-0 lg:border-e dark:border-slate-800">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Performance Score
          </p>
          <div className="flex items-center justify-around gap-4">
            <SummaryScoreRing
              site={siteLabelA}
              score={perfScoreA}
              label="Performance"
              color={scoreRingColor(perfScoreA)}
            />
            <span className="text-lg font-bold text-slate-300 dark:text-slate-600">
              VS
            </span>
            <SummaryScoreRing
              site={siteLabelB}
              score={perfScoreB}
              label="Performance"
              color={scoreRingColor(perfScoreB)}
            />
          </div>
          {perfWinnerText && (
            <p className="mt-4 text-center text-xs text-teal-600 dark:text-teal-400">
              {perfWinnerText}
            </p>
          )}
        </div>

        <div className="border-b border-slate-100 p-6 dark:border-slate-800 lg:border-b-0">
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              All Categories
            </p>
            <div className="flex shrink-0 gap-3 text-[10px] text-slate-400">
              <span className="flex max-w-[7rem] items-center gap-1 truncate">
                <span className="h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                <span className="truncate">{siteLabelA}</span>
              </span>
              <span className="flex max-w-[7rem] items-center gap-1 truncate">
                <span className="h-2 w-2 shrink-0 rounded-full bg-slate-400" />
                <span className="truncate">{siteLabelB}</span>
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {categories.map((cat) => (
              <CategoryBar
                key={cat.key}
                label={cat.label}
                scoreA={cat.scoreA}
                scoreB={cat.scoreB}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 p-6 dark:border-slate-800">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Core Web Vitals — Side by Side
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 dark:border-slate-800">
                <th className="pb-2 text-start font-medium">Metric</th>
                <th className="pb-2 text-end font-medium text-teal-600 dark:text-teal-400">
                  {siteLabelA}
                </th>
                <th className="pb-2 text-end font-medium">{siteLabelB}</th>
                <th className="pb-2 text-end font-medium">Winner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/80">
              {cwv.map((row) => (
                <tr key={row.label}>
                  <td className="py-2.5 font-medium text-slate-700 dark:text-slate-200">
                    {row.label}
                  </td>
                  <td
                    className={`py-2.5 text-end tabular-nums ${
                      row.winner === "a"
                        ? "font-semibold text-teal-600 dark:text-teal-400"
                        : "text-slate-500"
                    }`}
                  >
                    {row.displayA}
                  </td>
                  <td
                    className={`py-2.5 text-end tabular-nums ${
                      row.winner === "b"
                        ? "font-semibold text-slate-700 dark:text-slate-200"
                        : "text-slate-500"
                    }`}
                  >
                    {row.displayB}
                  </td>
                  <td className="py-2.5 text-end">
                    {row.winner === "tie" ? (
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        —
                      </span>
                    ) : (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          row.winner === "a"
                            ? "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {row.winner === "a" ? "A" : "B"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
