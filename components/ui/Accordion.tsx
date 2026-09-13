"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface AccordionProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Accordion({
  title,
  subtitle,
  defaultOpen = false,
  open,
  onToggle,
  children,
  className,
}: AccordionProps) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? open : internalOpen;

  const handleToggle = () => {
    if (onToggle) onToggle();
    if (!isControlled) setInternalOpen((v) => !v);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
        className
      )}
    >
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
      >
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-slate-400 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="border-t border-slate-100 px-4 py-4 dark:border-slate-800">
          {children}
        </div>
      )}
    </div>
  );
}
