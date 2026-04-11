"use client";

/**
 * Slide — "为什么 AI 写小说总爱倒吸一口凉气"
 *
 * Step 0: Title centered
 * Step 1: Title moved, prompt text shown
 * Step 2: Option A [倒吸]
 * Step 3: Option B [此子]
 * Step 4: Option C [双手]
 * Step 5: Option D [沉默]
 * Step 6: Interactive Dashboard (Temperature slider + 4 prompt presets)
 * Step 7: Epiphany conclusion cards
 */

import { useState, useMemo } from "react";
import { useCurrentStep } from "@/config/StepContext";
import { motion, AnimatePresence } from "motion/react";
import SlideTitle from "@/components/SlideTitle";

const FADE_DURATION = 0.5;

// The fixed base prompt that never changes — this is the "题目"
const BASE_PROMPT = "看着眼前毫发无损的少年，长老瞪大了眼睛，";

// 4 prompt presets — same base prompt, different instructions steer different options to win
const PROMPT_PRESETS = [
  {
    id: 0,
    label: "无额外指令",
    instruction: "",
    hint: "候选 A 胜出 ~85%",
    color: "red",
    // A (倒吸) wins ~85% at T=0.7
    logits: [-0.11375, -1.61175, -2.25316, -4.83539],
  },
  {
    id: 1,
    label: "指定阴谋心理",
    instruction: "请以修真世界中老辣长老的视角续写，体现他识破天才少年后内心涌现的警惕与算计",
    hint: "候选 B 胜出 ~82%",
    color: "amber",
    // B (此子) wins ~82% at T=0.7
    logits: [-3.5, 0.9, -2.0, -4.2],
  },
  {
    id: 2,
    label: "指定身体反应",
    instruction: "请着重描写长老感受到逆天气息冲击时，身体本能产生的应激与颤栗",
    hint: "候选 C 胜出 ~78%",
    color: "blue",
    // C (双手) wins ~78% at T=0.7
    logits: [-3.0, -2.5, 0.8, -4.5],
  },
  {
    id: 3,
    label: "指定克制留白",
    instruction: "请用克制、留白的文学笔法续写，避免套路化反应，展现长老内心震动后归于平静的人性瞬间",
    hint: "候选 D 胜出 ~72%",
    color: "emerald",
    // D (沉默) wins ~72% at T=0.7
    logits: [-3.5, -3.2, -3.8, 0.5],
  },
] as const;

const PRESET_STYLES: Record<string, { activeBg: string; activeBorder: string; activeText: string; dot: string }> = {
  red:     { activeBg: "bg-red-950/60",     activeBorder: "border-red-500/60",     activeText: "text-red-300",     dot: "bg-red-500" },
  amber:   { activeBg: "bg-amber-950/60",   activeBorder: "border-amber-500/60",   activeText: "text-amber-300",   dot: "bg-amber-500" },
  blue:    { activeBg: "bg-blue-950/60",    activeBorder: "border-blue-500/60",    activeText: "text-blue-300",    dot: "bg-blue-500" },
  emerald: { activeBg: "bg-emerald-950/60", activeBorder: "border-emerald-500/60", activeText: "text-emerald-300", dot: "bg-emerald-500" },
};

