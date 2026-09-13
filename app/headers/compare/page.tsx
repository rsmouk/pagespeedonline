import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { HeaderComparePage } from "@/components/headers/HeaderComparePage";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Header Compare Results",
  description: "Side-by-side HTTP header comparison results for two URLs.",
  path: "/headers/compare",
  noIndex: true,
});

function HeadersLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader2 className="h-8 w-8 animate-spin text-violet-600 dark:text-violet-400" />
    </div>
  );
}

export default function HeadersComparePage() {
  return (
    <Suspense fallback={<HeadersLoading />}>
      <HeaderComparePage />
    </Suspense>
  );
}
