"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { SlideAudioAPI } from "@/hooks/useSlideAudio";

interface SlideAudioBarProps {
  api: SlideAudioAPI;
}

function formatTime(t: number) {
  if (isNaN(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * SlideAudioBar — fixed bottom progress bar rendered by SlideContainer
 * whenever the current step has a loaded audio file.
 *
 * Features:
 * - Draggable scrubber (range input)
 * - Current / total time display
 * - Play / Pause icon button
 * - "Paused" ghost text overlay in center of screen
 */
export default function SlideAudioBar({ api }: SlideAudioBarProps) {
  const { hasAudio, isPlaying, isPaused, duration, toggle, seek } = api;

  // Own RAF — polls audioRef.currentTime so SlideContainer doesn't re-render every frame
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    const tick = () => {
      const t = api.audioRef.current?.currentTime ?? 0;
      setProgress(t);
      rafRef.current = requestAnimationFrame(tick);
    };
    if (hasAudio) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [hasAudio, api.audioRef]);

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <>
      {/* "Paused" ghost indicator */}
      <AnimatePresence>
        {hasAudio && isPaused && (
          <motion.div
            key="paused-indicator"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
          >
            <div className="text-white/20 text-4xl tracking-[0.5em] font-display uppercase blur-[1px]">
              Paused
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <AnimatePresence>
        {hasAudio && (
          <motion.div
            key="audio-bar"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-14 left-10 right-10 z-50 flex items-center gap-3 text-white/40 font-mono text-xs pointer-events-auto group"
          >
            {/* Play / Pause button */}
            <button
              onClick={toggle}
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity hover:text-white"
              aria-label={isPlaying ? "暂停" : "播放"}
            >
              {isPlaying ? (
                /* Pause icon */
                <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                  <rect x="0" y="0" width="4" height="14" rx="1" />
                  <rect x="8" y="0" width="4" height="14" rx="1" />
                </svg>
              ) : (
                /* Play icon */
                <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                  <polygon points="0,0 12,7 0,14" />
                </svg>
              )}
            </button>

            {/* Current time */}
            <span className="w-8 text-right tabular-nums">{formatTime(progress)}</span>

            {/* Scrubber — py-2 enlarges hit area without changing visual height */}
            <input
              type="range"
              min={0}
              max={duration}
              step={0.01}
              value={progress}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="flex-1 h-0.5 py-2 box-content rounded-full appearance-none outline-none cursor-pointer hover:h-1 transition-all opacity-50 group-hover:opacity-100"
              style={{
                background: `linear-gradient(to right, var(--color-primary) ${pct}%, rgba(255,255,255,0.15) ${pct}%)`,
              }}
            />

            {/* Total time */}
            <span className="w-8 text-left tabular-nums">{formatTime(duration)}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Range thumb styles */}
      <style>{`
        .audio-bar-range::-webkit-slider-thumb,
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 0;
          height: 0;
        }
        input[type=range]:hover::-webkit-slider-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 8px rgba(0,240,255,0.8);
          transition: 0.1s;
        }
      `}</style>
    </>
  );
}
