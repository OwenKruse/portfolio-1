"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RefreshCw, Check } from "lucide-react";

interface TransactionCardProps {
  id?: string;
  amount?: string;
  dueDate?: string;
  onSign?: (signatureDataUrl: string) => void;
  className?: string;
}

export function TransactionCard({
  id = "INV-456789",
  amount = "$284,342.57",
  dueDate = "Due in 15 days",
  onSign,
  className,
}: TransactionCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas resolution
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const isDark = document.documentElement.classList.contains("dark");
    ctx.strokeStyle = isDark ? "#ffffff" : "#18181b";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasSigned(true);

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ("touches" in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ("touches" in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleConfirm = () => {
    if (!hasSigned) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsComplete(true);
    if (onSign) {
      onSign(canvas.toDataURL());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "w-full max-w-[400px] bg-white dark:bg-zinc-950 rounded-[40px] p-10 shadow-2xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800 flex flex-col gap-6 relative overflow-hidden",
        className
      )}
    >
      {/* Success Overlay */}
      <AnimatePresence>
        {isComplete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white/90 dark:bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-white"
            >
              <Check size={40} strokeWidth={3} />
            </motion.div>
            <p className="text-xl font-bold text-zinc-900 dark:text-white">Transaction Signed</p>
            <button 
              onClick={() => {
                setIsComplete(false);
                clearSignature();
              }}
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header / Logo */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg transform rotate-45" />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-zinc-500 dark:text-zinc-400 font-medium tracking-wide uppercase text-sm">{id}</p>
          <h2 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">{amount}</h2>
          <p className="text-zinc-400 dark:text-zinc-500 font-medium">{dueDate}</p>
        </div>
      </div>

      {/* Signing Area */}
      <div className="mt-4 space-y-4">
        <div 
          className={cn(
            "relative h-48 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 transition-all duration-300 overflow-hidden",
            isDrawing && "border-[#7d8eff] scale-[1.02]",
            hasSigned && !isDrawing && "border-emerald-200 dark:border-emerald-900"
          )}
        >
          {/* Sign Here Placeholder */}
          {!hasSigned && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-serif text-zinc-800 dark:text-zinc-200 opacity-80 mt-4">Sign here</span>
              <div className="w-48 h-[1px] bg-zinc-200 dark:bg-white mt-2" />
            </div>
          )}

          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
          />

          {hasSigned && !isComplete && (
            <button 
              onClick={clearSignature}
              className="absolute top-4 right-4 p-2 bg-white dark:bg-zinc-800 rounded-full shadow-md text-zinc-400 hover:text-rose-500 transition-all hover:scale-110"
            >
              <RefreshCw size={16} />
            </button>
          )}
        </div>

        <Button 
          disabled={!hasSigned}
          onClick={handleConfirm}
          className={cn(
            "w-full h-14 rounded-xl text-lg font-bold transition-all duration-300",
            hasSigned 
              ? "shadow-lg shadow-[#7d8eff]/30" 
              : "text-white"
          )}
        >
          Confirm Transaction
        </Button>
      </div>
    </motion.div>
  );
}
