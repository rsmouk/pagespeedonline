export interface HeaderHop {
  requestUrl: string;
  requestMethod: string;
  status: number;
  statusText: string;
  remoteAddress: string | null;
  durationMs: number;
  requestHeaders: Record<string, string>;
  responseHeaders: Record<string, string>;
}

export interface HeaderInspectResult {
  inputUrl: string;
  finalUrl: string;
  hops: HeaderHop[];
  error?: string;
}

export interface HeaderCompareExport {
  exportedAt: string;
  siteA: { url: string; result: HeaderInspectResult };
  siteB: { url: string; result: HeaderInspectResult };
}
