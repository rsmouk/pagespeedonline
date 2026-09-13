"use client";

import type { ReactNode } from "react";
import type { Strategy } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Monitor, Smartphone } from "lucide-react";

interface StrategyTabsProps {
  value: Strategy;
  onChange: (strategy: Strategy) => void;
}

export function StrategyTabs({ value, onChange }: StrategyTabsProps) {
  const tabs: { id: Strategy; label: string; icon: ReactNode }[] = [
    { id: "mobile", label: "Mobile", icon: <Smartphone className="h-3.5 w-3.5" /> },
    { id: "desktop", label: "Desktop", icon: <Monitor className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800/50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition",
            value === tab.id
              ? "bg-white text-teal-700 shadow-sm dark:bg-slate-900 dark:text-teal-400"
              : "text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
