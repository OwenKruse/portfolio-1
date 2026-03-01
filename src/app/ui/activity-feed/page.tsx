"use client";

import { ActivityFeed, ActivityItem } from "@/components/activity-feed";
import { motion } from "framer-motion";
import { CodeBlock } from "@/components/ui/code-block";

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "commit",
    user: { name: "Alice", avatar: "https://i.pravatar.cc/150?u=a" },
    content: "feat: add pricing card component",
    project: "portfolio-1",
    timestamp: "2 mins ago",
  },
  {
    id: "2",
    type: "comment",
    user: { name: "Bob", avatar: "https://i.pravatar.cc/150?u=b" },
    content: "Looks great! Just approved the PR.",
    timestamp: "1 hour ago",
  },
  {
    id: "3",
    type: "deploy",
    user: { name: "System" },
    content: "Production deployment successful",
    project: "api-service",
    timestamp: "3 hours ago",
  },
];

const simpleActivities: ActivityItem[] = [
  {
    id: "4",
    type: "issue",
    user: { name: "Charlie" },
    content: "Opened an issue: Bug in Safari",
    timestamp: "Yesterday",
  }
];

export default function ActivityFeedPage() {
  return (
    <div className="w-full flex flex-col items-center py-12">
      <div className="max-w-xl w-full flex flex-col items-center gap-12">
        <div className="text-center space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight"
          >
            Activity Feed
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            A timeline and log block to render chronological user actions.
          </motion.p>
        </div>

        <div className="w-full relative mt-8">
          <ActivityFeed activities={activities} />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full space-y-12"
        >
          {/* Variants Section */}
          <div className="space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Variants & States</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start justify-items-center bg-muted/30 p-8 rounded-3xl border border-border/50">
              <div className="flex flex-col gap-4 w-full">
                <ActivityFeed 
                  title="System Logs" 
                  activities={activities.slice(2)} 
                  className="max-w-sm scale-90 -mx-4"
                />
                <span className="text-xs font-medium text-muted-foreground text-center">System Events</span>
              </div>
              <div className="flex flex-col gap-4 w-full">
                <ActivityFeed 
                  title="User Mentions" 
                  activities={simpleActivities} 
                  className="max-w-sm scale-90 -mx-4"
                />
                <span className="text-xs font-medium text-muted-foreground text-center">User Issues</span>
              </div>
            </div>
          </div>

          {/* npx link */}
          <CodeBlock 
            language="bash"
            filename="Terminal"
            code="npx shadcn@latest add activity-feed"
          />

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Usage</h2>
            <CodeBlock 
              language="tsx"
              filename="MyPage.tsx"
              code={`import { ActivityFeed } from "@/components/activity-feed";

const logs = [
  {
    id: "1",
    type: "commit" as const,
    user: { name: "Alice", avatar: "/avatar.png" },
    content: "pushed to main",
    timestamp: "Just now",
  }
];

export default function MyPage() {
  return (
    <ActivityFeed 
      title="Recent Changes" 
      activities={logs} 
    />
  );
}`}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
