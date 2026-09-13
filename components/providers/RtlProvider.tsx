"use client";

import { useEffect } from "react";

function applyDocumentDirection() {
  const html = document.documentElement;
  const isRtl =
    html.lang === "ar" ||
    html.lang.startsWith("ar-") ||
    html.classList.contains("translated-rtl");

  const nextDir = isRtl ? "rtl" : "ltr";
  if (html.getAttribute("dir") !== nextDir) {
    html.setAttribute("dir", nextDir);
  }

  const hasRtlClass = html.classList.contains("rtl");
  if (isRtl && !hasRtlClass) html.classList.add("rtl");
  if (!isRtl && hasRtlClass) html.classList.remove("rtl");
}

export function RtlProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyDocumentDirection();

    let frame = 0;
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(applyDocumentDirection);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang", "class"],
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return children;
}
