import { NextRequest, NextResponse } from "next/server";
import { inspectUrlHeaders } from "@/lib/header-fetch-server";

export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter." }, { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL." }, { status: 400 });
  }

  const result = await inspectUrlHeaders(url);
  return NextResponse.json(result);
}
