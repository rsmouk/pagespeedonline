import type { ScanState } from "@/lib/types";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface ScanProgressProps {
  scans: ScanState[];
}

export function ScanProgress({ scans }: ScanProgressProps) {
  if (!scans.length) return null;

  return (
    <div className="no-print rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">
        Scan progress
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {scans.map((scan) => (
          <div
            key={scan.key}
            className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/50"
          >
            {scan.status === "loading" && (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-teal-600" />
            )}
            {scan.status === "done" && (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            )}
            {scan.status === "error" && (
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            )}
            {scan.status === "idle" && (
              <span className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-300" />
            )}
            <span className="truncate text-slate-700 dark:text-slate-200">
              {scan.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
