"use client";

/**
 * Slide — "词嵌入 / Embedding"
 *
 * Step 0: Title centered (static intro)
 * Step 1: Title flies to top-left
 * Step 2: Show Token ID
 * Step 3: Show Embedding Matrix
 * Step 4: Show Transformer Layers
 * Step 5: Show LM Head
 * Step 6: Show Softmax Tail
 */

import { useCurrentStep } from "@/config/StepContext";
import { motion, AnimatePresence } from "motion/react";
import SlideTitle from "@/components/SlideTitle";

const CONNECTOR_DURATION = 0.5;
const FADE_DURATION = 0.4;

export default function SlideEmbedding() {
  const step = useCurrentStep();
  const showBox = step >= 1;
  const showToken = step >= 1;
  const showEmbedding = step >= 2;
  const showTransformer = step >= 3;
  const showLMHead = step >= 4;
  const showSoftmax = step >= 5;
  const showLoop = step >= 6;

  // Reusable bottom label
  const Label = ({ text }: { text: string }) => (
    <div className="border border-[var(--color-primary-container)] rounded-full px-2 py-0.5 sm:px-4 sm:py-1.5 text-[clamp(0.45rem,0.9vw,0.75rem)] font-mono tracking-wider text-[var(--color-primary)] bg-[var(--color-background)] z-10 whitespace-nowrap mt-1.5 sm:mt-4 opacity-80 uppercase shadow-md">
      {text}
    </div>
  );

  // Reusable top label for better understanding
  const TopLabel = ({ text }: { text: string }) => (
    <div className="absolute -top-[clamp(22px,4vh,40px)] left-1/2 -translate-x-1/2 text-[var(--color-text)] font-semibold tracking-wider text-[clamp(0.5rem,1.1vw,0.875rem)] opacity-90 whitespace-nowrap">
      {text}
    </div>
  );

  // Golden quote tooltip
  const Tooltip = ({ text }: { text: string }) => (
    <div className="absolute top-[105%] mt-4 left-1/2 -translate-x-1/2 w-[240px] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 translate-y-2 group-hover:translate-y-0">
      <div className="bg-black/90 border border-[var(--color-primary)]/40 rounded-xl p-3 md:p-4 shadow-[0_10px_30px_rgba(0,190,255,0.2)] backdrop-blur-xl relative">
        {/* Little triangle arrow pointing up */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-[6px] border-transparent border-b-[var(--color-primary)]/40"></div>
        <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 border-[6px] border-transparent border-b-black/90"></div>
        <p className="text-[11px] md:text-sm text-gray-200 font-body leading-relaxed text-center tracking-wide">
          {text}
        </p>
      </div>
    </div>
  );

  return (
    <div className="slide !p-0 overflow-hidden relative">
      {/* ====== Animated Title ====== */}
      <SlideTitle title="词嵌入" label="EMBEDDING" moved={showBox} />

      {/* ====== Main Pipeline Area ====== */}
      <AnimatePresence>
        {showBox && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* ──── Container for Pipeline ──── */}
            <div className="w-[90%] max-w-6xl h-[clamp(160px,22vh,256px)] flex items-center justify-between relative mt-[clamp(1.5rem,7vh,4rem)]">

              {/* Continuous Background Track Line (dim) */}
              <div className="absolute top-1/2 left-[5%] right-[5%] h-px border-b border-dashed border-white/20 -translate-y-1/2 z-0" />

              {/* 1. Token ID */}
              <motion.div
                className="flex flex-col items-center relative z-10 group pointer-events-auto cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: showToken ? 1 : 0, x: showToken ? 0 : -20 }}
                transition={{ duration: FADE_DURATION }}
              >
                <div className="w-[clamp(36px,5vw,64px)] h-[clamp(36px,5vw,64px)] rounded-full border-2 border-[var(--color-primary)] shadow-[0_0_15px_var(--color-primary-container)] flex items-center justify-center bg-[var(--color-background)] relative overflow-hidden">
                  <svg className="w-1/2 h-1/2 opacity-80" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                    <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
                    <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                  </svg>
                </div>
                <TopLabel text="词元化" />
                <Label text="ID: 9982" />
                <Tooltip text="把大千世界的连续信息「降维」打碎成离散的乐高块，为了让计算机能存得下。" />
              </motion.div>

              {/* Connector 1 */}
              <Connector show={showEmbedding} label="离散 -> 连续向量" />

              {/* 2. Embedding Matrix */}
              <motion.div
                className="flex flex-col items-center relative z-10 group pointer-events-auto cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: showEmbedding ? 1 : 0, x: showEmbedding ? 0 : -20 }}
                transition={{ duration: FADE_DURATION, delay: CONNECTOR_DURATION * 0.5 }}
              >
                <div className="w-[clamp(44px,7vw,96px)] h-[clamp(58px,9vw,128px)] border border-[#d0bcff]/40 bg-[#d0bcff]/5 relative overflow-hidden shadow-[0_0_20px_rgba(208,188,255,0.1)] rounded-sm">
                  {/* Grid Pattern */}
                  <div className="absolute inset-0 flex flex-col justify-between py-1">
                    {[...Array(6)].map((_, i) => (
                      <div key={`h-${i}`} className="w-full h-px bg-[#d0bcff]/20" />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex justify-between px-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={`v-${i}`} className="h-full w-px bg-[#d0bcff]/20" />
                    ))}
                  </div>
                  {/* Highlighted Row */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showEmbedding ? [0, 1, 0.6] : 0 }}
                    transition={{ duration: 1.5, delay: CONNECTOR_DURATION + 0.3 }}
                    className="absolute top-[35%] left-0 right-0 h-4 bg-[#d0bcff]/40 shadow-[0_0_10px_#d0bcff]"
                  />
                </div>
                <TopLabel text="词嵌入查询" />
                <Label text="200000 X 8192" />
                <Tooltip text="把这些冰冷的砖块重新「升维」，抛入一个连续的数学宇宙，赋予它们灵魂和相互的联系。" />
              </motion.div>

              {/* Connector 2 */}
              <Connector show={showTransformer} label="上下文向量运算" />

              {/* 3. Transformer Layers */}
              <motion.div
                className="flex flex-col items-center relative z-10 group pointer-events-auto cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: showTransformer ? 1 : 0, x: showTransformer ? 0 : -20 }}
                transition={{ duration: FADE_DURATION, delay: CONNECTOR_DURATION * 0.5 }}
              >
                <div className="w-[clamp(44px,7vw,96px)] h-[clamp(58px,9vw,128px)] relative">
                  {/* Stack of cards */}
                  {[0, 1, 2].map((layerIndex) => (
                    <motion.div
                      key={layerIndex}
                      className="absolute inset-0 border border-[#50ffa0]/50 bg-[var(--color-background)] rounded-sm shadow-[0_0_15px_rgba(80,255,160,0.15)] flex justify-center items-center backdrop-blur-md"
                      style={{
                        transform: `translate(${layerIndex * 8}px, ${layerIndex * -8}px) scale(${1 - layerIndex * 0.05})`,
                        zIndex: 3 - layerIndex,
                        opacity: 1 - layerIndex * 0.3,
                      }}
                    >
                      {layerIndex === 0 && (
                        <div className="w-[45%] h-[55%] border border-[#50ffa0]/40 rounded-sm flex items-center justify-center opacity-70">
                          {/* Abstract Transformer symbol */}
                          <div className="w-[45%] h-[45%] border-2 border-[#50ffa0]/80 rounded-sm rotate-45 transform" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                <TopLabel text="Transformer堆叠" />
                <div className="mt-2 ml-4">
                  <Label text="80 LAYERS" />
                </div>
                <Tooltip text="大模型的思考，就发生在这个连续的高维流形宇宙中，通过注意力机制捕捉万物的隐式关联。" />
              </motion.div>

              {/* Connector 3 */}
              <Connector show={showLMHead} label="降维反向投射" />

              {/* 4. LM Head */}
              <motion.div
                className="flex flex-col items-center relative z-10 group pointer-events-auto cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: showLMHead ? 1 : 0, x: showLMHead ? 0 : -20 }}
                transition={{ duration: FADE_DURATION, delay: CONNECTOR_DURATION * 0.5 }}
              >
                <div className="w-[clamp(56px,9vw,128px)] h-[clamp(42px,7vw,96px)] border border-[#ffc83c]/40 bg-[#ffc83c]/5 relative overflow-hidden shadow-[0_0_20px_rgba(255,200,60,0.1)] rounded-sm">
                  {/* Grid Pattern */}
                  <div className="absolute inset-0 flex flex-col justify-between py-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={`lm-h-${i}`} className="w-full h-px bg-[#ffc83c]/20" />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex justify-between px-1">
                    {[...Array(6)].map((_, i) => (
                      <div key={`lm-v-${i}`} className="h-full w-px bg-[#ffc83c]/20" />
                    ))}
                  </div>
                </div>
                <TopLabel text="模型反投影" />
                <Label text="8192 X 200000" />
                <Tooltip text="思考完毕，大模型将其高维的「灵感」重新坍缩回人类能理解的世俗字典的维度。" />
              </motion.div>

              {/* Connector 4 */}
              <Connector show={showSoftmax} label="采样、Temperature" />

              {/* 5. Softmax */}
              <motion.div
                className="flex flex-col items-center relative z-10 group pointer-events-auto cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: showSoftmax ? 1 : 0, x: showSoftmax ? 0 : -20 }}
                transition={{ duration: FADE_DURATION, delay: CONNECTOR_DURATION * 0.5 }}
              >
                <div className="w-[clamp(44px,7vw,96px)] h-[clamp(44px,7vw,96px)] flex items-end justify-between px-0.5 pb-0.5 gap-[clamp(0.5px,0.15vw,4px)] relative overflow-hidden">
                  {/* Gradient overlay for tail */}
                  <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--color-background)] to-transparent z-10" />

                  {/* Bars */}
                  {[100, 75, 45, 30, 20, 15, 10, 5, 2, 1].map((h, i) => (
                    <motion.div
                      key={`bar-${i}`}
                      initial={{ height: 0 }}
                      animate={{ height: showSoftmax ? `${h}%` : 0 }}
                      transition={{ duration: 0.6, delay: showSoftmax ? CONNECTOR_DURATION + i * 0.05 : 0, type: "spring", stiffness: 80 }}
                      className={`w-[clamp(1.5px,0.25vw,10px)] rounded-t-sm shadow-[0_0_8px_rgba(0,240,255,0.3)] ${i === 0 ? "bg-[var(--color-primary)]" : "bg-[#50ffa0]/60"
                        }`}
                    />
                  ))}
                </div>
                <TopLabel text="概率分布" />
                <Label text="TAIL: 199997" />
                <Tooltip text="在词库的亿万种可能中，结合 Temperature 等超参，笃定地掷出那颗决定命运的概率色子。" />
              </motion.div>

              {/* 6. Autoregressive Loop */}
              <AnimatePresence>
                {showLoop && (
                  <motion.div
                    className="absolute inset-x-0 -top-[clamp(80px,14vh,160px)] h-[clamp(100px,18vh,200px)] z-20 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: FADE_DURATION }}
                  >
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 200">
                      <defs>
                        <linearGradient id="loopGrad" x1="1" y1="0" x2="0" y2="0">
                          <stop offset="0%" stopColor="var(--color-primary)" />
                          <stop offset="100%" stopColor="#50ffa0" />
                        </linearGradient>
                        <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                          <polygon points="0 0, 6 2, 0 4" fill="#50ffa0" />
                        </marker>
                      </defs>
                      <motion.path
                        d="M 940 200 Q 500 -80 60 200"
                        fill="none"
                        stroke="url(#loopGrad)"
                        strokeWidth="4"
                        strokeDasharray="16 12"
                        strokeLinecap="round"
                        markerEnd="showLoop ? 'url(#arrowhead)' : ''"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        style={{ filter: "drop-shadow(0 0 8px var(--color-primary))" }}
                      />
                    </svg>
                    <motion.div
                      className="absolute left-1/2 top-4 -translate-x-1/2 text-[var(--color-background)] font-bold text-xs sm:text-sm md:text-base bg-[var(--color-primary)] px-3 py-1.5 sm:px-6 sm:py-2 rounded-full shadow-[0_0_20px_var(--color-primary-container)] text-center max-w-[80vw] z-30"
                      initial={{ y: 10, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
                    >
                      自回归循环：预测的新词重新入队，进行下一轮预测
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Reusable Animated Connector ──────────────────────────────────────────────
function Connector({ show, label }: { show: boolean; label?: string }) {
  return (
    <div className="flex-1 h-12 relative mx-[clamp(2px,1vw,16px)] z-0 flex items-center justify-center">
      {label && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: show ? 0.9 : 0, y: show ? 0 : 10 }}
          transition={{ delay: CONNECTOR_DURATION * 0.8, duration: 0.3 }}
          className="absolute -top-8 text-[9px] sm:text-[11px] font-mono tracking-wider text-[var(--color-primary)] bg-[var(--color-background)] px-1 sm:px-2 whitespace-nowrap shadow-sm border border-[var(--color-primary)]/30 rounded hidden sm:block"
        >
          {label}
        </motion.div>
      )}
      <svg className="absolute inset-0 w-full h-full preserve-3d" preserveAspectRatio="none">
        <motion.line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
          transition={{ duration: CONNECTOR_DURATION, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 0 6px var(--color-primary))" }}
        />
      </svg>
    </div>
  );
}
