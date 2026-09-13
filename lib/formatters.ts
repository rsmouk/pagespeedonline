export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined) return "N/A";
  return String(Math.round(score * 100));
}

export function scoreColorClass(score: number | null | undefined): string {
  if (score === null || score === undefined) {
    return "text-slate-500 dark:text-slate-400";
  }
  const pct = score * 100;
  if (pct >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (pct >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

export function scoreBgClass(score: number | null | undefined): string {
  if (score === null || score === undefined) {
    return "bg-slate-100 dark:bg-slate-800";
  }
  const pct = score * 100;
  if (pct >= 90) return "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800";
  if (pct >= 50) return "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800";
  return "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800";
}

export function formatCruxMetricName(key: string): string {
  return key
    .replace(/_MS$/, " (ms)")
    .replace(/_SCORE$/, " Score")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatCategoryLabel(key: string): string {
  const labels: Record<string, string> = {
    performance: "Performance",
    accessibility: "Accessibility",
    "best-practices": "Best Practices",
    seo: "SEO",
  };
  return labels[key] ?? key;
}

export function formatDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") {
    if (Number.isInteger(value)) return String(value);
    return value.toFixed(2);
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function scoreDelta(
  a: number | null | undefined,
  b: number | null | undefined
): number | null {
  if (a == null || b == null) return null;
  return Math.round((a - b) * 100);
}
