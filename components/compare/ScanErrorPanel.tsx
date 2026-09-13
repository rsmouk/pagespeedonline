import { AlertCircle, RefreshCw } from "lucide-react";
import type { ScanErrorKind } from "@/lib/types";

interface ScanErrorPanelProps {
  label: string;
  message?: string;
  errorKind?: ScanErrorKind;
  onRetry?: () => void;
  retrying?: boolean;
}

export function ScanErrorPanel({
  label,
  message,
  errorKind,
  onRetry,
  retrying = false,
}: ScanErrorPanelProps) {
  const isQuota = errorKind === "quota";

  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/30">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-rose-800 dark:text-rose-200">
            {label} — scan failed
          </p>
          <p className="mt-1 text-sm text-rose-700 dark:text-rose-300">
            {message ?? "Unable to complete the scan."}
          </p>
          {!isQuota && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              disabled={retrying}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-50 dark:bg-rose-500 dark:text-rose-950 dark:hover:bg-rose-400"
            >
              <RefreshCw
                className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`}
              />
              {retrying ? "Retrying…" : "Retry scan"}
            </button>
          )}
          {isQuota && (
            <p className="mt-2 text-xs text-rose-600/80 dark:text-rose-400/80">
              Upload a JSON report from PageSpeed Insights if you need results
              today.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
