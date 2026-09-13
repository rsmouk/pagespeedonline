import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { CompareReportPage } from "@/components/compare/CompareReportPage";

function CompareLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader2 className="h-8 w-8 animate-spin text-teal-600 dark:text-teal-400" />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<CompareLoading />}>
      <CompareReportPage />
    </Suspense>
  );
}
