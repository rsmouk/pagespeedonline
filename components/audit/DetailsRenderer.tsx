"use client";

import { DataTable } from "@/components/ui/DataTable";
import { KeyValueGrid } from "@/components/ui/KeyValueGrid";
import type { AuditDetails } from "@/lib/types";
import { formatValue } from "@/lib/formatters";

interface DetailsRendererProps {
  details: AuditDetails;
  depth?: number;
}

export function DetailsRenderer({ details, depth = 0 }: DetailsRendererProps) {
  if (!details || typeof details !== "object") return null;

  const { type, headings, items, ...rest } = details;

  return (
    <div className="space-y-3" style={{ marginLeft: depth > 0 ? 12 : 0 }}>
      {type && (
        <p className="text-xs font-medium uppercase tracking-wide text-teal-600 dark:text-teal-400">
          Type: {type}
        </p>
      )}

      {headings && headings.length > 0 && items && items.length > 0 && (
        <DataTable
          columns={headings.map((h, i) => ({
            key: h.key ?? `col_${i}`,
            label: h.label ?? h.key ?? `Column ${i + 1}`,
          }))}
          rows={items}
        />
      )}

      {items && items.length > 0 && !(headings && headings.length > 0) && (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-100 p-3 dark:border-slate-800"
            >
              <KeyValueGrid data={item as Record<string, unknown>} />
            </div>
          ))}
        </div>
      )}

      {details.screenshot && typeof details.screenshot === "object" && (
        <ScreenshotBlock data={details.screenshot as Record<string, unknown>} />
      )}

      {details.nodes && typeof details.nodes === "object" && (
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            Nodes ({Object.keys(details.nodes).length})
          </p>
          <KeyValueGrid data={details.nodes as Record<string, unknown>} />
        </div>
      )}

      {details.chains && (
        <NestedJson label="Chains" data={details.chains} />
      )}

      {details.longestChain && (
        <NestedJson label="Longest Chain" data={details.longestChain} />
      )}

      {details.debugData && (
        <NestedJson label="Debug Data" data={details.debugData} />
      )}

      {details.summary && (
        <NestedJson label="Summary" data={details.summary} />
      )}

      {typeof details.overallSavingsMs === "number" && (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Overall savings: {details.overallSavingsMs} ms
        </p>
      )}

      {typeof details.overallSavingsBytes === "number" && (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Overall savings: {details.overallSavingsBytes} bytes
        </p>
      )}

      {Object.entries(rest).map(([key, value]) => {
        if (
          ["type", "headings", "items", "screenshot", "nodes", "chains", "longestChain", "debugData", "summary", "overallSavingsMs", "overallSavingsBytes", "sortedBy"].includes(key)
        ) {
          return null;
        }
        if (value === undefined || value === null) return null;

        if (typeof value === "object" && !Array.isArray(value)) {
          return (
            <NestedJson
              key={key}
              label={key}
              data={value as Record<string, unknown>}
            />
          );
        }

        return (
          <p key={key} className="text-sm text-slate-600 dark:text-slate-300">
            <span className="font-medium">{key}:</span> {formatValue(value)}
          </p>
        );
      })}
    </div>
  );
}

function ScreenshotBlock({ data }: { data: Record<string, unknown> }) {
  const src = data.data as string | undefined;
  if (!src) return <KeyValueGrid data={data} />;

  return (
    <div className="space-y-2">
      <img
        src={src}
        alt="Audit screenshot"
        className="max-h-64 rounded-lg border border-slate-200 dark:border-slate-700"
      />
      <KeyValueGrid data={{ ...data, data: "[image data]" }} />
    </div>
  );
}

function NestedJson({
  label,
  data,
}: {
  label: string;
  data: Record<string, unknown> | unknown;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
        {label}
      </p>
      <pre className="max-h-64 overflow-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-950 dark:text-slate-300">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
