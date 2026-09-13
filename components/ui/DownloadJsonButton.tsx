"use client";

import { Download } from "lucide-react";
import { cn } from "@/lib/cn";
import { downloadJsonFile } from "@/lib/download-json";

interface DownloadJsonButtonProps {
  getPayload: () => string;
  filename: string;
  label?: string;
  className?: string;
  alwaysShowLabel?: boolean;
}

export function DownloadJsonButton({
  getPayload,
  filename,
  label = "Download JSON",
  className,
  alwaysShowLabel = false,
}: DownloadJsonButtonProps) {
  const handleDownload = () => {
    downloadJsonFile(getPayload(), filename);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      title={label}
      aria-label={label}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 sm:px-3 sm:py-2 sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-teal-700 dark:hover:bg-teal-950/40 dark:hover:text-teal-300",
        className
      )}
    >
      <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      <span className={alwaysShowLabel ? "inline" : "hidden min-[400px]:inline"}>
        {label}
      </span>
      {!alwaysShowLabel && <span className="min-[400px]:hidden">JSON</span>}
    </button>
  );
}