export default function SlideLogits() {
  const step = useCurrentStep();

  const showPrompt = step >= 1;
  const showOptionA = step >= 2;
  const showOptionB = step >= 3;
  const showOptionC = step >= 4;
  const showOptionD = step >= 5;
  const showControls = step >= 6;
  const showConclusion = step >= 7;

  const [temperature, setTemperature] = useState(0.7);
  const [selectedPreset, setSelectedPreset] = useState(0);

  // Calculate Softmax from selected preset's logits + temperature
  const probabilities = useMemo(() => {
    const temp = Math.max(temperature, 0.01);
    const logits = PROMPT_PRESETS[selectedPreset].logits;
    const expVals = logits.map((z: number) => Math.exp(z / temp));
    const sumExp = expVals.reduce((a: number, b: number) => a + b, 0);
    return expVals.map((val: number) => (val / sumExp) * 100);
  }, [temperature, selectedPreset]);

  return (
    <div className="w-full h-full bg-transparent flex flex-col pt-8 sm:pt-16 pb-12 px-4 md:px-12 relative overflow-hidden">
      <SlideTitle
        title="AI味“八股文”"
        label="LOGITS"
        moved={showPrompt}
        subtitle="为什么 AI 写小说总爱倒吸一口凉气"
      />

      <AnimatePresence>
        {showPrompt && (
          <motion.div
            className="absolute inset-x-0 top-32 bottom-0 flex flex-col items-center pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: FADE_DURATION }}
          >
            {/* Context Prompt Box */}
            <div className="w-full max-w-4xl bg-[#0a0a14]/90 border-l-4 border-l-[#ffb86c] border-y border-r border-white/10 rounded-r-xl p-6 shadow-2xl mb-8 backdrop-blur-md pointer-events-auto shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-white/5 px-2 py-1 rounded-bl-lg text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                Prompt Context
              </div>

              {/* Instruction block — only appears when a preset with an instruction is selected */}
              <AnimatePresence>
                {showControls && PROMPT_PRESETS[selectedPreset].instruction && (
                  <motion.div
                    key={`inst-${selectedPreset}`}
                    className="mb-4 pb-4 border-b border-white/10"
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="text-[10px] font-mono text-amber-400/80 uppercase tracking-widest mb-1.5">
                      ✦ 续写指令 / User Instruction
                    </div>
                    <div className="text-amber-200/90 text-sm leading-relaxed">
                      {PROMPT_PRESETS[selectedPreset].instruction}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Fixed base prompt — never changes */}
              <div className="text-gray-300 font-serif text-xl md:text-2xl leading-relaxed tracking-wide">
                {BASE_PROMPT}
                <motion.span
                  className="inline-block border-b-2 border-white ml-2 w-24 animate-pulse align-bottom"
                />
              </div>
            </div>

            {/* Candidates Display */}
            <div className="w-full max-w-4xl flex flex-col gap-4 pointer-events-auto">

              {/* Option A */}
              <AnimatePresence>
                {showOptionA && (
                  <OptionRow
                    label="候选 A" word="倒吸" percent={probabilities[0]}
                    baseColor="red" combo={["一", "口", "凉", "气"]}
                  />
                )}
              </AnimatePresence>

              {/* Option B */}
              <AnimatePresence>
                {showOptionB && (
                  <OptionRow
                    label="候选 B" word="此子" percent={probabilities[1]}
                    baseColor="amber" combo={["断", "不", "可", "留"]}
                  />
                )}
              </AnimatePresence>

              {/* Option C */}
              <AnimatePresence>
                {showOptionC && (
                  <OptionRow
                    label="候选 C" word="双手" percent={probabilities[2]}
                    baseColor="blue" combo={["微", "微", "颤", "抖"]}
                  />
                )}
              </AnimatePresence>

              {/* Option D */}
              <AnimatePresence>
                {showOptionD && (
                  <OptionRow
                    label="候选 D" word="沉默地将法宝收起" percent={probabilities[3]}
                    baseColor="emerald" isLowProbability
                    note="(这才是真正有人味的描写，但被低概率淹没了)"
                  />
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Center & Conclusion Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute bottom-6 left-0 right-0 px-4 flex flex-col items-center pointer-events-auto z-50"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            <div className="w-full max-w-5xl bg-black/80 border border-white/20 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col md:flex-row gap-8 relative overflow-visible">

              {/* Left Panel: Temperature + Prompt Presets */}
              <div className="flex-1 flex flex-col justify-center gap-5">

                {/* Temperature Slider */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-300 text-sm font-bold tracking-widest">Temperature (随机性)</span>
                    <span className="text-(--color-primary) font-mono font-bold">{temperature.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="0.01" max="2.0" step="0.01"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full appearance-none bg-gray-700 h-2 rounded outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-(--color-primary) cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
                    <span>向左: 套路复读机</span>
                    <span>向右: 胡言乱语发散</span>
                  </div>
                </div>

                {/* Prompt Preset Selector */}
                <div>
                  <div className="text-gray-300 text-sm font-bold tracking-widest mb-3">
                    选择续写指令
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {PROMPT_PRESETS.map((preset) => {
                      const styles = PRESET_STYLES[preset.color];
                      const isActive = selectedPreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          onClick={() => setSelectedPreset(preset.id)}
                          className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                            isActive
                              ? `${styles.activeBg} ${styles.activeBorder} ${styles.activeText}`
                              : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${styles.dot}`} />
                            <span className="font-bold text-xs tracking-wider">{preset.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Conclusion Cards */}
              <AnimatePresence>
                {showConclusion && (
                  <motion.div
                    className="flex-[1.5] grid grid-cols-1 md:grid-cols-2 gap-4 relative"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* Decorative bolt */}
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-px h-3/4 bg-gradient-to-b from-transparent via-white/20 to-transparent hidden md:block" />

                    <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-4 md:p-5 relative overflow-hidden group hover:border-red-500/60 transition-colors">
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-red-500/20 blur-xl rounded-full" />
                      <div className="text-red-400 font-bold mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                        Token 级板结现象
                      </div>
                      <p className="text-xs text-red-200/80 leading-relaxed font-body">
                        网文语料库中，“倒”字后紧跟“吸”的配对出现率极高，导致概率权重压倒了语法多样性，形成词汇捆绑销售。
                      </p>
                    </div>

                    <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-4 md:p-5 relative overflow-hidden group hover:border-amber-500/60 transition-colors">
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-500/20 blur-xl rounded-full" />
                      <div className="text-amber-400 font-bold mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        语义坍缩与偷懒
                      </div>
                      <p className="text-xs text-amber-200/80 leading-relaxed font-body">
                        大模型本质上是个概率缝合怪。它永远青睐用最少量的 Token，走完最容易“及格”的感情过场套路。
                      </p>
                    </div>
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

// ---------------------------------------------------------------------------
// Helper Components
// ---------------------------------------------------------------------------

function OptionRow({ label, word, percent, baseColor, combo, isLowProbability, note }: {
  label: string, word: string, percent: number, baseColor: string, combo?: string[], isLowProbability?: boolean, note?: string
}) {

  // Dynamic color map
  const colorMap: Record<string, string> = {
    red: "bg-red-500", amber: "bg-amber-500", blue: "bg-blue-500", emerald: "bg-emerald-500"
  };
  const textColorMap: Record<string, string> = {
    red: "text-red-400", amber: "text-amber-400", blue: "text-blue-400", emerald: "text-emerald-400"
  };
  const borderColorMap: Record<string, string> = {
    red: "border-red-500/30", amber: "border-amber-500/30", blue: "border-blue-500/30", emerald: "border-emerald-500/30"
  };

  const cBg = colorMap[baseColor] || "bg-gray-500";
  const cText = textColorMap[baseColor] || "text-gray-400";
  const cBorder = borderColorMap[baseColor] || "border-gray-500/30";

  return (
    <motion.div
      className={`flex items-center gap-4 bg-white/5 border ${cBorder} rounded-xl p-3 md:p-4 hover:bg-white/10 transition-colors pointer-events-auto overflow-hidden relative`}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      {/* Background fill representing percentage */}
      <motion.div
        className={`absolute left-0 top-0 bottom-0 ${cBg} opacity-10`}
        animate={{ width: `${percent}%` }}
        transition={{ type: "spring", bounce: 0.2 }}
      />

      <div className="w-16 shrink-0 text-sm text-gray-400 font-mono text-right">{label}:</div>

      <div className="w-64 shrink-0">
        <span className={`inline-block border px-2 py-1 rounded font-bold tracking-widest bg-black/40 ${isLowProbability ? "text-gray-400 border-gray-600" : `${cText} border-current`}`}>
          [{word}]
        </span>
      </div>

      <div className="w-24 shrink-0 flex items-center justify-end px-2">
        <span className="font-mono font-bold text-gray-200">
          {(percent).toFixed(percent < 1 ? 2 : 1)}%
        </span>
      </div>

      {combo && percent > 50 && (
        <div className="flex-1 hidden md:flex items-center gap-2">
          <span className="text-[10px] text-gray-300 uppercase tracking-widest pl-2 border-l border-gray-700">连招预警</span>
          <div className="flex gap-1">
            {combo.map((c, i) => (
              <motion.span
                key={i}
                className="bg-gray-800 border border-gray-700 text-gray-300 text-xs px-1.5 py-0.5 rounded"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
              >
                [{c}]
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {note && (
        <div className="flex-1 text-xs text-gray-300 italic pl-4 border-l border-gray-700 hidden lg:block">
          {note}
        </div>
      )}
    </motion.div>
  );
}
