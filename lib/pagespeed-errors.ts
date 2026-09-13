export type PageSpeedErrorKind = "quota" | "timeout" | "network" | "unknown";

export class PageSpeedFetchError extends Error {
  readonly kind: PageSpeedErrorKind;
  readonly retryable: boolean;
  readonly userMessage: string;

  constructor(raw: string, kind: PageSpeedErrorKind, userMessage: string) {
    super(raw);
    this.name = "PageSpeedFetchError";
    this.kind = kind;
    this.retryable = kind === "timeout" || kind === "network";
    this.userMessage = userMessage;
  }
}

const QUOTA_PATTERNS = [
  /quota exceeded/i,
  /rate limit/i,
  /ratelimit/i,
  /daily limit/i,
  /RESOURCE_EXHAUSTED/i,
  /limit exceeded/i,
  /too many requests/i,
  /usage limits/i,
];

const TIMEOUT_PATTERNS = [
  /FAILED_DOCUMENT_REQUEST/i,
  /ERR_TIMED_OUT/i,
  /timed out/i,
  /timeout/i,
  /unable to reliably load/i,
];

const NETWORK_PATTERNS = [
  /failed to fetch/i,
  /network error/i,
  /ECONNRESET/i,
  /ENOTFOUND/i,
  /DNS/i,
];

export function isQuotaErrorMessage(message: string): boolean {
  return QUOTA_PATTERNS.some((p) => p.test(message));
}

function classifyError(raw: string): PageSpeedErrorKind {
  if (isQuotaErrorMessage(raw)) return "quota";
  if (TIMEOUT_PATTERNS.some((p) => p.test(raw))) return "timeout";
  if (NETWORK_PATTERNS.some((p) => p.test(raw))) return "network";
  return "unknown";
}

function userMessageFor(kind: PageSpeedErrorKind, raw: string): string {
  switch (kind) {
    case "quota":
      return "Daily scan limit reached. Please try again tomorrow, or upload a saved Lighthouse JSON report instead.";
    case "timeout":
      return "The page took too long to load from Google's servers. The site may be slow, blocking bots, or temporarily unavailable. Try again in a moment.";
    case "network":
      return "Could not reach the scan service. Check your connection and try again.";
    default:
      if (/Lighthouse returned error/i.test(raw)) {
        return "Lighthouse could not complete the scan for this URL. Verify the link works in your browser, then retry.";
      }
      return "The scan could not be completed. Please verify the URL and try again.";
  }
}

export function parsePageSpeedError(error: unknown): PageSpeedFetchError {
  if (error instanceof PageSpeedFetchError) return error;

  const raw =
    error instanceof Error ? error.message : String(error ?? "Unknown error");
  const kind = classifyError(raw);
  return new PageSpeedFetchError(raw, kind, userMessageFor(kind, raw));
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
