"use client";

/**
 * SlideTitle
 *
 * Reusable animated title that starts centered (step 0) and flies to the
 * top-left corner (step >= 1) — shared by all content slides.
 *
 * Props:
 *  - title:    The main heading text
 *  - label:    The small section label shown above the title (hidden after fly)
 *  - moved:    Whether the title has flown to its corner position (step >= 1)
 */

import { motion } from "motion/react";

interface SlideTitleProps {
  title: string;
  label: string;
  subtitle?: string;
  moved: boolean;
}

const SPRING = { type: "spring" as const, stiffness: 120, damping: 24, mass: 0.8 };

export default function SlideTitle({ title, label, subtitle, moved }: SlideTitleProps) {
  return (
    <motion.div
      className="z-20 flex flex-col"
      animate={{
        top: moved ? "clamp(2rem, 5vh, 5rem)" : "50%",
        left: moved ? "clamp(2rem, 6vw, 8rem)" : "50%",
        translateX: moved ? "0%" : "-50%",
        translateY: moved ? "0%" : "-50%",
      }}
      transition={SPRING}
      style={{ position: "absolute" }}
    >
      {/* Section label — visible only in centered state */}
      <motion.div
        animate={{ opacity: moved ? 0 : 1, height: moved ? 0 : "auto" }}
        transition={{ duration: 0.3 }}
        className="mb-8 text-center overflow-hidden"
      >
        <span className="section-label">{label}</span>
      </motion.div>

      {/* Main heading */}
      <motion.h1
        className="font-display font-extrabold leading-none tracking-[-0.03em] !m-0 whitespace-nowrap"
        animate={{
          fontSize: moved ? "clamp(1.5rem, 3vw, 2.5rem)" : "clamp(3.5rem, 9vw, 8rem)",
        }}
        transition={SPRING}
        style={{
          background: moved
            ? "none"
            : "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)",
          WebkitBackgroundClip: moved ? "unset" : "text",
          backgroundClip: moved ? "unset" : "text",
          WebkitTextFillColor: moved ? "var(--color-primary)" : "transparent",
          color: moved ? "var(--color-primary)" : "transparent",
          textShadow: moved
            ? "none"
            : "0 0 40px rgba(0, 240, 255, 0.3), 0 0 80px rgba(0, 240, 255, 0.15)",
            textAlign: moved ? 'left' : 'center'
        }}
      >
        {title}
      </motion.h1>

      {/* Subtitle explanation */}
      {subtitle && (
        <motion.div
          animate={{
            fontSize: moved ? "clamp(0.8rem, 1.2vw, 1rem)" : "clamp(1.2rem, 2.5vw, 1.8rem)",
            opacity: moved ? 0 : 0.9,
            marginTop: moved ? "0.25rem" : "1.5rem",
          }}
          transition={SPRING}
          className="font-body tracking-widest text-right text-[var(--color-secondary)]"
          style={{ textShadow: moved ? "none" : "0 0 20px rgba(208, 188, 255, 0.4)" }}
        >
          {subtitle}
        </motion.div>
      )}
    </motion.div>
  );
}
