import React from "react";
import { motion, AnimatePresence } from "motion/react";
import SlideTitle from "@/components/SlideTitle";
import { useCurrentStep } from "@/config/StepContext";

// Emulated King Vector floats before quant
const FLOAT_DATA = [0.824519, -0.412188, 0.119331, 0.553210, 0.771992];
// Labels for dimensions
const FEATURE_LABELS = ["权力/皇权特征", "性别(男:负)", "时代(古典)", "体能特权", "领导力属性"];
// INT8 compressed data post-quant
const INT_DATA = [64, -32, 9, 43, 60];

export default function SlideVector() {
  const step = useCurrentStep();
  const isStarted = step >= 1;

  // New Scene: Display Token -> Matrix mapping diagram
  const showMatrixScene = step === 1;

  // Scene 1: Vector details base
  const showRowBox = step >= 2;
  // Features & Dimensionality
  const showFeatures = step >= 3;
  // Precision display
  const showPrecision = step >= 4;
  // Quantize visual starts
  const startQuantize = step >= 5;
  // Final INT format
  const showINT8 = step >= 6;
  // Scaling factor independent popup
  const showScaleFactor = step >= 7;
  // Pipeline details
  const showDetails = step >= 8;
  // Hardware and Naming flip card
  const showHardwareCard = step >= 9;

  // The active array depending on quantization state
  const activeData = showINT8 ? INT_DATA : FLOAT_DATA;

  return (
    <div className="w-full h-full bg-transparent flex flex-col pt-8 sm:pt-16 pb-12 px-4 md:px-12 relative overflow-hidden">
      <SlideTitle
        title="向量"
        label="VECTOR"
        moved={isStarted}
      />

      <AnimatePresence>
        {isStarted && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ perspective: 3000 }}
          >
            {/* Front Card (Vector visualization) */}
            <motion.div
              className={`absolute inset-0 flex flex-col items-center justify-start sm:justify-center w-full h-full overflow-y-auto sm:overflow-hidden ${showHardwareCard ? "pointer-events-none" : "pointer-events-auto"}`}
              style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
              animate={{ rotateY: showHardwareCard ? 180 : 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            >
              <AnimatePresence mode="wait">
              {showMatrixScene && (
                <motion.div
                  key="matrix-scene"
                  className="absolute inset-0 flex items-center justify-center pt-10"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-5xl gap-3 sm:gap-4 md:gap-8 px-4 md:px-8 py-4 sm:py-0">
                    {/* Target Token */}
                    <div className="flex flex-col items-center">
                      <div className="text-sm sm:text-lg md:text-xl text-[var(--color-primary-fixed-dim)] mb-3 sm:mb-6 tracking-widest font-bold drop-shadow-md">词元化</div>
                      {/* Token Circle */}
                      <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border border-[var(--color-primary)] shadow-[0_0_30px_rgba(0,190,255,0.4)] flex items-center justify-center relative bg-[var(--color-primary)]/10">
                        <div className="w-10 h-10 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full border-2 border-[var(--color-primary)]/80 flex items-center justify-center">
                          <div className="w-7 h-7 sm:w-10 sm:h-10 md:w-16 md:h-16 rounded-full border border-[var(--color-primary)] flex items-center justify-center text-white text-sm sm:text-lg md:text-2xl font-bold tracking-widest">
                            国王
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-8 border border-[var(--color-primary)] rounded-full px-3 sm:px-4 md:px-6 py-1 sm:py-2 text-[var(--color-primary)] font-mono text-xs sm:text-sm md:text-lg tracking-widest">
                        ID: 9982
                      </div>
                    </div>

                    {/* Bridge */}
                    <div className="flex-none sm:flex-1 w-full sm:w-auto h-10 sm:h-auto flex flex-row sm:flex-col items-center justify-center relative px-4 sm:px-2 md:px-4">
                      <div className="px-2 md:px-4 py-1 sm:py-1.5 border border-gray-600 rounded-lg text-gray-300 text-[10px] sm:text-xs md:text-sm tracking-widest sm:mb-4 z-10 bg-black/50 backdrop-blur whitespace-nowrap">
                        离散 -{">"} 连续向量
                      </div>
                      {/* Dashed line with laser */}
                      <div className="flex-1 sm:w-full h-[1px] border-b border-dashed border-gray-600 sm:absolute sm:top-1/2 sm:mt-3 md:mt-2"></div>
                      <motion.div
                        className="h-1 w-1/4 bg-[var(--color-primary)] shadow-[0_0_15px_var(--color-primary)] hidden sm:block sm:absolute sm:top-1/2 sm:mt-[11px] md:mt-[7px] rounded-full"
                        initial={{ left: "0%", opacity: 0 }}
                        animate={{ left: ["0%", "30%", "75%"], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </div>

                    {/* Matrix Lookup */}
                    <div className="flex flex-col items-center">
                      <div className="text-sm sm:text-lg md:text-xl text-gray-300 mb-3 sm:mb-6 tracking-widest font-bold">词嵌入查询</div>
                      {/* Abstract Grid */}
                      <div className="border-2 border-indigo-900/50 rounded-xl bg-indigo-950/20 backdrop-blur w-24 h-32 sm:w-32 sm:h-48 md:w-48 md:h-64 p-2 flex flex-col justify-between relative overflow-hidden">
                        {/* Glowing Active Row corresponding to ID 9982. middle row */}
                        <motion.div
                          className="absolute left-0 right-0 h-8 md:h-10 top-[40%] bg-indigo-500/30 shadow-[0_0_30px_var(--color-primary)] z-0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.3, 0.8, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        {/* Draw Grid Lines */}
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-5 gap-0 pointer-events-none z-10">
                          {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="border-[0.5px] border-indigo-500/20"></div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-8 border border-[var(--color-primary)] rounded-full px-3 sm:px-4 md:px-6 py-1 sm:py-2 text-[var(--color-primary)] font-mono text-xs sm:text-sm md:text-lg tracking-widest">
                        200000 X 8192
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {showRowBox && (
                <motion.div
                  key="vector-detail"
                  className="w-full flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Central Vector Row Box */}
                  <div className="relative w-full max-w-4xl px-4 md:px-0">

                    {/* Quantization Crush Press Element */}
                    <AnimatePresence>
                      {startQuantize && !showINT8 && (
                        <motion.div
                          className="absolute inset-x-0 h-12 -top-12 bg-[#1a0505] rounded-t-lg border-t-2 border-l-2 border-r-2 border-red-500/80 shadow-[0_-20px_40px_rgba(220,38,38,0.4)] z-30 flex items-center justify-center backdrop-blur-md overflow-hidden"
                          initial={{ y: -50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 50, opacity: 0, scaleY: 0.2 }}
                          transition={{ duration: 0.3, ease: "easeIn" }}
                        >
                          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,red_10px,red_20px)]"></div>
                          <span className="text-red-400 font-black font-tech tracking-[0.2em] md:tracking-[0.4em] text-sm md:text-lg z-10 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]">
                            QUANTIZATION / 量化
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Top Bracket for Dimensions / Precision */}
                    <AnimatePresence>
                      {(showPrecision && !startQuantize) && (
                        <motion.div
                          className="absolute -top-14 inset-x-0 flex flex-col items-center justify-end z-20 pointer-events-none"
                          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        >
                          <div className="text-[#fbbf24] font-mono text-xs tracking-widest mb-1 bg-black/60 px-3 py-1 rounded">内存占用: 32 bit Float (FP32)</div>
                          <div className="w-full max-w-[80%] h-4 border-t-2 border-l-2 border-r-2 border-[#fbbf24]/50 rounded-t-lg"></div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* The Cells Vector Wrapper */}
                    <motion.div
                      className={`flex w-full items-center justify-between rounded-xl overflow-visible border bg-[#111] p-3 md:p-6 drop-shadow-2xl relative z-10 transition-colors duration-500 gap-2 md:gap-4 ${showINT8 ? 'border-red-900/50 shadow-[#450a0a]' : 'border-[#333]'}`}
                      animate={{
                        scale: (startQuantize && !showINT8) ? 0.98 : 1,
                        y: (startQuantize && !showINT8) ? 8 : 0,
                        backgroundColor: showINT8 ? "#1a0b0b" : "#111"
                      }}
                      transition={{ duration: 0.15 }}
                    >
                      {activeData.map((val, i) => (
                        <div key={i} className="flex flex-col items-center flex-1 relative group">

                          {/* Value Cell */}
                          <motion.div
                            className={`font-mono text-xs md:text-lg font-bold tracking-wider relative flex items-center justify-center transition-all ${showINT8 ? 'text-red-400 md:text-xl' : 'text-[var(--color-primary)]'}`}
                            initial={false}
                          >
                            {showINT8 ? val : (
                              <div className="flex items-center">
                                <span>{val.toFixed(6).slice(0, -2)}</span>
                                <motion.span
                                  initial={{ y: 0, opacity: 1, rotate: 0 }}
                                  animate={startQuantize ? { y: 25, opacity: 0, rotate: Math.random() > 0.5 ? 20 : -20, scale: 0.5 } : { y: 0, opacity: 1, rotate: 0, scale: 1 }}
                                  transition={{ duration: 0.4, ease: "easeIn", delay: i * 0.08 }}
                                  className={startQuantize ? "text-red-500 ml-[1px] inline-block" : "text-[var(--color-primary)] ml-[1px] inline-block"}
                                >
                                  {val.toFixed(6).slice(-2)}
                                </motion.span>
                              </div>
                            )}
                          </motion.div>

                          {/* Dimensionality Features */}
                          <AnimatePresence>
                            {showFeatures && !showINT8 && (
                              <motion.div
                                className="absolute -bottom-14 flex flex-col items-center whitespace-nowrap"
                                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                              >
                                <div className="w-[1px] h-4 bg-[var(--color-primary)]/50 mb-1"></div>
                                <span className={`text-[8px] sm:text-[10px] md:text-sm text-[var(--color-primary-fixed-dim)] bg-[var(--color-primary)]/10 px-1 sm:px-2 py-0.5 rounded shadow ${i === activeData.length - 1 ? "hidden md:inline-block" : ""}`}>{FEATURE_LABELS[i]}</span>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* INT8 memory tooltip */}
                          <AnimatePresence>
                            {showINT8 && (
                              <motion.div
                                className="absolute -top-12 flex flex-col items-center"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                              >
                                <span className="text-[10px] text-red-300/80 font-mono scale-90">8 bit</span>
                                <div className="w-[1px] h-3 bg-red-400/30 mt-1"></div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}

                      {/* The 8192 Dots */}
                      <div className="flex-none flex justify-center items-center gap-1 md:gap-2 px-2 md:px-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                      </div>

                      {/* The End Bracket */}
                      <motion.div className="flex flex-col items-center flex-1 relative">
                        <div className={`font-mono text-xs md:text-lg font-bold tracking-wider ${showINT8 ? 'text-red-400 md:text-xl' : 'text-[var(--color-primary)]'}`}>
                          {showINT8 ? '109' : (
                            <div className="flex items-center justify-center">
                              <span>0.9314</span>
                              <motion.span
                                initial={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
                                animate={startQuantize ? { y: 25, opacity: 0, rotate: 20, scale: 0.5 } : { y: 0, opacity: 1, rotate: 0, scale: 1 }}
                                transition={{ duration: 0.4, ease: "easeIn", delay: 5 * 0.08 }}
                                className={startQuantize ? "text-red-500 ml-[1px] inline-block" : "text-[var(--color-primary)] ml-[1px] inline-block"}
                              >
                                98
                              </motion.span>
                            </div>
                          )}
                        </div>
                        <AnimatePresence>
                          {showFeatures && !showINT8 && (
                            <motion.div
                              className="absolute -bottom-14 flex flex-col items-center whitespace-nowrap"
                              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * 6 }}
                            >
                              <div className="w-[1px] h-4 bg-[var(--color-primary)]/50 mb-1"></div>
                              <span className="text-[8px] sm:text-[10px] md:text-sm text-[var(--color-primary-fixed-dim)] bg-[var(--color-primary)]/10 px-1 sm:px-2 py-0.5 rounded shadow">神性特征</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>

                    {/* Step 2 ONLY: 8192 Count Bracket */}
                    <AnimatePresence>
                      {step === 2 && (
                        <motion.div
                          className="absolute -bottom-8 w-full px-4 flex items-end justify-center z-0 pointer-events-none"
                          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        >
                          <div className="flex w-[96%] items-end">
                            <div className="flex-1 h-3 border-b-2 border-l-2 border-[var(--color-primary)]/30 rounded-bl-lg"></div>
                            <div className="text-[var(--color-primary)] font-mono text-xs md:text-sm tracking-widest px-3 translate-y-[10px]">
                              8192 个浮点数
                            </div>
                            <div className="flex-1 h-3 border-b-2 border-r-2 border-[var(--color-primary)]/30 rounded-br-lg"></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* 8192 Dimensionality Global Counter */}
                    <AnimatePresence>
                      {(showFeatures && !startQuantize) && (
                        <motion.div
                          className="absolute -bottom-24 sm:-bottom-28 w-full text-center z-0"
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        >
                          <p className="text-[var(--color-secondary)] font-tech tracking-[0.1em] md:tracking-[0.3em] text-xs md:text-sm">
                            [ D=8192 ] 代表大模型对一个词进行了八千次微妙的特征剖析，维数越高，模型能捕捉的“语义细节”就越丰富，区分“同义词”和“微妙语境”的能力就越强。
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Scaling Factor Block extracted post-quantization */}
                    <AnimatePresence>
                      {showScaleFactor && (
                        <motion.div
                          className="absolute -top-48 md:-top-32 right-[0%] border border-[#fcd34d]/60 bg-gradient-to-br from-[#2a1305]/95 to-[#170800]/95 backdrop-blur-xl rounded-xl flex items-start px-4 md:px-6 py-4 shadow-[0_20px_60px_rgba(251,191,36,0.3)] z-50 pointer-events-auto max-w-[min(90vw,440px)]"
                          initial={{ opacity: 0, y: 40, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", bounce: 0.4 }}
                        >
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mr-3 md:mr-4 border border-amber-400/50 mt-1 shrink-0">
                            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-amber-300 font-tech tracking-widest mb-2 font-bold flex items-center">
                              SCALING FACTOR <span className="opacity-50 mx-2">/</span> 缩放因子
                            </span>

                            <div className="text-white font-mono text-xs md:text-sm space-y-1 mb-2 bg-black/50 px-3 py-2 rounded-lg border border-amber-900/60 shadow-inner">
                              <div className="flex items-center text-amber-100/90 py-1">
                                <span className="text-[var(--color-primary)] font-bold mr-1 md:mr-2">0.824519</span>
                                <span className="mr-1 md:mr-2 text-gray-400">≈</span>
                                <span className="text-red-400 font-bold mr-1 md:mr-2">64</span>
                                <span className="mr-1 md:mr-2 text-gray-400">×</span>
                                <span className="text-amber-400 font-bold">0.012883</span>
                              </div>
                              <div className="text-[10px] md:text-xs text-amber-200/50 pt-1.5 border-t border-amber-900/50 mt-1 tracking-widest flex items-center gap-1 md:gap-2">
                                <span>真实浮点值</span>
                                <span className="text-gray-500">≈</span>
                                <span>量化整数</span>
                                <span className="text-gray-500">×</span>
                                <span>缩放因子(FP32)</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Bottom Explainer Popups */}
                  <AnimatePresence mode="wait">
                    {showPrecision && !startQuantize && (
                      <motion.div
                        key="precision"
                        className="mt-12 sm:mt-36 text-center bg-black/40 px-4 sm:px-6 py-3 rounded-full border border-yellow-500/30 font-body text-xs md:text-sm text-yellow-300 drop-shadow-md backdrop-blur-md max-w-[90vw]"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      >
                        显卡内存杀手：一个模型里有千百亿个这样的浮点数，存储量惊人！
                      </motion.div>
                    )}
                    {showDetails && (
                      <motion.div
                        key="quant"
                        className="mt-10 sm:mt-28 flex flex-col items-center gap-3 drop-shadow-lg z-40 pointer-events-auto px-4 sm:px-0"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      >
                        <div className="text-center bg-[#170505]/80 px-6 py-4 rounded-xl border border-red-500/30 font-body text-sm text-red-200 shadow-xl max-w-3xl leading-relaxed backdrop-blur-md">
                          <strong className="text-white tracking-widest text-base block mb-2">为什么可以做量化？大模型的容错奇迹：</strong>
                          高维语义空间具有极强的<strong className="text-white mx-1">鲁棒性</strong>。在几千维的广袤空间里，微小的数据精度损失（如 <code className="bg-red-950 px-1 rounded text-red-300">0.824519</code> 约等于 <code className="bg-red-950 px-1 rounded text-red-300">0.824512</code>）几乎不影响最终概念的方向和位置。这不仅是存储魔法，更是计算重构：<br />庞大的向量由昂贵的浮点计算降级为<span className="text-red-400 font-bold mx-1 text-base">极速整数乘加 (INT-ALU)</span>，大幅拉平了推理硬件的门槛！
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

            {/* Back Card (Hardware & Naming info) */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-start md:justify-center overflow-y-auto px-3 sm:px-6 md:px-12 w-full h-full pointer-events-auto pt-6 md:pt-0"
              style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
              initial={{ rotateY: -180 }}
              animate={{ rotateY: showHardwareCard ? 0 : -180 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            >
              {showHardwareCard && (
                <div className="w-full max-w-[90rem] mx-auto flex flex-col items-center">
                  <div className="text-[var(--color-primary)] font-tech text-xl md:text-3xl tracking-[0.2em] mb-4 md:mb-10 drop-shadow-[0_0_15px_rgba(0,190,255,0.6)] text-center w-full">
                    算力与存储的现实碰撞
                    <div className="text-sm md:text-base text-[var(--color-primary)]/50 mt-2 font-mono tracking-widest uppercase">The Reality of Compute & Storage</div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full pb-6 md:pb-0">
                    {/* Left Panel: Hardware Storage */}
                    <div className="flex-1 bg-gradient-to-br from-[#0a1526]/80 to-[#02050a]/90 border border-blue-900/50 rounded-2xl p-4 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-md">
                      <div className="flex items-center mb-3 md:mb-6 border-b border-blue-900/50 pb-2 md:pb-4">
                        <svg className="w-6 h-6 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                        <h3 className="text-blue-200 text-lg md:text-xl font-bold tracking-widest font-body">显存容量危机 (VRAM Bottleneck)</h3>
                      </div>
                      
                      <div className="space-y-3 md:space-y-6">
                        <div className="bg-blue-950/30 p-3 md:p-5 rounded-xl border border-blue-900/30">
                          <div className="text-blue-300 text-xs md:text-sm mb-3 font-mono flex items-center justify-between">
                            <span>Llama-3 70B (700亿参数)</span>
                            <span className="text-blue-100 bg-blue-900/50 px-2 rounded">FP16 (半精度)</span>
                          </div>
                          <div className="flex items-end gap-3 mb-2">
                            <span className="text-3xl md:text-4xl text-white font-tech font-bold">~140 GB</span>
                            <span className="text-blue-400 text-xs md:text-sm mb-1">显存需求</span>
                          </div>
                          <p className="text-xs md:text-sm text-blue-200/60 font-body leading-relaxed mt-3">
                            庞然大物！如果只部署一个原始精度模型，至少需要 <strong className="text-blue-300 bg-blue-900/40 px-1 rounded mx-0.5">2 张 NVIDIA H100 (80GB)</strong> 或 <strong className="text-blue-300 bg-blue-900/40 px-1 rounded mx-0.5">4 张 A100 (40GB)</strong> 才能勉强加载，单机部署成本高达几十万乃至百万人民币。
                          </p>
                        </div>

                        <div className="bg-red-950/30 p-3 md:p-5 rounded-xl border border-red-900/30 relative overflow-hidden">
                          <div className="absolute right-0 top-0 w-24 h-24 bg-red-500/10 rounded-bl-full blur-xl"></div>
                          <div className="text-red-300 text-xs md:text-sm mb-3 font-mono flex items-center justify-between z-10 relative">
                            <span>Llama-3 70B (700亿参数)</span>
                            <span className="text-red-100 bg-red-900/50 px-2 rounded shadow-[0_0_10px_rgba(220,38,38,0.3)]">INT4 (4位量化)</span>
                          </div>
                          <div className="flex items-end gap-3 mb-2 z-10 relative">
                            <span className="text-3xl md:text-4xl text-red-100 font-tech font-bold drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]">~38 GB</span>
                            <span className="text-red-400 text-xs md:text-sm mb-1">显存需求</span>
                          </div>
                          <p className="text-xs md:text-sm text-red-200/70 font-body leading-relaxed z-10 relative mt-3">
                            量化的奇迹！显存直降 70%！仅需 <strong className="text-red-300 bg-red-900/40 px-1 rounded mx-0.5">2 张民用级 RTX 4090 (24GB)</strong> 或 <strong className="text-red-300 bg-red-900/40 px-1 rounded mx-0.5">1 张 A6000</strong> 即可流畅运行，让人人皆可拥有大模型。
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Middle Panel: Chip Ecosystem */}
                    <div className="flex-1 bg-gradient-to-br from-[#051a15]/90 to-[#020a07]/95 border border-emerald-900/50 rounded-2xl p-4 md:p-8 shadow-[0_10px_40px_rgba(16,185,129,0.1)] backdrop-blur-md">
                      <div className="flex items-center mb-3 md:mb-6 border-b border-emerald-900/50 pb-2 md:pb-4">
                        <svg className="w-6 h-6 text-emerald-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                        <h3 className="text-emerald-200 text-lg md:text-xl font-bold tracking-widest font-body">硬件阵营与推理格式</h3>
                      </div>

                      <div className="space-y-3 md:space-y-4">
                        <div className="bg-emerald-950/30 p-3 md:p-4 rounded-xl border border-emerald-900/30">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-emerald-400 font-bold">NVIDIA (CUDA)</span>
                            <span className="text-[10px] bg-emerald-900/50 text-emerald-200 px-1 rounded">高性能</span>
                          </div>
                          <div className="text-xs md:text-sm text-emerald-100/80 mb-2 font-mono">
                            专属格式: <strong className="text-white bg-emerald-900/40 px-1 rounded mx-0.5">AWQ</strong> / <strong className="text-white bg-emerald-900/40 px-1 rounded mx-0.5">GPTQ</strong> / <strong className="text-white bg-emerald-900/40 px-1 rounded mx-0.5">EXL2</strong>
                          </div>
                          <p className="text-xs text-emerald-200/60 leading-relaxed font-body">
                            业界霸主。追求极致并发与极限 GPU 利用率。部署成本高，主要面向云端机房与极致算力的企业玩家。
                          </p>
                        </div>

                        <div className="bg-emerald-950/30 p-3 md:p-5 rounded-xl border border-emerald-900/30 relative overflow-hidden">
                          <div className="absolute right-0 top-0 w-20 h-20 bg-emerald-500/10 rounded-bl-full blur-xl"></div>
                          <div className="flex items-center gap-2 mb-2 relative z-10">
                            <span className="text-emerald-300 font-bold text-base md:text-lg drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">Apple Silicon (苹果)</span>
                            <span className="text-[10px] border border-emerald-400/50 text-emerald-300 px-1 rounded font-bold shadow-[0_0_8px_rgba(52,211,153,0.3)]">神级架构</span>
                          </div>
                          <div className="text-xs md:text-sm text-emerald-100/90 mb-3 font-mono relative z-10">
                            绝配格式: <strong className="text-white bg-emerald-900/40 px-1 rounded mx-0.5 text-base">GGUF</strong> / <strong className="text-white bg-emerald-900/40 px-1 rounded mx-0.5 text-base">MLX</strong>
                          </div>
                          <p className="text-xs md:text-sm text-emerald-200/80 leading-relaxed font-body relative z-10 mt-1">
                            得益于令人嫉妒的<strong className="text-emerald-400 font-bold border-b border-emerald-400/50 mx-1">统一内存架构 (UMA)</strong>，Mac 系列可以直接把高达大几十 GB 的内存当成显存池来用！这让看似算力薄弱的 MacBook 却能轻而易举吃下普通 PC 无法加载的超大体积模型，成为了当今个人运行大模型的**最强性价比神器**。
                          </p>
                        </div>
                        
                        <div className="bg-emerald-950/30 p-3 md:p-4 rounded-xl border border-emerald-900/30">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-emerald-400/80 font-bold text-sm">NPU / Edge (端侧芯片)</span>
                          </div>
                          <div className="text-[11px] md:text-xs text-emerald-100/60 mb-1 font-mono">
                            兼容格式: <strong className="text-white/70 bg-emerald-900/40 px-1 rounded">ONNX</strong> / <strong className="text-white/70 bg-emerald-900/40 px-1 rounded">OpenVINO</strong>
                          </div>
                          <p className="text-[11px] md:text-xs text-emerald-200/50 leading-relaxed font-body">
                            面向手机、AI PC等低功耗端侧设备的万能轻量级胶水方案。
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel: Naming Convention */}
                    <div className="flex-1 bg-gradient-to-br from-[#1a0f05]/90 to-[#0d0702]/95 border border-amber-900/50 rounded-2xl p-4 md:p-8 shadow-[0_10px_40px_rgba(251,191,36,0.1)] backdrop-blur-md">
                       <div className="flex items-center mb-3 md:mb-6 border-b border-amber-900/50 pb-2 md:pb-4">
                        <svg className="w-6 h-6 text-amber-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        <h3 className="text-amber-200 text-lg md:text-xl font-bold tracking-widest font-body">量化名称脱盲 (Naming Decode)</h3>
                      </div>

                      <div className="bg-black/60 rounded-xl p-3 md:p-5 border border-amber-500/20 mb-4 md:mb-8 shadow-inner relative">
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(251,191,36,0.02),rgba(251,191,36,0.02)_10px,transparent_10px,transparent_20px)] rounded-xl"></div>
                        <div className="font-mono text-[11px] md:text-sm tracking-wide flex flex-col gap-2 relative z-10">
                           <span className="text-gray-400 text-[10px] md:text-xs tracking-widest mb-1">常见的民间下载后缀名：</span>
                           <div className="flex flex-wrap items-center">
                             <span className="text-gray-300">Llama-3-8B-</span>
                             <span className="text-red-400 font-bold bg-red-400/10 px-1 rounded animate-pulse">Q4</span>
                             <span className="text-amber-400 font-bold bg-amber-400/10 px-1 rounded">_K_M</span>
                             <span className="text-emerald-400 font-bold bg-emerald-400/10 px-1 rounded">.GGUF</span>
                           </div>
                        </div>
                      </div>

                      <div className="space-y-4 md:space-y-6">
                        <div className="flex gap-4">
                          <div className="w-12 h-8 shrink-0 bg-red-950/50 border border-red-500/30 rounded flex items-center justify-center text-red-400 font-mono text-sm font-bold shadow-[0_0_10px_rgba(220,38,38,0.2)]">Q4</div>
                          <div className="flex flex-col">
                            <div className="text-red-200 text-sm font-bold mb-1">4-bit Quantization (4位量化)</div>
                            <div className="text-xs text-red-200/60 leading-relaxed font-body">就是我们在左侧“切断压榨”出来的 INT4 等级。数字越小，也就是砍得越狠，文件越小，但智商损失越大。(市面上还有 Q8、Q5 等)</div>
                          </div>
                        </div>
                        
                        <div className="flex gap-4">
                          <div className="w-12 h-8 shrink-0 bg-amber-950/50 border border-amber-500/30 rounded flex items-center justify-center text-amber-400 font-mono text-sm font-bold">K_M</div>
                          <div className="flex flex-col">
                            <div className="text-amber-200 text-sm font-bold mb-1">K-Quant Medium (中等K系量化)</div>
                            <div className="text-xs text-amber-200/60 leading-relaxed font-body">一种精妙的混合精度压榨算法。M代表中杯，精准平衡了“模型体积”与“逻辑推理能力”之间的甜点位。(还有 S小杯，L大杯)</div>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="w-12 h-8 shrink-0 bg-emerald-950/50 border border-emerald-500/30 rounded flex items-center justify-center text-emerald-400 font-mono text-sm font-bold">.GGUF</div>
                          <div className="flex flex-col">
                            <div className="text-emerald-200 text-sm font-bold mb-1">GGML Universal Format (通用量化格式)</div>
                            <div className="text-xs text-emerald-200/60 leading-relaxed font-body">配合中间面板的知识点，这是跨平台的模型分发格式。对 Mac 非常友好，llama.cpp 引擎可以直接调用它跑在 Apple Silicon 上。</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-1" />
    </div>
  );
}
