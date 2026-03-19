"use client";

import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const xRatio = (clientX / window.innerWidth - 0.5) * 20;
      const yRatio = (clientY / window.innerHeight - 0.5) * 20;
      containerRef.current.style.setProperty("--mouse-x-ratio", `${xRatio}px`);
      containerRef.current.style.setProperty("--mouse-y-ratio", `${yRatio}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none">
      {/* Parallax Stars layer 1 */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{
          transform:
            "translate(calc(var(--mouse-x-ratio, 0) * -1), calc(var(--mouse-y-ratio, 0) * -1))",
        }}
      >
        <div className="stars absolute inset-0" />
      </div>

      {/* Parallax Stars layer 2 */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{
          transform:
            "translate(calc(var(--mouse-x-ratio, 0) * -2), calc(var(--mouse-y-ratio, 0) * -2))",
        }}
      >
        <div className="stars2 absolute inset-0" />
      </div>

      {/* Soft light blobs — subtle ambient glow */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{
          transform:
            "translate(calc(var(--mouse-x-ratio, 0) * 2), calc(var(--mouse-y-ratio, 0) * 2))",
        }}
      >
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-white/[0.015] blur-[120px] animate-blob" />
      </div>

      <div
        className="absolute inset-0 transition-transform duration-1000 ease-out"
        style={{
          transform:
            "translate(calc(var(--mouse-x-ratio, 0) * 3), calc(var(--mouse-y-ratio, 0) * 3))",
        }}
      >
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-white/[0.015] blur-[120px] animate-blob animation-delay-2000" />
      </div>

      <div
        className="absolute inset-0 transition-transform duration-1000 ease-out"
        style={{
          transform:
            "translate(calc(var(--mouse-x-ratio, 0) * -2), calc(var(--mouse-y-ratio, 0) * -2))",
        }}
      >
        <div className="absolute top-[40%] left-[60%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-white/[0.012] blur-[100px] animate-blob animation-delay-4000" />
      </div>
    </div>
  );
}
