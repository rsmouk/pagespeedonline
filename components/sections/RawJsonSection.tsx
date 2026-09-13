import type { PageSpeedResult } from "@/lib/types";

interface RawJsonSectionProps {
  data: PageSpeedResult;
}

export function RawJsonSection({ data }: RawJsonSectionProps) {
  const json = JSON.stringify(data, null, 2);
  const truncated = json.length > 120_000;
  const display = truncated ? `${json.slice(0, 120_000)}\n\n… [truncated for browser performance]` : json;

  return (
    <div className="space-y-2">
      {truncated && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          Large payload trimmed in view. Use Copy JSON for the full section export.
        </p>
      )}
      <pre className="max-h-[600px] overflow-auto rounded-lg bg-slate-50 p-4 text-xs leading-relaxed text-slate-700 dark:bg-slate-950 dark:text-slate-300">
        {display}
      </pre>
    </div>
  );
}
