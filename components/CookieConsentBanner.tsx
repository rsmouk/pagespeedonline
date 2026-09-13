"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { acceptCookieConsent, hasCookieConsent } from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasCookieConsent()) setVisible(true);
  }, []);

  const dismiss = () => {
    acceptCookieConsent();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="no-print fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-4 shadow-[0_-4px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-5 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-[0_-4px_24px_rgba(0,0,0,0.35)]"
    >
      <div className="relative mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex min-w-0 items-start gap-3 pe-8 sm:pe-0">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
            <Cookie className="h-5 w-5" aria-hidden />
          </span>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            We use essential cookies and local storage to remember your theme
            preference and before/after snapshots. By continuing, you agree to
            our{" "}
            <Link
              href="/privacy"
              className="font-medium text-teal-600 underline-offset-2 hover:underline dark:text-teal-400"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={dismiss}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700 dark:bg-teal-500 dark:text-teal-950 dark:hover:bg-teal-400"
          >
            Accept
          </button>
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Close cookie banner"
          className="absolute end-3 top-3 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 sm:end-5 sm:top-1/2 sm:-translate-y-1/2"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
