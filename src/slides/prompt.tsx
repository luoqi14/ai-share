"use client";

/**
 * Slide — "提示词工程" / PROMPT ENGINEERING
 *
 * Step 0:   Title centered
 * Step 1:   Title flies to top-left. Introduce core concept: "Navigation, not Chatting"
 * Step 2-5: Progressively add constraints, visualizing probability-space shrinking
 * Step 6:   Modal auto-opens (comparison A vs B), both panels auto-scroll slowly
 * Step 7:   Modal closes. Metaphor section appears.
 * Step 8:   Quote "提示词的本质永远不会消失…" appears
 * Step 9:   "超级实习生" intro + comparison cards appear
 * Step 10:  Conclusion card appears
 */

import { useState, useEffect, useRef } from "react";
import { useCurrentStep } from "@/config/StepContext";
import { motion, AnimatePresence } from "motion/react";
import SlideTitle from "@/components/SlideTitle";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BASE_PROMPT = "帮我写一篇关于拔智齿的小红书文案";

const CONSTRAINTS = [
  {
    label: "设定角色",
    content: "你是一个有 8 年私立齿科经验的“金牌咨询师”，极其擅长共情",
    color: "#00f0ff", // primary
  },
  {
    label: "目标受众",
    content: "痛得晚上睡不着，但又极度害怕电钻声和打麻药的年轻怕痛星人",
    color: "#d0bcff", // secondary
  },
  {
    label: "核心任务",
    content: "写一篇小红书种草文，主推我们的“微创无痛拔牙”技术",
    color: "#50ffa0", // green
  },
  {
    label: "风格限制",
    content: "像闺蜜分享一样，先痛点共鸣，再给出解决方案，多用口语化表达和 Emoji，文末带上“私信看牙片”的钩子",
    color: "#ffc83c", // yellow
  },
];

// Mapping step to probability circle size and intensity
const CLOUD_STATES = {
  1: { size: 500, blur: 60, opacity: 0.3, core: 100 },
  2: { size: 380, blur: 40, opacity: 0.5, core: 80 },
  3: { size: 260, blur: 25, opacity: 0.7, core: 60 },
  4: { size: 160, blur: 15, opacity: 0.9, core: 40 },
  5: { size: 60, blur: 8, opacity: 1, core: 20 },
};

