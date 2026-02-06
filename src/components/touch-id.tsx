"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";

interface TouchIDProps {
  onComplete?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg" | number;
  speed?: number; // Duration in ms, defaults to 2000
}

const SIZE_MAP = {
  sm: 60,
  md: 120,
  lg: 200,
};

export function TouchID({ 
  onComplete, 
  className, 
  size = "md",
  speed = 2000 
}: TouchIDProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const finalSize = typeof size === "number" ? size : SIZE_MAP[size];

  useEffect(() => {
    let startTimestamp: number;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const newProgress = Math.min((elapsed / speed) * 100, 100);
      
      setProgress(newProgress);

      if (newProgress < 100) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    };

    if (isHolding) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      setProgress(0);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isHolding, onComplete, speed]);

  const handleStart = () => {
    setIsHolding(true);
  };

  const handleEnd = () => {
    setIsHolding(false);
  };

  return (
    <motion.div 
      className={cn(
        "relative flex items-center justify-center select-none cursor-pointer",
        className
      )}
      style={{ width: finalSize, height: finalSize }}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Corner Brackets */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Left */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/20 rounded-tl-xl" />
        {/* Top Right */}
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/20 rounded-tr-xl" />
        {/* Bottom Left */}
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/20 rounded-bl-xl" />
        {/* Bottom Right */}
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/20 rounded-br-xl" />
      </div>

      {/* Fingerprint Container */}
      <div className="relative w-3/5 h-3/5 flex items-center justify-center">
        {/* Static Background Fingerprint */}
        <Fingerprint 
          className="w-full h-full text-slate-300 dark:text-slate-700" 
          strokeWidth={1.5}
        />
        
        {/* Active Colored Fingerprint with Clip Path */}
        <motion.div 
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `inset(${100 - progress}% 0 0 0)`
          }}
        >
          <Fingerprint 
            className="w-full h-full text-[#7d8eff]" 
            strokeWidth={1.5}
          />
        </motion.div>

        {/* Scanning Line - Single line moving bottom to top */}
        <AnimatePresence>
          {isHolding && progress < 100 && (
            <motion.div
              className="absolute left-[-15%] right-[-15%] h-[2px] bg-[#7d8eff] shadow-[0_0_15px_#7d8eff] z-10"
              style={{ top: `${100 - progress}%` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Success Pulse */}
      {progress === 100 && (
        <motion.div
          className="absolute inset-0 border-4 border-[#7d8eff] rounded-3xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
