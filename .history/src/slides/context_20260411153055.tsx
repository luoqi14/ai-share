"use client";

import { useCurrentStep } from "@/config/StepContext";
import { motion, AnimatePresence } from "motion/react";
import SlideTitle from "@/components/SlideTitle";

// ---------------------------------------------------------------------------
// Data for the four "极寒灾难" cards (Step 7)
// ---------------------------------------------------------------------------
type MetaphorScene = { label?: string; text: string; highlight?: boolean };
type LimitItem = {
  icon: string;
  title: string;
  desc: string;
  metaphor?: { title: string; scenes: MetaphorScene[] };
};

const LIMIT_ITEMS: LimitItem[] = [
  {
    icon: "📏",
    title: "长度截断",
    desc: "无限累加的历史极其容易撞上大模型物理边界导致 API 直接报界限溢出错误。",
    metaphor: {
      title: "💡 门诊隐喻：诊室桌子承重极限",
      scenes: [
        { text: "每次对话，AI 都要把所有聊天记录从头读一遍——就像医生每次接诊前，必须把所有病历重新摊在诊桌上。" },
        { text: "但诊桌就那么大。当病历堆到桌子边沿，再往上放一张就会哗啦啦全掉地上。", highlight: true },
        { text: "API 报错崩溃，跟桌子承重到极限完全一模一样——不是不想读，是物理上装不下了。" },
      ],
    },
  },
  {
    icon: "🕳️",
    title: "迷失与注意力稀释",
    desc: "由于无关废话不断稀释核心 Attention 权重，模型极易产生遗忘早期设定的现象（Lost in the middle）。",
    metaphor: {
      title: "💡 门诊隐喻：超厚病历本效应",
      scenes: [
        { text: "给新来的前台实习生一本只有 3 页的预约表（短上下文），她一眼就能记住谁对麻醉过敏。" },
        { text: "但若把一本 300 页的重度牙周炎患者五年复诊病历砸在她桌上，让她 5 秒内看完并回答问题——她确实翻完了（没有报错崩溃），但注意力被严重稀释：只记住了第 1 页「患者叫张三」和最后一页你刚问的问题。" },
        { text: "夹在第 156 页那条致命的「头孢过敏」记录，早就「中间迷失」，忘得一干二净了。", highlight: true },
      ],
    },
  },
  {
    icon: "🗑️",
    title: "上下文污染",
    desc: "前面的闲聊噪音、甚至废弃的纠错指令被一并代入，杂音干扰导致 AI 逐渐变笨。",
    metaphor: {
      title: "💡 门诊隐喻",
      scenes: [
        {
          label: "七嘴八舌综合征（Prompt 污染）",
          text: "就好比你在给医生交代正畸患者的诉求，结果旁边护士在疯狂背诵门诊消防规定，客服在抱怨昨天的盒饭难吃。医生（AI）听完脑子绝对是懵的。",
        },
        {
          label: "串场病历（RAG / 知识库污染）",
          text: "就像患者来复诊拔牙，前台小妹把这个患者的病历、正在做根管治疗大爷的病历、以及楼上正畸小孩的病历，全订在一个夹子里扔给了主任。主任（AI）看串行了，差点给拔牙的患者上了个托槽。",
        },
      ],
    },
  },
  {
    icon: "💸",
    title: "成本与延迟爆炸",
    desc: "大模型是严格按绝对 Token 计费与推演的，越问到底部越离谱的昂贵与缓慢！",
    metaphor: {
      title: "💡 门诊隐喻",
      scenes: [
        {
          label: "成本会爆炸（太贵）",
          text: "大模型是按字数（Token）收钱的。如果门诊知识库有一本书那么厚，患者每次微信问一句「今天开门吗？」，你都把整本书和对话历史发给大模型读一遍，那门诊每个月的 API 账单会直接破产。",
        },
        {
          label: "速度会拖垮（太慢）",
          text: "阅读 100 万字，模型在后台可能要卡顿 10 到 30 秒。对于要求「秒回」的前台客服系统来说，这个延迟是灾难性的。",
          highlight: true,
        },
      ],
    },
  },
];

