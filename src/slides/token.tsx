"use client";

/**
 * Slide — "词元 / Token"
 *
 * Step 0: Title centered (static intro)
 * Step 1: Title → top-left (same spring as what-is-ai), sentence appears
 * Step 2: Sentence explodes into colored token fragments via Motion stagger
 */

import { useCurrentStep } from "@/config/StepContext";
import { motion, AnimatePresence } from "motion/react";
import SlideTitle from "@/components/SlideTitle";
import { useMemo } from "react";
import { encode, decode } from "gpt-tokenizer";

// ─── Demo sentence ────────────────────────────────────────────────────────────
const DEMO_TEXT = "用Next.js搭建不一样的PPT";

// ─── Step 3 insight items ─────────────────────────────────────────────────────
const INSIGHTS = [
  { text: '它是 AI 世界的“算力货币”', colorIdx: 0 },
  { text: '模型多语言的“不公平税”',   colorIdx: 1 },
  { text: "上下文窗口",               colorIdx: 2 },
];

// ─── Token colors palette (cyclic) ───────────────────────────────────────────
const TOKEN_COLORS = [
  { bg: "rgba(0, 240, 255, 0.18)", border: "rgba(0, 240, 255, 0.5)", text: "#00f0ff" },
  { bg: "rgba(208, 188, 255, 0.18)", border: "rgba(208, 188, 255, 0.5)", text: "#d0bcff" },
  { bg: "rgba(80, 255, 160, 0.15)", border: "rgba(80, 255, 160, 0.45)", text: "#50ffa0" },
  { bg: "rgba(255, 200, 60, 0.15)", border: "rgba(255, 200, 60, 0.45)", text: "#ffc83c" },
  { bg: "rgba(255, 100, 130, 0.15)", border: "rgba(255, 100, 130, 0.45)", text: "#ff6482" },
  { bg: "rgba(60, 180, 255, 0.15)", border: "rgba(60, 180, 255, 0.45)", text: "#3cb4ff" },
];

// ─── Derive tokens from text ──────────────────────────────────────────────────
function getTokens(text: string) {
  try {
    const ids = encode(text);
    return ids.map((id, i) => {
      // decode each token id individually to get the string
      const str = decode([id]);
      return {
        id,
        text: str || `<${id}>`,
        color: TOKEN_COLORS[i % TOKEN_COLORS.length],
      };
    });
  } catch {
    // fallback: character-level
    return text.split("").map((ch, i) => ({
      id: i,
      text: ch,
      color: TOKEN_COLORS[i % TOKEN_COLORS.length],
    }));
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SlideToken() {
  const step = useCurrentStep();
  const showBox      = step >= 1; // title flies to top-left
  const showTokens   = step >= 2; // token highlights + IDs
  const showInsights = step >= 3; // three insight phrases

  const tokens = useMemo(() => getTokens(DEMO_TEXT), []);

  return (
    <div className="slide !p-0 overflow-hidden">
      {/* ====== Animated Title ====== */}
      <SlideTitle title="词元" label="TOKEN" moved={showBox} />

      {/* ====== Main Content Area ====== */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-10 px-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* ── Sentence: plain in step 1, token-highlighted + ID in step 2 ── */}
            <motion.div
              className="flex flex-wrap justify-center items-end"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ gap: "0 2px" }}
            >
              {tokens.map((token, i) => (
                <div key={`${token.id}-${i}`} className="flex flex-col items-center">
                  {/* Token text with animated background */}
                  <motion.span
                    animate={{
                      backgroundColor: showTokens ? token.color.bg : "rgba(0,0,0,0)",
                      color: showTokens ? token.color.text : "rgba(255,255,255,0.9)",
                      borderRadius: showTokens ? "6px" : "0px",
                      boxShadow: showTokens
                        ? `0 0 10px ${token.color.border}44`
                        : "0 0 0px transparent",
                    }}
                    transition={{
                      delay: showTokens ? i * 0.07 : 0,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    className="font-display font-bold px-1 py-0.5"
                    style={{
                      whiteSpace: "pre",
                      fontSize: "clamp(2rem, 5vw, 4.5rem)",
                      letterSpacing: "-0.02em",
                      lineHeight: "1.4",
                    }}
                  >
                    {token.text}
                  </motion.span>
                  {/* Token ID badge — always occupies space, fades in on step 2 */}
                  <motion.span
                    animate={{ opacity: showTokens ? 0.55 : 0 }}
                    transition={{
                      delay: showTokens ? i * 0.07 + 0.18 : 0,
                      duration: 0.3,
                    }}
                    className="font-mono tracking-wider"
                    style={{
                      fontSize: "clamp(0.5rem, 0.9vw, 0.7rem)",
                      color: token.color.text,
                      height: "1.2em",
                      marginTop: "0.25em",
                    }}
                  >
                    {token.id}
                  </motion.span>
                </div>
              ))}
            </motion.div>

            {/* ── Step 2: stats bar（step 3 时退场） ── */}
            <AnimatePresence>
              {showTokens && !showInsights && (
                <motion.div
                  className="flex items-center gap-8 font-mono text-sm"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: tokens.length * 0.07 + 0.2, duration: 0.4 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="opacity-50">字符数</span>
                    <span className="font-bold text-lg" style={{ color: "var(--color-primary)" }}>
                      {DEMO_TEXT.replace(/\s/g, "").length}
                    </span>
                  </div>
                  <div className="h-6 w-px opacity-20 bg-white" />
                  <div className="flex items-center gap-2">
                    <span className="opacity-50">Token 数</span>
                    <span className="font-bold text-lg" style={{ color: "#d0bcff" }}>
                      {tokens.length}
                    </span>
                  </div>
                  <div className="h-6 w-px opacity-20 bg-white" />
                  <div className="flex items-center gap-2">
                    <span className="opacity-50">比率</span>
                    <span className="font-bold text-lg" style={{ color: "#50ffa0" }}>
                      {(tokens.length / DEMO_TEXT.replace(/\s/g, "").length).toFixed(1)}x
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Step 3: three insight phrases ── */}
            <AnimatePresence>
              {showInsights && (
                <motion.ul
                  className="list-none m-0 p-0 flex flex-col gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {INSIGHTS.map((item, i) => {
                    const color = TOKEN_COLORS[item.colorIdx];
                    return (
                      <motion.li
                        key={i}
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ delay: i * 0.15, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        {/* colored accent dot */}
                        <span
                          className="flex-shrink-0 rounded-full"
                          style={{
                            width: "8px",
                            height: "8px",
                            backgroundColor: color.text,
                            boxShadow: `0 0 8px ${color.border}`,
                          }}
                        />
                        <span
                          className="font-display font-semibold"
                          style={{
                            fontSize: "clamp(1rem, 2.2vw, 1.6rem)",
                            color: "var(--color-primary)",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {item.text}
                        </span>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
