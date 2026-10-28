"use client";

import { useEffect, useRef } from "react";

/**
 * Full-bleed background video. Autoplays muted; pauses when the user
 * prefers reduced motion (the poster gradient beneath it stays visible).
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (media.matches) {
        video.pause();
      } else {
        video.play().catch(() => {
          /* autoplay can be blocked; the gradient fallback still shows */
        });
      }
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  return (
    <video
      ref={ref}
      src="/videos/hero.mp4"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
