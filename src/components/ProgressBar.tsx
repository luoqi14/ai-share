"use client";

/**
 * ProgressBar - Top progress indicator showing presentation advancement.
 */

interface ProgressBarProps {
  progress: number; // 0 to 1
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div
      className="progress-bar"
      style={{ width: `${progress * 100}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
