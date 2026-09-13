import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export interface PageSeoOptions {
  /** Page title without site name (template adds suffix) */
  title?: string;
  description?: string;
  /** Path starting with / e.g. "/compare" */
  path?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export function absoluteUrl(path = ""): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized === "/" ? "" : normalized}`;
}

export function pageTitle(title?: string): string {
  return title ? `${title} | ${siteConfig.name}` : siteConfig.name;
}

export function buildPageMetadata(options: PageSeoOptions = {}): Metadata {
  const {
    title,
    description = siteConfig.description,
    path = "/",
    noIndex = false,
    keywords = [...siteConfig.keywords],
  } = options;

  const canonicalPath = path === "" ? "/" : path;
  const url = absoluteUrl(canonicalPath);
  const resolvedTitle = pageTitle(title);

  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

  return {
    ...(title ? { title } : {}),
    description,
    keywords,
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    applicationName: siteConfig.name,
    category: "technology",
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title: resolvedTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      creator: siteConfig.author.name,
    },
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    ...(googleVerification
      ? { verification: { google: googleVerification } }
      : {}),
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  applicationName: siteConfig.name,
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    creator: siteConfig.author.name,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};
