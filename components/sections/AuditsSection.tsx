import { AuditCard } from "@/components/audit/AuditCard";
import { auditDiffers } from "@/lib/audit-compare";
import type { Audit, LighthouseResult } from "@/lib/types";

interface AuditsSectionProps {
  lighthouse: LighthouseResult;
  compareLighthouse?: LighthouseResult;
  differencesOnly?: boolean;
  groupFilter?: string;
  title?: string;
}

export function AuditsSection({
  lighthouse,
  compareLighthouse,
  differencesOnly = false,
  groupFilter,
  title,
}: AuditsSectionProps) {
  const audits = lighthouse.audits ?? {};
  const auditRefs = Object.values(lighthouse.categories ?? {}).flatMap(
    (c) => c.auditRefs ?? []
  );

  const groupMap = new Map(auditRefs.map((r) => [r.id, r.group]));

  let auditList: Audit[] = Object.values(audits);

  if (groupFilter) {
    auditList = auditList.filter(
      (a) => groupMap.get(a.id) === groupFilter
    );
  }

  if (differencesOnly && compareLighthouse) {
    const otherAudits = compareLighthouse.audits ?? {};
    auditList = auditList.filter((audit) =>
      auditDiffers(audit, otherAudits[audit.id])
    );
  }

  auditList.sort((a, b) => a.title.localeCompare(b.title));

  if (!auditList.length) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {differencesOnly
          ? "No differences in this group — both sites match."
          : "No audits in this group."}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {title && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {title} — {auditList.length} audit(s)
        </p>
      )}
      {auditList.map((audit) => (
        <AuditCard key={audit.id} audit={audit} />
      ))}
    </div>
  );
}
