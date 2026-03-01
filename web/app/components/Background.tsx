"use client";

import { useEffect, useMemo, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function ParallaxBackground() {
  const [y, setY] = useState(0);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const onScroll = () => setY(window.scrollY || 0);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduceMotion]);

  // Very subtle parallax (keep it tiny so it feels premium)
  const s = clamp(y, 0, 1200);
  const layer1 = reduceMotion ? 0 : -s * 0.05;
  const layer2 = reduceMotion ? 0 : -s * 0.025;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base wash */}
      <div className="absolute inset-0 bg-warm" />

      {/* parallax layers */}
      <div
        className="absolute inset-0 bg-warm-layer1"
        style={{ transform: `translate3d(0, ${layer1}px, 0)` }}
      />
      <div
        className="absolute inset-0 bg-warm-layer2"
        style={{ transform: `translate3d(0, ${layer2}px, 0)` }}
      />

      {/* subtle grain */}
      <div className="absolute inset-0 bg-grain opacity-[0.08]" />
    </div>
  );
}