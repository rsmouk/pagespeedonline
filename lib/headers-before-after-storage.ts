import type { HeaderInspectResult } from "@/lib/header-types";

const STORAGE_KEY = "header-compare-before-snapshot";

export interface HeaderBeforeSnapshot {
  url: string;
  savedAt: string;
  result: HeaderInspectResult;
}

export function getHeaderBeforeSnapshot(): HeaderBeforeSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HeaderBeforeSnapshot;
  } catch {
    return null;
  }
}

export function saveHeaderBeforeSnapshot(
  url: string,
  result: HeaderInspectResult
): HeaderBeforeSnapshot {
  const snapshot: HeaderBeforeSnapshot = {
    url,
    savedAt: new Date().toISOString(),
    result,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  return snapshot;
}

export function clearHeaderBeforeSnapshot(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasHeaderBeforeForUrl(url: string): boolean {
  const snap = getHeaderBeforeSnapshot();
  return snap?.url === url && Boolean(snap.result);
}
