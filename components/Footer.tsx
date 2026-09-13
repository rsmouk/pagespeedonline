import Link from "next/link";
import { GoogleAttribution } from "@/components/GoogleAttribution";

export function Footer() {
  return (
    <footer className="no-print border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <GoogleAttribution />
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
          <Link
            href="/privacy"
            className="transition hover:text-teal-600 dark:hover:text-teal-400"
          >
            Privacy Policy
          </Link>
          <span className="hidden text-slate-300 sm:inline dark:text-slate-600">
            ·
          </span>
          <Link
            href="/terms"
            className="transition hover:text-teal-600 dark:hover:text-teal-400"
          >
            Terms of Service
          </Link>
          <span className="hidden text-slate-300 sm:inline dark:text-slate-600">
            ·
          </span>
          <span>
            Developed by{" "}
            <a
              href="https://hesdev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-teal-600 hover:underline dark:text-teal-400"
            >
              hesdev
            </a>
          </span>
        </div>
        <p className="mt-3 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Lighthouse Compare
        </p>
      </div>
    </footer>
  );
}
