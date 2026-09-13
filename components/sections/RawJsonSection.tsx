import type { PageSpeedResult } from "@/lib/types";

interface RawJsonSectionProps {
  data: PageSpeedResult;
}

export function RawJsonSection({ data }: RawJsonSectionProps) {
  return (
    <pre className="max-h-[600px] overflow-auto rounded-lg bg-slate-50 p-4 text-xs leading-relaxed text-slate-700 dark:bg-slate-950 dark:text-slate-300">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
