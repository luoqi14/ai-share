"use client";

import { useState, useEffect } from "react";
import { useCurrentStep } from "@/config/StepContext";
import { motion, AnimatePresence } from "motion/react";
import SlideTitle from "@/components/SlideTitle";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const TRICKS = [
  {
    num: "01",
    title: '数据污染与定向应试',
    subtitle: '"拿考卷复习的严重偏科"',
    desc: '因 MMLU 等题库已公开，部分厂商会将考题给 AI“强行背诵”，并针对客观题进行题海特训，彻底沦为应试教育。',
    metaphor: '门诊隐喻：就像实习生理论考了 98 分，一上临床连患者情绪都安抚不好。他不是真懂，只是变成了一个高分低能的“做题家”。'
  },
  {
    num: "02",
    title: '疯狂“挑肥拣瘦”',
    subtitle: '"拍一百张，只发一张精修"',
    desc: '提示词微调能极大影响得分。厂商在内部用几百种方式跑测试，但发布会上永远只放出那组得分最高、对自己最有利的数据。',
    metaphor: '门诊隐喻：如同医美案例，永远拿自己加了厚滤镜的“术后精修图”，去拉踩竞争对手没睡醒的素颜“术前状态”。'
  },
  {
    num: "03",
    title: '平台调用量“刷榜”',
    subtitle: '"疯狂补贴造就的虚假繁荣"',
    desc: '利用早期“地板价甚至白嫖”的补贴引流，吸引全球自动化机器脚本疯狂薅羊毛甚至自写脚本刷单。一旦泡沫破裂恢复原价收费，调用量即断崖下跌。',
    metaphor: '门诊隐喻：像新诊所打出“洗牙 9 块 9”骗取大长龙排队，自称本市最受欢迎。等第二周恢复 198 的常规价，门口就什么人影都没了。'
  }
];

// Helper to render lab prefixes
const CustomYAxisTick = (props: any) => {
  const { x, y, payload, data } = props;
  const modelName = payload.value;
  // Find lab
  const modelData = data.find((d: any) => d.name === modelName);
  const labName = modelData?.lab || "";

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={4} textAnchor="end" fill="rgba(255,255,255,0.7)" fontSize={11} fontFamily="var(--font-tech)">
        <tspan fill="rgba(255,255,255,0.3)" fontSize={10}>{labName}</tspan>
        {labName ? " · " : ""}
        <tspan>{modelName}</tspan>
      </text>
    </g>
  );
};

export default function SlideBenchmark() {
  const step = useCurrentStep();
  const showBox = step >= 1;
  const showChart = step >= 1;

  // Step logic refactor:
  // Step 1: Chart full width
  // Step 2: Chart shrinks to left, Header "为什么各家..." appears
  // Step 3: Trick 1 appears
  // Step 4: Trick 2 appears
  // Step 5: Trick 3 appears
  const isChartCentered = step === 1;

  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    if (step >= 1 && leaderboard.length === 0) {
      fetch('/api/arena')
        .then(res => res.json())
        .then(data => {
          setLeaderboard(data.data);
        });
    }
  }, [step, leaderboard.length]);

  return (
    <div className="slide !p-0 overflow-hidden">
      <SlideTitle title="基准测试" label="BENCHMARK" moved={showBox} />

      <AnimatePresence>
        {showBox && (
          <motion.div
            className="absolute inset-0 top-[15vh] px-16 pb-16 flex flex-row items-center justify-center gap-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* ====== Chart Area ====== */}
            {showChart && (
              <motion.div
                layout
                className="relative flex flex-col items-center justify-center bg-surface-container-high/40 rounded-3xl border ghost-border glass-overlay h-full overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  width: isChartCentered ? "80%" : "45%"
                }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
              >

                {/* Chart Header */}
                <div className="w-full flex justify-between items-start p-8 pb-4 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex flex-col gap-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-display font-medium text-2xl text-white/90">文本模型竞技场</span>
                    </div>
                    <div className="text-white/60 text-sm mt-1">
                      查看跨越数学、编程、创意写作等各个开放领域任务的 AI 文本模型综合排名。
                    </div>
                  </div>
                </div>

                {/* Chart Body */}
                <div className="w-full flex-1 p-6 pl-0 pb-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={leaderboard} layout="vertical" margin={{ left: 20 }}>
                      <XAxis type="number" domain={['dataMin - 50', 'dataMax']} hide />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={250}
                        tick={<CustomYAxisTick data={leaderboard} />}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                        contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', backdropFilter: 'blur(10px)' }}
                        itemStyle={{ color: 'var(--color-primary)' }}
                      />
                      <Bar dataKey="elo" radius={[0, 4, 4, 0]} barSize={isChartCentered ? 20 : 14} animationDuration={1500}>
                        {leaderboard.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index < 3 ? 'var(--color-primary)' : index < 10 ? 'var(--color-secondary)' : 'rgba(255,255,255,0.15)'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* ====== Tricks Area (Step 2+) ====== */}
            <AnimatePresence>
              {step >= 2 && (
                <motion.div
                  className="flex-1 h-full flex flex-col pt-4 overflow-hidden"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="mb-6 px-4">
                    <h2 className="font-display text-2xl font-medium text-white mb-2">为什么发布会上数据都那么好？</h2>
                  </div>

                  <div className="flex flex-col gap-5 overflow-y-auto pr-4 pb-20 custom-markdown-scrollbar">
                    {TRICKS.map((trick, index) => {
                      const isActive = step >= index + 3;
                      if (!isActive) return null;

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-black/20 border border-white/5 rounded-2xl p-6 flex flex-col gap-3"
                        >
                          <div className="flex items-center gap-4">
                            <span className="font-tech text-white/30 text-xl border border-white/10 px-3 py-1 rounded-sm">
                              {trick.num}
                            </span>
                            <h3 className="font-display font-medium text-[18px] text-white/90">
                              {trick.title}
                            </h3>
                          </div>
                          
                          <div className="font-mono text-xs text-primary/70 tracking-wide mb-1">
                            {trick.subtitle}
                          </div>

                          <p className="text-white/70 leading-relaxed text-[15px] pt-1">
                            {trick.desc}
                          </p>

                          {trick.metaphor && (
                            <div className="mt-1 pt-3 border-t border-white/5 text-[14px] text-white/40 leading-relaxed">
                              {trick.metaphor}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
