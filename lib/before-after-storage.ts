import type { PageSpeedResult, Strategy } from "@/lib/types";

const STORAGE_KEY = "lighthouse-compare-before-snapshot";

export interface BeforeSnapshot {
  url: string;
  savedAt: string;
  reports: Partial<Record<Strategy, PageSpeedResult>>;
}

export function getBeforeSnapshot(): BeforeSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BeforeSnapshot;
  } catch {
    return null;
  }
}

export function saveBeforeSnapshot(
  url: string,
  reports: Partial<Record<Strategy, PageSpeedResult>>
): BeforeSnapshot {
  const snapshot: BeforeSnapshot = {
    url,
    savedAt: new Date().toISOString(),
    reports,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  return snapshot;
}

export function clearBeforeSnapshot(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasBeforeForUrl(url: string): boolean {
  const snap = getBeforeSnapshot();
  return snap?.url === url && Boolean(snap.reports.mobile || snap.reports.desktop);
}
