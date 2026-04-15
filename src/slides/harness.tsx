"use client";

import { useCurrentStep } from "@/config/StepContext";
import { motion, AnimatePresence } from "motion/react";
import SlideTitle from "@/components/SlideTitle";

const text1 = "“全自动 AI”的美好幻想".split("");
const text2 = "“可控与合规”永远高于“聪明”".split("");

export default function SlideHarness() {
  const step = useCurrentStep();
  const showBox = step >= 1;

  return (
    <div className="slide !p-0 overflow-hidden">
      <SlideTitle title="脚手架工程" label="HARNESS ENGINEERING" moved={showBox} subtitle="从聊天到打工：给 AI 套上缰绳" />

      <AnimatePresence>
        {/* Step 1 & 2: Hook Title Explosion & Reassembly */}
        {step === 1 && (
          <motion.div
            key="hook-1"
            className="absolute inset-0 flex items-center justify-center p-6 sm:p-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="font-display flex flex-wrap justify-center text-[2rem] sm:text-[4rem] tracking-wider text-white/90 font-medium text-center drop-shadow-2xl">
              {text1.map((char, i) => {
                const angle = (i / text1.length) * Math.PI * 2;
                const dx = Math.cos(angle) * (150 + (i % 3) * 100);
                const dy = Math.sin(angle) * (150 + (i % 3) * 100);

                return (
                  <motion.span
                    key={i}
                    className="inline-block"
                    exit={{ x: dx, y: dy, opacity: 0, filter: "blur(10px)", rotate: dx }}
                    transition={{ duration: 0.8, ease: "easeIn" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="hook-2"
            className="absolute inset-0 flex items-center justify-center p-6 sm:p-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="font-display flex flex-wrap justify-center max-w-4xl text-[2rem] sm:text-[3.8rem] tracking-wider text-secondary font-bold text-center drop-shadow-[0_0_15px_rgba(var(--color-secondary),0.4)]">
              {text2.map((char, i) => {
                const angle = ((i + 5) / text2.length) * Math.PI * 2;
                const dx = Math.cos(angle) * (200 + (i % 4) * 80);
                const dy = Math.sin(angle) * (200 + (i % 4) * 80);

                return (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ x: dx, y: dy, opacity: 0, filter: "blur(15px)", scale: 2, rotate: -dx }}
                    animate={{ x: 0, y: 0, opacity: 1, filter: "blur(0px)", scale: 1, rotate: 0 }}
                    transition={{ duration: 1.2, delay: 0.5 + i * 0.04, type: "spring", bounce: 0.3 }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        )}

        {step >= 3 && step <= 10 && (
          <motion.div
            key="main-content"
            className="absolute inset-0 top-[18vh] pb-4 sm:pb-16 px-4 sm:px-8 md:px-16 flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-12 overflow-y-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* ---------------- LEFT PANEL ---------------- */}
            <div className="w-full sm:flex-[0.4] flex flex-col pt-4 shrink-0">
              <AnimatePresence mode="wait">

                {/* Text 1: Auto-GPT */}
                {step === 3 && (
                  <motion.div
                    key="left-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-gradient font-display text-xl sm:text-[32px] font-medium mb-4 sm:mb-8">
                      “全自主调度”的灾难
                    </h2>
                    <div className="flex flex-col gap-6 text-white/70 text-[15px] leading-relaxed">
                      <p>
                        前两年各种演示吹捧的 AutoGPT，号称只要给目标，AI 就能自主拆解任务、搜资料、写代码并彻底接管一切。
                      </p>
                      <p>
                        但在真实的商业环境（如口腔门诊）中，这种不受控的黑盒架构简直是一场灾难。它可能为了查一个排班陷入后台死循环，凭空拉扯几百块的 API 调用费；也可能突然发疯，把来咨询洗牙的排期，自主推理成种牙的手术账单发给患者。
                      </p>
                      <div className="px-5 py-4 border-l-2 border-error/40 bg-error/10 rounded-r-xl">
                        <strong className="text-error font-medium drop-shadow-md">门诊隐喻：</strong>这就像招了一个智商 180 但自负、完全不听指挥的散漫医学天才。你让他去“大厅接待”，他为了炫技越过所有护士，直接把患者拉进手术室要给人家做正颌手术。
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Text 2: Harness & SOP */}
                {step >= 4 && step <= 5 && (
                  <motion.div
                    key="left-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-gradient font-display text-xl sm:text-[32px] font-medium mb-4 sm:mb-8">
                      铁打的流水线，流水的 AI
                    </h2>
                    <div className="flex flex-col gap-6 text-white/70 text-[15px] leading-relaxed">
                      <p>
                        在真正严肃的业务流中，占据主导权和调度权的，绝对不能是大模型，而必须是我们绝对可控的传统程序代码（即 Harness，脚手架流程）。
                      </p>
                      <p>
                        在 Harness 架构下，大模型不再是发号施令的中心“大管家”，它被降级成了流水线上一个只提供极点算力的专属 <strong className="text-secondary drop-shadow-md">“高级螺丝钉”</strong>。
                      </p>
                      <div className="px-5 py-4 border-l-2 border-primary/40 bg-primary/10 rounded-r-xl text-[14px]">
                        患者进门，程序强制接管录入，再去调用 DB —— 只有在被需要的时候，程序才把数据发给模型去翻译成“温柔的问候语”。一切不可控的幻觉，全部被死死关进程序的铁笼子里。
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Text 3: OpenClaw Negative Example */}
                {step >= 6 && step <= 7 && (
                  <motion.div
                    key="left-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-gradient font-display text-xl sm:text-[32px] font-medium mb-4 sm:mb-8">
                      顶级智能体的分野
                    </h2>
                    <div className="flex flex-col gap-6 text-white/70 text-[15px] leading-relaxed">
                      <div className="bg-black/20 p-6 rounded-2xl border border-error/30 shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-error/20 text-error px-4 py-1.5 rounded-bl-xl text-[12px] font-bold uppercase tracking-widest">反面教材</div>
                        <h3 className="text-error font-medium mb-3 text-[18px] tracking-wide relative z-10">OpenClaw<span className="text-white/40 text-[13px] ml-2 font-normal">(四肢发达，头脑混乱)</span></h3>

                        <p className="mb-4">
                          <strong className="text-white/80">现状：</strong>OpenClaw 最近火爆，GitHub 星星数甚至超越了 Linux。它能把 AI 瞬间接入微信、钉钉、各种数据库，看似手脚全施展开了。
                        </p>
                        <p className="mb-4 border-l border-error/50 pl-3 text-[13.5px]">
                          <strong className="text-error">致命缺陷：</strong>它没有做干净的上下文管理。它做任务时，就是把各种聊天记录、数据库文件全丢给大模型（openclaw也是有subagents的，但是动态记忆在初始版本做的不好，有待验证）。
                        </p>
                        <div className="bg-error/10 px-4 py-3 rounded text-error/80 text-[13.5px] italic border-l-4 border-error mt-2">
                          锐评：“手脚麻利但没有灵魂。” 因为上下文被严重污染，它越聊越笨，经常执行错任务。
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Text 4: Subagent & Task Breakdown */}
                {step === 8 && (
                  <motion.div
                    key="left-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-gradient font-display text-xl sm:text-[32px] font-medium mb-4 sm:mb-8">
                      任务拆分与 Subagent
                    </h2>
                    <div className="flex flex-col gap-5 text-white/70 text-[15px] leading-relaxed">
                      <p>
                        在真正的工业级 Harness 架构中，Subagent（子智能体）的本质是<strong className="text-primary font-medium tracking-wide">“跨界合作”</strong>。每个 Subagent 应该代表一个拥有独立专业知识、独立技能 (Skills)、甚至不同性格的“职业大脑”。
                      </p>
                      <p>
                        <strong className="text-white/90">为什么要隔离上下文？</strong><br />
                        如果我们用以前那种把所有资料都塞给一个大模型的粗暴做法，那个 AI 就像一个精神分裂的怪物——它会在跟患者聊拔牙风险时，突然插一句“今天办卡打八折哦”。
                      </p>
                      <div className="px-5 py-4 border-l-2 border-secondary/40 bg-secondary/5 rounded-r-xl">
                        这就呼出了一种全新的生态：成熟的 Harness 工程，是在用代码构建一整座<strong className="text-secondary mx-1">虚拟门诊</strong>。它让客服 AI 只管共情，让医生 AI 只管治病，让运营 AI 只管算账。它们各司其职，互不污染，最后由系统把它们拼接起来。
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Text 5: Critic / Feedback */}
                {step === 9 && (
                  <motion.div
                    key="left-5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-gradient font-display text-xl sm:text-[32px] font-medium mb-4 sm:mb-8">
                      反馈循环与独立审查
                    </h2>
                    <div className="flex flex-col gap-6 text-white/70 text-[15px] leading-relaxed">
                      <p>
                        哪怕给前端的 Agent 戴上了镣铐，我们也绝不能把它的输出直接暴露给患者。
                      </p>
                      <p>
                        我们会在关键的出口节点，专门安插一个独立运转的 <strong className="text-primary">Reviewer 审查智能体 (Critic)</strong> 来做独立审查验证。这就像强行在流水线末端加了一道安检。
                      </p>
                      <div className="px-5 py-4 border-l-2 border-error/50 bg-error/5 rounded-r-xl">
                        如果发现前端 AI 生成的回复里包含了越界敏感词，或者是泄露了患者隐私（比如输出了别人的全景牙片结论），Reviewer 会直接亮起红灯打回重做，绝不泄露给外部！
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Text 6: Entropy Management */}
                {step === 10 && (
                  <motion.div
                    key="left-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-gradient font-display text-xl sm:text-[32px] font-medium mb-4 sm:mb-8">
                      熵的降维打击 (状态清理)
                    </h2>
                    <div className="flex flex-col gap-6 text-white/70 text-[15px] leading-relaxed">
                      <p>
                        随着时间的推移，哪怕再好的系统，长周期的多轮聊天记录和发散思维也会变成一种混乱无序的“熵”。
                      </p>
                      <p>
                        Harness 系统会在后台定期静默运行专属的<strong className="text-secondary drop-shadow-md tracking-wide">“垃圾回收 (GC)” </strong>Agent 节点。
                      </p>
                      <div className="font-mono text-[13px] bg-black/20 p-5 rounded-xl border border-white/5 space-y-2">
                        <div className="flex"><span className="text-secondary mr-2">👉</span> 把混乱无序的聊天信息提取总结。</div>
                        <div className="flex"><span className="text-secondary mr-2">👉</span> 压缩成结构化的表格/JSON，转写入关系型数据库保存。</div>
                        <div className="flex"><span className="text-secondary mr-2">👉</span> 修复过时历史、偿还早期技术债、抹平幻觉残渣。</div>
                      </div>
                      <p className="border-b border-secondary/20 pb-2 text-secondary/90 italic font-medium">
                        —— 让庞大的 Agent 门诊体系，永远保持出厂设置般的绝对清爽。
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ---------------- RIGHT PANEL ---------------- */}
            <div className="w-full sm:flex-[0.6] min-h-[380px] sm:min-h-0 relative flex flex-col bg-surface-container-high/40 rounded-3xl border ghost-border glass-overlay overflow-hidden shadow-2xl mb-6 sm:mb-0">
              <AnimatePresence mode="wait">

                {/* Visual A: Auto-GPT Chaos (Step 3) */}
                {step === 3 && (
                  <motion.div
                    key="visual-1"
                    className="absolute inset-0 flex items-center justify-center p-4 sm:p-12"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                  >
                    <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                      <motion.div className="w-32 h-32 bg-error/20 rounded-full blur-2xl absolute" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                      <div className="relative z-10 w-24 h-24 bg-black/80 border-2 border-error/50 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(var(--color-error),0.4)]">
                        <span className="text-4xl animate-pulse">🤖</span>
                      </div>

                      <motion.div className="absolute top-4 left-4 bg-black/40 border border-error/30 text-error text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full" animate={{ y: [0, -10, 0], x: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }}>API 配额: -$152.00</motion.div>
                      <motion.div className="absolute bottom-12 right-2 bg-black/40 border border-error/30 text-error text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full" animate={{ y: [0, 10, 0], x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>无限死循环</motion.div>
                      <motion.div className="absolute top-1/2 -left-12 bg-black/40 border border-error/30 text-error text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full" animate={{ y: [0, 5, 0], x: [0, -10, 0] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.5 }}>发送错误报价</motion.div>

                      <svg className="absolute inset-0 w-full h-full -z-10 text-error/30" viewBox="0 0 100 100">
                        <path d="M50,50 Q20,20 10,40 T50,50" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_1s_linear_infinite]" />
                        <path d="M50,50 Q80,10 90,50 T50,50" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_1.5s_linear_infinite]" />
                        <path d="M50,50 Q70,90 40,90 T50,50" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_1.2s_linear_infinite]" />
                      </svg>
                    </div>
                  </motion.div>
                )}

                {/* Visual B: Harness SOP Pipeline (Step 4 & 5) */}
                {step >= 4 && step <= 5 && (
                  <motion.div
                    key="visual-2"
                    className="absolute inset-0 flex flex-col justify-center items-center p-4 sm:p-8 md:p-12 bg-black/20 overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[11px] font-tech text-white/30 tracking-[0.3em] uppercase">SOP Harness Pipeline</div>
                    <div className="flex flex-col gap-6 w-full max-w-sm mt-4">
                      <div className="w-full flex items-center bg-[#151515] p-4 rounded-xl border border-white/10 shadow-lg">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl shrink-0">📋</div>
                        <div className="ml-4 flex flex-col">
                          <div className="text-[14px] text-white/90 font-medium tracking-wide">患者进门强录入（而不是让 AI 去闲聊）</div>
                          <div className="text-[12px] text-white/40 font-mono mt-0.5">程序代码</div>
                        </div>
                      </div>
                      <div className="h-6 w-px bg-gradient-to-b from-white/20 to-transparent mx-auto"></div>
                      <div className="w-full flex items-center bg-[#151515] p-4 rounded-xl border border-white/10 shadow-lg">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl shrink-0">🗄️</div>
                        <div className="ml-4 flex flex-col">
                          <div className="text-[14px] text-white/90 font-medium tracking-wide">调阅历史病历发送给大模型节点</div>
                          <div className="text-[12px] text-white/40 font-mono mt-0.5">程序查询数据库</div>
                        </div>
                      </div>
                      <div className="h-6 w-px bg-gradient-to-b from-white/20 to-transparent mx-auto"></div>
                      <motion.div
                        className={`w-full flex items-center p-5 rounded-xl border-2 shadow-2xl relative overflow-hidden transition-colors duration-700 ${step === 5 ? 'bg-secondary/15 border-secondary/50 shadow-[0_0_40px_rgba(var(--color-secondary),0.15)]' : 'bg-[#151515] border-white/10'}`}
                        initial={{ scale: 0.95 }}
                        animate={{ scale: step === 5 ? 1.05 : 1 }}
                      >
                        {step === 5 && <div className="absolute top-0 right-0 bg-secondary text-black font-bold text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-bl-xl">“高级螺丝钉”</div>}
                        <div className="w-12 h-12 rounded-xl bg-black/50 flex items-center justify-center text-2xl border border-white/10 shrink-0">🧠</div>
                        <div className="ml-4 flex flex-col z-10">
                          <div className={`text-[15px] font-medium tracking-wide ${step === 5 ? 'text-secondary font-bold' : 'text-white/90'}`}>把生涩的病历翻译成一句温柔的复诊问候语</div>
                          <div className="text-[12px] text-white/40 font-mono mt-0.5">Subagent 特定翻译提示词</div>
                        </div>
                      </motion.div>
                      <div className="h-6 w-px bg-gradient-to-b from-white/20 to-transparent mx-auto"></div>
                      <div className="w-full flex items-center bg-[#151515] p-4 rounded-xl border border-white/10 shadow-lg">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl shrink-0">📨</div>
                        <div className="ml-4 flex flex-col">
                          <div className="text-[14px] text-white/90 font-medium tracking-wide">交接回程序，程序调用企微 API 投递</div>
                          <div className="text-[12px] text-white/40 font-mono mt-0.5">确定性终末操作</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Visual C: Hermes Agent (Step 7) */}
                {step === 7 && (
                  <motion.div
                    key="visual-3"
                    className="absolute inset-0 flex items-center justify-center p-3 sm:p-8 md:p-12 bg-black/20 overflow-y-auto"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-full sm:w-[85%] bg-gradient-to-br from-[#121A2F] to-[#0A0F15] border border-blue-400/30 p-4 sm:p-8 rounded-3xl shadow-[0_0_60px_rgba(96,165,250,0.15)] relative overflow-hidden group">
                      <div className="absolute -top-4 -right-4 p-4 font-display text-[80px] text-blue-400/5 font-bold italic group-hover:scale-110 transition-transform duration-700 pointer-events-none">HERMES</div>
                      <div className="absolute top-6 left-6 bg-blue-500/20 text-blue-400 text-[11px] font-bold px-3 py-1 rounded tracking-widest uppercase">正面标杆</div>

                      <div className="mt-8 flex flex-col gap-4 relative z-10">
                        <h3 className="text-xl sm:text-[28px] font-display text-white font-bold drop-shadow-md">Hermes Agent</h3>
                        <p className="text-[14px] text-white/50 tracking-widest font-tech uppercase mb-1 border-b border-white/10 pb-4">自带 Harness 与记忆的灵魂</p>

                        <div className="text-[15px] text-white/70 leading-[1.8] mt-2">
                          由 <strong className="text-white drop-shadow-md border-b border-blue-400/50">Nous Research</strong> 发布的顶级开源智能体。后来者居上，它主打的就是“一个陪伴你共同成长的生态系统”。
                        </div>

                        <div className="mt-4 bg-black/40 border-l-2 border-blue-400 p-5 rounded-r-xl relative overflow-hidden">
                          <div className="absolute inset-0 bg-blue-400/5 mix-blend-screen pointer-events-none"></div>
                          <div className="text-[15px] text-white/90 font-bold tracking-wide mb-2"><span className="text-blue-400 mr-2 text-lg drop-shadow-[0_0_5px_rgba(96,165,250,1)]">✦</span>神级 Harness 架构隔离</div>
                          <p className="text-[13.5px] text-white/60 leading-[1.8]">
                            它绝对不把所有的垃圾数据丢进同一个窗口杂交。<br /><br />
                            它在底层做了一套优雅的“持久化记忆库 (<span className="text-blue-300 font-mono">Persistent Memory</span>)”和“隔离的子代理 (<span className="text-blue-300 font-mono">Isolated Subagents</span>)”。它会把你的个人偏好写成简短备忘录单独存储，每次执行任务时只呼唤最相关的记忆，把给 AI 的信息提纯得无比干净。
                          </p>
                          <div className="bg-error/10 px-4 py-3 rounded text-blue-300 text-[13.5px] italic border-error mt-2">
                            锐评：真正的 Harness 工程，不是比谁能塞的数据多，而是比谁能把给 AI 的信息提纯得最干净。
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Visual D: Virtual Clinic Subagents (Step 8) */}
                {step === 8 && (
                  <motion.div
                    key="visual-4"
                    className="absolute inset-0 flex flex-col justify-center items-center py-4 sm:py-8 px-3 sm:px-8 overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-col gap-4 w-full">
                      {/* Subagent A */}
                      <div className="bg-[#111] p-5 rounded-2xl border-l-[3px] border-l-primary border-t border-r border-b border-white/5 shadow-xl flex items-start gap-4">
                        <div className="text-3xl mt-1 shrink-0 drop-shadow-lg">💁‍♀️</div>
                        <div className="flex flex-col gap-1 w-full">
                          <div className="text-[15px] font-bold text-primary tracking-wide border-b border-white/5 pb-2 mb-1">
                            Subagent A：金牌初诊客服 <span className="text-white/90 text-[12px] font-normal tracking-normal ml-2">—— 情绪与情报收集者</span>
                          </div>
                          <div className="text-[13px] text-white/60 leading-relaxed">
                            <span className="text-white/80 font-medium">● 它的任务：</span>和患者在微信上沟通，安抚情绪，套出患者的真实预算、最害怕的事情（比如怕痛、怕打针）以及时间安排。
                          </div>
                          <div className="text-[13px] text-white/60 leading-relaxed">
                            <span className="text-white/80 font-medium">● 护栏隔离的上下文：</span>只传患者微信聊天记录、基础话术库。绝对不看专业齿科文献。
                          </div>
                          <div className="text-[13px] text-white/60 leading-relaxed bg-white/5 px-3 py-1.5 rounded-lg mt-1">
                            <span className="text-white/80 font-medium">● 纯血输出画像：</span>生成一份精简的《患者非医疗诉求画像》，例如：预算 3 万；极度怕痛；急需为下个月的婚礼做改善。
                          </div>
                        </div>
                      </div>

                      {/* Subagent B */}
                      <div className="bg-[#111] p-5 rounded-2xl border-l-[3px] border-l-secondary border-t border-r border-b border-white/5 shadow-xl flex items-start gap-4 sm:translate-x-4">
                        <div className="text-3xl mt-1 shrink-0 drop-shadow-lg opacity-90 grayscale">👨‍⚕️</div>
                        <div className="flex flex-col gap-1 w-full">
                          <div className="text-[15px] font-bold text-secondary tracking-wide border-b border-white/5 pb-2 mb-1">
                            Subagent B：正畸种植医师 <span className="text-white/90 text-[12px] font-normal tracking-normal ml-2">—— 纯粹的医疗大脑</span>
                          </div>
                          <div className="text-[13px] text-white/60 leading-relaxed">
                            <span className="text-white/80 font-medium">● 它的任务：</span>根据患者的初步症状描述或上传的牙片，给出最科学、最安全的医疗方案。
                          </div>
                          <div className="text-[13px] text-white/60 leading-relaxed">
                            <span className="text-white/80 font-medium">● 护栏隔离的上下文：</span>只传各大口腔医学指南、该患者的牙片特征。物理屏蔽预算和砍价记录。
                          </div>
                          <div className="text-[13px] text-secondary/80 font-medium leading-relaxed bg-secondary/10 px-3 py-1.5 rounded-lg mt-1">
                            ● 隔离的意义：保证医疗方案的纯粹性！如果提前知道了患者嫌贵，它的上下文被污染，它可能会自主降级方案，这在医疗上是绝对不允许的。
                          </div>
                        </div>
                      </div>

                      {/* Subagent C */}
                      <div className="bg-[#111] p-5 rounded-2xl border-l-[3px] border-l-blue-400 border-t border-r border-b border-white/5 shadow-xl flex items-start gap-4 sm:translate-x-8">
                        <div className="text-3xl mt-1 shrink-0 drop-shadow-lg">📊</div>
                        <div className="flex flex-col gap-1 w-full">
                          <div className="text-[15px] font-bold text-blue-400 tracking-wide border-b border-white/5 pb-2 mb-1">
                            Subagent C：门诊转化总监 <span className="text-white/90 text-[12px] font-normal tracking-normal ml-2">—— 商业融合大脑</span>
                          </div>
                          <div className="text-[13px] text-white/60 leading-relaxed">
                            <span className="text-white/80 font-medium">● 它的任务：</span>拿着 B（医生）给出的硬核治疗方案，结合 A（客服）给出的患者预算和痛点，生成一套完美的“逼单/转化话术”。
                          </div>
                          <div className="text-[13px] text-white/60 leading-relaxed">
                            <span className="text-white/80 font-medium">● 跨界合作流水线：</span>接收 B 医生的硬核方案 + A 客服的痛点标记 + 门诊本月的优惠活动库、分期付款政策、消费者心理学。
                          </div>
                          <div className="text-[13px] text-blue-300/90 font-medium leading-relaxed bg-blue-500/10 px-3 py-1.5 rounded-lg mt-1 border border-blue-500/20">
                            它会把医生冰冷的“上颌骨骨皮质切开术”翻译成患者能听懂且不害怕的“微创无痛加速排齐”，并精准卡在患者的 3 万预算内给出连环促销方案。
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Visual E: Critic Reviewer Mechanism (Step 9) */}
                {step === 9 && (
                  <motion.div
                    key="visual-5"
                    className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 md:p-12 bg-black/20 overflow-y-auto"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
                      {/* Generation Box */}
                      <div className="bg-[#1A1A1A] border border-white/10 px-6 py-4 rounded-xl text-white/80 text-[14px] flex items-center gap-3 shadow-lg">
                        <span className="text-xl grayscale">🤖</span> 前端输出营销话术草稿...
                      </div>

                      <div className="text-white/30 text-2xl animate-bounce">⬇</div>

                      {/* Inspection Box */}
                      <div className="bg-[#111] border-2 border-primary/40 p-6 rounded-2xl flex items-center gap-5 shadow-[0_0_30px_rgba(var(--color-primary),0.15)] relative w-full justify-center">
                        <span className="text-5xl drop-shadow-[0_0_20px_rgba(var(--color-primary),0.5)]">👮‍♂️</span>
                        <div className="flex flex-col gap-1">
                          <span className="font-bold tracking-widest text-[18px] text-primary">Reviewer Agent (独立审查安检)</span>
                          <span className="text-[13px] text-white/50 font-mono tracking-wide">扫描校验：绝对化医疗承诺、隐私漏出、违法广告词...</span>
                        </div>
                      </div>

                      {/* Forking outputs */}
                      <div className="flex w-full justify-between mt-2 pt-4 relative px-2 sm:px-8">
                        {/* Red Flow */}
                        <div className="flex flex-col items-center gap-3 w-1/2">
                          <div className="text-error text-3xl font-bold animate-pulse">⬇</div>
                          <div className="bg-error/10 border border-error/50 p-4 rounded-xl text-error text-[14px] font-bold tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(var(--color-error),0.2)]">
                            <span className="text-xl">❌</span> REJECT! 内部打回
                          </div>
                          <div className="text-[11px] text-error/60 mt-2 text-center">含有风险词“根治”，<br />绝不流出至患者终端！</div>

                          {/* Animated return loop SVG */}
                          <svg className="absolute top-0 right-[49%] w-32 h-[80px] text-error/60 -z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M50,100 C10,100 10,0 50,0" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_1s_linear_infinite]" />
                          </svg>
                        </div>

                        <div className="w-px bg-white/10 h-full absolute left-1/2 top-4"></div>

                        {/* Green Flow */}
                        <div className="flex flex-col items-center gap-3 w-1/2 opacity-50 grayscale">
                          <div className="text-secondary text-3xl font-bold">⬇</div>
                          <div className="bg-secondary/10 border border-secondary/50 p-4 rounded-xl text-secondary text-[14px] font-bold tracking-widest flex items-center gap-2">
                            <span className="text-xl">✅</span> PASS 放行
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Visual F: Entropy Garbage Collection (Step 10) */}
                {step === 10 && (
                  <motion.div
                    key="visual-6"
                    className="absolute inset-0 flex flex-col sm:flex-row items-center justify-between p-4 sm:p-8 md:p-12 bg-black/30 gap-4 sm:gap-0 overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Messy unstructured area */}
                    <div className="flex flex-col gap-3 relative w-full sm:w-1/3 h-[140px] sm:h-[70%] justify-center border-b sm:border-b-0 sm:border-r border-dashed border-white/20 sm:pr-6 shrink-0">
                      <motion.div className="absolute top-10 left-0 bg-white/5 p-2 rounded text-[11px] text-white/50 blur-[1px]">这几个月业绩怎么不好</motion.div>
                      <motion.div className="absolute top-28 right-4 bg-white/10 p-2 rounded text-[11px] text-white/70">你觉得洗牙痛不痛啊</motion.div>
                      <motion.div className="absolute bottom-24 left-2 bg-error/10 border border-error/20 p-2 rounded text-[11px] text-error/80 z-10 shadow-lg">我的预算勉强2万块吧</motion.div>
                      <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/5 p-2 rounded text-[11px] text-white/40 blur-[1px]">好想下个月结婚前弄好</motion.div>
                      <motion.div className="absolute bottom-10 right-0 bg-white/5 p-2 rounded text-[11px] text-white/40 blur-[2px]">哈哈今天天气不错</motion.div>

                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-bold tracking-widest text-[13px] text-white/30 uppercase whitespace-nowrap">无序聊天残渣 / 巨大的熵</div>
                    </div>

                    {/* Vacuum GC */}
                    <div className="flex flex-col items-center justify-center relative w-full sm:w-1/3 text-primary group shrink-0">
                      <span className="text-6xl mb-4 group-hover:scale-125 transition-transform drop-shadow-[0_0_20px_rgba(var(--color-primary),0.6)]">🧹</span>
                      <span className="font-bold tracking-widest text-[14px] bg-primary/10 px-4 py-2 rounded-xl shadow-lg border border-primary/30 text-center relative z-10 backdrop-blur-md">
                        后台清理聚合<br />
                        <span className="text-[10px] text-primary/60 tracking-wider">Garbage Collection Agent</span>
                      </span>

                      {/* Suction lines */}
                      <svg className="absolute -left-12 top-1/2 -translate-y-[60%] w-16 h-12 text-white/10 -z-10" viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M0 10h40"><animateMotion dur="1s" repeatCount="indefinite" path="M0 0 L20 0" /></path>
                      </svg>
                      <svg className="absolute -right-8 top-1/2 -translate-y-[60%] w-12 h-12 text-primary/40 -z-10" viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeDasharray="3 3" d="M0 10h40"><animateMotion dur="1.5s" repeatCount="indefinite" path="M0 0 L15 0" /></path>
                      </svg>
                    </div>

                    {/* Clean DB */}
                    <div className="flex flex-col gap-3 w-full sm:w-1/3 bg-[#080808] border border-secondary/40 p-4 sm:p-6 rounded-2xl shadow-[0_0_40px_rgba(var(--color-secondary),0.15)] h-auto sm:h-[60%] sm:ml-4">
                      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                        <span className="text-secondary text-2xl drop-shadow-md">🗄️</span>
                        <span className="text-white/90 text-[14px] font-bold tracking-widest">结构化记忆数据库</span>
                      </div>
                      <pre className="text-secondary/90 text-[11px] font-mono leading-[2] mt-2 overflow-hidden h-full">
                        {`{
  "intent": "隐形正畸",
  "budget_limit": 20000,
  "anxiety": "high",
  "urgency": "next_month_wedding",
  "history": "[已压缩归档...]"
}`}
                      </pre>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ---------------- 最终高潮大结局（全屏 Overlay） ---------------- */}
        <AnimatePresence>
          {step === 11 && (
            <motion.div
              key="climax"
              className="absolute inset-0 z-50 flex items-center justify-center p-6 sm:p-12 md:p-16 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2 }}
            >
              <div className="absolute inset-0 bg-[#06080A]/80 backdrop-blur-2xl"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--color-primary),0.08)_0%,transparent_70%)]"></div>

              <div className="relative z-10 max-w-4xl text-center flex flex-col items-center gap-4 sm:gap-8 md:gap-10">
                <motion.div
                  className="text-6xl text-primary drop-shadow-[0_0_30px_rgba(var(--color-primary),1)] animate-pulse"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  💡
                </motion.div>

                <h1 className="text-2xl sm:text-[42px] font-display font-bold text-white tracking-[0.2em] drop-shadow-2xl">
                  工业级 Agent 时代降临
                </h1>

                <div className="text-sm sm:text-[17px] text-white/80 leading-[2] sm:leading-[2.2] text-justify tracking-wide font-medium bg-black/20 p-4 sm:p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative">
                  <div className="absolute -top-4 -left-4 text-6xl text-primary/20 pointer-events-none font-display">&ldquo;</div>
                  <div className="absolute -bottom-10 -right-4 text-6xl text-primary/20 pointer-events-none font-display">&rdquo;</div>

                  <p className="mb-6 indent-8">
                    当我们火热讨论引入 AI 时，我们谈论的<strong className="text-white drop-shadow-md mx-1 border-b border-primary/50">绝不仅仅是在电脑上装一个聊天的对话框</strong>。
                  </p>
                  <p className="mb-6 indent-8">
                    我们即将迎来的，是一支基于 <strong className="text-primary text-[19px] tracking-widest mx-1 drop-shadow-md">Harness 工程</strong> 打造的工业级实体。它有可控程序的严谨护栏（安全），有精准净化的外接知识库（专业），有能自我隔离各司其职的 Subagent（高效），还有能记住每个患者喜好的长期记忆（贴心）。
                  </p>
                  <p className="indent-8 text-secondary font-bold text-[18px] drop-shadow-[0_0_15px_rgba(var(--color-secondary),0.6)]">
                    这时的 AI，不再是一个随时可能犯错的脱缰机器，而是一支永远不知疲倦、严格遵守商业规则的“超级虚拟团队”。这，才是我们为门诊插上翅膀的真正核心！
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 12 && (
            <motion.div
              key="shrimp-farmer"
              className="absolute inset-0 z-[60] flex items-center justify-center p-6 sm:p-12 md:p-16 overflow-y-auto"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="absolute inset-0 bg-[#040A0F]/90 backdrop-blur-3xl"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--color-secondary),0.05)_0%,transparent_60%)]"></div>

              <div className="relative z-10 max-w-4xl text-center flex flex-col items-center gap-4 sm:gap-8">
                <motion.div
                  className="text-5xl sm:text-7xl drop-shadow-[0_0_30px_rgba(var(--color-secondary),0.4)]"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", bounce: 0.4 }}
                >
                  🦐
                </motion.div>

                <h1 className="text-2xl sm:text-[40px] font-display font-bold text-white tracking-[0.1em] drop-shadow-xl mt-1 sm:mt-2 mb-2 sm:mb-4">
                  做顶配 AI 时代的“<span className="text-secondary drop-shadow-[0_0_10px_rgba(var(--color-secondary),0.5)] border-b-2 border-secondary/50 pb-1">专业养虾人</span>”
                </h1>

                <div className="text-sm sm:text-[16px] text-white/80 leading-[2] sm:leading-[2.2] text-justify tracking-wide bg-secondary/5 p-4 sm:p-8 md:p-10 rounded-2xl border border-secondary/20 shadow-[0_0_50px_rgba(var(--color-secondary),0.05)] relative w-full">
                  <p className="mb-5 indent-8">
                    既然我们已经看透了那些“全自动 AI 代替人类”的虚假神话，明白了 AI 依然会脱轨、会幻觉、会犯错……
                  </p>
                  <p className="mb-6 indent-8">
                    <strong className="text-secondary/90">那就不要去抗拒它，也不要把它们当神仙。</strong>我们要把它们看作池子里正在进化的底层数字劳工，或者是需要被圈养的“赛博虾蟹”。<strong className="text-white">我们的工作，就是摸清它们的脾性。</strong>用代码构建 Harness 水坝栏杆（划掉），用精准的 Context 喂养它们最干净的知识饲料！
                  </p>

                  <div className="w-full h-px bg-white/10 my-6"></div>

                  <p className="text-center font-bold text-[18px]">
                    而做好一个养虾人，最核心的起点：<br />
                    <span className="text-secondary text-lg sm:text-[24px] tracking-wide inline-block mt-3 sm:mt-4 drop-shadow-md">
                      身体力行，从每天接触、使用主流 AI 开始！
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </AnimatePresence>
    </div>
  );
}
