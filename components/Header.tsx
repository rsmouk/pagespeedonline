import Link from "next/link";
import { Gauge } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  actions?: React.ReactNode;
}

export function Header({ actions }: HeaderProps) {
  return (
    <header className="no-print border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 transition hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white dark:bg-teal-500 dark:text-teal-950">
              <Gauge className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Lighthouse Compare
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Website analysis tools
              </p>
            </div>
          </Link>
          <NavBar />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {actions}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
