import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { KeyValueGrid } from "@/components/ui/KeyValueGrid";
import type { LighthouseResult } from "@/lib/types";
import { formatCategoryLabel, formatScore, scoreColorClass } from "@/lib/formatters";

interface CategoriesSectionProps {
  lighthouse: LighthouseResult;
}

export function CategoriesSection({ lighthouse }: CategoriesSectionProps) {
  const categories = lighthouse.categories ?? {};
  const groups = lighthouse.categoryGroups ?? {};

  return (
    <div className="space-y-6">
      {Object.entries(categories).map(([key, cat]) => (
        <div
          key={key}
          className="rounded-lg border border-slate-100 p-4 dark:border-slate-800"
        >
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100">
              {formatCategoryLabel(key)}
            </h4>
            <span className={`text-2xl font-bold ${scoreColorClass(cat.score)}`}>
              {formatScore(cat.score)}
            </span>
          </div>

          <KeyValueGrid
            data={{
              id: cat.id,
              title: cat.title,
              score: cat.score,
            }}
          />

          {cat.auditRefs && cat.auditRefs.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
                Audit References ({cat.auditRefs.length})
              </p>
              <DataTable
                columns={[
                  { key: "id", label: "Audit ID" },
                  { key: "weight", label: "Weight" },
                  { key: "group", label: "Group" },
                  { key: "acronym", label: "Acronym" },
                ]}
                rows={cat.auditRefs.map((ref) => ({
                  id: ref.id,
                  weight: ref.weight ?? "—",
                  group: ref.group ?? "—",
                  acronym: ref.acronym ?? "—",
                }))}
              />
            </div>
          )}
        </div>
      ))}

      {Object.keys(groups).length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Category Groups
          </h4>
          <div className="space-y-2">
            {Object.entries(groups).map(([id, group]) => (
              <div
                key={id}
                className="rounded-lg border border-slate-100 p-3 dark:border-slate-800"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="muted">{id}</Badge>
                  <span className="font-medium text-slate-800 dark:text-slate-100">
                    {group.title}
                  </span>
                </div>
                {group.description && (
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {group.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
