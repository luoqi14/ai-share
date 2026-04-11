"use client";

/**
 * SlideCounter - Shows "current / total" at bottom-right.
 */

import { totalSlides } from "@/config/slides";

interface SlideCounterProps {
  current: number; // 0-indexed
}

export default function SlideCounter({ current }: SlideCounterProps) {
  return (
    <div className="slide-counter">
      {current + 1} / {totalSlides}
    </div>
  );
}
