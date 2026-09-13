import { HeaderLandingPage } from "@/components/headers/HeaderLandingPage";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "HTTP Header Inspector",
  description:
    "Inspect and compare HTTP response headers for any URL. Security headers, caching, redirects, and server fingerprint side by side.",
  path: "/headers",
});

export default function HeadersPage() {
  return <HeaderLandingPage />;
}
