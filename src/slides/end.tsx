"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { endSubtitles } from "@/data/end_data";

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(1);
  const reqRef = useRef<number>(0);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatTimeMs = (time: number) => {
    if (isNaN(time)) return "0:00.000";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 1000);
    return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/end.mp3");
    }
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    if (audio.readyState >= 1) handleLoadedMetadata();

    // Do NOT play automatically on mount!
    // The user must click the play button to satisfy "进入该幻灯片就不需要自动播放了".

    const updateTime = () => {
      // Return early if not playing or completed to avoid unnecessary calculations
      if (audio.paused && audio.currentTime === 0) {
        reqRef.current = requestAnimationFrame(updateTime);
        return;
      }

      const now = audio.currentTime;
      setProgress(now);
      
      let newIdx = -1;

      for (let i = 0; i < endSubtitles.length; i++) {
        if (now >= endSubtitles[i].start && now < endSubtitles[i].end) {
          newIdx = i;
          break;
        }
      }
      
      setActiveIndex(newIdx);
      reqRef.current = requestAnimationFrame(updateTime);
    };
    
    reqRef.current = requestAnimationFrame(updateTime);

    return () => {
      cancelAnimationFrame(reqRef.current);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.pause();
      audio.currentTime = 0; // Restoring initial state implicitly handled by Next.js unmounting this component
    };
  }, []);

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

      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer pointer-events-auto"
            onClick={() => {
              audioRef.current?.play();
              setIsPlaying(true);
              setIsPaused(false);
            }}
          >
            <div className="text-white text-2xl font-display tracking-widest border border-white/20 px-8 py-4 rounded-full hover:bg-white/10 transition-colors">
              播放结束语
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invisible layer to capture click-to-pause (behind progress bar) */}
      {isPlaying && (
        <div 
          className="absolute inset-0 z-20 cursor-pointer pointer-events-auto"
          onClick={() => {
            if (audioRef.current) {
              if (audioRef.current.paused) {
                audioRef.current.play();
                setIsPaused(false);
              } else {
                audioRef.current.pause();
                setIsPaused(true);
              }
            }
          }}
        />
      )}

      {/* Paused visual indicator */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          >
            <div className="text-white/20 text-4xl tracking-[0.5em] font-display uppercase blur-[1px]">
              Paused
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar (Visible when playing) */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-8 left-10 right-10 z-50 flex items-center justify-center gap-4 text-white/40 font-mono text-sm pointer-events-auto group"
            style={{ zIndex: 50 }}
          >
            <span className="w-24 text-right">{formatTimeMs(progress)}</span>
            <input
              type="range"
              min={0}
              max={duration}
              step={0.01}
              value={progress}
              onChange={(e) => {
                const newTime = parseFloat(e.target.value);
                if (audioRef.current) {
                  audioRef.current.currentTime = newTime;
                  setProgress(newTime);
                }
              }}
              className="flex-1 max-w-4xl h-1 bg-white/20 rounded-full appearance-none outline-none cursor-pointer hover:h-2 transition-all opacity-50 group-hover:opacity-100"
              style={{
                background: `linear-gradient(to right, var(--color-primary) ${(progress / duration) * 100}%, rgba(255,255,255,0.1) ${(progress / duration) * 100}%)`,
              }}
            />
            <span className="w-12 text-left">{formatTime(duration)}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 0px; 
          height: 0px; 
        }
        input[type=range]:hover::-webkit-slider-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.8);
          transition: 0.1s;
        }
      `}</style>
    </div>
  );
}
