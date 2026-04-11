"use client";

/**
 * SlideOverview - A simple and performant grid view of all slides.
 * Triggered by pressing 'ESC'.
 */

import { slides } from "@/config/slides";

interface SlideOverviewProps {
  currentSlide: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

export default function SlideOverview({
  currentSlide,
  onSelect,
  onClose,
}: SlideOverviewProps) {
  return (
    <div className="absolute inset-0 z-50 bg-[var(--color-background)] overflow-y-auto p-12">
      <div className="max-w-[1200px] mx-auto mt-12">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="!mb-2 text-[48px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-text-primary)] to-[var(--color-text-muted)]">
              所有幻灯片
            </h2>
          </div>
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] transition-colors text-[18px] cursor-pointer font-medium"
          >
            返回演示
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {slides.map((slide, index) => {
            const isCurrent = index === currentSlide;

            return (
              <div
                key={slide.id}
                onClick={() => onSelect(index)}
                className={`relative cursor-pointer group flex flex-col justify-between p-6 rounded-2xl transition-all duration-300 border-2 min-h-[160px] ${isCurrent
                  ? "bg-[var(--color-accent-glow)] border-[var(--color-accent)] shadow-[0_0_20px_var(--color-accent-glow)] scale-105"
                  : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:-translate-y-1"
                  }`}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`font-mono text-[32px] font-bold leading-none ${isCurrent ? "text-[var(--color-accent)]" : "text-[var(--color-border-subtle)] group-hover:text-[var(--color-text-muted)]"
                      } transition-colors duration-300`}
                  >
                    {(index + 1).toString().padStart(2, '0')}
                  </span>

                  {isCurrent && (
                    <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                  )}
                </div>

                <div className="mt-8">
                  {slide.section && (
                    <div className="text-[12px] font-bold tracking-wider text-[var(--color-text-muted)] uppercase mb-1">
                      {slide.section}
                    </div>
                  )}
                  <h3 className={`text-[20px] font-medium leading-tight !mb-0 ${isCurrent ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"
                    }`}>
                    {slide.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
