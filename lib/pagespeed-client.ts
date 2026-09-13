import {
  PageSpeedFetchError,
  isQuotaErrorMessage,
  parsePageSpeedError,
} from "@/lib/pagespeed-errors";
import type { PageSpeedResult, Strategy } from "./types";

export async function fetchPageSpeed(
  url: string,
  strategy: Strategy
): Promise<PageSpeedResult> {
  const params = new URLSearchParams({ url, strategy });
  const response = await fetch(`/api/pagespeed?${params.toString()}`);

  const body = (await response.json().catch(() => ({}))) as {
    error?: string;
    code?: string;
  };

  if (!response.ok) {
    const raw = body.error ?? `Request failed (${response.status})`;
    if (
      body.code === "QUOTA_EXCEEDED" ||
      response.status === 429 ||
      isQuotaErrorMessage(raw)
    ) {
      throw new PageSpeedFetchError(
        raw,
        "quota",
        "Daily scan limit reached. Please try again tomorrow, or upload a saved Lighthouse JSON report instead."
      );
    }
    throw parsePageSpeedError(new Error(raw));
  }

  return body as PageSpeedResult;
}
