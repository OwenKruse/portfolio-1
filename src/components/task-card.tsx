"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { Check, Circle, Plus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type TaskCardVariant = "soft" | "minimal" | "glass";
export type TaskCardSize = "sm" | "md" | "lg";
export type TaskItemStatus = "pending" | "active" | "complete";
export type TaskItemTone =
  | "zinc"
  | "blue"
  | "violet"
  | "emerald"
  | "amber"
  | "rose";
export type TaskItemMetaTone = "default" | "primary" | "warning" | "success";

export interface TaskItemBadge {
  text: string;
  tone?: TaskItemTone;
}

export interface TaskItemAssignee {
  name: string;
  avatar?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status?: TaskItemStatus;
  meta?: string;
  metaTone?: TaskItemMetaTone;
  badge?: TaskItemBadge;
  assignee?: TaskItemAssignee;
}

export interface TaskCardProps {
  title: string;
  subtitle?: string;
  items: TaskItem[];
  variant?: TaskCardVariant;
  size?: TaskCardSize;
  className?: string;
  actionLabel?: string;
  emptyState?: string;
  onAdd?: () => void;
  onItemToggle?: (item: TaskItem, nextStatus: TaskItemStatus) => void;
  onItemClick?: (item: TaskItem) => void;
}

const cardVariants = cva(
  "w-full rounded-[32px] border border-border/60 px-6 py-5 shadow-sm",
  {
    variants: {
      variant: {
        soft:
          "border-zinc-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] dark:bg-zinc-950 dark:border-zinc-800",
        minimal: "bg-transparent border-border/40 shadow-none",
        glass:
          "bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-none",
      },
      size: {
        sm: "px-3 py-2",
        md: "px-4 py-4",
        lg: "px-7 py-6",
      },
    },
    defaultVariants: {
      variant: "soft",
      size: "md",
    },
  }
);

const itemVariants = cva(
  "flex items-center gap-3 rounded-[18px] transition-colors",
  {
    variants: {
      variant: {
        soft: "hover:bg-zinc-50 dark:hover:bg-zinc-900/70",
        minimal: "hover:bg-muted/40",
        glass: "hover:bg-white/70 dark:hover:bg-zinc-900/60",
      },
      size: {
        sm: "px-2 py-1.5",
        md: "px-3 py-2",
        lg: "px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "soft",
      size: "md",
    },
  }
);

const statusClasses: Record<TaskItemStatus, string> = {
  pending:
    "border-zinc-200 bg-transparent text-transparent dark:border-zinc-800",
  active:
    "border-emerald-500 bg-emerald-50 text-emerald-500 dark:border-emerald-400 dark:bg-emerald-400/10",
  complete:
    "border-emerald-500 bg-emerald-500 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-zinc-900",
};

const badgeToneClasses: Record<TaskItemTone, string> = {
  zinc:
    "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-500/20 dark:text-zinc-200 dark:border-zinc-500/30",
  blue: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-200 dark:border-blue-500/30",
  violet:
    "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-500/20 dark:text-violet-200 dark:border-violet-500/30",
  emerald:
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500/30",
  amber:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-500/30",
  rose: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-200 dark:border-rose-500/30",
};

const metaToneClasses: Record<TaskItemMetaTone, string> = {
  default: "text-muted-foreground",
  primary: "text-blue-600 dark:text-blue-400",
  warning: "text-amber-600 dark:text-amber-400",
  success: "text-emerald-600 dark:text-emerald-400",
};

const sizeLabelClasses: Record<TaskCardSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-sm",
};

const sizeTitleClasses: Record<TaskCardSize, string> = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

