"use client";

import React from "react";
import { Check, Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PricingFeature {
  name: string;
  included: boolean;
}

export interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: PricingFeature[];
  isPopular?: boolean;
  buttonText?: string;
  onSubscribe?: () => void;
  className?: string;
}

export function PricingCard({
  title,
  price,
  description,
  features,
  isPopular = false,
  buttonText = "Get Started",
  onSubscribe,
  className,
}: PricingCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={cn(
        "relative w-full max-w-sm rounded-[32px] border p-8 backdrop-blur-xl transition-all",
        isPopular
          ? "border-blue-500/50 bg-gradient-to-b from-blue-500/10 to-transparent shadow-[0_0_40px_rgba(59,130,246,0.15)] dark:from-blue-900/20"
          : "border-border/60 bg-white/50 shadow-sm dark:bg-zinc-950/50 dark:border-zinc-800",
        className
      )}
    >
      {isPopular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-1 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            <Star className="h-3 w-3 fill-current" />
            Most Popular
          </div>
        </div>
      )}

      <div className="mb-6 space-y-2">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="mb-6 flex items-baseline gap-2">
        <span className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">{price}</span>
        {price !== "Free" && price !== "Custom" && <span className="text-sm text-muted-foreground">/mo</span>}
      </div>

      <ul className="mb-8 space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                feature.included
                  ? isPopular
                    ? "bg-blue-500 text-white"
                    : "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
              )}
            >
              <Check className="h-3 w-3 stroke-[3]" />
            </div>
            <span
              className={cn(
                "text-sm font-medium",
                feature.included ? "text-zinc-700 dark:text-zinc-300" : "text-muted-foreground line-through"
              )}
            >
              {feature.name}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSubscribe}
        className={cn(
          "w-full rounded-[16px] py-3 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]",
          isPopular
            ? "bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-500/25"
            : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        )}
      >
        {buttonText}
      </button>
    </motion.div>
  );
}
