import { ExternalLink } from "lucide-react";

export function GoogleAttribution({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "text-xs text-slate-500 dark:text-slate-400"
          : "rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
      }
    >
      <p className={compact ? "" : "text-sm text-slate-600 dark:text-slate-300"}>
        Powered by{" "}
        <a
          href="https://developers.google.com/web/tools/lighthouse"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-teal-600 hover:underline dark:text-teal-400"
        >
          Google Lighthouse
          <ExternalLink className="h-3 w-3" />
        </a>{" "}
        via the{" "}
        <a
          href="https://developers.google.com/speed/docs/insights/v5/get-started"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-teal-600 hover:underline dark:text-teal-400"
        >
          PageSpeed Insights API
          <ExternalLink className="h-3 w-3" />
        </a>
        . Lighthouse is an open-source tool from Google for auditing web page
        quality.
      </p>
    </div>
  );
}
