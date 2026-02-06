"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface TextHighlightProps {
  /**
   * The text content to be highlighted.
   */
  children: React.ReactNode;
  /**
   * The color theme for the highlight and badge.
   * @default "indigo"
   */
  color?: "indigo" | "emerald" | "amber" | "rose" | "blue" | "violet" | "cyan" | "orange";
  /**
   * URL for the avatar logo.
   * @default "https://github.com/github.png"
   */
  logo?: string;
  /**
   * The name or content to display in the badge.
   * @default "John Doe"
   */
  content?: string;
  /**
   * Additional classes for the wrapper.
   */
  className?: string;
  /**
   * Whether to show the floating badge.
   * @default true
   */
  showBadge?: boolean;
  /**
   * Whether to show a blinking cursor at the end.
   * @default false
   */
  showCursor?: boolean;
  /**
   * Delay before the highlight appears (in seconds).
   * @default 0
   */
  delay?: number;
}

const colorMap: Record<string, { bg: string; text: string; badge: string; cursor: string; hex: string }> = {
  indigo: {
    bg: "rgba(99, 102, 241, 0.2)",
    text: "text-indigo-600 dark:text-indigo-400",
    badge: "bg-indigo-600",
    cursor: "bg-indigo-600",
    hex: "#4f46e5",
  },
  emerald: {
    bg: "rgba(16, 185, 129, 0.2)",
    text: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-600",
    cursor: "bg-emerald-600",
    hex: "#059669",
  },
  amber: {
    bg: "rgba(245, 158, 11, 0.2)",
    text: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-600",
    cursor: "bg-amber-600",
    hex: "#d97706",
  },
  rose: {
    bg: "rgba(244, 63, 94, 0.2)",
    text: "text-rose-600 dark:text-rose-400",
    badge: "bg-rose-600",
    cursor: "bg-rose-600",
    hex: "#e11d48",
  },
  blue: {
    bg: "rgba(59, 130, 246, 0.2)",
    text: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-600",
    cursor: "bg-blue-600",
    hex: "#2563eb",
  },
  violet: {
    bg: "rgba(139, 92, 246, 0.2)",
    text: "text-violet-600 dark:text-violet-400",
    badge: "bg-violet-600",
    cursor: "bg-violet-600",
    hex: "#7c3aed",
  },
  cyan: {
    bg: "rgba(6, 182, 212, 0.2)",
    text: "text-cyan-600 dark:text-cyan-400",
    badge: "bg-cyan-600",
    cursor: "bg-cyan-600",
    hex: "#0891b2",
  },
  orange: {
    bg: "rgba(249, 115, 22, 0.2)",
    text: "text-orange-600 dark:text-orange-400",
    badge: "bg-orange-600",
    cursor: "bg-orange-600",
    hex: "#ea580c",
  },
};

/**
 * A premium text highlighting component that wraps text and adds a collaborator-style badge.
 * Optimized for multi-line support.
 */
export function TextHighlight({
  children,
  color = "indigo",
  logo = "https://github.com/github.png",
  content = "John Doe",
  className,
  showBadge = true,
  showCursor = false,
  delay = 0,
}: TextHighlightProps) {
  const styles = colorMap[color] || colorMap.indigo;

  return (
    <motion.span
      initial={{ backgroundSize: "0% 100%" }}
      animate={{ backgroundSize: "100% 100%" }}
      transition={{ 
        duration: 0.8, 
        delay: delay,
        ease: [0.16, 1, 0.3, 1] 
      }}
      className={cn(
        "relative inline decoration-clone bg-no-repeat px-1 py-0.5 rounded-sm transition-colors duration-300",
        styles.text,
        className
      )}
      style={{
        backgroundImage: `linear-gradient(${styles.bg}, ${styles.bg})`,
        backgroundPosition: "left center",
      }}
    >
      {children}

      {/* Anchor for Badge and Cursor */}
      <span className="relative inline-block w-0 h-0 align-middle">
        {/* Blinking Cursor */}
        {showCursor && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ 
              duration: 0.8, 
              repeat: Infinity, 
              delay: delay + 0.5 
            }}
            className={cn(
              "absolute left-0 -top-3 bottom-0 w-[2px] h-6 z-20",
              styles.cursor
            )}
          />
        )}

        {/* Floating Badge */}
        <AnimatePresence>
          {showBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 5 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25,
                delay: delay + 0.3 
              }}
              className={cn(
                "absolute left-1 -top-8 flex items-center gap-1.5 px-2 py-0.5 rounded-md text-white whitespace-nowrap z-30 shadow-lg select-none pointer-events-none origin-bottom-left border border-white/10",
                styles.badge
              )}
            >
              <Avatar className="w-3.5 h-3.5 rounded-sm ring-1 ring-white/20">
                <AvatarImage src={logo} className="object-cover" />
                <AvatarFallback className="text-[8px] bg-white/20 leading-none flex items-center justify-center font-bold">
                  {content[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-[10px] font-bold leading-none tracking-tight">{content}</span>
              
             
            </motion.div>
          )}
        </AnimatePresence>
      </span>
    </motion.span>
  );
}

