"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Testimonial {
  id: string;
  content: string;
  author: {
    name: string;
    role: string;
    company: string;
    avatar?: string;
  };
}

export interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative flex w-full max-w-lg flex-col justify-between overflow-hidden rounded-[32px] border border-border/50 bg-white/40 p-8 shadow-sm backdrop-blur-md dark:bg-zinc-900/40 dark:border-zinc-800",
        className
      )}
    >
      <div className="absolute -right-6 -top-6 text-zinc-100/50 dark:text-zinc-800/50">
        <Quote className="h-32 w-32 rotate-12" />
      </div>

      <div className="relative z-10 mb-8">
        <div className="mb-4 text-amber-500 flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className="h-4 w-4 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
        <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
          "{testimonial.content}"
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-white shadow-sm dark:border-zinc-800">
          <AvatarImage src={testimonial.author.avatar} alt={testimonial.author.name} />
          <AvatarFallback className="bg-zinc-100 font-semibold text-zinc-700">
            {testimonial.author.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold tracking-tight text-zinc-900 dark:text-white">
            {testimonial.author.name}
          </span>
          <span className="text-sm text-muted-foreground">
            {testimonial.author.role} at <span className="text-zinc-900 dark:text-zinc-300 font-medium">{testimonial.author.company}</span>
          </span>
        </div>
      </div>
      
      {/* Decorative gradient blur */}
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-rose-500/10 blur-3xl" />
    </motion.div>
  );
}
