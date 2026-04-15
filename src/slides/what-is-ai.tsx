"use client";

/**
 * Slide — "AI大模型是什么"
 * Step 0: Title centered
 * Step 1: Title → top-left, Magic Box appears
 * Step 2: 文本 input + output + arrows (both at once)
 * Step 3: 图像/音频/视频 inputs + arrows (all at once)
 * Step 4: 图像/音频/视频 outputs + arrows (all at once)
 * Step 5: Math formula Y ∼ f(X; θ)
 * Step 6: Token nodes inserted between inputs/outputs and model
 */

import { useCurrentStep } from "@/config/StepContext";
import { motion, AnimatePresence } from "motion/react";
import SlideTitle from "@/components/SlideTitle";
import { useRef, useState, useEffect, useCallback } from "react";
import { BlockMath, InlineMath } from "react-katex";

// Data definitions
const inputItems = [
  { label: "文本", step: 2, color: "var(--color-primary-fixed-dim)" },
  { label: "图像", step: 3, color: "var(--color-primary-fixed-dim)" },
  { label: "音频", step: 3, color: "var(--color-primary-fixed-dim)" },
  { label: "视频", step: 3, color: "var(--color-primary-fixed-dim)" },
];

const outputItems = [
  { label: "文本", step: 2, color: "var(--color-secondary)" },
  { label: "图像", step: 4, color: "var(--color-secondary)" },
  { label: "音频", step: 4, color: "var(--color-secondary)" },
  { label: "视频", step: 4, color: "var(--color-secondary)" },
];

const MEDIA_ICONS: Record<string, React.ReactNode> = {
  "文本": <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" /></svg>,
  "图像": <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>,
  "音频": <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10v3" /><path d="M6 6v11" /><path d="M10 3v18" /><path d="M14 8v7" /><path d="M18 5v13" /><path d="M22 10v3" /></svg>,
  "视频": <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
};

// Curved arrow path builder
function buildArrowPath(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const cp1x = x1 + dx * 0.4;
  const cp2x = x1 + dx * 0.6;
  return `M ${x1} ${y1} C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x2} ${y2}`;
}

interface ArrowData {
  path: string;
  visible: boolean;
  type: "input" | "output";
}

