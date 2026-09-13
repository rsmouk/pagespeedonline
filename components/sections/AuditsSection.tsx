import { AuditCard } from "@/components/audit/AuditCard";
import type { Audit, LighthouseResult } from "@/lib/types";

interface AuditsSectionProps {
  lighthouse: LighthouseResult;
  groupFilter?: string;
  title?: string;
}

export function AuditsSection({
  lighthouse,
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

  auditList.sort((a, b) => a.title.localeCompare(b.title));

  if (!auditList.length) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No audits in this group.
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
