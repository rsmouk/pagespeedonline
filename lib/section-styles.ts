export const SECTION_BACKGROUNDS = [
  "border-teal-200/80 bg-teal-50/70 dark:border-teal-900/60 dark:bg-teal-950/25",
  "border-sky-200/80 bg-sky-50/70 dark:border-sky-900/60 dark:bg-sky-950/25",
  "border-violet-200/80 bg-violet-50/70 dark:border-violet-900/60 dark:bg-violet-950/25",
  "border-amber-200/80 bg-amber-50/70 dark:border-amber-900/60 dark:bg-amber-950/25",
  "border-rose-200/80 bg-rose-50/70 dark:border-rose-900/60 dark:bg-rose-950/25",
  "border-emerald-200/80 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/25",
  "border-indigo-200/80 bg-indigo-50/70 dark:border-indigo-900/60 dark:bg-indigo-950/25",
  "border-cyan-200/80 bg-cyan-50/70 dark:border-cyan-900/60 dark:bg-cyan-950/25",
  "border-orange-200/80 bg-orange-50/70 dark:border-orange-900/60 dark:bg-orange-950/25",
  "border-fuchsia-200/80 bg-fuchsia-50/70 dark:border-fuchsia-900/60 dark:bg-fuchsia-950/25",
  "border-lime-200/80 bg-lime-50/70 dark:border-lime-900/60 dark:bg-lime-950/25",
  "border-blue-200/80 bg-blue-50/70 dark:border-blue-900/60 dark:bg-blue-950/25",
  "border-pink-200/80 bg-pink-50/70 dark:border-pink-900/60 dark:bg-pink-950/25",
] as const;

export function getSectionBackground(index: number): string {
  return SECTION_BACKGROUNDS[index % SECTION_BACKGROUNDS.length];
}