export default function SlideWhatIsAI() {
  const step = useCurrentStep();
  const showBox = step >= 1;

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);
  const outputRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tokenInRef = useRef<HTMLDivElement>(null);
  const tokenOutRef = useRef<HTMLDivElement>(null);

  const [arrows, setArrows] = useState<ArrowData[]>([]);

  const measureArrows = useCallback(() => {
    if (!containerRef.current || !boxRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    const bRect = boxRef.current.getBoundingClientRect();
    const bCY = bRect.top + bRect.height / 2 - cRect.top;
    const bLeft = bRect.left - cRect.left;
    const bRight = bRect.right - cRect.left;

    const newArrows: ArrowData[] = [];

    if (step >= 6 && tokenInRef.current && tokenOutRef.current) {
      // Step 6: input chips → tokenIn → box → tokenOut → output chips
      const tinR = tokenInRef.current.getBoundingClientRect();
      const tinLeft = tinR.left - cRect.left;
      const tinRight = tinR.right - cRect.left;
      const tinCY = tinR.top + tinR.height / 2 - cRect.top;

      const toutR = tokenOutRef.current.getBoundingClientRect();
      const toutLeft = toutR.left - cRect.left;
      const toutRight = toutR.right - cRect.left;
      const toutCY = toutR.top + toutR.height / 2 - cRect.top;

      // Input chips → token in (converge)
      inputRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        newArrows.push({
          path: buildArrowPath(r.right - cRect.left + 8, r.top + r.height / 2 - cRect.top, tinLeft - 4, tinCY),
          visible: step >= inputItems[i].step,
          type: "input",
        });
      });

      // Token in → box (single)
      newArrows.push({
        path: buildArrowPath(tinRight + 4, tinCY, bLeft - 4, bCY),
        visible: true,
        type: "input",
      });

      // Box → token out (single)
      newArrows.push({
        path: buildArrowPath(bRight + 4, bCY, toutLeft - 4, toutCY),
        visible: true,
        type: "output",
      });

      // Token out → output chips (diverge)
      outputRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        newArrows.push({
          path: buildArrowPath(toutRight + 4, toutCY, r.left - cRect.left - 8, r.top + r.height / 2 - cRect.top),
          visible: step >= outputItems[i].step,
          type: "output",
        });
      });

    } else {
      // Steps 1–8: direct input → box → output
      inputRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        newArrows.push({
          path: buildArrowPath(r.right - cRect.left + 8, r.top + r.height / 2 - cRect.top, bLeft - 4, bCY),
          visible: step >= inputItems[i].step,
          type: "input",
        });
      });

      outputRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        newArrows.push({
          path: buildArrowPath(bRight + 4, bCY, r.left - cRect.left - 8, r.top + r.height / 2 - cRect.top),
          visible: step >= outputItems[i].step,
          type: "output",
        });
      });
    }

    setArrows(newArrows);
  }, [step]);

  useEffect(() => {
    const timer = setTimeout(measureArrows, 500);
    window.addEventListener("resize", measureArrows);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measureArrows);
    };
  }, [step, measureArrows]);

  return (
    <div ref={containerRef} className="slide !p-0 overflow-hidden">
      {/* ====== Animated Title ====== */}
      <SlideTitle title="AI大模型" label="LMM (Large Multimodal Model)" moved={showBox} />

      {/* ====== Central Layout: Inputs | Box | Outputs ====== */}
      <div className="absolute inset-0 flex items-start sm:items-center justify-center z-10 pt-[18vh] sm:pt-0 pb-8 sm:pb-0 overflow-y-auto sm:overflow-hidden pointer-events-auto sm:pointer-events-none">
        <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-[clamp(0.5rem,7vw,8rem)]">

          {/* ====== Input Column ====== */}
          <div className="flex flex-col items-center sm:items-end gap-2 sm:gap-3 relative">
            <motion.div
              className="hidden sm:block absolute -top-12 right-0 text-[var(--color-text-primary)] text-xs sm:text-sm md:text-base font-semibold tracking-widest whitespace-nowrap opacity-60 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: step >= 2 ? 0.8 : 0 }}
            >
              {step >= 3 ? "多模态输入 / MULTIMODAL" : "输入 / INPUT"}
            </motion.div>
            <div className="flex flex-row sm:flex-col flex-wrap justify-center gap-2 sm:gap-3">
              {inputItems.map((item, i) => (
                <motion.div
                  key={item.label + "-in"}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{
                    opacity: step >= item.step ? 1 : 0,
                    x: step >= item.step ? 0 : 20,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div className="data-chip flex items-center gap-1.5 text-[clamp(0.65rem,1.1vw,1rem)] !px-2 !py-1 sm:!px-4 sm:!py-2.5">
                    <span className="opacity-80" style={{ color: item.color }}>{MEDIA_ICONS[item.label]}</span>
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ====== Token: Input → Model ====== */}
          <AnimatePresence>
            {step >= 6 && (
              <motion.div
                className="hidden sm:flex flex-col items-center gap-1"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div
                  ref={tokenInRef}
                  className="px-3 py-1 rounded-full font-mono tracking-widest uppercase border whitespace-nowrap text-[clamp(0.55rem,0.7vw,0.7rem)]"
                  style={{
                    background: "rgba(0, 240, 255, 0.07)",
                    borderColor: "rgba(0, 240, 255, 0.4)",
                    color: "#00f0ff",
                    boxShadow: "0 0 12px rgba(0, 240, 255, 0.15)",
                  }}
                >
                  token
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ====== Magic Box ====== */}
          <motion.div
            ref={boxRef}
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: showBox ? 1 : 0,
              scale: showBox ? 1 : 0.5,
            }}
            transition={{
              scale: { type: "spring", stiffness: 100, damping: 20, delay: showBox ? 0.2 : 0 },
              opacity: { duration: 0.4, delay: showBox ? 0.2 : 0 },
            }}
          >
            <motion.div
              className="absolute -top-[clamp(48px,10vh,100px)] text-[var(--color-primary)] text-xs sm:text-sm md:text-base font-bold tracking-widest whitespace-nowrap uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: showBox ? 0.9 : 0, y: showBox ? 0 : 10 }}
              transition={{ delay: 0.6 }}
            >
              核心引擎 / ENGINE
            </motion.div>

            {/* Ambient glow */}
            <motion.div
              className="absolute rounded-full monolith-orb-primary w-[clamp(180px,45vw,500px)] h-[clamp(180px,45vw,500px)]"
              animate={{
                opacity: showBox && step < 5 ? [0.2, 0.5, 0.2] : (step >= 5 ? [0.05, 0.15, 0.05] : 0),
                scale: showBox ? [0.9, 1.1, 0.9] : 0.5,
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <AnimatePresence mode="wait">
              {step < 5 ? (
                <motion.svg
                  key="magic-box"
                  viewBox="0 0 200 220"
                  className="w-[clamp(100px,28vw,420px)] h-auto relative z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1, y: [-5, 5, -5] }}
                  exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                  transition={{
                    y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 0.4 },
                    scale: { duration: 0.4 }
                  }}
                >
                  <defs>
                    <linearGradient id="topFace" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="leftFace" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.02" />
                    </linearGradient>
                    <linearGradient id="rightFace" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#d0bcff" stopOpacity="0.06" />
                      <stop offset="100%" stopColor="#d0bcff" stopOpacity="0.01" />
                    </linearGradient>
                    <filter id="edgeGlow">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <polygon points="100,20 180,60 100,100 20,60" fill="url(#topFace)" stroke="rgba(0,240,255,0.3)" strokeWidth="1" />
                  <polygon points="20,60 100,100 100,190 20,150" fill="url(#leftFace)" stroke="rgba(0,240,255,0.15)" strokeWidth="1" />
                  <polygon points="180,60 100,100 100,190 180,150" fill="url(#rightFace)" stroke="rgba(208,188,255,0.15)" strokeWidth="1" />

                  <g filter="url(#edgeGlow)">
                    <line x1="20" y1="60" x2="100" y2="100" stroke="#00f0ff" strokeWidth="1" opacity="0.6" />
                    <line x1="180" y1="60" x2="100" y2="100" stroke="#00f0ff" strokeWidth="1" opacity="0.4" />
                    <line x1="100" y1="20" x2="20" y2="60" stroke="#00f0ff" strokeWidth="1" opacity="0.5" />
                    <line x1="100" y1="20" x2="180" y2="60" stroke="#00f0ff" strokeWidth="1" opacity="0.5" />
                    <line x1="100" y1="100" x2="100" y2="190" stroke="#00f0ff" strokeWidth="1.5" opacity="0.7" />
                  </g>

                  <circle cx="100" cy="105" r="3" fill="#00f0ff" opacity="0.8">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="100" cy="105" r="12" fill="none" stroke="#00f0ff" strokeWidth="0.5" opacity="0.3">
                    <animate attributeName="r" values="10;18;10" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.05;0.3" dur="3s" repeatCount="indefinite" />
                  </circle>
                </motion.svg>
              ) : (
                <motion.div
                  key="math-formula-container"
                  className="relative z-10 flex flex-col items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                >
                  <div className="backdrop-blur-md rounded-2xl px-4 sm:px-10 py-4 sm:py-8">
                    <div className="text-[clamp(1.5rem,3vw,3rem)] text-white font-tech tracking-wider drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">
                      <BlockMath math="Y \sim f(X; \theta)" />
                    </div>
                  </div>

                  {/* Legend below formula */}
                  <motion.div
                    className="relative sm:absolute sm:-bottom-20 mt-3 sm:mt-0 font-body tracking-widest flex flex-wrap items-center justify-center gap-1.5 max-w-[80vw]"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    {[
                      { math: "X", desc: "多模态输入" },
                      { math: "\\theta", desc: "海量参数" },
                      { math: "f", desc: "神经网络" },
                      { math: "Y", desc: "高维生成输出" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-1 rounded-lg backdrop-blur-sm text-xs sm:text-sm text-[var(--color-primary-container)]">
                        <span className="text-white scale-110 drop-shadow"><InlineMath math={item.math} /></span>
                        <span className="opacity-80 text-xs tracking-wider">：{item.desc}</span>
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ====== Token: Model → Output ====== */}
          <AnimatePresence>
            {step >= 6 && (
              <motion.div
                className="hidden sm:flex flex-col items-center gap-1"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              >
                <div
                  ref={tokenOutRef}
                  className="px-3 py-1 rounded-full font-mono tracking-widest uppercase border whitespace-nowrap text-[clamp(0.55rem,0.7vw,0.7rem)]"
                  style={{
                    background: "rgba(208, 188, 255, 0.07)",
                    borderColor: "rgba(208, 188, 255, 0.4)",
                    color: "#d0bcff",
                    boxShadow: "0 0 12px rgba(208, 188, 255, 0.15)",
                  }}
                >
                  token
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ====== Output Column ====== */}
          <div className="flex flex-col items-center sm:items-start gap-2 sm:gap-3 relative">
            <motion.div
              className="hidden sm:block absolute -top-12 left-0 text-[var(--color-text-primary)] text-xs sm:text-sm md:text-base font-semibold tracking-widest whitespace-nowrap opacity-60 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: step >= 2 ? 0.8 : 0 }}
            >
              {step >= 4 ? "多模态输出 / MULTIMODAL" : "生成 / OUTPUT"}
            </motion.div>
            <div className="flex flex-row sm:flex-col flex-wrap justify-center gap-2 sm:gap-3">
              {outputItems.map((item, i) => (
                <motion.div
                  key={item.label + "-out"}
                  ref={(el) => { outputRefs.current[i] = el; }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: step >= item.step ? 1 : 0,
                    x: step >= item.step ? 0 : -20,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    delay: item.step === 7 ? i * 0.12 : 0,
                  }}
                >
                  <div className="data-chip flex items-center gap-1.5 text-[clamp(0.65rem,1.1vw,1rem)] !px-2 !py-1 sm:!px-4 sm:!py-2.5">
                    <span className="opacity-80" style={{ color: item.color }}>{MEDIA_ICONS[item.label]}</span>
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ====== Dynamic Arrows Overlay ====== */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden sm:block">
        <defs>
          <marker id="arrowIn" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#00f0ff" opacity="0.7" />
          </marker>
          <marker id="arrowOut" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#d0bcff" opacity="0.7" />
          </marker>
        </defs>

        {arrows.map((arrow, i) =>
          arrow.visible ? (
            <motion.path
              key={i}
              d={arrow.path}
              fill="none"
              stroke={arrow.type === "input" ? "#00f0ff" : "#d0bcff"}
              strokeWidth="1.5"
              strokeDasharray="6 6"
              markerEnd={arrow.type === "input" ? "url(#arrowIn)" : "url(#arrowOut)"}
              initial={{ opacity: 0, strokeDashoffset: 12 }}
              animate={{
                opacity: 0.6,
                strokeDashoffset: [12, 0]
              }}
              transition={{
                opacity: { duration: 0.4 },
                strokeDashoffset: { duration: 0.6, repeat: Infinity, ease: "linear" }
              }}
            />
          ) : null
        )}
      </svg>
    </div>
  );
}
