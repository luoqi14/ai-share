"use client";

/**
 * Animated - Reusable animation wrapper for slide content elements.
 *
 * Makes it trivial to add staggered entrance animations to any element.
 * Wrap slide content items with <Animated> and set `delay` for stagger.
 *
 * Usage:
 *   <Animated delay={0.1}>
 *     <h1>Title</h1>
 *   </Animated>
 *   <Animated delay={0.2} direction="up">
 *     <p>Subtitle</p>
 *   </Animated>
 */

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useIsOverview } from "@/config/OverviewContext";

type Direction = "up" | "down" | "left" | "right" | "none";

interface AnimatedProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: Direction;
  className?: string;
}

const directionOffset: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

export default function Animated({
  children,
  delay = 0,
  duration = 0.6,
  direction = "up",
  className,
}: AnimatedProps) {
  const isOverview = useIsOverview();
  const offset = directionOffset[direction];

  if (isOverview) {
    // Return standard div in overview mode to skip ALL animations 
    // and greatly improve performance for 6+ simultaneous slides
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
