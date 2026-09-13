import type { Audit } from "@/lib/types";

export function auditDiffers(a: Audit, other?: Audit): boolean {
  if (!other) return true;
  if (a.score !== other.score) return true;
  if (a.displayValue !== other.displayValue) return true;
  if (a.numericValue !== other.numericValue) return true;
  if (a.scoreDisplayMode !== other.scoreDisplayMode) return true;
  return false;
}
