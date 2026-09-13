import type { FullComparisonExport } from "@/lib/extract-section-data";
import type { PageSpeedResult, Strategy } from "@/lib/types";

export interface ImportedReport {
  url: string;
  label?: string;
  reports: Partial<Record<Strategy, PageSpeedResult>>;
}

function isPageSpeedResult(value: unknown): value is PageSpeedResult {
  return (
    typeof value === "object" &&
    value !== null &&
    "lighthouseResult" in value &&
    typeof (value as PageSpeedResult).lighthouseResult === "object"
  );
}

function urlFromResult(data: PageSpeedResult, fallback: string): string {
  const lh = data.lighthouseResult;
  return (
    lh.finalUrl ??
    lh.requestedUrl ??
    lh.finalDisplayedUrl ??
    data.id ??
    fallback
  );
}

function wrapSingle(data: PageSpeedResult, strategy: Strategy = "mobile"): ImportedReport {
  return {
    url: urlFromResult(data, "imported-site"),
    reports: { [strategy]: data },
  };
}

/** Parse exported JSON (full report, comparison export, or section export). */
export function parseReportJson(raw: unknown): ImportedReport {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid JSON file.");
  }

  const obj = raw as Record<string, unknown>;

  if (isPageSpeedResult(obj)) {
    return wrapSingle(obj);
  }

  if (isPageSpeedResult(obj.data)) {
    const strategy = (obj.strategy as Strategy) ?? "mobile";
    return {
      url: (obj.url as string) ?? urlFromResult(obj.data, "imported-site"),
      label: obj.siteLabel as string | undefined,
      reports: { [strategy]: obj.data },
    };
  }

  if (obj.siteA && obj.siteB && typeof obj.siteA === "object") {
    const exp = obj as unknown as FullComparisonExport;
    const a = exp.siteA.data;
    if (!isPageSpeedResult(a)) throw new Error("siteA missing lighthouse data.");
    const strategy = exp.strategy ?? "mobile";
    return {
      url: exp.siteA.url,
      reports: { [strategy]: a },
      label: "Site A",
    };
  }

  if (obj.data && typeof obj.data === "object") {
    const inner = obj.data as Record<string, unknown>;
    if (isPageSpeedResult(inner)) return wrapSingle(inner);
  }

  throw new Error("Unrecognized report JSON format.");
}

export function parseComparisonPairJson(
  rawA: unknown,
  rawB: unknown
): { a: ImportedReport; b: ImportedReport } {
  return { a: parseReportJson(rawA), b: parseReportJson(rawB) };
}

export async function readJsonFile(file: File): Promise<unknown> {
  const text = await file.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Could not parse ${file.name} as JSON.`);
  }
}
