"use client";

/**
 * SlideTransition - Wraps each slide with entry/exit animations.
 *
 * Uses Motion's AnimatePresence for smooth slide transitions.
 * Supports multiple transition modes: slide, fade, zoom.
 */

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

export type TransitionMode = "slide" | "fade" | "zoom";

interface SlideTransitionProps {
  slideKey: string;
  direction: number; // -1 = backward, 1 = forward
  mode?: TransitionMode;
  children: ReactNode;
}

const variants = {
  slide: {
    enter: (direction: number) => ({
      x: direction > 0 ? "15vw" : "-15vw",
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-15vw" : "15vw",
      opacity: 0,
      scale: 0.98,
    }),
  },
  fade: {
    enter: () => ({
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      opacity: 1,
      scale: 1,
    },
    exit: () => ({
      opacity: 0,
      scale: 0.98,
    }),
  },
  zoom: {
    enter: (direction: number) => ({
      opacity: 0,
      scale: direction > 0 ? 1.1 : 0.9,
    }),
    center: {
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      opacity: 0,
      scale: direction > 0 ? 0.9 : 1.1,
    }),
  },
};

const transition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 30,
  mass: 0.8,
};

export default function SlideTransition({
  slideKey,
  direction,
  mode = "slide",
  children,
}: SlideTransitionProps) {
  const variant = variants[mode];

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={slideKey}
        custom={direction}
        variants={variant}
        initial="enter"
        animate="center"
        exit="exit"
        transition={transition}
        style={{
          position: "absolute",
          inset: 0,
          willChange: "transform, opacity",
          transformOrigin: "center center",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
