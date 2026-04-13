import { useCurrentStep } from "@/config/StepContext";
import SlideTitle from "@/components/SlideTitle";
import { BlockMath } from "react-katex";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

const PROJECTION_ANGLE = Math.PI / 6;
function project(x: number, y: number, z: number) {
  return {
    x: (x - y) * Math.cos(PROJECTION_ANGLE),
    y: (x + y) * Math.sin(PROJECTION_ANGLE) - z,
  };
}

const pMan = { x: 120, y: 0, z: 0 };
const pWoman = { x: -80, y: 0, z: 0 };
const pKing = { x: 120, y: 0, z: 160 };
const pQueen = { x: -80, y: 0, z: 160 };

const spMan = project(pMan.x, pMan.y, pMan.z);
const spWoman = project(pWoman.x, pWoman.y, pWoman.z);
const spKing = project(pKing.x, pKing.y, pKing.z);
const spQueen = project(pQueen.x, pQueen.y, pQueen.z);

// Alignment Points
const pAlignImgStart = { x: -140, y: 0, z: -120 };
const pAlignTxtStart = { x: 140, y: 0, z: 120 };
const pAlignTarget = { x: 0, y: 0, z: 0 };
const spAlignImgStart = project(pAlignImgStart.x, pAlignImgStart.y, pAlignImgStart.z);
const spAlignTxtStart = project(pAlignTxtStart.x, pAlignTxtStart.y, pAlignTxtStart.z);
const spAlignTarget = project(pAlignTarget.x, pAlignTarget.y, pAlignTarget.z);

// Generalization Points
// Generalization Points
const pGenKnown = [
  { x: 30, y: 0, z: -100 }, { x: -50, y: 0, z: -120 }, { x: 100, y: 0, z: 20 },
  { x: 40, y: 0, z: 80 }, { x: -80, y: 0, z: 40 }, { x: -120, y: 0, z: -30 }, // 0 to 5
  { x: -200, y: 0, z: -160 }, { x: -300, y: 0, z: -80 } // Basis points for Hallucination in the TOP-LEFT deep void
];
const spGenKnown = pGenKnown.map(p => project(p.x, p.y, p.z));
const pGenUnknown = { x: -20, y: 0, z: -40 };
const spGenUnknown = project(pGenUnknown.x, pGenUnknown.y, pGenUnknown.z);

// Hallucination Point (Move deep into the TOP-LEFT area to match user's box and avoid title)
const pGenHall = { x: -260, y: 0, z: -120 };
const spGenHall = project(pGenHall.x, pGenHall.y, pGenHall.z);

const IconImage = () => (
  <svg className="w-4 h-4 mr-1.5 text-[#f5d0fe]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>
);

const IconText = () => (
  <svg className="w-4 h-4 mr-1.5 text-[#67e8f9]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
  </svg>
);

// Interpolation Points
const pGenCat = { x: -160, y: 0, z: -80 };
const pGenDog = { x: 160, y: 0, z: 80 };
const spGenCat = project(pGenCat.x, pGenCat.y, pGenCat.z);
const spGenDog = project(pGenDog.x, pGenDog.y, pGenDog.z);
const spGenMid = project((pGenCat.x + pGenDog.x) / 2, 0, (pGenCat.z + pGenDog.z) / 2);

const DISCRETE_TOKENS_MATH = [
  { label: "男人", id: "5381", color: "#00f0ff" },
  { label: "女人", id: "8893", color: "#00f0ff" },
  { label: "国王", id: "0492", color: "#d0bcff" },
  { label: "女王", id: "6614", color: "#d0bcff" },
];

const DISCRETE_TOKENS_ALIGN = [
  { icon: <IconImage />, label: "图像: 狗", id: "V-849", color: "#f5d0fe", sub: "解析策略/ViT Patches" },
  { icon: <IconText />, label: "单词: Dog", id: "T-014", color: "#67e8f9", sub: "解析策略/BPE Subword" },
];

const DISCRETE_TOKENS_GEN = [
  { label: "概念：猫 (Cat)", id: "C-112", color: "#fca5a5" },
  { label: "概念：狗 (Dog)", id: "D-990", color: "#fde047" },
];

