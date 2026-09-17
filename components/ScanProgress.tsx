import type { ScanState } from "@/lib/types";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface ScanProgressProps {
  scans: ScanState[];
}

function statusLabel(status: ScanState["status"]): string {
  switch (status) {
    case "loading":
      return "Scanning…";
    case "done":
      return "Complete";
    case "error":
      return "Failed";
    default:
      return "Waiting…";
  }
}

export function ScanProgress({ scans }: ScanProgressProps) {
  if (!scans.length) return null;

  return (
    <div className="no-print rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center gap-2">
        {scans.some((s) => s.status === "loading") ? (
          <Loader2 className="h-4 w-4 animate-spin text-teal-600 dark:text-teal-400" />
        ) : null}
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Scan progress
        </p>
      </div>
      <ul className="space-y-2">
        {scans.map((scan) => (
          <li
            key={scan.key}
            className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-800/50"
          >
            {scan.status === "loading" && (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-teal-600 dark:text-teal-400" />
            )}
            {scan.status === "done" && (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            )}
            {scan.status === "error" && (
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            {scan.status === "idle" && (
              <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                {scan.label}
              </p>
              <p
                className={
                  scan.status === "loading"
                    ? "text-xs text-teal-600 dark:text-teal-400"
                    : scan.status === "error"
                      ? "text-xs text-rose-600 dark:text-rose-400"
                      : scan.status === "done"
                        ? "text-xs text-emerald-600 dark:text-emerald-400"
                        : "text-xs text-slate-500 dark:text-slate-400"
                }
              >
                {statusLabel(scan.status)}
                {scan.status === "error" && scan.error
                  ? ` — ${
                      scan.error.length > 80
                        ? `${scan.error.slice(0, 80)}…`
                        : scan.error
                    }`
                  : ""}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
