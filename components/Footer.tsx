import { GoogleAttribution } from "@/components/GoogleAttribution";

export function Footer() {
  return (
    <footer className="no-print border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <GoogleAttribution />
        <p className="mt-3 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Lighthouse Compare
        </p>
      </div>
    </footer>
  );
}
