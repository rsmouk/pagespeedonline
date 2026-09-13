export const COOKIE_CONSENT_KEY = "lighthouse-cookie-consent";

export function hasCookieConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

export function acceptCookieConsent(): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
  } catch {
    // ignore storage errors (private mode, etc.)
  }
}
