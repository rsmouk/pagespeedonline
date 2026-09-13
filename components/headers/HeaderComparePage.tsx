"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { NavIconLink } from "@/components/ui/NavIconButton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeaderHoverProvider } from "@/components/headers/HeaderHoverContext";
import { HeaderSitePanel } from "@/components/headers/HeaderSitePanel";
import { DownloadJsonButton } from "@/components/ui/DownloadJsonButton";
import { jsonFilename } from "@/lib/download-json";
import { fetchUrlHeaders } from "@/lib/headers-client";
import {
  buildHeaderCompareExport,
  headerCompareToJson,
} from "@/lib/header-export";
import { normalizeUrl } from "@/lib/formatters";
import type { HeaderInspectResult } from "@/lib/header-types";

export function HeaderComparePage() {
  const searchParams = useSearchParams();
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");
  const [resultA, setResultA] = useState<HeaderInspectResult | undefined>();
  const [resultB, setResultB] = useState<HeaderInspectResult | undefined>();
  const [loading, setLoading] = useState(false);

  const runCompare = useCallback(async (a: string, b: string) => {
    setLoading(true);
    setResultA(undefined);
    setResultB(undefined);

    try {
      const [headersA, headersB] = await Promise.all([
        fetchUrlHeaders(a),
        fetchUrlHeaders(b),
      ]);
      setResultA(headersA);
      setResultB(headersB);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const a = normalizeUrl(searchParams.get("a") ?? "");
    const b = normalizeUrl(searchParams.get("b") ?? "");
    if (a && b) {
      setUrlA(a);
      setUrlB(b);
      runCompare(a, b);
    }
  }, [searchParams, runCompare]);

  const canCopy = Boolean((resultA || resultB) && !loading);
  const getPayload = useCallback(
    () =>
      headerCompareToJson(
        buildHeaderCompareExport({
          urlA,
          urlB,
          resultA,
          resultB,
        })
      ),
    [urlA, urlB, resultA, resultB]
  );

  const hopA = resultA?.hops[resultA.hops.length - 1];
  const hopB = resultB?.hops[resultB.hops.length - 1];
  const missingUrls = !urlA || !urlB;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header
        actions={
          <>
            {canCopy && (
              <div className="hidden sm:contents">
                <DownloadJsonButton
                  getPayload={getPayload}
                  filename={jsonFilename("header-compare")}
                  label="Download JSON"
                />
              </div>
            )}
            <NavIconLink href="/headers" label="Header Tool">
              <ArrowLeft className="h-4 w-4" />
            </NavIconLink>
          </>
        }
        mobileBar={
          canCopy ? (
            <DownloadJsonButton
              getPayload={getPayload}
              filename={jsonFilename("header-compare")}
              label="Download JSON"
              alwaysShowLabel
              className="w-full justify-center"
            />
          ) : undefined
        }
      />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            HTTP Header Compare
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Browser-like GET requests with Chrome-style request headers. Differs
            are amber; hover a row to highlight the matching field on the other
            site in teal.
          </p>
        </div>

        {missingUrls && !loading && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900 dark:bg-amber-950/30">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Missing URLs. Start from the home page header compare tool.
            </p>
            <Link
              href="/headers"
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Header Compare
            </Link>
          </div>
        )}

        {!missingUrls && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="grid min-w-0 flex-1 gap-1 sm:grid-cols-2">
              <p className="truncate text-xs text-slate-500">
                <span className="font-medium text-slate-600 dark:text-slate-400">A:</span>{" "}
                {urlA}
              </p>
              <p className="truncate text-xs text-slate-500">
                <span className="font-medium text-slate-600 dark:text-slate-400">B:</span>{" "}
                {urlB}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {loading && (
                <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Inspecting headers...
                </span>
              )}
              {canCopy && (
                <DownloadJsonButton
                  getPayload={getPayload}
                  filename={jsonFilename("header-compare")}
                  label="Download JSON"
                />
              )}
            </div>
          </div>
        )}

        {!missingUrls && (
          <HeaderHoverProvider>
            <div className="grid items-start gap-4 lg:grid-cols-2">
              <HeaderSitePanel
                siteLabel="Site A"
                url={urlA}
                result={resultA}
                loading={loading && !resultA}
                compareHop={hopB}
              />
              <HeaderSitePanel
                siteLabel="Site B"
                url={urlB}
                result={resultB}
                loading={loading && !resultB}
                compareHop={hopA}
              />
            </div>
          </HeaderHoverProvider>
        )}
      </main>

      <Footer />
    </div>
  );
}
