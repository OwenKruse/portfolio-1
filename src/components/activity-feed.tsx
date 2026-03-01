"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, ArrowUpRight, Clock, MessageSquare, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type ActivityType = "commit" | "comment" | "deploy" | "issue";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  user: {
    name: string;
    avatar?: string;
  };
  content: string;
  project?: string;
  timestamp: string;
}

export interface ActivityFeedProps {
  title?: string;
  activities: ActivityItem[];
  className?: string;
}

const typeConfig: Record<ActivityType, { icon: React.ElementType; color: string; bg: string }> = {
  commit: { icon: ArrowUpRight, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  comment: { icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
  deploy: { icon: Activity, color: "text-violet-500", bg: "bg-violet-500/10" },
  issue: { icon: Plus, color: "text-amber-500", bg: "bg-amber-500/10" },
};

export function ActivityFeed({ title = "Recent Activity", activities, className }: ActivityFeedProps) {
  return (
    <div className={cn("w-full max-w-md rounded-[32px] border border-border/60 bg-white/50 p-6 backdrop-blur-xl dark:bg-zinc-950/50 dark:border-zinc-800 shadow-sm", className)}>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-semibold tracking-tight text-zinc-900 dark:text-white">{title}</h3>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="space-y-6">
        {activities.map((activity, index) => {
          const config = typeConfig[activity.type];
          const Icon = config.icon;

          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={activity.id}
              className="group relative flex gap-4"
            >
              {/* Connecting line */}
              {index !== activities.length - 1 && (
                <div className="absolute left-[19px] top-10 bottom-[-24px] w-px bg-border/50 group-hover:bg-border transition-colors" />
              )}

              <div className="relative z-10">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm dark:border-zinc-950">
                  <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                  <AvatarFallback className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {activity.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className={cn("absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white dark:border-zinc-950", config.bg)}>
                  <Icon className={cn("h-2 w-2", config.color)} strokeWidth={3} />
                </div>
              </div>

              <div className="flex flex-col pt-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {activity.user.name}
                  <span className="font-normal text-muted-foreground ml-1">
                    {activity.type === "commit" && "pushed to"}
                    {activity.type === "comment" && "commented on"}
                    {activity.type === "deploy" && "deployed"}
                    {activity.type === "issue" && "opened an issue"}
                  </span>
                  {activity.project && (
                    <span className="font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                      {activity.project}
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {activity.content}
                </p>
                <span className="mt-2 text-xs text-muted-foreground">{activity.timestamp}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
