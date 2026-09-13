/** Central site constants for SEO, sitemap, and structured data. */
export const siteConfig = {
  name: "Lighthouse Compare",
  tagline: "Compare Website Performance Side by Side",
  description:
    "Free Lighthouse and PageSpeed Insights tool. Compare two websites or analyze a single URL with full mobile and desktop reports — Core Web Vitals, audits, CrUX, and PDF export.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://lighthouse-compare.vercel.app",
  locale: "en_US",
  language: "en",
  author: {
    name: "hesdev",
    url: "https://hesdev.com",
  },
  keywords: [
    "lighthouse compare",
    "pagespeed insights",
    "website performance",
    "core web vitals",
    "compare websites",
    "lighthouse report",
    "page speed test",
    "web performance audit",
    "mobile vs desktop lighthouse",
    "before after lighthouse",
    "http headers compare",
    "google lighthouse tool",
  ],
} as const;
