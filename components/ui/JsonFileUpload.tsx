"use client";

import { useRef } from "react";
import { FileJson, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface JsonFileUploadProps {
  id: string;
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  accent?: "teal" | "violet" | "amber" | "slate";
}

const ACCENTS = {
  teal: "border-teal-200 bg-teal-50/50 dark:border-teal-800 dark:bg-teal-950/20",
  violet: "border-violet-200 bg-violet-50/50 dark:border-violet-800 dark:bg-violet-950/20",
  amber: "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20",
  slate: "border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/30",
};

export function JsonFileUpload({
  id,
  label,
  file,
  onFileChange,
  accent = "teal",
}: JsonFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={cn(
        "rounded-xl border-2 border-dashed p-4 transition",
        ACCENTS[accent]
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </label>
        {file && (
          <button
            type="button"
            onClick={() => {
              onFileChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="rounded p-1 text-slate-400 hover:bg-white/80 hover:text-slate-600 dark:hover:bg-slate-900"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center gap-3 rounded-lg border border-slate-200/80 bg-white px-3 py-3 text-start text-sm transition hover:border-teal-400 dark:border-slate-600 dark:bg-slate-900 dark:hover:border-teal-600"
      >
        <FileJson className="h-5 w-5 shrink-0 text-teal-600 dark:text-teal-400" />
        <span className="min-w-0 truncate text-slate-600 dark:text-slate-300">
          {file ? file.name : "Choose JSON report file…"}
        </span>
      </button>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept=".json,application/json"
        className="sr-only"
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