export function TaskCard({
  title,
  subtitle,
  items,
  variant = "soft",
  size = "md",
  className,
  actionLabel = "",
  emptyState = "No tasks yet.",
  onAdd,
  onItemToggle,
  onItemClick,
}: TaskCardProps) {
  return (
    <div className={cn(cardVariants({ variant, size }), "bg-zinc-50/50", className)}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="space-y-0.5">
          <h3 className={cn("font-bold tracking-tight text-zinc-900 dark:text-white", sizeTitleClasses[size])}>
            {title}
          </h3>
          {subtitle ? (
            <p className={cn("text-muted-foreground", sizeLabelClasses[size])}>
              {subtitle}
            </p>
          ) : null}
        </div>
        {onAdd ? (
          <button
            type="button"
            onClick={onAdd}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-200/50 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <Plus className="h-5 w-5" />
            {actionLabel}
          </button>
        ) : null}
      </div>

      <div className="space-y-3 bg-white p-3 rounded-[24px] border border-zinc-100 shadow-sm dark:bg-zinc-950 dark:border-zinc-800">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
            {emptyState}
          </div>
        ) : null}
        {items.map((item) => {
          const status = item.status ?? "pending";
          const isComplete = status === "complete";
          const onToggle = onItemToggle
            ? () =>
                onItemToggle(
                  item,
                  status === "complete" ? "pending" : "complete"
                )
            : undefined;

          return (
            <div
              key={item.id}
              className={cn(
                itemVariants({ variant, size }),
                isComplete || status === "active" ? "bg-zinc-50/80 dark:bg-zinc-900/40" : ""
              )}
            >
              <button
                type="button"
                onClick={onToggle}
                disabled={!onItemToggle}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border transition-colors",
                  statusClasses[status],
                  !onItemToggle && "cursor-default"
                )}
                aria-label={
                  isComplete ? "Mark task incomplete" : "Mark task complete"
                }
              >
                {isComplete ? (
                  <Check className="h-3 w-3 stroke-[3]" />
                ) : (
                  <Circle className="h-3 w-3 text-transparent" />
                )}
              </button>

              {onItemClick ? (
                <button
                  type="button"
                  onClick={() => onItemClick(item)}
                  className="flex flex-1 items-center justify-between gap-4 text-left"
                >
                  <div className="space-y-0.5">
                    <p
                      className={cn(
                        "text-[15px] font-medium text-zinc-700 dark:text-zinc-200",
                        isComplete && "text-zinc-400 line-through dark:text-zinc-500"
                      )}
                    >
                      {item.title}
                    </p>
                    {item.description ? (
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    {item.badge ? (
                      <Badge
                        variant="secondary"
                        className={cn(
                          "border text-[10px] font-semibold uppercase tracking-wide",
                          badgeToneClasses[item.badge.tone ?? "zinc"]
                        )}
                      >
                        {item.badge.text}
                      </Badge>
                    ) : null}
                    {item.meta ? (
                      <span
                        className={cn(
                          "text-sm font-normal text-zinc-500",
                          isComplete && "text-zinc-400",
                          metaToneClasses[item.metaTone ?? "default"]
                        )}
                      >
                        {item.meta}
                      </span>
                    ) : null}
                    {item.assignee ? (
                      <Avatar className="h-7 w-7 border border-border/60">
                        {item.assignee.avatar ? (
                          <AvatarImage
                            src={item.assignee.avatar}
                            alt={item.assignee.name}
                          />
                        ) : null}
                        <AvatarFallback className="text-[10px]">
                          {item.assignee.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : null}
                  </div>
                </button>
              ) : (
                <div className="flex flex-1 items-center justify-between gap-4 text-left">
                  <div className="space-y-0.5">
                    <p
                      className={cn(
                        "text-[15px] font-medium text-zinc-700 dark:text-zinc-200",
                        isComplete && "text-zinc-400 line-through dark:text-zinc-500"
                      )}
                    >
                      {item.title}
                    </p>
                    {item.description ? (
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    {item.badge ? (
                      <Badge
                        variant="secondary"
                        className={cn(
                          "border text-[10px] font-semibold uppercase tracking-wide",
                          badgeToneClasses[item.badge.tone ?? "zinc"]
                        )}
                      >
                        {item.badge.text}
                      </Badge>
                    ) : null}
                    {item.meta ? (
                      <span
                        className={cn(
                          "text-sm font-normal text-zinc-500",
                          isComplete && "text-zinc-400",
                          metaToneClasses[item.metaTone ?? "default"]
                        )}
                      >
                        {item.meta}
                      </span>
                    ) : null}
                    {item.assignee ? (
                      <Avatar className="h-7 w-7 border border-border/60">
                        {item.assignee.avatar ? (
                          <AvatarImage
                            src={item.assignee.avatar}
                            alt={item.assignee.name}
                          />
                        ) : null}
                        <AvatarFallback className="text-[10px]">
                          {item.assignee.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
