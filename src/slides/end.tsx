"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { endSubtitles } from "@/data/end_data";
import { useSlideAudioContext } from "@/config/SlideAudioContext";

const getColorClass = (index: number) => {
  // 14 premium colors with expanded palette
  const colors = [
    "text-[#dbfcff]", // cyan
    "text-[#ffb4ab]", // peach
    "text-[#d0bcff]", // purple
    "text-[#bdfaca]", // mint
    "text-[#fcf4a3]", // softer yellow
    "text-[#ffd8ed]", // rose pink
    "text-[#a6e6ff]", // bright blue
    "text-[#ffc8dd]", // baby pink
    "text-[#caffbf]", // soft lime
    "text-[#9bf6ff]", // light cyan
    "text-[#a0c4ff]", // periwinkle
    "text-[#bdb2ff]", // lavender
    "text-[#ffc6ff]", // bright pink
    "text-[#fdffb6]"  // light yellow
  ];
  
  // Random color for ALL sentences pseudo-randomly
  const hash = (index * 31) % colors.length;
  return colors[hash];
};

const getAnchors = () => {
  return {
    blackout: endSubtitles.findIndex(s => s.text.includes("极速的概率")),
    typewriter: endSubtitles.findIndex(s => s.text.includes("对于我们")),
    dance: endSubtitles.findIndex(s => s.text.includes("与AI共舞")),
    thanks: endSubtitles.length - 1
  };
};

const getPhaseInfo = (index: number) => {
  const i = index - 1;
  const a = getAnchors();

  if (i === a.thanks) return 6;
  if (i === a.dance) return 5;
  if (i === a.blackout) return 4;
  
  if (a.typewriter !== -1 && a.blackout !== -1 && i >= a.typewriter && i < a.blackout) return 3;
  if (a.blackout !== -1 && i > a.blackout && i < a.thanks) return 5;
  if (a.typewriter !== -1 && i >= Math.floor(a.typewriter / 2) && i < a.typewriter) return 2;
  
  return 1;
};

const isVertical = (index: number) => {
  const i = index - 1;
  const a = getAnchors();

  if (i === a.thanks || i === a.dance || i === a.blackout) return false;
  if (a.typewriter !== -1 && a.blackout !== -1 && i >= a.typewriter && i < a.blackout) return false;
  
  return index % 3 === 0;
};

const getContainerLayout = (index: number) => {
  const i = index - 1;
  const a = getAnchors();

  if (i === a.thanks || i === a.dance || i === a.blackout) {
    return "items-center justify-center text-center px-10";
  }

  if (a.typewriter !== -1 && a.blackout !== -1 && i >= a.typewriter && i < a.blackout) {
    return "items-center justify-center pb-[10vh]";
  }

  const positions = [
    "items-start justify-start pt-[15vh] pl-[10vw]",
    "items-end justify-end pb-[15vh] pr-[15vw]",
    "items-start justify-center pt-[20vh]",
    "items-center justify-start pl-[20vw]",
    "items-start justify-end pt-[15vh] pr-[20vw]",
    "items-end justify-start pb-[20vh] pl-[15vw]",
    "items-end justify-center pb-[25vh]",
    "items-center justify-end pr-[20vw]"
  ];

  return positions[index % positions.length];
};

