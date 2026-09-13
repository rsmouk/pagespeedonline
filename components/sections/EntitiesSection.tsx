import { Badge } from "@/components/ui/Badge";
import type { Entity } from "@/lib/types";

interface EntitiesSectionProps {
  entities?: Entity[];
}

export function EntitiesSection({ entities }: EntitiesSectionProps) {
  if (!entities?.length) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No entities detected.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {entities.map((entity, i) => (
        <div
          key={`${entity.name}-${i}`}
          className="rounded-lg border border-slate-100 p-4 dark:border-slate-800"
        >
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100">
              {entity.name}
            </h4>
            {entity.category && <Badge variant="muted">{entity.category}</Badge>}
            {entity.isFirstParty && <Badge variant="success">First Party</Badge>}
            {entity.isUnrecognized && (
              <Badge variant="warning">Unrecognized</Badge>
            )}
          </div>
          {entity.homepage && (
            <a
              href={entity.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-sm text-teal-600 hover:underline dark:text-teal-400"
            >
              {entity.homepage}
            </a>
          )}
          {entity.origins && entity.origins.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
              {entity.origins.map((origin) => (
                <li key={origin} className="break-all">
                  {origin}
                </li>
              ))}
            </ul>
          )}
          {Object.entries(entity)
            .filter(
              ([k]) =>
                !["name", "homepage", "category", "origins", "isFirstParty", "isUnrecognized"].includes(k)
            )
            .map(([k, v]) => (
              <p key={k} className="mt-1 text-xs text-slate-500">
                {k}: {String(v)}
              </p>
            ))}
        </div>
      ))}
    </div>
  );
}
