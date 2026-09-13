import type { ScanState, Strategy } from "@/lib/types";
import { scanKey } from "@/lib/types";

export function upsertScan(
  scans: ScanState[],
  next: ScanState
): ScanState[] {
  const index = scans.findIndex((s) => s.key === next.key);
  if (index === -1) return [...scans, next];
  const copy = [...scans];
  copy[index] = next;
  return copy;
}

export function getScanState(
  scans: ScanState[],
  url: string,
  strategy: Strategy
): ScanState | undefined {
  return scans.find((s) => s.url === url && s.strategy === strategy);
}

export function needsScan(
  scans: ScanState[],
  url: string,
  strategy: Strategy
): boolean {
  const scan = getScanState(scans, url, strategy);
  return !scan || scan.status === "idle";
}

export function createLoadingScan(
  url: string,
  strategy: Strategy,
  label: string
): ScanState {
  return {
    key: scanKey(url, strategy),
    url,
    strategy,
    label,
    status: "loading",
  };
}

/** Remove a scan so it can be fetched again (manual retry). */
export function clearScan(
  scans: ScanState[],
  url: string,
  strategy: Strategy
): ScanState[] {
  return scans.filter((s) => !(s.url === url && s.strategy === strategy));
}
