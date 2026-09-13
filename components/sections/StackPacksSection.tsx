import { KeyValueGrid } from "@/components/ui/KeyValueGrid";
import type { StackPack } from "@/lib/types";

interface StackPacksSectionProps {
  stackPacks?: StackPack[];
}

export function StackPacksSection({ stackPacks }: StackPacksSectionProps) {
  if (!stackPacks?.length) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No stack packs detected.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {stackPacks.map((pack) => (
        <div
          key={pack.id}
          className="rounded-lg border border-slate-100 p-4 dark:border-slate-800"
        >
          <div className="mb-3 flex items-center gap-3">
            {pack.iconDataURL && (
              <img
                src={pack.iconDataURL}
                alt={pack.title}
                className="h-8 w-8"
              />
            )}
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                {pack.title}
              </h4>
              <p className="text-xs text-slate-500">{pack.id}</p>
            </div>
          </div>

          {pack.descriptions && (
            <div className="space-y-2">
              {Object.entries(pack.descriptions).map(([auditId, desc]) => (
                <div
                  key={auditId}
                  className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50"
                >
                  <p className="text-xs font-medium text-teal-600 dark:text-teal-400">
                    {auditId}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          <KeyValueGrid
            data={{ id: pack.id, title: pack.title }}
            exclude={["descriptions", "iconDataURL"]}
          />
        </div>
      ))}
    </div>
  );
}
