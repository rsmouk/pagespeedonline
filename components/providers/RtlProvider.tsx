"use client";

import { useEffect } from "react";

function applyDocumentDirection() {
  const html = document.documentElement;
  const isRtl =
    html.lang === "ar" ||
    html.lang.startsWith("ar-") ||
    html.classList.contains("translated-rtl");

  html.dir = isRtl ? "rtl" : "ltr";
  html.classList.toggle("rtl", isRtl);
}

export function RtlProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyDocumentDirection();

    const observer = new MutationObserver(applyDocumentDirection);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang", "class", "dir"],
    });

    return () => observer.disconnect();
  }, []);

  return children;
}
