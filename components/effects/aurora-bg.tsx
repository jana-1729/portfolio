"use client";
import { useReducedMotion } from "framer-motion";

export function AuroraBg({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute inset-0" style={{ filter: "blur(70px)", mixBlendMode: "screen" }}>
        <div
          className="absolute h-[50vw] w-[50vw] rounded-full"
          style={{
            top: "-10%", left: "-10%",
            background: "radial-gradient(circle, rgba(168,85,247,0.55) 0%, transparent 60%)",
            animation: reduce ? undefined : "aurora-1 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute h-[60vw] w-[60vw] rounded-full"
          style={{
            bottom: "-20%", right: "-15%",
            background: "radial-gradient(circle, rgba(6,182,212,0.45) 0%, transparent 60%)",
            animation: reduce ? undefined : "aurora-2 22s ease-in-out infinite",
          }}
        />
        <div
          className="absolute h-[40vw] w-[40vw] rounded-full"
          style={{
            top: "30%", left: "30%",
            background: "radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 60%)",
            animation: reduce ? undefined : "aurora-3 26s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
