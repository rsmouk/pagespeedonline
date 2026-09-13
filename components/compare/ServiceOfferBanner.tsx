"use client";

import { MessageCircle } from "lucide-react";
import { displayHost } from "@/lib/extract-compare-summary";
import { siteConfig } from "@/lib/site-config";

const WHATSAPP_NUMBER = "212669271321";

function buildWhatsAppUrl(siteUrl: string): string {
  const domain = displayHost(siteUrl);
  const text = [
    `Hi! I'm coming from ${siteConfig.name}.`,
    `I ran a performance report for ${domain} and I'd like help improving my site — making it faster, fixing the issues shown in the report, and standing out from competitors.`,
    "I've seen you help many sites boost their performance and I'd love to discuss a service for my website.",
    "Thank you!",
  ].join(" ");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

interface ServiceOfferBannerProps {
  siteUrl: string;
}

export function ServiceOfferBanner({ siteUrl }: ServiceOfferBannerProps) {
  return (
    <div className="no-print border-b border-teal-200/80 bg-gradient-to-r from-teal-50 via-white to-emerald-50/80 dark:border-teal-900/50 dark:from-teal-950/40 dark:via-slate-950 dark:to-emerald-950/20">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-3.5">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Need help fixing what this report found?
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            I can fix the performance issues on your site and make it fast and
            competitive. I&apos;ve helped many websites improve speed,
            Core Web Vitals, and overall quality.
          </p>
        </div>
        <a
          href={buildWhatsAppUrl(siteUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#20bd5a]"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp me
        </a>
      </div>
    </div>
  );
}
