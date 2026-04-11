"use client";

/**
 * SlideContainer - The main presentation engine.
 *
 * Responsive approach: slides fill 100vw × 100vh directly.
 * No JS-based scaling — uses CSS clamp() and viewport units.
 */

import { slides } from "@/config/slides";
import { useSlideNavigation } from "@/hooks/useSlideNavigation";
import SlideTransition from "@/components/SlideTransition";
import ProgressBar from "@/components/ProgressBar";
import NavigationDots from "@/components/NavigationDots";
import SlideOverview from "@/components/SlideOverview";
import DefaultBackground from "@/components/DefaultBackground";
import { StepContext } from "@/config/StepContext";
import { AnimatePresence } from "motion/react";
import { useEffect, useRef } from "react";

export default function SlideContainer() {
  const {
    currentSlide,
    currentStep,
    goTo,
    progress,
    isOverview,
    toggleOverview,
  } = useSlideNavigation();
  const prevSlideRef = useRef(currentSlide);

  // Determine direction for transitions
  const direction = currentSlide > prevSlideRef.current ? 1 : -1;

  useEffect(() => {
    prevSlideRef.current = currentSlide;
  }, [currentSlide]);

  const CurrentSlideComponent = slides[currentSlide]?.component;

  if (!CurrentSlideComponent) {
    return <div className="text-white p-10">Slide not found!</div>;
  }

  return (
    <div className="slide-viewport bg-[var(--color-background)]">
      <ProgressBar progress={progress} />

      {slides[currentSlide]?.id !== "cover" && <DefaultBackground />}

      {/* Slides render directly at viewport size — no scale wrapper */}
      <SlideTransition
        slideKey={slides[currentSlide].id}
        direction={direction}
        mode="slide"
      >
        <StepContext.Provider value={currentStep}>
          <CurrentSlideComponent />
        </StepContext.Provider>
      </SlideTransition>

      <NavigationDots current={currentSlide} onNavigate={goTo} />

      {/* Global Bottom Bar */}
      <div className="fixed bottom-6 left-8 right-8 md:bottom-8 md:left-12 md:right-12 flex justify-between items-end pointer-events-none z-50">
        <div className="text-[var(--color-text-muted)] text-xs md:text-sm tracking-widest font-mono opacity-60">
          主讲人：罗启
        </div>
        <div className="text-[var(--color-text-muted)] text-[11px] md:text-xs tracking-wider font-mono opacity-40">
          按 [→] 继续 &nbsp;&nbsp;&nbsp; 按 [F] 全屏 &nbsp;&nbsp;&nbsp; 按 [ESC] 总览
        </div>
      </div>

      <AnimatePresence>
        {isOverview && (
          <SlideOverview
            currentSlide={currentSlide}
            onSelect={goTo}
            onClose={toggleOverview}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