export default function SlideVectorSpace() {
  const step = useCurrentStep();
  const showBox = step >= 1;
  const showText = step >= 2;
  const show3D = step >= 3;

  // Scene 1: Math King Queen
  const sceneMath = step >= 3 && step <= 6;
  const showPoints = step >= 4 && step <= 6;
  const showPrincipalArrows = step >= 5 && step <= 6;
  const showCompletingArrows = step === 6;

  // Scene 2: Multimodal Alignment
  const sceneAlign = step === 7;

  // Scene 3: Generative Interpolation
  const sceneGen = step >= 8 && step <= 9;
  const showInterpolation = step === 9;

  // Scene 4: Generalization & Hallucination (Full Screen)
  const sceneGeneralize = step >= 10;
  const showUnknownPoint = step >= 11;
  const showHallucination = step >= 12;

  let currentTokens = DISCRETE_TOKENS_MATH;
  if (sceneAlign) currentTokens = DISCRETE_TOKENS_ALIGN;
  if (sceneGen) currentTokens = DISCRETE_TOKENS_GEN;

  // Track if tokens are "shooting" over bridge
  const isShootingOut = step === 4 || step === 7 || step === 8;

  return (
    <div className="slide !p-0 overflow-hidden relative flex flex-col items-center justify-center">
      <SlideTitle
        title="向量空间"
        label="VECTOR SPACE"
        subtitle="语义可计算"
        moved={showBox}
      />

      {/* Formula & Text Overlay - Fades out at Step 3 */}
      <AnimatePresence>
        {!show3D && showBox && (
          <motion.div
            className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-12 z-30 w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-[clamp(1.5rem,3vw,3rem)] text-white font-tech tracking-wider drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <BlockMath math="V(\text{国王}) - V(\text{男人}) + V(\text{女人}) \approx V(\text{女王})" />
            </div>

            <motion.div
              className="text-lg md:text-2xl text-[var(--color-primary-fixed-dim)] font-body tracking-wider text-center max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 20 }}
              transition={{ duration: 0.6 }}
            >
              它理解的不是字，而是连续空间中的<strong className="text-[var(--color-primary)]">几何坐标与距离</strong>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Split View Layout: Discrete -> Bridge -> Continuous 3D View */}
      <AnimatePresence>
        {show3D && (
          <motion.div
            className="absolute top-[20%] inset-x-[5%] bottom-[10%] flex flex-row items-center z-10 pointer-events-none"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 60 }}
          >
            {/* 1. Left Column: Discrete World */}
            <AnimatePresence>
              {!sceneGeneralize && (
                <motion.div
                  className="w-[20%] h-full flex flex-col justify-center items-center gap-6 relative shrink-0"
                  exit={{ opacity: 0, x: -30, filter: "blur(5px)" }}
                >
                  <motion.div
                    className="absolute top-0 text-[var(--color-primary)] font-bold tracking-widest font-tech text-xs md:text-sm uppercase text-shadow-primary z-20 whitespace-nowrap"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} exit={{ opacity: 0 }}
                  >
                    离散孤岛 / DISCRETE WORLD
                  </motion.div>

                  {currentTokens.map((token: any, i) => (
                    <motion.div
                      key={token.id} // ensures re-render animate on swap
                      className="bg-[#1a1a1a] border border-[#333] text-[var(--color-outline-variant)] font-mono px-4 py-2.5 flex justify-between w-full max-w-[300px] rounded-md shadow-lg items-center relative overflow-hidden"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      exit={{ opacity: 0 }}
                    >
                      <span className="bg-black/60 px-2 py-0.5 rounded text-[10px] tracking-wider text-[#666]">ID: {token.id}</span>

                      <div className="flex flex-col items-end">
                        <span className="text-[#bbb] font-body tracking-wider text-sm flex items-center" style={{ color: token.color }}>
                          {token.icon} {token.label}
                        </span>
                        {token.sub && <span className="text-[9px] text-[#666] font-mono tracking-widest mt-1 opacity-80">{token.sub}</span>}
                      </div>

                      {/* Highlight burst passing through token element upon injection */}
                      {isShootingOut && (
                        <motion.div
                          className="absolute inset-0 bg-white opacity-0"
                          animate={{ opacity: [0, 0.4, 0] }}
                          transition={{ duration: 0.6, delay: i * 0.1 }}
                        />
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2. Middle Bridge: Embedding Mapping */}
            <AnimatePresence>
              {!sceneGeneralize && (
                <motion.div
                  className="flex-1 flex flex-col items-center justify-center relative px-4 shrink-0 mt-8"
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <motion.div
                    className="text-[10px] md:text-xs text-[var(--color-primary-fixed-dim)] font-tech tracking-wider whitespace-nowrap -mt-10 mb-2 opacity-80"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} exit={{ opacity: 0 }}
                  >
                    EMBEDDING 映射法则
                  </motion.div>

                  <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="bridgeFlow" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="var(--color-primary-fixed-dim)" />
                        <stop offset="100%" stopColor="var(--color-primary)" />
                      </linearGradient>
                    </defs>
                    {/* Static track */}
                    <line x1="0" y1="16" x2="100%" y2="16" stroke="rgba(0,240,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                    {/* Flowing animated track triggers when tokens get shot */}
                    {(isShootingOut || step === 9) && (
                      <motion.line
                        x1="0" y1="16" x2="100%" y2="16"
                        stroke="url(#bridgeFlow)" strokeWidth="2" strokeDasharray="16 8"
                        initial={{ strokeDashoffset: 100 }}
                        animate={{ strokeDashoffset: [100, 0] }}
                        transition={{ duration: 0.6, ease: "linear", repeat: Infinity }}
                        style={{ filter: "drop-shadow(0 0 6px var(--color-primary))" }}
                      />
                    )}
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 3. Right Column: Continuous 3D Isometric View */}
            <motion.div
              className="h-full flex items-center justify-center relative overflow-visible"
              initial={{ width: "55%", translateX: "-5%" }}
              animate={{
                width: sceneGeneralize ? "100%" : "55%",
                translateX: sceneGeneralize ? "0%" : "-5%"
              }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              <AnimatePresence>
                {!sceneGeneralize && (
                  <motion.div
                    className="absolute top-0 text-[var(--color-primary)] font-bold tracking-widest font-tech text-xs md:text-sm uppercase text-shadow-primary z-20 whitespace-nowrap"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} exit={{ opacity: 0 }}
                  >
                    连续宇宙 / CONTINUOUS SPACE
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {sceneGeneralize && (
                  <motion.div
                    className="absolute top-[5%] md:top-0 text-white font-bold tracking-widest font-tech text-sm md:text-lg text-center uppercase z-20 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} exit={{ opacity: 0 }}
                  >
                    未知的边界 / <span className="text-red-400">GENERALIZATION</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <svg
                className="w-full h-full max-w-[600px] overflow-visible"
                viewBox="-300 -300 600 550"
              >
                <defs>
                  <marker id="arrowPrimary" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#00f0ff" />
                  </marker>
                  <marker id="arrowDashed" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#d0bcff" opacity="0.6" />
                  </marker>
                </defs>

                {/* Base Grid */}
                <g stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1">
                  {Array.from({ length: 9 }).map((_, i) => {
                    const val = -200 + i * 50;
                    const p1 = project(val, -200, 0);
                    const p2 = project(val, 200, 0);
                    const p3 = project(-200, val, 0);
                    const p4 = project(200, val, 0);
                    return (
                      <g key={i}>
                        <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />
                        <line x1={p3.x} y1={p3.y} x2={p4.x} y2={p4.y} />
                      </g>
                    );
                  })}
                </g>

                {/* Grid origin axes */}
                <g stroke="rgba(0, 240, 255, 0.15)" strokeWidth="2">
                  <line {...{ x1: project(-200, 0, 0).x, y1: project(-200, 0, 0).y, x2: project(200, 0, 0).x, y2: project(200, 0, 0).y }} />
                  <line {...{ x1: project(0, -200, 0).x, y1: project(0, -200, 0).y, x2: project(0, 200, 0).x, y2: project(0, 200, 0).y }} />
                  {/* Z axis */}
                  <line {...{ x1: project(0, 0, 0).x, y1: project(0, 0, 0).y, x2: project(0, 0, 250).x, y2: project(0, 0, 250).y }} />
                </g>

                {/* Principal Vectors (Man -> King, Woman -> Queen) */}
                {showPrincipalArrows && (
                  <g stroke="#00f0ff" strokeWidth="2" markerEnd="url(#arrowPrimary)">
                    <motion.line
                      x1={spMan.x} y1={spMan.y} x2={spKing.x} y2={spKing.y}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.8 }}
                      transition={{ duration: 0.8 }}
                    />
                    <motion.line
                      x1={spWoman.x} y1={spWoman.y} x2={spQueen.x} y2={spQueen.y}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.8 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </g>
                )}

                {/* Completing Vectors (Man -> Woman, King -> Queen) */}
                {showCompletingArrows && (
                  <g stroke="#d0bcff" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" markerEnd="url(#arrowDashed)">
                    <motion.line
                      x1={spMan.x} y1={spMan.y} x2={spWoman.x} y2={spWoman.y}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                    />
                    <motion.line
                      x1={spKing.x} y1={spKing.y} x2={spQueen.x} y2={spQueen.y}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </g>
                )}

                {/* Scene 1: Points & Labels */}
                {showPoints && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Point x={spMan.x} y={spMan.y} label="男人 (Man)" value="[0.21, -0.4...]" align="right" delay={0.1} color="#00f0ff" />
                    <Point x={spWoman.x} y={spWoman.y} label="女人 (Woman)" value="[-0.15, 0.8...]" align="left" delay={0.2} color="#00f0ff" />
                    <Point x={spKing.x} y={spKing.y} label="国王 (King)" value="[0.55, -0.4...]" align="right" delay={0.3} color="#d0bcff" />
                    <Point x={spQueen.x} y={spQueen.y} label="女王 (Queen)" value="[-0.31, 0.8...]" align="left" delay={0.4} color="#d0bcff" />
                  </motion.g>
                )}

                {/* Scene 2: Multimodal Alignment */}
                <AnimatePresence>
                  {sceneAlign && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {/* Animated Image Token Point */}
                      <motion.g
                        initial={{ x: spAlignImgStart.x, y: spAlignImgStart.y }}
                        animate={{ x: spAlignTarget.x, y: spAlignTarget.y }}
                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                      >
                        <Point x={0} y={0} label="图像特征" value="[...]" color="#f5d0fe" align="left" />
                      </motion.g>

                      {/* Animated Text Token Point */}
                      <motion.g
                        initial={{ x: spAlignTxtStart.x, y: spAlignTxtStart.y }}
                        animate={{ x: spAlignTarget.x, y: spAlignTarget.y }}
                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                      >
                        <Point x={0} y={0} label="文本特征" value="[...]" color="#67e8f9" align="right" />
                      </motion.g>

                      {/* Merged Core Effect */}
                      <motion.g
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2, type: "spring" }}
                      >
                        <circle cx={spAlignTarget.x} cy={spAlignTarget.y} r="16" fill="white" style={{ filter: "drop-shadow(0 0 10px white)" }} />
                        <text x={spAlignTarget.x} y={spAlignTarget.y + 35} fill="white" textAnchor="middle" fontWeight="bold" className="drop-shadow-md">完美对齐 (合并)</text>
                      </motion.g>
                    </motion.g>
                  )}
                </AnimatePresence>

                {/* Scene 3: Generative Interpolation */}
                <AnimatePresence>
                  {sceneGen && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Point x={spGenCat.x} y={spGenCat.y} label="猫(Cat)" value="[...]" color="#fca5a5" align="left" delay={0} />
                      <Point x={spGenDog.x} y={spGenDog.y} label="狗(Dog)" value="[...]" color="#fde047" align="right" delay={0} />

                      {/* Interpolation Line */}
                      <motion.line
                        x1={spGenCat.x} y1={spGenCat.y} x2={spGenDog.x} y2={spGenDog.y}
                        stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="4 4"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 1 }}
                      />

                      {/* Sliding Interpolation Node */}
                      {showInterpolation && (
                        <motion.g
                          initial={{ x: spGenCat.x, y: spGenCat.y }}
                          animate={{ x: spGenMid.x, y: spGenMid.y }}
                          transition={{ duration: 2.5, ease: "easeInOut" }}
                        >
                          <circle cx={0} cy={0} r="8" fill="#fbbf24" style={{ filter: "drop-shadow(0 0 10px #fbbf24)" }} />
                          <circle cx={0} cy={0} r="20" fill="#fbbf24" opacity="0.3" />
                          <motion.text
                            x={0} y={-18} fill="#fbbf24" textAnchor="middle" fontWeight="bold" className="drop-shadow-md"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
                          >
                            半猫半狗虚拟态
                          </motion.text>
                          <motion.text
                            x={0} y={20} fill="#fbbf24" textAnchor="middle" fontSize="11" opacity="0.8"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
                          >
                            [0.48, -0.66...]
                          </motion.text>
                        </motion.g>
                      )}
                    </motion.g>
                  )}
                </AnimatePresence>
                {/* Scene 4: Generalization Explorations */}
                <AnimatePresence>
                  {sceneGeneralize && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                      {/* Cluster of known semantic points */}
                      {spGenKnown.map((sp, i) => (
                        <motion.circle
                          key={i} cx={sp.x} cy={sp.y} r="3" fill="#cbd5e1" opacity="0.6"
                          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 + i * 0.1 }}
                        />
                      ))}

                      {/* The Unknown/Unseen Input point drops in */}
                      {showUnknownPoint && (
                        <motion.g
                          initial={{ opacity: 0, y: spGenUnknown.y - 150 }}
                          animate={{ opacity: 1, y: spGenUnknown.y }}
                          transition={{ type: "spring", bounce: 0.5, duration: 1 }}
                        >
                          {/* Radiating radar to nearby known points for Corgi (Indices 0, 1, 2) */}
                          <motion.line x1={spGenUnknown.x} y1={0} x2={spGenKnown[0].x} y2={spGenKnown[0].y - spGenUnknown.y} stroke="rgba(248,113,113,0.5)" strokeWidth="1" strokeDasharray="2 2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8 }} />
                          <motion.line x1={spGenUnknown.x} y1={0} x2={spGenKnown[1].x} y2={spGenKnown[1].y - spGenUnknown.y} stroke="rgba(248,113,113,0.5)" strokeWidth="1" strokeDasharray="2 2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9 }} />
                          <motion.line x1={spGenUnknown.x} y1={0} x2={spGenKnown[2].x} y2={spGenKnown[2].y - spGenUnknown.y} stroke="rgba(248,113,113,0.5)" strokeWidth="1" strokeDasharray="2 2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.0 }} />

                          <circle cx={spGenUnknown.x} cy={0} r="6" fill="#f87171" style={{ filter: "drop-shadow(0 0 8px #f87171)" }} />
                          <circle cx={spGenUnknown.x} cy={0} r="18" fill="#f87171" opacity="0.4" />
                          <motion.text
                            x={spGenUnknown.x} y={-18} fill="#f87171" textAnchor="middle" fontWeight="bold" className="drop-shadow-md text-[12px]"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                          >
                            [ 未知提问 Prompt ]
                          </motion.text>
                          <motion.text
                            x={spGenUnknown.x} y={20} fill="#fca5a5" textAnchor="middle" fontSize="10"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}
                          >
                            几何推断成功: "柯基犬"
                          </motion.text>
                        </motion.g>
                      )}

                      {/* The Hallucination/Void Input point drops in */}
                      {showHallucination && (
                        <motion.g
                          initial={{ opacity: 0, y: spGenHall.y - 150 }}
                          animate={{ opacity: 1, y: spGenHall.y }}
                          transition={{ type: "spring", bounce: 0.5, duration: 1 }}
                        >
                          {/* Weak radar lines searching for COMPLETELY DIFFERENT basis points in the top void (Indices 5, 6, 7) */}
                          <motion.line x1={spGenHall.x} y1={0} x2={spGenKnown[5].x} y2={spGenKnown[5].y - spGenHall.y} stroke="rgba(192,132,252,0.3)" strokeWidth="1" strokeDasharray="1 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8 }} />
                          <motion.line x1={spGenHall.x} y1={0} x2={spGenKnown[6].x} y2={spGenKnown[6].y - spGenHall.y} stroke="rgba(192,132,252,0.3)" strokeWidth="1" strokeDasharray="1 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9 }} />
                          <motion.line x1={spGenHall.x} y1={0} x2={spGenKnown[7].x} y2={spGenKnown[7].y - spGenHall.y} stroke="rgba(192,132,252,0.3)" strokeWidth="1" strokeDasharray="1 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.0 }} />

                          <circle cx={spGenHall.x} cy={0} r="6" fill="#c084fc" style={{ filter: "drop-shadow(0 0 8px #c084fc)" }} />
                          <circle cx={spGenHall.x} cy={0} r="18" fill="#c084fc" opacity="0.4" />
                          <motion.text 
                             x={spGenHall.x} y={-18} fill="#c084fc" textAnchor="middle" fontWeight="bold" className="drop-shadow-md text-[12px]"
                             initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                          >
                            [ 荒谬提问 Prompt ]
                          </motion.text>
                          <motion.text 
                             x={spGenHall.x} y={20} fill="#e879f9" textAnchor="middle" fontSize="10"
                             initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}
                          >
                            强行组装: "林黛玉倒拔垂杨柳"
                          </motion.text>
                        </motion.g>
                      )}
                    </motion.g>
                  )}
                </AnimatePresence>
              </svg>

              {/* Bottom Explainers for ALL Scenes */}
              <AnimatePresence mode="wait">
                {showCompletingArrows && (
                  <motion.div
                    key="scene1"
                    className="absolute -bottom-4 md:bottom-12 text-[var(--color-primary-fixed-dim)] tracking-widest font-body text-xs md:text-sm text-center bg-black/40 px-6 py-3 rounded-full border border-[var(--color-primary)]/30 backdrop-blur-md whitespace-nowrap"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  >
                    特征向量严格平行 —— 语义关系转化为精确的几何关系
                  </motion.div>
                )}
                {sceneAlign && (
                  <motion.div
                    key="scene2"
                    className="absolute -bottom-4 md:bottom-12 text-[#e879f9] tracking-widest font-body text-xs md:text-sm text-center bg-black/40 px-6 py-3 rounded-full border border-[#f5d0fe]/30 backdrop-blur-md whitespace-nowrap"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ delay: 2.5 }}
                  >
                    多模态对齐 (Alignment) —— 将视觉与文本拉平在同一个高维度宇宙
                  </motion.div>
                )}
                {showInterpolation && !sceneGeneralize && (
                  <motion.div
                    key="scene3"
                    className="absolute -bottom-4 md:bottom-12 text-[#fcd34d] tracking-widest font-body text-xs md:text-sm text-center bg-black/40 px-6 py-3 rounded-full border border-[#fbbf24]/30 backdrop-blur-md whitespace-nowrap drop-shadow-lg"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ delay: 2.5 }}
                    style={{ color: "#fcd34d" }}
                  >
                    潜在空间插值 (Latent Interpolation) —— 探索未知并创造新物种
                  </motion.div>
                )}
                {sceneGeneralize && !showHallucination && (
                  <motion.div
                    key="scene4"
                    className="absolute -bottom-4 md:bottom-12 tracking-widest font-body text-xs md:text-sm text-center bg-black/40 px-6 py-3 rounded-full border border-red-400/30 backdrop-blur-md drop-shadow-lg z-30"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ delay: 1.5 }}
                  >
                    <span className="text-red-400 font-bold mr-2">泛化推断 / Generalization :</span>
                    <span className="text-white opacity-90">大模型面对新数据没有宕机，因为浩瀚的连续空间赋予了它推断未知的神力</span>
                  </motion.div>
                )}
                {showHallucination && (
                  <motion.div
                    key="scene5"
                    className="absolute -bottom-4 md:bottom-12 tracking-widest font-body text-xs md:text-sm text-center bg-black/40 px-6 py-3 rounded-full border border-[#c084fc]/30 backdrop-blur-md drop-shadow-lg z-30"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ delay: 2 }}
                  >
                    <span className="text-[#c084fc] font-bold mr-2">双刃剑 / Hallucination :</span> 
                    <span className="text-white opacity-90">连续几何空间没有 404 真空，空白区的强行解码就是幻象（幻觉本质）</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper to render a glowing point with a text block
function Point({ x, y, label, value, align = "right", delay = 0, color = "#00f0ff" }: any) {
  const gX = align === "right" ? x + 15 : x - 15;
  const textAnchor = align === "right" ? "start" : "end";

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", bounce: 0.4 }}
    >
      <circle cx={x} cy={y} r="6" fill={color} />
      <circle cx={x} cy={y} r="12" fill={color} opacity="0.3" />

      <text x={gX} y={y - 5} fill="white" fontSize="14" fontWeight="bold" textAnchor={textAnchor} className="drop-shadow-md">
        {label}
      </text>
      <text x={gX} y={y + 12} fill={color} fontSize="10" fontFamily="monospace" textAnchor={textAnchor} opacity="0.8">
        {value}
      </text>
    </motion.g>
  );
}
