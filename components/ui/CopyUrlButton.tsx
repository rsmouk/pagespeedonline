"use client";

import { useCallback, useState } from "react";
import { Check, Link2 } from "lucide-react";
import { cn } from "@/lib/cn";

interface CopyUrlButtonProps {
  getUrl?: () => string;
  label?: string;
  className?: string;
  alwaysShowLabel?: boolean;
  /** Icon above label on mobile */
  stacked?: boolean;
}

export function CopyUrlButton({
  getUrl,
  label = "Copy link",
  className,
  alwaysShowLabel = false,
  stacked = false,
}: CopyUrlButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const url = getUrl?.() ?? window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const input = document.createElement("textarea");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }, [getUrl]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={label}
      aria-label={label}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 sm:px-3 sm:py-2 sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-teal-700 dark:hover:bg-teal-950/40 dark:hover:text-teal-300",
        stacked &&
          "flex-col gap-1 py-2 text-[10px] leading-tight sm:flex-row sm:gap-1.5 sm:py-1.5 sm:text-sm sm:leading-normal",
        className
      )}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      ) : (
        <Link2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      )}
      <span
        className={
          alwaysShowLabel ? "inline" : "hidden min-[400px]:inline"
        }
      >
        {copied ? "Copied!" : label}
      </span>
      {!alwaysShowLabel && (
        <span className="min-[400px]:hidden">{copied ? "✓" : "Link"}</span>
      )}
    </button>
  );
}
