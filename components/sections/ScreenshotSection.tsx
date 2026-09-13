"use client";

import { useState } from "react";
import { KeyValueGrid } from "@/components/ui/KeyValueGrid";
import type { LighthouseResult } from "@/lib/types";

interface ScreenshotSectionProps {
  lighthouse: LighthouseResult;
}

export function ScreenshotSection({ lighthouse }: ScreenshotSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const fps = lighthouse.fullPageScreenshot;

  if (!fps) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No full page screenshot available.
      </p>
    );
  }

  const screenshot = fps.screenshot;
  const nodes = fps.nodes ?? {};

  return (
    <div className="space-y-4">
      {screenshot?.data && (
        <div>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mb-2 text-sm font-medium text-teal-600 hover:underline dark:text-teal-400"
          >
            {expanded ? "Hide full screenshot" : "Show full screenshot"}
          </button>
          <img
            src={screenshot.data}
            alt="Full page screenshot"
            className={
              expanded
                ? "max-w-full rounded-lg border border-slate-200 dark:border-slate-700"
                : "max-h-48 rounded-lg border border-slate-200 dark:border-slate-700"
            }
          />
          {screenshot.width != null && screenshot.height != null && (
            <p className="mt-1 text-xs text-slate-500">
              {screenshot.width} × {screenshot.height}px
            </p>
          )}
        </div>
      )}

      {Object.keys(nodes).length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            DOM Nodes ({Object.keys(nodes).length})
          </p>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {Object.entries(nodes).map(([nodeId, bounds]) => (
              <div
                key={nodeId}
                className="rounded border border-slate-100 p-2 dark:border-slate-800"
              >
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {nodeId}
                </p>
                <KeyValueGrid data={bounds as Record<string, unknown>} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
