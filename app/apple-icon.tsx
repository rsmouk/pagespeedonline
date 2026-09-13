import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f766e 0%, #2dd4bf 100%)",
          borderRadius: 36,
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 21.5a9 9 0 0 1 18 0"
            stroke="#ffffff"
            strokeWidth="2.25"
            strokeLinecap="round"
            opacity="0.35"
          />
          <path
            d="M9.5 21a6.5 6.5 0 0 1 13 0"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="16" cy="21" r="2" fill="#ffffff" />
          <path
            d="M16 21V13.5"
            stroke="#ffffff"
            strokeWidth="2.25"
            strokeLinecap="round"
          />
          <circle cx="16" cy="13.5" r="1.25" fill="#ffffff" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
