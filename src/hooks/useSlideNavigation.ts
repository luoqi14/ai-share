"use client";

/**
 * useSlideNavigation - Core presentation navigation hook.
 *
 * Handles:
 * - Keyboard navigation (←/→, Space, Home, End, etc.)
 * - Touch/swipe gestures
 * - URL hash sync (e.g., #3)
 * - Programmatic navigation
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { slides, totalSlides } from "@/config/slides";

export interface SlideNavigation {
  currentSlide: number;
  currentStep: number;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  goToFirst: () => void;
  goToLast: () => void;
  isFirst: boolean;
  isLast: boolean;
  progress: number; // 0 to 1
  isOverview: boolean;
  toggleOverview: () => void;
}

export function useSlideNavigation(): SlideNavigation {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isOverview, setIsOverview] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Read initial slide from URL hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const slideIndex = parseInt(hash, 10) - 1;
    if (!isNaN(slideIndex) && slideIndex >= 0 && slideIndex < totalSlides) {
      setCurrentSlide(slideIndex);
      setCurrentStep(0);
    }
  }, []);

  // Sync URL hash on change
  useEffect(() => {
    window.location.hash = `#${currentSlide + 1}`;
  }, [currentSlide]);

  const toggleOverview = useCallback(() => {
    setIsOverview((prev) => !prev);
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrentSlide(Math.max(0, Math.min(index, totalSlides - 1)));
    setCurrentStep(0);
    setIsOverview(false); // Close overview when a slide is selected
  }, []);

  const next = useCallback(() => {
    if (isOverview) return;
    
    // Check if current slide has remaining progressive steps
    const maxSteps = slides[currentSlide]?.steps || 0;
    if (currentStep < maxSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Go to next slide
      if (currentSlide < totalSlides - 1) {
        setCurrentSlide((prev) => prev + 1);
        setCurrentStep(0);
      }
    }
  }, [currentSlide, currentStep, isOverview]);

  const prev = useCallback(() => {
    if (isOverview) return;
    
    // Check if current slide has backwards progressive steps
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      // Go to previous slide, landing on its LAST step
      if (currentSlide > 0) {
        const previousIndex = currentSlide - 1;
        setCurrentSlide(previousIndex);
        setCurrentStep(slides[previousIndex]?.steps || 0);
      }
    }
  }, [currentSlide, currentStep, isOverview]);

  const goToFirst = useCallback(() => setCurrentSlide(0), []);
  const goToLast = useCallback(() => setCurrentSlide(totalSlides - 1), []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "Home":
          e.preventDefault();
          goToFirst();
          break;
        case "End":
          e.preventDefault();
          goToLast();
          break;
        case "Escape":
          e.preventDefault();
          toggleOverview();
          break;
        case "f":
        case "F":
          e.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev, goToFirst, goToLast, toggleOverview]);

  // Touch / Swipe navigation
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isOverview) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;
      const minSwipeDistance = 50;

      // Only horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX < 0) {
          next();
        } else {
          prev();
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [next, prev, isOverview]);

  return {
    currentSlide,
    currentStep,
    goTo,
    next,
    prev,
    goToFirst,
    goToLast,
    isFirst: currentSlide === 0,
    isLast: currentSlide === totalSlides - 1,
    progress: totalSlides > 1 ? currentSlide / (totalSlides - 1) : 0,
    isOverview,
    toggleOverview,
  };
}
