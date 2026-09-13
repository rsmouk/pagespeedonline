import type { Strategy } from "@/lib/types";
import { scanKey } from "@/lib/types";

export type ComparePhase = "before" | "after" | "a" | "b";

export function phaseScanUrl(baseUrl: string, phase: ComparePhase): string {
  return `${baseUrl}#${phase}`;
}

export function scanKeyForPhase(
  baseUrl: string,
  strategy: Strategy,
  phase: ComparePhase
): string {
  return scanKey(phaseScanUrl(baseUrl, phase), strategy);
}
