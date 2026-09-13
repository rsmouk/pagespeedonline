import { LandingPage } from "@/components/landing/LandingPage";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  path: "/",
});

export default function Home() {
  return <LandingPage />;
}
