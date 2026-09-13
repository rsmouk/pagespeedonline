import { KeyValueGrid } from "@/components/ui/KeyValueGrid";
import type { LighthouseResult } from "@/lib/types";
import { formatDate } from "@/lib/formatters";

interface LighthouseMetaSectionProps {
  lighthouse: LighthouseResult;
}

export function LighthouseMetaSection({ lighthouse }: LighthouseMetaSectionProps) {
  const topLevel = {
    requestedUrl: lighthouse.requestedUrl,
    finalUrl: lighthouse.finalUrl,
    mainDocumentUrl: lighthouse.mainDocumentUrl,
    finalDisplayedUrl: lighthouse.finalDisplayedUrl,
    lighthouseVersion: lighthouse.lighthouseVersion,
    userAgent: lighthouse.userAgent,
    fetchTime: formatDate(lighthouse.fetchTime),
  };

  return (
    <div className="space-y-4">
      <KeyValueGrid data={topLevel as Record<string, unknown>} />

      {lighthouse.environment && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Environment
          </h4>
          <KeyValueGrid data={lighthouse.environment} />
        </div>
      )}

      {lighthouse.configSettings && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Config Settings
          </h4>
          <KeyValueGrid data={lighthouse.configSettings} />
        </div>
      )}

      {lighthouse.runWarnings && lighthouse.runWarnings.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Run Warnings
          </h4>
          <ul className="list-disc space-y-1 pl-5 text-sm text-amber-700 dark:text-amber-300">
            {lighthouse.runWarnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {lighthouse.timing && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Timing
          </h4>
          <KeyValueGrid data={lighthouse.timing} />
        </div>
      )}

      {lighthouse.i18n && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            i18n
          </h4>
          <pre className="max-h-48 overflow-auto rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-950">
            {JSON.stringify(lighthouse.i18n, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
