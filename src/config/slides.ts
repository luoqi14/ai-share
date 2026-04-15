/**
 * Slide registry - Central place to register all slides.
 *
 * To add a new slide:
 * 1. Create a component in `src/slides/` (e.g., `my-topic.tsx`)
 * 2. Import it here
 * 3. Add an entry to the `slides` array
 *
 * That's it! No routing config, no layout changes needed.
 */

import type { ComponentType } from "react";

// --- Slide Imports ---
import SlideCover from "@/slides/cover";
import SlideWhatIsAI from "@/slides/what-is-ai";
import SlideToken from "@/slides/token";
import SlideEmbedding from "@/slides/embedding";
import SlideVectorSpace from "@/slides/vector-space";
import SlideVector from "@/slides/vector";
import SlideLogits from "@/slides/logits";
import SlidePrompt from "@/slides/prompt";
import SlideContext from "@/slides/context";
import SlideHarness from "@/slides/harness";
import SlideBenchmark from "@/slides/benchmark";
import SlideModel from "@/slides/model";
import SlideEnd from "@/slides/end";

// --- Types ---
export interface SlideEntry {
  /** Unique identifier for the slide */
  id: string;
  /** Display title (used in navigation/overview) */
  title: string;
  /** The slide component to render */
  component: ComponentType;
  /** Optional section grouping */
  section?: string;
  /** Optional number of progressive steps (fragments) in this slide */
  steps?: number;
}

// --- Slide Deck Definition ---
export const slides: SlideEntry[] = [
  {
    id: "cover",
    title: "封面",
    component: SlideCover,
    section: "开始",
  },
  {
    id: "what-is-ai",
    title: "AI大模型",
    component: SlideWhatIsAI,
    section: "基础概念",
    steps: 6,
  },
  {
    id: "token",
    title: "词元",
    component: SlideToken,
    section: "基础概念",
    steps: 3,
  },
  {
    id: "embedding",
    title: "词嵌入",
    component: SlideEmbedding,
    section: "基础概念",
    steps: 6,
  },
  {
    id: "vector-space",
    title: "向量空间",
    component: SlideVectorSpace,
    section: "基础概念",
    steps: 12,
  },
  {
    id: "vector",
    title: "向量",
    component: SlideVector,
    section: "底层系统",
    steps: 9,
  },
  {
    id: "logits",
    title: "概率与生成",
    component: SlideLogits,
    section: "生成原理",
    steps: 10,
  },
  {
    id: "prompt",
    title: "提示词工程",
    component: SlidePrompt,
    section: "应用实践",
    steps: 10,
  },
  {
    id: "context",
    title: "上下文工程",
    component: SlideContext,
    section: "应用实践",
    steps: 17,
  },
  {
    id: "harness",
    title: "脚手架工程",
    component: SlideHarness,
    section: "应用生态结构",
    steps: 12,
  },
  {
    id: "benchmark",
    title: "基准测试",
    component: SlideBenchmark,
    section: "应用实践",
    steps: 5,
  },
  {
    id: "model",
    title: "主流大模型",
    component: SlideModel,
    section: "应用实践",
    steps: 11,
  },
  {
    id: "end",
    title: "与AI共舞",
    component: SlideEnd,
    section: "结束",
  },
];

export const totalSlides = slides.length;
