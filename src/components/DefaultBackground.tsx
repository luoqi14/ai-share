"use client";

/**
 * DefaultBackground
 *
 * Provides a consistent, subtle ambient background for all content slides.
 * Features a dark background with very soft, large blurred orbs (cyan top-left, purple right)
 * matching the provided design.
 */
export default function DefaultBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[var(--color-background)]">
      {/* Top-left subtle primary (cyan) glow */}
      <div
        className="absolute rounded-full w-[70vw] h-[80vh] left-[-20%] top-[-30%]"
        style={{
          background: "radial-gradient(circle, rgba(0, 240, 255, 0.1) 0%, transparent 100%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute rounded-full w-[70vw] h-[80vh] right-[-20%] bottom-[-30%]"
        style={{
          background: "radial-gradient(circle, rgba(0, 240, 255, 0.1) 0%, transparent 100%)",
          filter: "blur(60px)",
        }}
      />

      {/* Right/Bottom-right subtle secondary (purple) glow */}
      <div
        className="absolute rounded-full w-[75vw] h-[100vh] right-[-25%] top-[-50%]"
        style={{
          background: "radial-gradient(circle, rgba(208, 188, 255, 0.2) 0%, transparent 100%)",
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}
