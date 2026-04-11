"use client";

import { motion, AnimatePresence } from "motion/react";
import type { ReactNode } from "react";
import { useCurrentStep } from "@/config/StepContext";
import { useIsOverview } from "@/config/OverviewContext";

interface StepProps {
  index: number;
  children: ReactNode;
  className?: string;
}

/**
 * Step (Fragment) Component
 * Encapsulates content that should only be revealed when the slide reaches a specific progressive step.
 * e.g., <Step index={1}> will be invisible when slide step is 0, and animate in when going to step 1.
 */
export default function Step({ index, children, className = "" }: StepProps) {
  const currentStep = useCurrentStep();
  const isOverview = useIsOverview();

  // In overview mode, reveal all steps unconditionally
  const isVisible = isOverview || currentStep >= index;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
