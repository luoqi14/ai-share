"use client";

import { useState, useEffect } from "react";
import { useCurrentStep } from "@/config/StepContext";
import { motion, AnimatePresence } from "motion/react";
import SlideTitle from "@/components/SlideTitle";

const MODELS = [
  {
    id: "anthropic",
    lab: "Anthropic",
    country: "美国",
    logoText: "Anth",
    color: "var(--color-primary)",
    models: "Claude Opus 4.6 / Sonnet 4.6 / Haiku 4.5 / Mythos",
    flagship: "Opus 4.6",
    price: "$5 / $25",
    context: "100万 token",
    desc: [
      "🏆 开创 **MCP (Model Context Protocol)** 协议标准与 **Skills（技能）**机制，引领** Agent 生态**；此机制最高可将上下文开销降低 **98.7%**。**Claude Code** 是最受追捧的 AI 编程工具。Opus 4.6 在 **SWE-Bench Verified (80.8%)** 领跑闭源。",
      "⚠️ 下一代突破：已研发出下一代“神话级”模型 **Claude Mythos (10万亿参数)**，在 SWE-bench Verified 取得 **93.9%** 的跨代际得分。但因展现出极度危险的零日漏洞黑客能力，已**被中止公开发布**，仅开放给少数巨头用于防御修复。"
    ],
    tags: ["MCP 创始者", "Agent 编程 SOTA", "Claude Code", "安全对齐领先", "1M 上下文标配", "Skills 沙盒执行", "10万亿参数 Mythos"]
  },
  {
    id: "openai",
    lab: "OpenAI",
    country: "美国",
    logoText: "OAI",
    color: "var(--color-secondary)",
    models: "GPT-5.4 / Sora 2 / GPT-6 (SPUD - 预训练完成)",
    flagship: "GPT-5.4",
    price: "$2.50 / $15",
    context: "100万 token",
    desc: [
      "🌐 消费端极霸：ChatGPT 拥有最大基数。GPT-5.4 将编程、推理、计算机使用三合一，**OSWorld 计算机控制得分 75%**，远超人类基线。GPT-5.4-mini 成为高频开发首选。",
      "⚠️ 战略转型与神话：已正式**中止 Sora 视频项目**，将算力转入超级模型。其下一代模型 **GPT-6 (Spud)** 已于耗资 5000 亿美金的 **Stargate (星门)** 超算集群（10万张H100）上完成预训练。提供 **200万 Token** 纯原生多模态架构。"
    ],
    tags: ["消费端第一品牌", "计算机使用 SOTA", "统一全能模型", "超大生态系统", "中止 Sora 项目", "Stargate 星门算力", "下一代 GPT-6 (Spud)", "Codex"]
  },
  {
    id: "google",
    lab: "Google DeepMind",
    country: "美国",
    logoText: "Goog",
    color: "var(--color-error)",
    models: "Gemini 3.1 Pro / Nano Banana 2 / Gemma 4",
    flagship: "Gemini 3.1 Pro",
    price: "$2 / $12",
    context: "100万 token",
    desc: [
      "🎸 **多模态能力最强**，原生支持五大模态。**ARC-AGI-2 推理得分 77.1%** 居各公开模型之首，GPQA Diamond **94.3%**。",
      "🎨 **视觉合成与前端工程 SOTA**：能够直接生成 **动态 SVG 动画代码**，对接遥测 API 构建实时交互监控大盘。",
      "🍌 极速生图王者：**Nano Banana 2** 接入 Gemini 高级世界知识库（World Knowledge），具备精准的 **多语种文字渲染能力**。",
      "🪆 开源生态顶梁柱：同等体积下最强大的开源模型 **Gemma 4**，进一步巩固了端侧生态控制力。"
    ],
    tags: ["多模态综合最强", "前端视觉合成首选", "ARC-AGI-2 第一", "免费试用 tier", "世界知识生图", "最强开源 Gemma 4"]
  },
  {
    id: "xai",
    lab: "xAI",
    country: "美国",
    logoText: "xAI",
    color: "rgba(255,255,255,0.7)",
    models: "Grok 4.20 / Grok Imagine Video",
    flagship: "Grok 4.20",
    price: "$2 / $6",
    context: "2M token",
    desc: [
      "⚡️ 包含最大上下文**（2M token）**。独家接入 **X (Twitter) 实时数据** 与 **DeepSearch** 多源检索，是社媒情报分析不二之选。拥有业内最宽容的**相对无审查策略**，直接处理安全与敏感争议话题。",
      "🎬 进军生视频 SOTA：**Grok Imagine Video** 在 LMSYS 视频榜单高达 **1361分**，逼近第一梯队，成为巅峰视频基座。",
      "🧠 **四智能体辩论**提效推理：全球首个 1.5GW 巨型超算 **“Colossus 2”**，正全力训练百倍参数的 Grok 5。"
    ],
    tags: ["2M 超长上下文", "X 实时数据独家", "DeepSearch 多源检索", "相对无审查", "Grok Imagine", "Colossus 2 算力"]
  },
  {
    id: "deepseek",
    lab: "DeepSeek",
    country: "中国",
    logoText: "DS",
    color: "var(--color-primary)",
    models: "DeepSeek V4(即将全面发布) / V3.2 / R1",
    flagship: "V3.2 / R1",
    price: "$0.28 / $0.42",
    context: "12.8万 token",
    desc: [
      "💥 中国的全球爆款：训练成本仅 600 万美元却媲美 GPT-4。采用 **MoE + MLA 架构** 极致压缩推理成本。**R1 推理模型便宜 96%**。",
      "⚠️ 蓄力期的新探索：受限于集群适配，完全体发布推迟，已悄然发布 **“V4 Lite”** 作为过渡。",
      "🧠 **Engram Memory（记忆印迹）**架构：泄漏版显示 V4 走入**原生多模态**，将在同一参数空间内直接生成文字与动静态视觉内容。"
    ],
    tags: ["开源 MIT 协议", "价格杀手", "MoE 极致架构", "SWE-Bench V4 81%", "本地部署友好", "缓存命中 $0.028"]
  },
  {
    id: "alibaba",
    lab: "Alibaba (Qwen团队)",
    country: "中国",
    logoText: "Ali",
    color: "var(--color-secondary)",
    models: "Qwen 3.6 Plus / Qwen 3.5-Omni",
    flagship: "Qwen 3.6 Plus",
    price: "$0.6 / $3",
    context: "100万 token",
    desc: [
      "💪 开源生态极度繁荣：Qwen 下载量超越 Meta Llama 位列全球第一（**占据超 50% 开源市场**）。前端代码生成和 **MCPmark 工具**调用极为强悍。",
      "⚠️ 高层巨震与独立事业群：核心架构师重大人事变动，阿里将其独立为**“通义大模型事业部”**，并任命李飞飞出任阿里云 CTO。",
      "🔓 **坚定不移拥抱开源核心战略**。",
      "👁️ 原生全模态霸主：最新 **Qwen 3.5-Omni** 端到端处理五大数据模态并支持 60 国语言**实时流式语音交互**。"
    ],
    tags: ["Hugging Face 下载第一", "201 语言支持", "前端代码生成强", "开源 Apache 2.0", "MCPmark 工具调用领先", "通义事业部独立", "坚定开源战略"]
  },
  {
    id: "moonshot",
    lab: "Moonshot AI (Kimi)",
    country: "中国",
    logoText: "Kimi",
    color: "#f0e6d2",
    models: "Kimi K2.5 / Kimi K2-Thinking",
    flagship: "Kimi K2.5",
    price: "$0.15 / $3",
    context: "26.2万 token",
    desc: [
      "🤖 核心王牌 **Agent Swarm（群智网络）**：最多 100 个子 Agent 兵分多路，10 分钟工作压缩至 2 分钟。在 **BrowseComp 以 78.4% 击败 GPT**，更获 Cursor 强力背书。",
      "🦀 **云端自动化幽灵 Kimi Claw**：永远在线的脱机 Agent。利用深度定制虚拟机自主执行爬虫与重火力网页分析，直接挑战本地算力局限。",
      "⚠️ 争议频发：被欧美点名的**“数据合规黑盒子”**由于极其强大的网海穿梭权正遭遇联合狙击审查。"
    ],
    tags: ["Agent Swarm 并行 100 子代理", "视觉编程领先", "Kimi Code CLI", "1T 参数 MoE", "云托管 Kimi Claw", "永远在线 Agent", "安全合规风暴眼"]
  },
  {
    id: "bytedance",
    lab: "ByteDance (Doubao)",
    country: "中国",
    logoText: "Byte",
    color: "var(--color-error)",
    models: "Doubao 2.0 / Seedance 2.0 / Seedream 5.0",
    flagship: "Doubao 2.0",
    price: "$0.25 / $2",
    context: "26.2万 token",
    desc: [
      "📱 国内 **DAU 绝对霸主（1.55 亿周活）**。深度嵌合 TikTok/抖音，编程模型成本下杀行业 60%。",
      "🎬 视频终结者 **Seedance 2.0**：“恐怖的混合输入”：支持同 Prompt 掺杂 9 图+多段音视频生成完美多镜头分轨影视，**MotionBench 高斯 SOTA**。",
      "🎨 思维导向级生图基座 **Seedream 5.0**：首创 **“Deep Thinking mode”**，在长链计算完毕后再出图，碾压硬核理工与解剖科研基准。",
      "🌎 AI for Science 布局出海，进军新药研发基建领域。"
    ],
    tags: ["中国 DAU 最高", "Seedance 视频 SOTA", "TikTok 生态整合", "编程成本最低"]
  },
  {
    id: "zai",
    lab: "z.ai (Zhipu AI)",
    country: "中国",
    logoText: "z.ai",
    color: "#a7f3d0",
    models: "GLM-5.1 / GLM-5V-Turbo",
    flagship: "GLM-5.1",
    price: "$1.26 / $3.96",
    context: "20万 token",
    desc: [
      "🏛️ 全球首家上市模型公司（破纪录 IPO）。采用 **华为昇腾全栈算力**，标配自主可控顶峰力量。**MIT 极度开源**。",
      "🤖 跨代代理革新：旗舰 **GLM-5.1** 首次实现无人化 **8小时长程自主编程试错 (Agentic Engineering)**，并一键分发成品仓库全托管发布。"
    ],
    tags: ["全球首家上市 AI 基础模型", "华为昇腾全栈", "异步智能体 RL", "MIT 开源", "8小时长程自主编程"]
  },
  {
    id: "minimax",
    lab: "MiniMax",
    country: "中国",
    logoText: "Mini",
    color: "#fbcfe8",
    models: "MiniMax M2.7 / M2.7-highspeed",
    flagship: "M2.7",
    price: "$0.30 / $1.20",
    context: "20.5万 token",
    desc: [
      "🔬 **首开自我进化先河**：模型能无干预狂暴自我运行 **100+ 轮优化**使得能力跃迁。",
      "💼 资本与商业变现新贵：2025年营收飙升 7 倍，百亿规模资本垂青。",
      "🦀 C 端娱乐应用最底盘支撑，迅速推出 **MaxClaw** 并切入企业桌面系统抢夺底层代理流量。"
    ],
    tags: ["递归自我进化训练", "SWE-Pro 近 Opus", "100 TPS 高速版", "语音视频领先"]
  },
  {
    id: "xiaomi",
    lab: "Xiaomi (MiMo)",
    country: "中国",
    logoText: "MiMo",
    color: "#fdba74",
    models: "MiMo-V2-Pro / V2-Omni / V2-Flash",
    flagship: "MiMo-V2-Pro",
    price: "$1 / $3",
    context: "100万 token",
    desc: [
      "📱 手机系跨界战神：隐姓埋名 **Hunter Alpha** 一刀将霸榜切碎。",
      "📈 **万亿参数前沿先锋**：V2-Pro 参数破 1T。在各类极端交互测试上成为全球八强，开源体系全球顶冠。",
      "🧠 **物理世界 AGI 大规划**：收编前沿研究员定调战略方向。以超大 EV（汽车）端及 AIoT 为落点，直插具身智能底座阵营大心脏。"
    ],
    tags: ["1T+ 参数旗舰", "全球 Top 8 综合得分", "Flash 开源全球第一", "1M 上下文", "手机生态整合"]
  }
];

