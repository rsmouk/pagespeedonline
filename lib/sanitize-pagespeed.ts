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

/** Remove heavy base64 image payloads to keep the UI responsive. */
export function sanitizePageSpeedResult(data: PageSpeedResult): PageSpeedResult {
  return stripBase64Images(structuredClone(data)) as PageSpeedResult;
}
