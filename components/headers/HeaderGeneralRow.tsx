"use client";

import { cn } from "@/lib/cn";
import { useHeaderHover } from "@/components/headers/HeaderHoverContext";

interface HeaderGeneralRowProps {
  field: string;
  label: string;
  value: React.ReactNode;
}

export function HeaderGeneralRow({
  field,
  label,
  value,
}: HeaderGeneralRowProps) {
  const { setHovered, isActive } = useHeaderHover();
  const target = { type: "general" as const, field };
  const paired = isActive(target);

  return (
    <div
      className={cn(
        "grid grid-cols-[120px_1fr] gap-2 rounded px-1 py-0.5 transition-colors",
        paired &&
          "bg-teal-100/90 ring-1 ring-inset ring-teal-300/80 dark:bg-teal-950/50 dark:ring-teal-700/80"
      )}
      onMouseEnter={() => setHovered(target)}
      onMouseLeave={() => setHovered(null)}
    >
      <dt
        className={cn(
          "text-slate-500",
          paired && "font-medium text-teal-700 dark:text-teal-300"
        )}
      >
        {label}
      </dt>
      <dd className="break-all text-slate-800 dark:text-slate-100">{value}</dd>
    </div>
  );
}
