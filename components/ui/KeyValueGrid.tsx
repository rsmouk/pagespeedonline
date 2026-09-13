import { formatValue } from "@/lib/formatters";

interface KeyValueGridProps {
  data: Record<string, unknown>;
  exclude?: string[];
}

export function KeyValueGrid({ data, exclude = [] }: KeyValueGridProps) {
  const entries = Object.entries(data).filter(([k]) => !exclude.includes(k));

  if (!entries.length) {
    return <p className="text-sm text-slate-500">No data</p>;
  }

  return (
    <dl className="grid gap-2 sm:grid-cols-2">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/30"
        >
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {key}
          </dt>
          <dd className="mt-1 break-all text-sm text-slate-800 dark:text-slate-100">
            {typeof value === "object" && value !== null
              ? JSON.stringify(value, null, 2)
              : formatValue(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
