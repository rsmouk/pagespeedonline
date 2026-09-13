import type { HeaderInspectResult } from "@/lib/header-types";

export async function fetchUrlHeaders(url: string): Promise<HeaderInspectResult> {
  const response = await fetch(
    `/api/headers?url=${encodeURIComponent(url)}`,
    { cache: "no-store" }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      (data as { error?: string }).error ?? "Header inspection failed."
    );
  }

  return data as HeaderInspectResult;
}
