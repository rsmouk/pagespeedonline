import type { CompareMode } from "@/lib/compare-mode";
import type { ScanState } from "@/lib/types";

const INDEX_KEY = "lighthouse-report-cache-index";
const CACHE_PREFIX = "lighthouse-report-cache:";
const MAX_CACHED_REPORTS = 5;

export interface CachedReportSession {
  queryKey: string;
  compareMode: CompareMode;
  urlA: string;
  urlB: string;
  baseUrl: string;
  labelA: string;
  labelB: string;
  scans: ScanState[];
  savedAt: string;
}

function cacheStorageKey(queryKey: string): string {
  return `${CACHE_PREFIX}${queryKey}`;
}

function readIndex(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeIndex(keys: string[]): void {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(keys.slice(0, MAX_CACHED_REPORTS)));
  } catch {
    // ignore quota errors
  }
}

function touchIndex(queryKey: string): void {
  const prev = readIndex();
  const next = [
    queryKey,
    ...prev.filter((k) => k !== queryKey),
  ].slice(0, MAX_CACHED_REPORTS);

  for (const key of prev) {
    if (!next.includes(key)) {
      try {
        localStorage.removeItem(cacheStorageKey(key));
      } catch {
        // ignore
      }
    }
  }

  writeIndex(next);
}

export function loadReportCache(queryKey: string): CachedReportSession | null {
  if (typeof window === "undefined" || !queryKey) return null;
  try {
    const raw = localStorage.getItem(cacheStorageKey(queryKey));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedReportSession;
    if (!parsed?.scans?.length) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveReportCache(
  session: Omit<CachedReportSession, "savedAt">
): void {
  if (typeof window === "undefined" || !session.queryKey) return;

  const doneScans = session.scans.filter(
    (s) => s.status === "done" && s.data
  );
  if (!doneScans.length) return;

  try {
    localStorage.setItem(
      cacheStorageKey(session.queryKey),
      JSON.stringify({
        ...session,
        scans: doneScans,
        savedAt: new Date().toISOString(),
      })
    );
    touchIndex(session.queryKey);
  } catch {
    // ignore quota errors
  }
}
