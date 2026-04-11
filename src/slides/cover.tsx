"use client";

/**
 * Cover Slide — "与AI共舞"
 * The Obsidian Monolith Design System Implementation
 * Strictly uses Tailwind utilities and global design tokens.
 * NO inline styles enabled.
 */

import Animated from "@/components/Animated";
import { motion } from "motion/react";

// 纯函数：生成确定的伪随机星空粒子，避免 SSR Hydration 不匹配
const generateStars = (count: number) => {
  return Array.from({ length: count }).map((_, i) => {
    const size = Math.abs(Math.sin(i * 10)) * 2 + 0.5;
    const blur = Math.abs(Math.sin(i * 555)) * 1.5;
    // Pseudo-randomly assign a primary (cyan) or secondary (purple) hue bias
    const isPurple = Math.sin(i * 888) > 0;

    return {
      id: i,
      x: `${(Math.sin(i * 1234.5) * 50 + 50).toFixed(2)}%`,
      y: `${(Math.cos(i * 5432.1) * 50 + 50).toFixed(2)}%`,
      size: `${size.toFixed(2)}px`,
      blur: `blur(${blur.toFixed(2)}px)`,
      duration: Math.abs(Math.sin(i * 432)) * 6 + 4,
      delay: Math.abs(Math.cos(i * 234)) * 5,
      yOffset: Math.sin(i * 789) * 20,
      isPurple,
    };
  });
};

const stars = generateStars(60);

export default function SlideCover() {
  return (
    <div className="slide slide-centered !p-0 overflow-hidden bg-[var(--color-background)]">

      {/* ====== Ambient Background Orbs ====== */}
      {/* Orb 1: Primary Ambient Glow */}
      <motion.div
        className="absolute rounded-full w-[400px] h-[400px] monolith-orb-primary left-[80%] top-[10%] -translate-x-1/2 -translate-y-1/2 will-change-transform will-change-opacity"
        animate={{
          x: ["-50%", "calc(-50% - 20px)", "-50%"],
          y: ["-50%", "calc(-50% + 30px)", "-50%"],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0 }}
      />

      {/* Orb 2: Secondary Ambient Glow */}
      <motion.div
        className="absolute rounded-full w-[500px] h-[500px] monolith-orb-secondary left-[10%] top-[70%] -translate-x-1/2 -translate-y-1/2 will-change-transform will-change-opacity"
        animate={{
          x: ["-50%", "calc(-50% + 30px)", "-50%"],
          y: ["-50%", "calc(-50% - 20px)", "-50%"],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Orb 3: Sharp High-pass Blur (White/Bright) */}
      <motion.div
        className="absolute rounded-full w-[80px] h-[80px] bg-white/10 blur-[20px] left-[75%] top-[20%] -translate-x-1/2 -translate-y-1/2 will-change-transform will-change-opacity"
        animate={{
          x: ["-50%", "calc(-50% + 10px)", "-50%"],
          y: ["-50%", "calc(-50% + 10px)", "-50%"],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Orb 4: Deep Purple Secondary Blur */}
      <motion.div
        className="absolute rounded-full w-[120px] h-[120px] bg-[#d0bcff]/10 blur-[30px] left-[25%] top-[75%] -translate-x-1/2 -translate-y-1/2 will-change-transform will-change-opacity"
        animate={{
          x: ["-50%", "calc(-50% - 15px)", "-50%"],
          y: ["-50%", "calc(-50% + 15px)", "-50%"],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* ====== Starry Sky Particles ====== */}
      <div className="absolute inset-0 pointer-events-none z-0 mix-blend-screen">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              filter: star.blur,
              willChange: "transform, opacity, box-shadow, background-color",
            }}
            animate={{
              y: [0, star.yOffset, 0],
              opacity: [0.1, 0.9, 0.1],
              scale: [1, 2.5, 1],
              backgroundColor: star.isPurple
                ? ["rgba(219, 252, 255, 0.8)", "rgba(208, 188, 255, 1)", "rgba(219, 252, 255, 0.8)"]
                : ["rgba(219, 252, 255, 0.8)", "rgba(0, 240, 255, 1)", "rgba(219, 252, 255, 0.8)"],
              boxShadow: star.isPurple
                ? [
                    "0 0 0px 0px rgba(208, 188, 255, 0)",
                    "0 0 12px 2px rgba(208, 188, 255, 0.9)",
                    "0 0 0px 0px rgba(208, 188, 255, 0)",
                  ]
                : [
                    "0 0 0px 0px rgba(0, 240, 255, 0)",
                    "0 0 12px 2px rgba(0, 240, 255, 0.9)",
                    "0 0 0px 0px rgba(0, 240, 255, 0)",
                  ],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: star.delay,
            }}
          />
        ))}
      </div>


      {/* ====== Central Geometry & Glow ====== */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <motion.div
          className="relative rounded-[24px] monolith-geometry-container ambient-glow will-change-transform"
          animate={{
            y: [-10, 10, -10]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Intense center burst inside the geometric box */}
          <div className="absolute inset-0 rounded-[24px] monolith-geometry-core" />

          {/* Glass reflections */}
          <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute bottom-10 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-[var(--color-primary-fixed)] to-transparent blur-[1px]" />
        </motion.div>
      </div>

      {/* ====== Content ====== */}

      {/* Main Title - The Hero Space Grotesk */}
      <Animated delay={0.4} className="z-10 flex flex-col items-center">
        <h1 className="font-display text-[clamp(4rem,10vw,9rem)] font-extrabold leading-none tracking-[-0.04em] text-gradient-primary drop-shadow-2xl !m-0">
          与AI共舞
        </h1>
      </Animated>

      {/* Subtitle - The Narrative Manrope */}
      <Animated delay={0.6} className="z-10 mt-[8vh]">
        <p className="font-body text-[clamp(1.1rem,2.5vw,2.2rem)] tracking-[0.4em] text-[var(--color-secondary)] font-light drop-shadow-lg !m-0">
          主流AI模型与工具评测
        </p>
      </Animated>
    </div>
  );
}
