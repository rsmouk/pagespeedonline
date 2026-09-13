export function MockCharts() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Performance score ring placeholder */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Performance
        </p>
        <div className="mt-4 flex items-center justify-center">
          <div className="relative h-24 w-24">
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
                strokeDasharray="226"
                strokeDashoffset="34"
                className="text-emerald-500"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-emerald-600">
              92
            </span>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-teal-400 to-emerald-500" />
        </div>
      </div>

      {/* Bar chart placeholder */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Core Web Vitals
        </p>
        <div className="mt-4 flex h-28 items-end justify-around gap-2">
          {[65, 88, 72, 95, 58].map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-teal-600 to-teal-400 opacity-80"
                style={{ height: `${h}%` }}
              />
              <span className="text-[10px] text-slate-400">
                {["LCP", "FID", "CLS", "FCP", "TBT"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison placeholder */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Site A vs Site B
        </p>
        <div className="mt-4 space-y-3">
          {[
            { label: "Performance", a: 92, b: 78 },
            { label: "Accessibility", a: 88, b: 91 },
            { label: "SEO", a: 95, b: 82 },
          ].map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>{row.label}</span>
                <span>
                  {row.a} / {row.b}
                </span>
              </div>
              <div className="flex h-2 gap-1">
                <div
                  className="rounded-full bg-teal-500"
                  style={{ width: `${row.a}%` }}
                />
                <div
                  className="rounded-full bg-slate-300 dark:bg-slate-600"
                  style={{ width: `${row.b}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
