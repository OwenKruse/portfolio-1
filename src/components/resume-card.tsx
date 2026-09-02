"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ResumeCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  description?: string;
}

export const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  badges,
  period,
  description,
}: ResumeCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Card className="group rounded-none border-0 border-b border-border bg-transparent py-6">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-5">
        <Avatar className="size-11 rounded-none border border-border bg-white p-1.5">
          <AvatarImage
            src={logoUrl}
            alt={altText}
            className="object-contain"
          />
          <AvatarFallback className="rounded-none">{altText[0]}</AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-medium leading-5">{title}</h4>
            {badges?.map((badge) => (
              <Badge
                variant="secondary"
                className="rounded-none px-1.5 py-0 font-mono text-[9px] font-normal"
                key={badge}
              >
                {badge}
              </Badge>
            ))}
          </div>
          {subtitle ? (
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="col-start-2 flex items-center justify-between gap-4 sm:col-start-3 sm:row-start-1 sm:justify-end">
          <span className="font-mono text-[9px] uppercase leading-4 tracking-[0.08em] text-muted-foreground sm:max-w-36 sm:text-right">
            {period}
          </span>
          {description ? (
            <button
              type="button"
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? "Hide" : "Show"} details for ${title}`}
              onClick={() => setIsExpanded((value) => !value)}
              className="grid size-8 shrink-0 place-items-center border border-border transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Plus
                className={cn(
                  "size-3.5 transition-transform duration-200",
                  isExpanded && "rotate-45",
                )}
              />
            </button>
          ) : href ? (
            <Link
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              aria-label={`Visit ${title}`}
              className="grid size-8 shrink-0 place-items-center border border-border transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowUpRight className="size-3.5" />
            </Link>
          ) : null}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {description && isExpanded ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-4 pt-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:pl-16">
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                {description}
              </p>
              {href && href !== "#" ? (
                <Link
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="inline-flex h-fit items-center gap-1.5 text-xs underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                >
                  Visit company
                  <ArrowUpRight className="size-3.5" />
                </Link>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Card>
  );
};