const SubtitleRenderer = ({ sub, index }: { sub: any, index: number }) => {
  const phase = getPhaseInfo(index);

  let textClass = `p-8 md:p-12 ${getColorClass(index)} `;
  let variant: any = {};

  // Pseudo-randomness for entrance animations
  const rx = (index * 53) % 100 - 50; // -50 to 50
  const ry = (index * 47) % 60 - 30;  // -30 to 30
  const rRotate = (index * 13) % 10 - 5; // -5 to 5

  switch (phase) {
    case 1:
      textClass += "text-[clamp(1.5rem,4vw,4rem)] font-display font-medium leading-tight";
      variant = {
        initial: { opacity: 0, scale: 0.8, x: rx, y: ry, rotate: rRotate },
        animate: { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0, transition: { type: "spring", bounce: 0.5, duration: 0.4 } },
        exit: { opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 0.2 } }
      };
      break;
    case 2:
      textClass += "text-[clamp(2.5rem,5vw,5rem)] font-display font-bold drop-shadow-lg leading-tight"; 
      variant = {
        initial: { opacity: 0, x: rx, y: 40 + ry, rotate: rRotate },
        animate: { opacity: 1, x: 0, y: 0, rotate: 0, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
      };
      break;
    case 3:
      textClass += "text-[clamp(1.5rem,3vw,3rem)] font-body font-light leading-relaxed opacity-90";
      variant = {
        animate: { transition: { staggerChildren: 0.05 } },
        exit: { opacity: 0, transition: { duration: 0.3 } }
      };
      break;
    case 4:
      textClass += "text-[clamp(2rem,6vw,6rem)] font-display font-bold leading-tight text-center max-w-5xl";
      variant = {
        initial: { opacity: 0, scale: 0.8, rotate: rRotate },
        animate: { opacity: 1, scale: 1, rotate: 0, textShadow: "0px 0px 40px rgba(255,255,255,0.4)", transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, scale: 1.2, transition: { duration: 0.3 } }
      };
      break;
    case 5:
      textClass += "text-[clamp(2.5rem,5.5vw,5.5rem)] font-display font-bold leading-none max-w-5xl mix-blend-screen";
      variant = {
        initial: { opacity: 0, rotate: rRotate * 2, scale: 0.5, x: rx, y: ry },
        animate: { opacity: 1, rotate: 0, scale: 1, x: 0, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
        exit: { opacity: 0, scale: 1.2, filter: "blur(20px)", transition: { duration: 0.3 } }
      };
      break;
    case 6:
      textClass += "text-[clamp(2rem,4vw,4rem)] font-body tracking-[0.8em] font-light opacity-80";
      variant = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
        exit: { opacity: 0 }
      };
      break;
  }

  const vertical = isVertical(index);

  if (phase === 3) {
    return (
      <motion.div
        className={textClass}
        variants={variant}
        initial="initial" animate="animate" exit="exit"
        style={{ writingMode: vertical ? 'vertical-rl' : 'horizontal-tb' }}
      >
        {sub.text.trim().split("").map((char: string, i: number) => (
          <motion.span key={i} variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}>
            {char}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={textClass}
      variants={variant}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ writingMode: vertical ? 'vertical-rl' : 'horizontal-tb' }}
      dangerouslySetInnerHTML={{ __html: sub.text.trim().replace(/\n/g, "<br/>") }}
    />
  );
};

export default function SlideEnd() {
  // Consume the audio API injected by SlideContainer via context.
  // progress (currentTime) drives subtitle tracking; all playback controls
  // (play/pause/scrub/auto-advance) are handled by the global SlideAudioBar.
  const audio = useSlideAudioContext();

  // Own RAF — polls audioRef.currentTime directly so we don't depend on the
  // (now removed) progress state in useSlideAudio.
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    const tick = () => {
      const t = audio?.audioRef.current?.currentTime ?? 0;
      setProgress(t);
      rafRef.current = requestAnimationFrame(tick);
    };
    if (audio?.hasAudio) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [audio?.hasAudio, audio?.audioRef]);

  // Derive active subtitle from current playback position
  let activeIndex = -1;
  for (let i = 0; i < endSubtitles.length; i++) {
    if (progress >= endSubtitles[i].start && progress < endSubtitles[i].end) {
      activeIndex = i;
      break;
    }
  }

  const activeSub = activeIndex !== -1 ? endSubtitles[activeIndex] : null;
  const logicIndex = activeIndex + 1; // 1-based index to maintain visual mappings
  const phase = getPhaseInfo(logicIndex);

  return (
    <div className="slide !p-0 overflow-hidden bg-transparent z-10 w-full h-full relative">
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none"
        style={{ zIndex: 0 }}
        animate={{ opacity: phase === 4 ? 1 : 0 }}
        transition={{ duration: 1 }}
      />

      <AnimatePresence mode="wait">
        {activeSub && (
          <motion.div
            key={logicIndex}
            className={`absolute inset-0 w-full h-full pointer-events-none flex ${getContainerLayout(logicIndex)}`}
            style={{ zIndex: 10 }}
          >
            <SubtitleRenderer sub={activeSub} index={logicIndex} />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
