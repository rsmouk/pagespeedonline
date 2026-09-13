import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const runtime = "edge";
export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0f172a 0%, #134e4a 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#0d9488",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            LC
          </div>
          <span style={{ fontSize: 48, fontWeight: 700 }}>
            {siteConfig.name}
          </span>
        </div>
        <p style={{ fontSize: 32, lineHeight: 1.4, opacity: 0.92, maxWidth: 900 }}>
          {siteConfig.tagline}
        </p>
        <p style={{ fontSize: 22, marginTop: 24, opacity: 0.75 }}>
          PageSpeed Insights · Core Web Vitals · Mobile & Desktop
        </p>
      </div>
    ),
    { ...size }
  );
}