export default function SlideContext() {
  const step = useCurrentStep();
  const showBox = step >= 1;

  return (
    <div className="slide !p-0 overflow-hidden">
      <SlideTitle title="上下文工程" label="CONTEXT ENGINEERING" moved={showBox} />

      <AnimatePresence>
        {step === 1 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
          >
            <div className="font-display text-[4rem] text-white/90 font-medium tracking-wide drop-shadow-2xl text-center">
              为什么<span className="text-error drop-shadow-[0_0_15px_rgba(var(--color-error),0.4)]">完美的提示词</span>依然会翻车？
            </div>
          </motion.div>
        )}

        {step >= 2 && (
          <motion.div
            className="absolute inset-0 top-[18vh] pb-16 px-16 flex flex-row gap-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Left Panel */}
            <div className="flex-[0.4] flex flex-col pt-4">
              <AnimatePresence mode="wait">
                {step >= 2 && step <= 7 && (
                  <motion.div
                    key="left-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-gradient font-display text-[32px] font-medium mb-8">
                      “无状态”设计
                    </h2>

                    <div className="flex flex-col gap-6">
                      <div className="bg-black/20 border border-white/5 rounded-2xl p-6">
                        <div className="text-secondary font-mono text-sm tracking-widest mb-2 uppercase drop-shadow-md">
                          上下文 (The Context)
                        </div>
                        <p className="text-white/70 text-[15px] leading-relaxed">
                          大模型一次输入与处理的最大数据视界。这是它唯一的“短时记忆”。
                        </p>
                      </div>

                      <div className="bg-black/20 border border-white/5 rounded-2xl p-6">
                        <div className="text-error font-mono text-sm tracking-widest mb-2 uppercase drop-shadow-md">
                          无状态API (Stateless)
                        </div>
                        <p className="text-white/70 text-[15px] leading-relaxed">
                          云端模型接口<strong className="text-white/90 font-medium">不自带储存档案</strong>。它记不住你发过的上一条消息。我们在网页上看到的“历史聊天”，实际上是套壳产品在底层做的工作。
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step >= 8 && step <= 9 && (
                  <motion.div
                    key="left-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-gradient font-display text-[32px] font-medium mb-8">
                      什么是上下文工程？
                    </h2>
                    <div className="flex flex-col gap-6 text-white/70 text-[16px] leading-relaxed">
                      <p>
                        为了避开因历史冗余堆叠产生的长度限制和幻觉污染，我们需要为模型提供<strong className="text-secondary font-medium tracking-wide drop-shadow-md">尽可能精确且高信噪比</strong>的信息。
                      </p>
                      <div className="px-5 py-4 border-l-2 border-primary bg-primary/5 rounded-r-xl">
                        好的沟通，不是把所有废话连带标点符号一起扔给对方，而是精心提纯。
                      </div>

                      <div className="rounded-xl border border-amber-400/25 bg-amber-400/5 px-4 py-3.5">
                        <div className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          💡 门诊隐喻
                        </div>
                        <p className="text-white/70 text-[13px] leading-relaxed">
                          患者进诊室前，你不能把门诊十年来几万个患者的病历全搬进诊室让医生自己翻。你要<strong className="text-white/90">极其精准地抽出</strong>这个患者今天的牙片、昨天的验血单、以及他之前的主诉，放在医生桌上。<span className="text-amber-400/70 ml-1 text-[11px]">（这是过滤背景和知识）</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step >= 10 && (
                  <motion.div
                    key="left-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-gradient font-display text-[32px] font-medium mb-8">
                      终极形态：全局架构
                    </h2>
                    <div className="flex flex-col gap-6 text-white/70 text-[16px] leading-relaxed">
                      <p>
                        抛弃人类手动干预的桎梏，借助外部独立存储与高频交互模块，将大模型原本窄小的 <strong className="text-secondary font-medium tracking-wide drop-shadow-md">上下文限界</strong> 无限向外延伸拓展。
                      </p>
                      <ul className="flex flex-col gap-5 text-[15px]">
                        <li className="flex gap-3">
                          <span className="text-primary mt-1">✦</span>
                          <p>放弃向模型系统提示词内无脑堆叠海量的前置背景数据与防出轨守则。</p>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-primary mt-1">✦</span>
                          <p>让大模型化位为纯粹的推理主枢，彻底转为<strong className="text-white/90">按需主动</strong>向外界执行流式获取（Agentic Workflow）。</p>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Panel */}
            <div className="flex-[0.6] relative flex flex-col bg-surface-container-high/40 rounded-3xl border ghost-border glass-overlay overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">

                {/* VISUAL A: Chat UI (Steps 2-6) */}
                {step >= 2 && step <= 6 && (
                  <motion.div
                    key="right-chat"
                    className="absolute inset-0 flex flex-col p-8 pb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Chat Header */}
                    <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4 shrink-0">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-tech text-white/50 border border-white/20">AI</div>
                      <div className="text-white/60 font-medium text-sm tracking-wider">Chat Console</div>
                    </div>

                    {/* Chat Messages */}
                    <div className={`relative flex flex-col gap-6 flex-1 w-full mx-auto max-w-lg ${step === 6 ? 'p-6 rounded-2xl border-2 border-secondary/50 bg-secondary/10 shadow-[0_0_50px_rgba(var(--color-secondary),0.15)] ring-4 ring-secondary/20' : 'p-6 border-2 border-transparent'} transition-all duration-700`}>

                      {step === 6 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-black text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest z-10 drop-shadow-lg whitespace-nowrap"
                        >
                          被合并打包底层发送的 Payload
                        </motion.div>
                      )}

                      {step >= 3 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end w-full">
                          <div className="bg-primary/20 border border-primary/30 text-primary-content text-[14px] px-5 py-3.5 rounded-2xl rounded-tr-sm max-w-[85%] leading-relaxed shadow-lg">
                            我是一名牙科运营，负责撰写社交文案，受众是年轻害怕打针痛感的女性。请先记住我的人设。
                          </div>
                        </motion.div>
                      )}

                      {step >= 4 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start w-full">
                          <div className="bg-white/5 border border-white/10 text-white/80 text-[14px] px-5 py-3.5 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed">
                            好的！我已经牢牢记住了您的人设。下次有需求请直接吩咐，我将依照此受众为您产出优质文案。
                          </div>
                        </motion.div>
                      )}

                      {step >= 5 && (
                        <AnimatePresence>
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end w-full">
                            <div className="bg-primary/20 border border-primary/30 text-primary-content text-[14px] px-5 py-3.5 rounded-2xl rounded-tr-sm max-w-[85%] leading-relaxed shadow-lg relative">
                              帮我写一篇关于微创无痛拔智齿的小红书种草文案。
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </div>

                    {step === 6 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 text-center bg-black/40 border border-white/5 p-4 rounded-xl text-secondary/90 tracking-wide text-[13px]">
                        ※ <strong className="font-bold">接口并没有记忆力</strong>。你发出的第 2 句话，实际上在底层是连带前面的全部聊天记录一字不差地被重新吞吐请求了一次。
                      </motion.div>
                    )}
                  </motion.div>
                )}


                {/* VISUAL B: Limitations (Step 7) */}
                {step === 7 && (
                  <motion.div
                    key="right-limits"
                    className="absolute inset-0 flex flex-col justify-center p-12 gap-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                  >
                    <div className="text-center font-display text-[22px] text-error mb-2 tracking-wider">由于无状态历史累加，引发四大极寒灾难：</div>

                    <div className="grid grid-cols-2 gap-5 w-full max-w-2xl mx-auto">
                      {LIMIT_ITEMS.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                          className="relative group bg-error/5 border border-error/10 hover:border-error/30 p-6 rounded-2xl transition-colors backdrop-blur-sm shadow-xl overflow-hidden"
                        >
                          <div className="text-[32px] mb-3 drop-shadow-sm">{item.icon}</div>
                          <div className="text-[17px] font-medium text-white/90 mb-2">{item.title}</div>
                          <div className="text-[13px] text-white/50 leading-relaxed">{item.desc}</div>

                          {/* Subtle hover indicator dot for cards with metaphors */}
                          {item.metaphor && (
                            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-60 group-hover:opacity-0 transition-opacity duration-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                              <span className="text-amber-400/70 text-[9px] font-mono tracking-wider">hover</span>
                            </div>
                          )}

                          {/* Hover metaphor overlay */}
                          {item.metaphor && (
                            <div className="absolute inset-0 bg-[#0c0c14]/97 rounded-2xl px-4 py-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2.5 overflow-y-auto">
                              <div className="text-amber-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 pb-1.5 border-b border-amber-400/20 shrink-0">
                                {item.metaphor.title}
                              </div>
                              <div className="flex flex-col gap-2">
                                {item.metaphor.scenes.map((scene, si) => (
                                  <div key={si}>
                                    {scene.label && (
                                      <div className="text-white/50 text-[9.5px] font-bold uppercase tracking-wider mb-0.5">
                                        {scene.label}
                                      </div>
                                    )}
                                    <p className={`text-[11px] leading-relaxed ${scene.highlight ? "text-error/90 font-semibold" : "text-white/75"}`}>
                                      {scene.text}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}


                {/* VISUAL C: Filter & Engineering (Step 8) */}
                {step === 8 && (
                  <motion.div
                    key="right-filter"
                    className="absolute inset-0 flex items-center justify-center p-12"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-col items-center gap-2 w-full max-w-md">

                      <div className="flex flex-wrap gap-2.5 justify-center bg-black/40 p-5 rounded-2xl border border-white/5 w-full shadow-inner relative pt-8">
                        <div className="absolute top-2 left-4 text-[10px] uppercase font-tech text-white/30 tracking-widest">Raw Input</div>
                        <motion.span className="px-3 py-1 bg-white/5 rounded-md text-white/40 text-[13px] border border-white/10" initial={{ y: -10 }} animate={{ y: 0 }} transition={{ duration: 1.5 }}>闲聊寒暄</motion.span>
                        <motion.span className="px-4 py-1.5 bg-secondary/20 border-secondary/40 border rounded-md text-secondary text-[14px] shadow-[0_0_15px_rgba(var(--color-secondary),0.3)] font-bold" initial={{ y: -10 }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.2 }}>核心诉求：拔牙文案</motion.span>
                        <motion.span className="px-3 py-1 bg-white/5 rounded-md text-white/40 text-[13px] border border-white/10" initial={{ y: -10 }} animate={{ y: 0 }} transition={{ duration: 1.6, delay: 0.4 }}>早前的废弃改稿</motion.span>
                        <motion.span className="px-4 py-1.5 bg-secondary/20 border-secondary/40 border rounded-md text-secondary text-[14px] shadow-[0_0_15px_rgba(var(--color-secondary),0.3)] font-bold" initial={{ y: -10 }} animate={{ y: 0 }} transition={{ duration: 1.3, delay: 0.1 }}>受众人设：害怕拍痛</motion.span>
                        <motion.span className="px-3 py-1 bg-gradient-to-r from-error/20 to-error/10 rounded-md text-white/50 text-[13px] border border-error/20" initial={{ y: -10 }} animate={{ y: 0 }} transition={{ duration: 1.4, delay: 0.5 }}>跑偏逻辑 / 失败测试体验</motion.span>
                      </div>

                      <div className="flex flex-col items-center my-2">
                        <svg className="w-16 h-16 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        <div className="-mt-3 w-1 h-8 border-l-2 border-dashed border-secondary/60 animate-pulse"></div>
                      </div>

                      <motion.div
                        className="w-[80%] flex flex-col items-center gap-2 bg-secondary/15 p-5 rounded-2xl border border-secondary/40 text-center shadow-[0_0_40px_rgba(var(--color-secondary),0.15)]"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 2 }}
                      >
                        <div className="text-secondary tracking-widest font-bold drop-shadow-md text-[16px]">极致提纯的高信噪比上下文</div>
                        <div className="text-[13px] text-secondary/60 font-mono">彻底剔除干扰噪音，重夺注意力集中度。</div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}


                {/* VISUAL D: Manual Engineering (Step 9) */}
                {step === 9 && (
                  <motion.div
                    key="right-manual"
                    className="absolute inset-0 flex flex-col justify-center items-center p-12 gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-col gap-2 w-full max-w-md">
                      <motion.div
                        className="w-full bg-black/30 p-5 pt-8 rounded-2xl border border-white/10 opacity-60 flex flex-col dashed relative overflow-hidden h-28 mix-blend-luminosity"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 0.6 }}
                      >
                        <div className="absolute top-2 left-4 text-[10px] uppercase font-tech text-white/30 tracking-widest">Long Chat History (8000+ Tokens)</div>
                        <span className="text-white text-[13px] italic mt-auto line-clamp-2">「之前疯狂发散的长篇大论... 带有误导的废弃尝试... 我们不需要这些了」</span>
                        <div className="absolute top-2 right-4 bg-error/20 border border-error/30 text-error text-[10px] font-bold px-2 py-0.5 rounded ml-4 tracking-wider uppercase">抛弃 / 会话清零</div>
                      </motion.div>

                      <motion.div className="flex flex-col items-center" initial={{ height: 0, opacity: 0 }} animate={{ height: 50, opacity: 1 }} transition={{ delay: 0.4 }}>
                        <div className="h-6 border-l border-dashed border-primary/40"></div>
                        <div className="bg-primary/20 border border-primary/50 text-white px-4 py-1.5 rounded-full text-[12px] font-bold tracking-wide my-1 shadow-[0_0_20px_rgba(var(--color-primary),0.2)]">
                          提取精华打包 &rarr;
                        </div>
                        <div className="h-6 border-l border-dashed border-primary/40"></div>
                      </motion.div>

                      <motion.div
                        className="w-full bg-[#1A1A1A] p-6 pt-10 rounded-2xl border-2 border-primary shadow-2xl relative"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.9, type: "spring" }}
                      >
                        <div className="absolute -top-3 right-6 bg-primary text-black text-[12px] font-extrabold px-4 py-1 rounded-sm shadow-xl uppercase tracking-widest flex items-center gap-1">
                          <span className="animate-pulse">✨</span> 新一代极净 Context
                        </div>
                        <div className="absolute top-3 left-4 text-[10px] font-tech text-primary/40 tracking-widest">SYSTEM ROLE PROMPT ( 150 Tokens )</div>
                        <div className="mt-2 text-[14.5px] text-white/90 leading-[1.7] font-mono drop-shadow-sm font-medium">
                          “你是一名专注私立齿科 8 年经验的运营。当前核心诉求：写一篇推荐<span className="bg-primary/20 text-primary px-1 rounded mx-0.5">无痛微创拔除术</span>的小红书种草文。用户画像：极度害怕打针的年轻女性。请直接在此高优人设下响应我的提问。”
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}


                {/* VISUAL E: Ultimate Agent Architecture (Step 10) */}
                {step === 10 && (
                  <motion.div
                    key="right-auto"
                    className="absolute inset-0 flex flex-col justify-center items-center p-12 bg-black/40"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="grid grid-cols-2 gap-4 w-full h-[85%]">

                      {/* Core Engine */}
                      <div className="col-span-2 bg-[#0A1015] border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent"></div>
                        <div className="z-10 flex flex-col gap-1.5">
                          <h4 className="text-[17px] text-white/90 font-medium tracking-wide drop-shadow-md">超级大语言模型引擎</h4>
                          <span className="text-[12px] text-white/40 font-mono tracking-wider">摒弃堆叠，永远保持初始的系统 Prompt 极简干净</span>
                        </div>
                        <div className="z-10 w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center text-secondary text-2xl border border-white/10 shadow-inner group-hover:scale-110 transition-transform">🧠</div>
                      </div>

                      {/* RAG DB */}
                      <div className="group relative flex flex-col justify-center gap-2 bg-[#161616] border border-white/5 p-5 rounded-2xl hover:border-white/10 transition-colors overflow-hidden">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl drop-shadow-sm text-primary">📚</span>
                          <span className="text-[15px] font-medium text-white/90 ml-1">动态记忆系统 (含 RAG)</span>
                        </div>
                        <div className="text-[12px] text-white/50 leading-[1.6]">构建专属向量外挂记忆体。当切入长程新会话时，由模型基于当前的思维缺口去池中取回切块投递进窗口，达成无缝延续。</div>
                        {/* hover dot */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-60 group-hover:opacity-0 transition-opacity duration-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          <span className="text-amber-400/70 text-[9px] font-mono tracking-wider">hover</span>
                        </div>
                        {/* metaphor overlay */}
                        <div className="absolute inset-0 bg-[#0c0c14]/97 rounded-2xl px-4 py-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2.5 overflow-y-auto">
                          <div className="text-amber-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 pb-1.5 border-b border-amber-400/20 shrink-0">💡 门诊隐喻：AI 实习生的随身便签本</div>
                          <div className="flex flex-col gap-2">
                            <p className="text-[11px] leading-relaxed text-white/75">后台悄悄运行一个「总结小助手」，把聊天中的核心事实（「患者害怕打麻药」、「患者预算是 2 万」）写进长期记忆库——就像实习生每天下班前把重要事情记在随身便签上。</p>
                            <p className="text-[11px] leading-relaxed text-amber-300/90 font-semibold">第二天上班哪怕换了个新工位（新对话），只要一眼扫完便签，就能瞬间接上昨天的工作——而不是完全失忆重来！</p>
                          </div>
                        </div>
                      </div>

                      {/* Web Search */}
                      <div className="group relative flex flex-col justify-center gap-2 bg-[#161616] border border-white/5 p-5 rounded-2xl hover:border-white/10 transition-colors overflow-hidden">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl drop-shadow-sm text-primary">🌐</span>
                          <span className="text-[15px] font-medium text-white/90 ml-1">实时网络检索</span>
                        </div>
                        <div className="text-[12px] text-white/50 leading-[1.6]">作为外部触手，仅将精准的增量情报提取后才喂入主模型思维链，极大地避免了将极巨量网页乱码直接塞入而污染主上下文。</div>
                        {/* hover dot */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-60 group-hover:opacity-0 transition-opacity duration-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          <span className="text-amber-400/70 text-[9px] font-mono tracking-wider">hover</span>
                        </div>
                        {/* metaphor overlay */}
                        <div className="absolute inset-0 bg-[#0c0c14]/97 rounded-2xl px-4 py-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2.5 overflow-y-auto">
                          <div className="text-amber-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 pb-1.5 border-b border-amber-400/20 shrink-0">💡 门诊隐喻：专科会诊单，不是搬图书馆</div>
                          <div className="flex flex-col gap-2">
                            <p className="text-[11px] leading-relaxed text-white/75">患者问「最新的种植牙材料哪种最好？」——主任不会把整间医学图书馆的书搬进诊室。他只会让助理去检索，把那一页最新的临床对比结论打印出来递进来。</p>
                            <p className="text-[11px] leading-relaxed text-amber-300/90 font-semibold">实时联网检索正是这道「递纸条」的机制：只把精准的那几行情报塞进上下文，绝不让整个互联网的噪声污染主治医生（AI）的脑子。</p>
                          </div>
                        </div>
                      </div>

                      {/* Agent Skills */}
                      <div className="col-span-2 group flex flex-col justify-center gap-3 bg-[#111] border border-secondary/20 p-5 rounded-2xl shadow-[0_0_15px_rgba(var(--color-secondary),0.05)] relative overflow-hidden hover:border-secondary/50 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-6xl group-hover:scale-125 transition-transform duration-700">⚙️</div>
                        <div className="relative z-10 flex items-center gap-3">
                          <span className="text-2xl drop-shadow-sm">🛠️</span>
                          <span className="text-[16px] font-medium text-secondary/90 ml-1 drop-shadow-sm tracking-wide">Skills (渐进式披露) 与持久化写回</span>
                        </div>
                        <div className="relative z-10 text-[13px] text-white/60 leading-[1.6] max-w-[95%]">
                          印证了上下文工程的至高核心准则：绝不一次性喂饱，而是提供函数探针（Skills）。甚至能授权给大模型以<strong className="text-white">主动归纳长线执行轨迹并自主写回持久化记录簿中</strong>，这就彻底升华成了全栈自动运转的<strong className="text-white font-bold ml-1">跨会话上下文体系 (Cross-Session Context)</strong>。
                        </div>
                        {/* hover dot */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-60 group-hover:opacity-0 transition-opacity duration-200 z-20">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          <span className="text-amber-400/70 text-[9px] font-mono tracking-wider">hover</span>
                        </div>
                        {/* metaphor overlay */}
                        <div className="absolute inset-0 bg-[#0c0c14]/97 rounded-2xl px-4 py-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2.5 overflow-y-auto z-10">
                          <div className="text-amber-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 pb-1.5 border-b border-amber-400/20 shrink-0">💡 门诊隐喻：教实习生用系统，而非背系统</div>
                          <div className="flex flex-col gap-2">
                            <div>
                              <div className="text-white/50 text-[9.5px] font-bold uppercase tracking-wider mb-0.5">传统做法的灾难（全量披露）</div>
                              <p className="text-[11px] leading-relaxed text-white/75">为了让 AI 回答「张三明天下午能来复诊吗？」，你把门诊 5 万个患者的数据库、10 个医生的排班表一次性全塞进对话框。结果 AI 卡死了，且算错了。</p>
                            </div>
                            <div>
                              <div className="text-white/50 text-[9.5px] font-bold uppercase tracking-wider mb-0.5">Skills 的降维打击（渐进式披露）</div>
                              <p className="text-[11px] leading-relaxed text-amber-300/90 font-semibold">不要提前给资料！给 AI 配备【查询患者档案】【查询医生排班】两个技能探针——听到问题时，它自己去数据库只抽「张三」和「明天下午」的精确数据，再回答你。</p>
                            </div>
                            <p className="text-[11px] leading-relaxed text-white/60 italic border-t border-white/10 pt-2 mt-1">就好比你不要让实习生把整本《门诊管理系统》背下来，你只要教他怎么用鼠标去查系统。需要什么，当场查什么——这就是最顶级的上下文净化！</p>
                          </div>
                        </div>
                      </div>

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
