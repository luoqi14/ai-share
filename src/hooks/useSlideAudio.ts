"use client";

/**
 * useSlideAudio — Universal per-step narration player.
 *
 * Convention: /voice/{slideId}/{slideId}{step}.mp3
 * e.g.  /voice/what-is-ai/what-is-ai2.mp3
 *
 * Returns SlideAudioAPI so callers (SlideContainer, end slide) can
 * render a progress bar, pause/resume, and track currentTime.
 *
 * Behaviour:
 * - On every (slideId, step, enabled) change: stops previous audio, loads and
 *   plays the new file. 404 / missing files are silently skipped (hasAudio stays false).
 * - Space key (capture phase) → pause / resume when hasAudio is true.
 * - onEnded fires when the audio clip ends naturally → used for auto-advance.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import type { RefObject } from "react";

export interface SlideAudioAPI {
  /** The underlying HTMLAudioElement — consumers poll currentTime directly */
  audioRef: RefObject<HTMLAudioElement | null>;
  /** True once the audio file has loaded metadata (i.e. the file actually exists) */
  hasAudio: boolean;
  /** Currently playing (not paused, not ended) */
  isPlaying: boolean;
  /** User explicitly paused playback */
  isPaused: boolean;
  /** Total duration in seconds */
  duration: number;
  /** Pause if playing, resume if paused */
  toggle: () => void;
  /** Seek to an arbitrary time in seconds */
  seek: (time: number) => void;
}

type AudioState = { hasAudio: boolean; isPlaying: boolean; isPaused: boolean; duration: number };
const RESET_STATE: AudioState = { hasAudio: false, isPlaying: false, isPaused: false, duration: 1 };

export function useSlideAudio(
  slideId: string,
  step: number,
  enabled: boolean,
  onEnded?: () => void,
): SlideAudioAPI {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Keep onEnded stable so the load effect doesn't re-run when the callback changes
  const onEndedRef = useRef(onEnded);
  useEffect(() => { onEndedRef.current = onEnded; });

  // Single state object → one dispatch per transition, no cascading re-renders
  const [{ hasAudio, isPlaying, isPaused, duration }, setAudioState] =
    useState<AudioState>(RESET_STATE);

  // ── Load + play effect ───────────────────────────────────────────────────────
  useEffect(() => {
    // Guard flag: prevents stale async event handlers from firing after cleanup.
    let isActive = true;

    if (!enabled) {
      // Cleanup resets state — no direct setState in effect body
      return () => { setAudioState(RESET_STATE); };
    }

    // NOTE: progress is NOT tracked in state here. SlideAudioBar and end.tsx
    // each run their own lightweight RAF to read audioRef.current.currentTime.
    // This prevents SlideContainer (and every slide child) from re-rendering
    // every frame while audio is playing.

    const src = `/voice/${slideId}/${slideId}${step}.mp3`;
    const audio = new Audio(src);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      if (!isActive) return;
      setAudioState(s => ({ ...s, hasAudio: true, duration: isNaN(audio.duration) ? 1 : audio.duration }));
    });

    audio.addEventListener("error", () => {
      if (!isActive) return;
      audioRef.current = null;
    });

    audio.addEventListener("ended", () => {
      if (!isActive) return;
      setAudioState(s => ({ ...s, isPlaying: false, isPaused: false }));
      onEndedRef.current?.();
    });

    audio.play()
      .then(() => { if (isActive) setAudioState(s => ({ ...s, isPlaying: true })); })
      .catch(() => { /* autoplay blocked or file missing */ });

    return () => {
      isActive = false;
      audio.pause();
      audio.src = "";            // may fire async "error" — isActive guard stops it
      audioRef.current = null;
      setAudioState(RESET_STATE); // Reset runs before next effect, not during render
    };
  }, [slideId, step, enabled]);

  // ── Controls ─────────────────────────────────────────────────────────────────
  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play()
        .then(() => setAudioState(s => ({ ...s, isPlaying: true, isPaused: false })))
        .catch(() => {});
    } else {
      audio.pause();
      setAudioState(s => ({ ...s, isPlaying: false, isPaused: true }));
    }
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    // No progress state — consumers' own RAF will pick up the new time
  }, []);

  // ── Space key: pause / resume (capture phase beats navigation handler) ───────
  useEffect(() => {
    if (!hasAudio) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === " ") {
        e.preventDefault();
        e.stopImmediatePropagation();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [hasAudio, toggle]);

  return { audioRef, hasAudio, isPlaying, isPaused, duration, toggle, seek };
}
