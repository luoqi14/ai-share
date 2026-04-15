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
import { SlideAudioContext } from "@/config/SlideAudioContext";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useSlideAudio } from "@/hooks/useSlideAudio";
import SlideAudioBar from "@/components/SlideAudioBar";

export default function SlideContainer() {
  const {
    currentSlide,
    currentStep,
    goTo,
    next,
    progress,
    isOverview,
    toggleOverview,
  } = useSlideNavigation();
  // "Store previous state" pattern — safe to read during render, no ref needed
  const [prevSlide, setPrevSlide] = useState(currentSlide);
  if (currentSlide !== prevSlide) setPrevSlide(currentSlide);
  const direction = currentSlide >= prevSlide ? 1 : -1;

  // Block audio autoplay until the user has interacted with the page.
  // This prevents audio from firing on direct URL load (both / and /#N).
  const [hasInteracted, setHasInteracted] = useState(false);
  useEffect(() => {
    const onInteract = () => setHasInteracted(true);
    window.addEventListener("keydown", onInteract, { once: true });
    window.addEventListener("click", onInteract, { once: true });
    window.addEventListener("touchend", onInteract, { once: true });
    return () => {
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("click", onInteract);
      window.removeEventListener("touchend", onInteract);
    };
  }, []);

  // Per-step narration: auto-plays, exposes API for bar + end slide
  const audioApi = useSlideAudio(
    slides[currentSlide].id,
    currentStep,
    hasInteracted && !isOverview,
    next, // auto-advance when clip ends
  );

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
          <SlideAudioContext.Provider value={audioApi}>
            <CurrentSlideComponent />
          </SlideAudioContext.Provider>
        </StepContext.Provider>
      </SlideTransition>

      {/* Global audio progress bar (hidden when no audio file for this step) */}
      <SlideAudioBar api={audioApi} />

      <NavigationDots current={currentSlide} onNavigate={goTo} />

      {/* Global Bottom Bar */}
      <div className="fixed bottom-6 left-8 right-8 md:bottom-8 md:left-12 md:right-12 flex justify-end items-end pointer-events-none z-50">
        <div className="text-white text-[11px] md:text-xs tracking-wider font-mono opacity-45">
          按 [→] 继续 | 按 [←] 后退 | 按 [空格] 播放/暂停 | 按 [F] 全屏 | 按 [ESC] 总览
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
