import { NextRequest, NextResponse } from "next/server";
import { isQuotaErrorMessage } from "@/lib/pagespeed-errors";
import { LIGHTHOUSE_CATEGORIES } from "@/lib/types";

export const maxDuration = 60;

const API_BASE = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

export async function GET(request: NextRequest) {
  const apiKey = process.env.PAGESPEED_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "PAGESPEED_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  const { searchParams } = request.nextUrl;
  const url = searchParams.get("url");
  const strategy = searchParams.get("strategy") ?? "desktop";

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter." }, { status: 400 });
  }

  if (strategy !== "mobile" && strategy !== "desktop") {
    return NextResponse.json(
      { error: "Strategy must be mobile or desktop." },
      { status: 400 }
    );
  }

  try {
    const apiUrl = new URL(API_BASE);
    apiUrl.searchParams.set("url", url);
    apiUrl.searchParams.set("key", apiKey);
    apiUrl.searchParams.set("strategy", strategy);
    for (const category of LIGHTHOUSE_CATEGORIES) {
      apiUrl.searchParams.append("category", category);
    }

    const response = await fetch(apiUrl.toString(), {
      next: { revalidate: 0 },
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        (data as { error?: { message?: string } })?.error?.message ??
        "PageSpeed API request failed.";

      if (response.status === 429 || isQuotaErrorMessage(message)) {
        return NextResponse.json(
          {
            code: "QUOTA_EXCEEDED",
            error:
              "Daily scan limit reached. Please try again tomorrow, or upload a saved Lighthouse JSON report instead.",
          },
          { status: 429 }
        );
      }

      return NextResponse.json({ error: message }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
