function ScoreRing({
  score,
  label,
  color,
  site,
}: {
  score: number;
  label: string;
  color: string;
  site: string;
}) {
  const circumference = 226;
  const offset = circumference - (score / 100) * circumference;

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
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${color}`}
        >
          {score}
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
  scoreA: number;
  scoreB: number;
}) {
  const winner = scoreA >= scoreB ? "a" : "b";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600 dark:text-slate-300">
          {label}
        </span>
        <span className="tabular-nums text-slate-500">
          <span className={winner === "a" ? "font-semibold text-teal-600 dark:text-teal-400" : ""}>
            {scoreA}
          </span>
          {" · "}
          <span className={winner === "b" ? "font-semibold text-slate-700 dark:text-slate-200" : ""}>
            {scoreB}
          </span>
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400"
            style={{ width: `${scoreA}%` }}
          />
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-slate-400 to-slate-500 dark:from-slate-500 dark:to-slate-400"
            style={{ width: `${scoreB}%` }}
          />
        </div>
      </div>
    </div>
  );
}

const SITE_A = "shopfast.io";
const SITE_B = "megastore.com";

const CATEGORIES = [
  { label: "Performance", a: 94, b: 71 },
  { label: "Accessibility", a: 89, b: 92 },
  { label: "Best Practices", a: 96, b: 83 },
  { label: "SEO", a: 98, b: 88 },
];

const CWV = [
  { label: "LCP", a: 1.8, b: 3.4, unit: "s", good: 2.5 },
  { label: "INP", a: 120, b: 280, unit: "ms", good: 200 },
  { label: "CLS", a: 0.04, b: 0.18, unit: "", good: 0.1 },
  { label: "FCP", a: 1.2, b: 2.1, unit: "s", good: 1.8 },
  { label: "TBT", a: 90, b: 340, unit: "ms", good: 200 },
];

export function MockCharts() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
      {/* Site headers */}
      <div className="grid border-b border-slate-200 lg:grid-cols-2 dark:border-slate-800">
        <div className="border-b border-slate-100 bg-teal-50/50 px-5 py-4 lg:border-b-0 lg:border-e dark:border-slate-800 dark:bg-teal-950/20">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-xs font-bold text-white">
              A
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {SITE_A}
              </p>
              <p className="text-xs text-slate-500">Mobile · Demo</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50/80 px-5 py-4 dark:bg-slate-800/30">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-600 text-xs font-bold text-white dark:bg-slate-500 dark:text-slate-900">
              B
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {SITE_B}
              </p>
              <p className="text-xs text-slate-500">Mobile · Demo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        {/* Performance rings */}
        <div className="border-b border-slate-100 p-6 lg:border-b-0 lg:border-e dark:border-slate-800">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Performance Score
          </p>
          <div className="flex items-center justify-around gap-4">
            <ScoreRing
              site={SITE_A}
              score={94}
              label="Performance"
              color="text-emerald-500"
            />
            <span className="text-lg font-bold text-slate-300 dark:text-slate-600">
              VS
            </span>
            <ScoreRing
              site={SITE_B}
              score={71}
              label="Performance"
              color="text-amber-500"
            />
          </div>
          <p className="mt-4 text-center text-xs text-teal-600 dark:text-teal-400">
            Site A wins by +23 points
          </p>
        </div>

        {/* Category comparison */}
        <div className="border-b border-slate-100 p-6 dark:border-slate-800 lg:border-b-0">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              All Categories
            </p>
            <div className="flex gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-teal-500" /> {SITE_A}
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-slate-400" /> {SITE_B}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {CATEGORIES.map((cat) => (
              <CategoryBar
                key={cat.label}
                label={cat.label}
                scoreA={cat.a}
                scoreB={cat.b}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Core Web Vitals */}
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
                  {SITE_A}
                </th>
                <th className="pb-2 text-end font-medium">{SITE_B}</th>
                <th className="pb-2 text-end font-medium">Winner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/80">
              {CWV.map((row) => {
                const aWins =
                  row.label === "CLS"
                    ? row.a < row.b
                    : row.a < row.b;
                const displayA = `${row.a}${row.unit}`;
                const displayB = `${row.b}${row.unit}`;

                return (
                  <tr key={row.label}>
                    <td className="py-2.5 font-medium text-slate-700 dark:text-slate-200">
                      {row.label}
                    </td>
                    <td
                      className={`py-2.5 text-end tabular-nums ${aWins ? "font-semibold text-teal-600 dark:text-teal-400" : "text-slate-500"}`}
                    >
                      {displayA}
                    </td>
                    <td
                      className={`py-2.5 text-end tabular-nums ${!aWins ? "font-semibold text-slate-700 dark:text-slate-200" : "text-slate-500"}`}
                    >
                      {displayB}
                    </td>
                    <td className="py-2.5 text-end">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          aWins
                            ? "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {aWins ? "A" : "B"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
