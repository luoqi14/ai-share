"use client";

import { createContext, useContext } from "react";
import type { SlideAudioAPI } from "@/hooks/useSlideAudio";

/**
 * SlideAudioContext — makes the current slide's audio API available to any
 * child component without prop-drilling.
 *
 * Primary consumer: end.tsx needs `progress` to drive subtitle tracking.
 * Other slides can use it to build custom controls if needed.
 */
export const SlideAudioContext = createContext<SlideAudioAPI | null>(null);

export const useSlideAudioContext = () => useContext(SlideAudioContext);