const parseHighlight = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <span key={i} className="text-secondary font-medium tracking-wide drop-shadow-md">{part.slice(2, -2)}</span>;
    }
    return <span key={i}>{part}</span>;
  });
};

export default function SlideModel() {
  const step = useCurrentStep();
  const showBox = step >= 1;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState<number | null>(0);
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    const check = () => setIsSmall(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="slide !p-0 overflow-hidden">
      <SlideTitle title="主流大模型" label="AI MODELS" moved={showBox} />

      <AnimatePresence>
        {showBox && (
          <motion.div
            className={isSmall
              ? "absolute inset-x-4 top-[15vh] bottom-0 pb-4 overflow-y-auto flex flex-col gap-2"
              : "absolute inset-x-8 top-[15vh] bottom-[8vh] flex flex-row items-stretch justify-center gap-2"
            }
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6 }}
          >
            {MODELS.map((model, index) => {
              const isHovered = hoveredIndex === index;
              // Default to expanding the first item if no item is hovered
              const isActive = hoveredIndex === null ? index === 0 : isHovered;

              // ── Mobile: compact accordion card ──────────────────────────────
              if (isSmall) {
                const isMobileExpanded = mobileActiveIndex === index;
                return (
                  <div
                    key={model.id}
                    className="w-full rounded-2xl border border-white/10 bg-surface-container-high/40 overflow-hidden shrink-0"
                  >
                    {/* Tap header */}
                    <button
                      className="w-full p-3 flex items-center gap-3 text-left"
                      onClick={() => setMobileActiveIndex(isMobileExpanded ? null : index)}
                    >
                      <div className="w-1 h-5 rounded-full shrink-0" style={{ backgroundColor: model.color }} />
                      <span className="font-display text-sm font-medium text-white/90 flex-1">{model.lab}</span>
                      <span className="text-white/30 text-xs mr-2">{model.country}</span>
                      <span className="text-white/30 text-xs">{isMobileExpanded ? '▲' : '▼'}</span>
                    </button>

                    {/* Collapsed preview */}
                    {!isMobileExpanded && (
                      <div className="px-4 pb-3 flex gap-3 text-[11px] text-white/40 flex-wrap">
                        <span>⚡ {model.flagship}</span>
                        <span>💰 {model.price}</span>
                        <span>📏 {model.context}</span>
                      </div>
                    )}

                    {/* Expanded content */}
                    {isMobileExpanded && (
                      <div className="px-3 pb-4 flex flex-col gap-3">
                        <div className="text-primary/70 font-mono tracking-widest text-[10px] uppercase px-1 overflow-hidden text-ellipsis whitespace-nowrap">
                          {model.models}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-black/30 p-2 rounded-xl border border-white/5 flex flex-col">
                            <div className="text-[9px] text-white/30 mb-0.5">旗舰模型</div>
                            <div className="text-white/80 font-mono text-[11px] truncate">{model.flagship}</div>
                          </div>
                          <div className="bg-black/30 p-2 rounded-xl border border-white/5 flex flex-col">
                            <div className="text-[9px] text-white/30 mb-0.5">价格 (输入/输出)</div>
                            <div className="text-white/80 font-mono text-[11px] truncate">{model.price}</div>
                          </div>
                          <div className="bg-black/30 p-2 rounded-xl border border-white/5 flex flex-col">
                            <div className="text-[9px] text-white/30 mb-0.5">上下文</div>
                            <div className="text-primary/90 font-mono text-[11px] truncate">{model.context}</div>
                          </div>
                        </div>
                        <div className="bg-black/20 p-3 rounded-xl border border-white/5 text-[12px] leading-relaxed flex flex-col gap-2">
                          {model.desc.map((desc, i) => (
                            <p key={i} className="text-white/70">{parseHighlight(desc)}</p>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {model.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-[10px] text-white/50">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // ── Desktop: horizontal accordion ───────────────────────────────
              return (
                <motion.div
                  key={model.id}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  layout
                  className={`relative group overflow-hidden cursor-pointer rounded-2xl border ghost-border glass-overlay transition-colors bg-surface-container-high/40 ${isHovered ? 'bg-[#151515]/90 border-white/20' : 'hover:bg-black/40'}`}
                  initial={{ flex: 1 }}
                  animate={{
                    flex: isActive ? 14 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                  {/* Left accent color edge */}
                  <div className="absolute inset-y-0 left-0 w-1 flex-shrink-0 opacity-80" style={{ backgroundColor: model.color }}></div>

                  {/* Collapsed Vertical Title */}
                  <div
                    className={`absolute inset-y-0 left-0 w-[50px] flex flex-col items-center justify-center p-2 opacity-60 font-display transition-opacity duration-300 ${isActive ? 'opacity-0 pointer-events-none' : 'group-hover:opacity-100'}`}
                  >
                    <div
                      className="text-white text-lg tracking-widest uppercase font-bold"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {model.logoText}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        className="absolute inset-y-0 left-2 right-0 p-6 flex flex-col gap-4 overflow-y-auto custom-markdown-scrollbar"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.1 } }}
                        transition={{ duration: 0.3, delay: 0.15 }}
                      >
                        <div className="flex flex-col gap-1 shrink-0">
                          <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-display font-medium text-white/90 whitespace-nowrap">{model.lab}</h2>
                            <span className="px-2 py-0.5 border border-white/10 rounded text-[11px] text-white/40 whitespace-nowrap">{model.country}</span>
                          </div>
                          <div className="text-primary/70 font-mono tracking-widest text-xs uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                            {model.models}
                          </div>
                        </div>

                        {/* Key Stats */}
                        <div className="grid grid-cols-3 gap-3 shrink-0">
                          <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex flex-col justify-center">
                            <div className="text-[10px] text-white/30 mb-0.5">旗舰模型</div>
                            <div className="text-white/80 font-mono text-sm whitespace-nowrap overflow-hidden text-ellipsis">{model.flagship}</div>
                          </div>
                          <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex flex-col justify-center">
                            <div className="text-[10px] text-white/30 mb-0.5">输入 / 输出价格</div>
                            <div className="text-white/80 font-mono text-sm whitespace-nowrap overflow-hidden text-ellipsis">{model.price}</div>
                          </div>
                          <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex flex-col justify-center">
                            <div className="text-[10px] text-white/30 mb-0.5">上下文长度</div>
                            <div className="text-primary/90 font-mono text-sm whitespace-nowrap overflow-hidden text-ellipsis">{model.context}</div>
                          </div>
                        </div>

                        {/* Desc */}
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-[14px] leading-[1.65] flex flex-col gap-3 shrink-0">
                          {model.desc.map((desc, i) => (
                            <p key={i} className="text-white/70">
                              {parseHighlight(desc)}
                            </p>
                          ))}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {model.tags.map((tag, i) => (
                            <span key={i} className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-[11px] text-white/50 tracking-wide">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
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
      `}</style>
    </div>
  );
}
