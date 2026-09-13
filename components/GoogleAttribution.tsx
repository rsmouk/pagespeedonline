import { ExternalLink } from "lucide-react";

export function GoogleAttribution({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "text-center text-xs text-slate-500 dark:text-slate-400"
          : "text-center text-xs text-slate-500 dark:text-slate-400"
      }
    >
      <p>
        Powered by{" "}
        <a
          href="https://developers.google.com/web/tools/lighthouse"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-teal-600 hover:underline dark:text-teal-400"
        >
          Google Lighthouse
          <ExternalLink className="h-3 w-3" />
        </a>
      </p>
    </div>
  );
}
