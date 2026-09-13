import type { PageSpeedResult, Strategy } from "./types";

export async function fetchPageSpeed(
  url: string,
  strategy: Strategy
): Promise<PageSpeedResult> {
  const params = new URLSearchParams({ url, strategy });
  const response = await fetch(`/api/pagespeed?${params.toString()}`);

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    throw new Error(body.error ?? `Request failed (${response.status})`);
  }

  return response.json() as Promise<PageSpeedResult>;
}
