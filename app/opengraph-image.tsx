import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ascent — Build a resume that gets you hired";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #fdf4e3 0%, #f8e3b6 55%, #eab96f 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "14px 34px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.7)",
            border: "1px solid #e5ddd0",
            marginBottom: 44,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "#201a15",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#faf6ee",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            ▲
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#201a15" }}>Ascent</div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            color: "#201a15",
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          Build a resume that gets you hired
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#5c554a",
            textAlign: "center",
            marginTop: 28,
            maxWidth: 760,
            lineHeight: 1.5,
          }}
        >
          AI suggestions you review and apply · ATS-friendly PDF · Free plan included
        </div>
      </div>
    ),
    { ...size }
  );
}
