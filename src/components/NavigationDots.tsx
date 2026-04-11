"use client";

/**
 * NavigationDots - Vertical dot navigation on the right side.
 */

import { slides } from "@/config/slides";

interface NavigationDotsProps {
  current: number;
  onNavigate: (index: number) => void;
}

export default function NavigationDots({ current, onNavigate }: NavigationDotsProps) {
  return (
    <nav className="nav-dots" aria-label="Slide navigation">
      {slides.map((slide, index) => (
        <button
          key={slide.id}
          className={`nav-dot ${index === current ? "active" : ""}`}
          onClick={() => onNavigate(index)}
          aria-label={`Go to slide ${index + 1}: ${slide.title}`}
          aria-current={index === current ? "step" : undefined}
          title={slide.title}
        />
      ))}
    </nav>
  );
}
