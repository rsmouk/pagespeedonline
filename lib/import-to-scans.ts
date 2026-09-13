import type { ImportedReport } from "@/lib/report-import";
import type { ScanState, Strategy } from "@/lib/types";
import { scanKey } from "@/lib/types";

export function importedReportToScans(
  report: ImportedReport,
  sideLabel: string
): ScanState[] {
  const strategies: Strategy[] = ["mobile", "desktop"];
  const scans: ScanState[] = [];

  for (const strategy of strategies) {
    const data = report.reports[strategy];
    if (!data) continue;
    scans.push({
      key: scanKey(report.url, strategy),
      url: report.url,
      strategy,
      label: `${sideLabel} · ${strategy}`,
      status: "done",
      data,
    });
  }

  if (!scans.length && report.reports.mobile) {
    const data = report.reports.mobile;
    scans.push({
      key: scanKey(report.url, "mobile"),
      url: report.url,
      strategy: "mobile",
      label: `${sideLabel} · mobile`,
      status: "done",
      data,
    });
  }

  return scans;
}

export function mergeImportedScans(
  scansA: ScanState[],
  scansB: ScanState[]
): ScanState[] {
  return [...scansA, ...scansB];
}
