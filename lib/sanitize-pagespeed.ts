import type { PageSpeedResult } from "@/lib/types";

function stripBase64Images(value: unknown): unknown {
  if (value === null || value === undefined) return value;

  if (typeof value === "string") {
    if (value.startsWith("data:image")) {
      const sizeKb = Math.round((value.length * 3) / 4 / 1024);
      return `[image data stripped — ~${sizeKb} KB]`;
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(stripBase64Images);
  }

  if (typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      result[key] = stripBase64Images(nested);
    }
    return result;
  }

  return value;
}

function preserveCompareScreenshots(data: PageSpeedResult): {
  fullPage?: string;
  final?: string;
} {
  const lh = data.lighthouseResult;
  const fullPage = lh?.fullPageScreenshot?.screenshot?.data;
  const finalShot = lh?.audits?.["final-screenshot"]?.details?.data;

  return {
    fullPage:
      typeof fullPage === "string" && fullPage.startsWith("data:image")
        ? fullPage
        : undefined,
    final:
      typeof finalShot === "string" && finalShot.startsWith("data:image")
        ? finalShot
        : undefined,
  };
}

/** Remove heavy base64 image payloads to keep the UI responsive. */
export function sanitizePageSpeedResult(data: PageSpeedResult): PageSpeedResult {
  const preserved = preserveCompareScreenshots(data);
  const sanitized = stripBase64Images(structuredClone(data)) as PageSpeedResult;

  if (
    preserved.fullPage &&
    sanitized.lighthouseResult.fullPageScreenshot?.screenshot
  ) {
    sanitized.lighthouseResult.fullPageScreenshot.screenshot.data =
      preserved.fullPage;
  }

  const finalAudit = sanitized.lighthouseResult.audits?.["final-screenshot"];
  if (
    preserved.final &&
    finalAudit?.details &&
    typeof finalAudit.details === "object"
  ) {
    (finalAudit.details as Record<string, unknown>).data = preserved.final;
  }

  return sanitized;
}
