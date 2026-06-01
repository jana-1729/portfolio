import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Janarthanan S — Member of Technical Staff";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a14",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          color: "white",
          fontFamily: "Space Grotesk, Inter, sans-serif",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(168,85,247,.55), transparent 50%), radial-gradient(circle at 10% 90%, rgba(6,182,212,.45), transparent 50%)" }} />
        <div style={{ position: "relative", fontFamily: "monospace", fontSize: 20, letterSpacing: 6, textTransform: "uppercase", opacity: 0.6, display: "flex" }}>portfolio · 2026</div>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 80, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, display: "flex" }}>Janarthanan S</div>
          <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.03em", background: "linear-gradient(90deg, #a855f7, #06b6d4, #ec4899)", backgroundClip: "text", color: "transparent", display: "flex" }}>builds the web at scale.</div>
          <div style={{ fontSize: 24, opacity: 0.7, marginTop: 12, display: "flex" }}>Member of Technical Staff · SurveySparrow</div>
        </div>
      </div>
    ),
    size,
  );
}
