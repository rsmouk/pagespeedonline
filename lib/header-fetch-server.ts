import dns from "dns/promises";
import { BROWSER_REQUEST_HEADERS } from "@/lib/browser-headers";
import type { HeaderHop, HeaderInspectResult } from "@/lib/header-types";

const MAX_REDIRECTS = 10;
const TIMEOUT_MS = 20_000;

function headersToRecord(headers: Headers): Record<string, string> {
  const record: Record<string, string> = {};
  headers.forEach((value, key) => {
    record[key.toLowerCase()] = value;
  });
  return record;
}

async function resolveRemoteAddress(url: string): Promise<string | null> {
  try {
    const hostname = new URL(url).hostname;
    const [address] = await dns.resolve4(hostname);
    return address ?? null;
  } catch {
    return null;
  }
}

export async function inspectUrlHeaders(
  inputUrl: string
): Promise<HeaderInspectResult> {
  const hops: HeaderHop[] = [];
  let currentUrl = inputUrl;

  try {
    for (let i = 0; i <= MAX_REDIRECTS; i += 1) {
      const started = Date.now();
      const remoteAddress = await resolveRemoteAddress(currentUrl);

      const response = await fetch(currentUrl, {
        method: "GET",
        headers: BROWSER_REQUEST_HEADERS,
        redirect: "manual",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      const hop: HeaderHop = {
        requestUrl: currentUrl,
        requestMethod: "GET",
        status: response.status,
        statusText: response.statusText,
        remoteAddress,
        durationMs: Date.now() - started,
        requestHeaders: { ...BROWSER_REQUEST_HEADERS },
        responseHeaders: headersToRecord(response.headers),
      };

      hops.push(hop);

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) break;
        currentUrl = new URL(location, currentUrl).toString();
        continue;
      }

      return {
        inputUrl,
        finalUrl: currentUrl,
        hops,
      };
    }

    return {
      inputUrl,
      finalUrl: currentUrl,
      hops,
      error: `Too many redirects (>${MAX_REDIRECTS}).`,
    };
  } catch (error) {
    return {
      inputUrl,
      finalUrl: currentUrl,
      hops,
      error: error instanceof Error ? error.message : "Header inspection failed.",
    };
  }
}
