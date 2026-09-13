"use client";

import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import type { ExtractedScreenshot } from "@/lib/extract-screenshot";

interface ScreenshotColumnProps {
  badge: "A" | "B";
  siteLabel: string;
  subtitle: string;
  screenshot: ExtractedScreenshot;
  expanded: boolean;
  onToggleExpand: () => void;
  variant: "teal" | "slate";
}

function ScreenshotColumn({
  badge,
  siteLabel,
  subtitle,
  screenshot,
  expanded,
  onToggleExpand,
  variant,
}: ScreenshotColumnProps) {
  const badgeClass =
    variant === "teal"
      ? "bg-teal-600 text-white"
      : "bg-slate-600 text-white dark:bg-slate-500 dark:text-slate-900";

  const headerClass =
    variant === "teal"
      ? "border-b border-slate-100 bg-teal-50/50 dark:border-slate-800 dark:bg-teal-950/20"
      : "border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/30";

  return (
    <div className="flex min-w-0 flex-col">
      <div className={`px-5 py-4 ${headerClass}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${badgeClass}`}
            >
              {badge}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                {siteLabel}
              </p>
              <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
          </div>
          {screenshot.src && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-600 transition hover:bg-white dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              {expanded ? (
                <>
                  <Minimize2 className="h-3 w-3" />
                  Collapse
                </>
              ) : (
                <>
                  <Maximize2 className="h-3 w-3" />
                  Expand
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {screenshot.stripped && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Screenshot omitted to keep the browser responsive. Open the{" "}
            <strong>Full Page Screenshot</strong> section below for metadata.
          </p>
        )}

        {!screenshot.stripped && !screenshot.src && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No screenshot available for this run.
          </p>
        )}

        {screenshot.src && (
          <div
            className={
              expanded
                ? "overflow-auto"
                : "max-h-80 overflow-auto sm:max-h-96"
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={screenshot.src}
              alt={`${siteLabel} screenshot`}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700"
            />
          </div>
        )}

        {screenshot.src && screenshot.width != null && screenshot.height != null && (
          <p className="mt-2 text-xs text-slate-500">
            {screenshot.width} × {screenshot.height}px
            {screenshot.source === "final" ? " · viewport capture" : " · full page"}
          </p>
        )}
      </div>
    </div>
  );
}

export interface CompareScreenshotsSectionProps {
  siteLabelA: string;
  siteLabelB: string;
  subtitleA: string;
  subtitleB: string;
  screenshotA: ExtractedScreenshot;
  screenshotB: ExtractedScreenshot;
}

export function CompareScreenshotsSection({
  siteLabelA,
  siteLabelB,
  subtitleA,
  subtitleB,
  screenshotA,
  screenshotB,
}: CompareScreenshotsSectionProps) {
  const [expandedA, setExpandedA] = useState(false);
  const [expandedB, setExpandedB] = useState(false);

  const hasAnyScreenshot =
    screenshotA.src ||
    screenshotB.src ||
    screenshotA.stripped ||
    screenshotB.stripped;

  if (!hasAnyScreenshot) return null;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Page Screenshots — Side by Side
        </p>
      </div>

      <div className="grid lg:grid-cols-2">
        <div className="border-b border-slate-100 lg:border-b-0 lg:border-e dark:border-slate-800">
          <ScreenshotColumn
            badge="A"
            siteLabel={siteLabelA}
            subtitle={subtitleA}
            screenshot={screenshotA}
            expanded={expandedA}
            onToggleExpand={() => setExpandedA((v) => !v)}
            variant="teal"
          />
        </div>
        <ScreenshotColumn
          badge="B"
          siteLabel={siteLabelB}
          subtitle={subtitleB}
          screenshot={screenshotB}
          expanded={expandedB}
          onToggleExpand={() => setExpandedB((v) => !v)}
          variant="slate"
        />
      </div>
    </div>
  );
}
