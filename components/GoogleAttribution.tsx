export function GoogleAttribution({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={
        compact
          ? "text-center text-xs text-slate-500 dark:text-slate-400"
          : "text-center text-xs text-slate-500 dark:text-slate-400"
      }
    >
      Powered by Google Lighthouse
    </p>
  );
}
