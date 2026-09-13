import type { HeaderCompareExport, HeaderInspectResult } from "@/lib/header-types";

export function buildHeaderCompareExport(options: {
  urlA: string;
  urlB: string;
  resultA?: HeaderInspectResult;
  resultB?: HeaderInspectResult;
}): HeaderCompareExport {
  return {
    exportedAt: new Date().toISOString(),
    siteA: {
      url: options.urlA,
      result: options.resultA ?? {
        inputUrl: options.urlA,
        finalUrl: options.urlA,
        hops: [],
        error: "No data",
      },
    },
    siteB: {
      url: options.urlB,
      result: options.resultB ?? {
        inputUrl: options.urlB,
        finalUrl: options.urlB,
        hops: [],
        error: "No data",
      },
    },
  };
}

export function headerCompareToJson(payload: HeaderCompareExport): string {
  return JSON.stringify(payload, null, 2);
}