export default function SlidePrompt() {
  const step = useCurrentStep();
  const showBox = step >= 1 && step < 7;
  const showConcept = step >= 1 && step < 7;
  const showMetaphor = step >= 7;

  // The visual state of the cloud based on how many constraints added
  const constraintCount = Math.max(0, step - 1);
  const cloudState = CLOUD_STATES[Math.min(step, 5) as keyof typeof CLOUD_STATES] || CLOUD_STATES[1];

  // --- Modal & Markdown State ---
  // Manual open: user clicked the base-prompt button (steps 1-5).
  // Step 6 auto-opens the modal; step 7+ auto-closes regardless of manual state.
  const [isManuallyOpen, setIsManuallyOpen] = useState(false);
  const isModalOpen = step === 6 || (step < 6 && isManuallyOpen);

  const [md1Content, setMd1Content] = useState("");
  const [md2Content, setMd2Content] = useState("");
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const isSyncingLeft = useRef(false);
  const isSyncingRight = useRef(false);
  const autoScrollRafRef = useRef(0);

  useEffect(() => {
    if (isModalOpen && !md1Content) {
      fetch("/prompt1.md").then(res => res.text()).then(setMd1Content);
      fetch("/prompt2.md").then(res => res.text()).then(setMd2Content);
    }
  }, [isModalOpen, md1Content]);

  // Auto-scroll both panels slowly when step===6 (modal is auto-open)
  useEffect(() => {
    if (step !== 6 || !isModalOpen) {
      cancelAnimationFrame(autoScrollRafRef.current);
      return;
    }

    const SPEED = 60; // px per second
    let lastTime: number | null = null;

    // Small delay so the modal can open and content can start rendering
    const startTimer = setTimeout(() => {
      const tick = (ts: number) => {
        if (lastTime === null) lastTime = ts;
        const dt = Math.min((ts - lastTime) / 1000, 0.05);
        lastTime = ts;

        // Scroll both panels directly; suppress cross-sync handlers
        isSyncingLeft.current = true;
        isSyncingRight.current = true;
        if (scrollRef1.current) scrollRef1.current.scrollTop += SPEED * dt;
        if (scrollRef2.current) scrollRef2.current.scrollTop += SPEED * dt;

        autoScrollRafRef.current = requestAnimationFrame(tick);
      };
      autoScrollRafRef.current = requestAnimationFrame(tick);
    }, 600);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(autoScrollRafRef.current);
    };
  }, [step, isModalOpen]);

  const handleScroll1 = () => {
    if (isSyncingLeft.current) {
      isSyncingLeft.current = false;
      return;
    }
    if (scrollRef2.current && scrollRef1.current) {
      isSyncingRight.current = true;
      const { scrollTop, scrollHeight, clientHeight } = scrollRef1.current;
      const scrollRatio = scrollTop / (scrollHeight - clientHeight);
      const targetScrollHeight = scrollRef2.current.scrollHeight - scrollRef2.current.clientHeight;
      scrollRef2.current.scrollTop = scrollRatio * targetScrollHeight;
    }
  };

  const handleScroll2 = () => {
    if (isSyncingRight.current) {
      isSyncingRight.current = false;
      return;
    }
    if (scrollRef1.current && scrollRef2.current) {
      isSyncingLeft.current = true;
      const { scrollTop, scrollHeight, clientHeight } = scrollRef2.current;
      const scrollRatio = scrollTop / (scrollHeight - clientHeight);
      const targetScrollHeight = scrollRef1.current.scrollHeight - scrollRef1.current.clientHeight;
      scrollRef1.current.scrollTop = scrollRatio * targetScrollHeight;
    }
  };


  return (
    <div className="slide !p-0 overflow-hidden">
      {/* ====== Animated Title ====== */}
      <SlideTitle title="提示词工程" label="PROMPT ENGINEERING" moved={step >= 1} />

      {/* ====== Main Content Area ====== */}
      <AnimatePresence>
        {showBox && (
          <motion.div
            className="absolute inset-0 top-[15vh] px-4 sm:px-8 md:px-16 pb-6 md:pb-16 flex flex-col sm:flex-row items-start justify-center gap-4 sm:gap-8 md:gap-16 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Left Column: Text & Constraints */}
            <div className="w-full sm:flex-1 sm:max-w-[600px] flex flex-col gap-4 sm:gap-8 sm:h-full pt-4 sm:pt-8">
              {/* Concept Intro */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface-container-high/50 p-6 rounded-2xl border ghost-border ambient-glow glass-overlay"
              >
                <h3 className="font-display text-lg sm:text-2xl mb-2 sm:mb-3 text-gradient-primary">
                  潜在空间的精确导航仪
                </h3>
                <p className="text-white/70 text-sm sm:text-lg leading-relaxed">
                  Prompt 不是在跟 AI 聊天，而是为其输出提供<strong>「边界与约束」</strong>。<br />
                  用密集的约束条件，强行把模型输出的概率云，锁定到极高质量的“甜点区”。
                </p>
              </motion.div>

              {/* Clinic Metaphor */}
              <div className="rounded-xl border border-amber-400/25 bg-amber-400/5 px-4 py-3.5">
                <div className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  💡 门诊隐喻
                </div>
                <p className="text-white/70 text-[13px] leading-relaxed">
                  这就像你叮嘱新来的咨询师：&quot;等下面对这位重度牙周炎患者时，你要<strong className="text-white/90">面带微笑，语气温柔</strong>，先共情他的痛苦，再介绍我们的治疗方案。&quot;<span className="text-amber-400/70 ml-1 text-[11px]">（这是规定态度和套路）</span>
                </p>
              </div>

              {/* Base Prompt */}
              <div className="flex flex-col gap-3">
                <div
                  onClick={() => setIsManuallyOpen(true)}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/80 font-medium cursor-pointer hover:bg-white/10 hover:border-primary/50 transition-all active:scale-95 flex justify-between items-center group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10">{BASE_PROMPT}</span>
                  <svg className="w-5 h-5 text-primary/30 group-hover:text-primary transition-colors relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>

              {/* Constraints List */}
              <div className="flex flex-col gap-4">
                {CONSTRAINTS.map((item, index) => {
                  const isActive = step >= index + 2;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20, height: 0, margin: 0 }}
                      animate={
                        isActive
                          ? { opacity: 1, x: 0, height: "auto", margin: "16px 0" }
                          : { opacity: 0.3, x: 0, height: "auto", margin: "16px 0" }
                      }
                      className="flex items-start gap-4 overflow-hidden"
                      style={{
                        display: isActive || step >= 1 ? "flex" : "none"
                      }}
                    >
                      <div
                        className="flex-shrink-0 mt-1 w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs text-background font-bold transition-all duration-500"
                        style={{
                          backgroundColor: isActive ? item.color : "#444",
                          boxShadow: isActive ? `0 0 15px ${item.color}88` : "none",
                        }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span
                          className="font-display font-bold text-sm tracking-widest uppercase transition-colors duration-500"
                          style={{ color: isActive ? item.color : "#888" }}
                        >
                          {item.label}
                        </span>
                        <p className={`text-base leading-snug transition-colors duration-500 ${isActive ? 'text-white' : 'text-white/30'}`}>
                          {item.content}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Visualization */}
            <div className="w-full sm:flex-1 flex items-center justify-center min-h-[200px] sm:min-h-0 sm:h-full overflow-hidden pb-4 sm:pb-0">
              {/* Fixed-size visualization, scaled on small screens */}
              <div className="relative w-[500px] h-[500px] shrink-0 flex items-center justify-center scale-[0.55] sm:scale-[0.65] lg:scale-90 origin-center">
              {/* Scope/Radar Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-[500px] h-[500px] rounded-full border border-white/20" />
                <div className="absolute w-[380px] h-[380px] rounded-full border border-white/10" />
                <div className="absolute w-[260px] h-[260px] rounded-full border border-white/10" />
                <div className="absolute w-[160px] h-[160px] rounded-full border border-white/5" />
              </div>

              {/* Constraint Rings (adding layers) */}
              {CONSTRAINTS.map((item, index) => {
                const isActive = step >= index + 2;
                const ringSizes = [380, 260, 160, 60];
                const size = ringSizes[index];

                return (
                  <motion.div
                    key={`ring-${index}`}
                    className="absolute rounded-full border-2 z-10"
                    initial={{ width: 600, height: 600, opacity: 0 }}
                    animate={{
                      width: isActive ? size : 600,
                      height: isActive ? size : 600,
                      opacity: isActive ? 1 : 0,
                      borderColor: isActive ? item.color : "rgba(255,255,255,0)",
                    }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    style={{
                      boxShadow: isActive ? `inset 0 0 20px ${item.color}33, 0 0 20px ${item.color}33` : "none"
                    }}
                  />
                );
              })}

              {/* The "Probability Cloud" */}
              <motion.div
                className="absolute shrink-0 rounded-full bg-primary-container z-20"
                animate={{
                  width: cloudState.size,
                  height: cloudState.size,
                  filter: `blur(${cloudState.blur}px)`,
                  opacity: cloudState.opacity,
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />

              {/* The Sweet Spot Core */}
              <motion.div
                className="absolute shrink-0 rounded-full bg-white z-30"
                animate={{
                  width: cloudState.core,
                  height: cloudState.core,
                  boxShadow: `0 0 ${cloudState.core * 2}px rgba(255, 255, 255, 0.8)`,
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />

              {/* Sweet spot label */}
              <AnimatePresence>
                {step >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-1/2 left-1/2 z-40 text-center font-display font-bold whitespace-nowrap"
                    style={{ transform: "translate(-50%, -50%)", color: "var(--color-bg)", textShadow: "0 0 10px rgba(0,0,0,0.5)" }}
                  >
                    <div className="bg-black/60 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-xs tracking-widest border border-primary/30 transform -translate-y-10">
                      SWEET SPOT
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              </div>{/* end scale wrapper */}
            </div>{/* end right column */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== Metaphor Section (Step 6+) ====== */}
      <AnimatePresence>
        {showMetaphor && (
          <motion.div
            className="absolute inset-0 px-4 sm:px-12 md:px-24 py-6 sm:py-14 md:py-20 flex flex-col items-center justify-start sm:justify-center gap-4 sm:gap-6 md:gap-10 z-10 overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Title & Introduction */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center w-full"
            >
              <h2 className="font-display text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-6">
                认知颠覆：提示词工程会消失吗？
              </h2>
              <div className="text-sm sm:text-lg text-white/70 leading-relaxed max-w-4xl mx-auto space-y-3 sm:space-y-4">
                <p>随着未来的 AI 越来越聪明，你确实不需要再死记硬背各种复杂的提示词模板或者符号了，AI 能听懂你的大白话。</p>
                
                <AnimatePresence>
                  {step >= 8 && (
                    <motion.div
                      className="py-4 border-y border-white/10 my-6"
                      initial={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: "1.5rem", marginBottom: "1.5rem" }}
                    >
                      <p className="text-primary font-bold text-base sm:text-xl">“但是，提示词的本质永远不会消失，它会演变成你的<span className="text-secondary mx-1 text-xl sm:text-2xl font-display">「专业认知壁垒」</span>。”</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {step >= 9 && (
                    <motion.p
                      className="opacity-90 pt-2 font-display text-base sm:text-xl tracking-wide"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      想象 AI 是一个智商 180 但毫不懂行业实战的<strong className="text-white">“超级实习生”</strong>：
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Comparison Cards (Step 8) */}
            <AnimatePresence>
              {step >= 9 && (
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full max-w-5xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex-1 p-4 sm:p-8 rounded-2xl border ghost-border bg-black/40 glass-overlay flex flex-col gap-3 sm:gap-6 relative overflow-hidden transition-all">
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">🧍</div>
                      <span className="font-bold text-base sm:text-lg text-white/80">外行患者</span>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-white/90 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]">
                      “牙痛怎么办？”
                    </div>
                    <div className="mt-auto p-4 bg-white/5 rounded-xl border border-white/5 text-white/60">
                      <span className="text-[10px] font-mono uppercase text-white/40 block mb-2 tracking-widest">超级实习生回答</span>
                      “吃布洛芬，看牙医。”
                    </div>
                  </div>

                  <div className="flex-1 p-4 sm:p-8 rounded-2xl border border-primary/30 bg-primary/5 glass-overlay flex flex-col gap-3 sm:gap-6 relative overflow-hidden ambient-glow sm:scale-105 z-10 shadow-2xl transition-all">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary"></div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(0,240,255,0.3)]">👨‍⚕️</div>
                      <span className="font-bold text-base sm:text-lg text-primary">资深门诊运营</span>
                    </div>
                    <div className="p-4 bg-black/40 rounded-xl border border-primary/30 text-white/90 leading-relaxed text-sm shadow-[inset_0_2px_15px_rgba(0,0,0,0.5)]">
                      “根据门诊本月 300 个初诊留资数据，帮我拆解种植牙和隐形正畸的转化率漏斗，并针对流失率最高的面诊环节设计一套客服逼单话术。”
                    </div>
                    <div className="mt-auto p-4 bg-primary/10 rounded-xl border border-primary/20 text-primary/90 text-sm">
                      <span className="text-[10px] font-mono uppercase text-primary/60 block mb-2 tracking-widest">超级实习生回答</span>
                      [瞬间生成了一套基于数据的深度转化率漏洞分析报表及多维度逼单话术库]
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Conclusion (Step 9) */}
            <AnimatePresence>
              {step >= 10 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 sm:mt-6 p-4 sm:p-6 sm:px-10 w-full max-w-5xl rounded-2xl bg-surface-container-highest border border-white/10 text-center glass-overlay ambient-glow"
                >
                  <p className="text-sm sm:text-xl leading-relaxed text-white/90 font-display">
                    AI 的输出上限，永远被你提出问题的<strong className="text-secondary text-lg sm:text-[26px] mx-2 tracking-widest border-b-2 border-secondary/50 pb-1">专业深度</strong>死死锁住。<br />
                    <span className="mt-3 block text-[0.95em] text-white/70">
                      你越懂业务，AI 在你手里越像<span className="text-primary mx-1">核武</span>；你自己都不懂，AI 只能给你输出正确<span className="opacity-50">的废话。</span>
                    </span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== Markdown Comparison Modal ====== */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/40"
          >
            <style>{`
              .markdown-prose {
                color: rgba(255, 255, 255, 0.85);
                line-height: 1.8;
                font-size: 1.05rem;
              }
              .markdown-prose h1, .markdown-prose h2, .markdown-prose h3 {
                color: var(--color-primary);
                font-family: var(--font-display);
                font-weight: 700;
                margin-top: 2em;
                margin-bottom: 1em;
                letter-spacing: -0.01em;
              }
              .markdown-prose h1 { font-size: 1.8rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 0.5em; }
              .markdown-prose h2 { font-size: 1.5rem; }
              .markdown-prose p { margin-bottom: 1.2em; }
              .markdown-prose img {
                max-width: 100%;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                margin: 1.5em 0;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
              }
              .markdown-prose ul, .markdown-prose ol {
                margin-bottom: 1.2em;
                padding-left: 1.5em;
              }
              .markdown-prose li { margin-bottom: 0.5em; }
              .markdown-prose strong { color: #fff; font-weight: 600; }
              .markdown-prose hr {
                border: none;
                border-top: 1px dashed rgba(255, 255, 255, 0.2);
                margin: 2em 0;
              }
              .custom-markdown-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
              .custom-markdown-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-markdown-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
              }
              .custom-markdown-scrollbar:hover::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
              }
            `}</style>

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full h-full max-w-[90vw] max-h-[90vh] bg-surface-container-highest/90 border border-outline-variant/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative glass-overlay"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-black/20">
                <div className="flex items-center gap-6">
                  <div className="section-label !text-primary">生成效果对比</div>
                  <div className="text-sm text-white/40 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    上下滚动其中一侧，均可自动同步位置
                  </div>
                </div>
                <button
                  onClick={() => setIsManuallyOpen(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
                {/* Left Pane */}
                <div
                  ref={scrollRef1}
                  onScroll={handleScroll1}
                  className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 sm:py-8 border-b sm:border-b-0 sm:border-r border-white/5 custom-markdown-scrollbar"
                >
                  <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 font-mono tracking-widest uppercase">
                    Model Output A (无约束)
                  </div>
                  <div className="markdown-prose">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {md1Content || "加载中..."}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Right Pane */}
                <div
                  ref={scrollRef2}
                  onScroll={handleScroll2}
                  className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 sm:py-8 custom-markdown-scrollbar bg-black/10"
                >
                  <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                    Model Output B (甜点区)
                  </div>
                  <div className="markdown-prose">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {md2Content || "加载中..."}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
