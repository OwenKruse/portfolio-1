"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TaskCard } from "@/components/task-card";
import type { TaskItem, TaskItemStatus } from "@/components/task-card";
import { CodeBlock } from "@/components/ui/code-block";

const meetingSeed: TaskItem[] = [
  {
    id: "agenda-1",
    title: "Review Q4 metrics",
    status: "complete",
    meta: "10 min",
  },
  {
    id: "agenda-2",
    title: "Discuss roadmap updates",
    status: "complete",
    meta: "15 min",
  },
  {
    id: "agenda-3",
    title: "Team announcements",
    status: "pending",
    meta: "5 min",
  },
  {
    id: "agenda-4",
    title: "Open discussion",
    status: "pending",
    meta: "10 min",
  },
];

const actionSeed: TaskItem[] = [
  {
    id: "action-1",
    title: "Update project timeline",
    status: "pending",
    meta: "Today",
    metaTone: "warning",
    assignee: {
      name: "Alex Chan",
      avatar:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=facearea&w=64&h=64&q=80",
    },
  },
  {
    id: "action-2",
    title: "Share design mockups",
    status: "pending",
    meta: "Tomorrow",
    assignee: {
      name: "Riley Park",
      avatar:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=64&h=64&q=80",
    },
  },
  {
    id: "action-3",
    title: "Review PRs",
    status: "complete",
    meta: "Done",
    metaTone: "success",
    assignee: {
      name: "Jordan Hill",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&w=64&h=64&q=80",
    },
  },
];

export default function TaskCardPage() {
  const [meetingItems, setMeetingItems] = useState<TaskItem[]>(meetingSeed);
  const [actionItems, setActionItems] = useState<TaskItem[]>(actionSeed);
  const [lastEvent, setLastEvent] = useState("Ready.");

  const meetingToggle = (item: TaskItem, nextStatus: TaskItemStatus) => {
    setMeetingItems((prev) =>
      prev.map((entry) =>
        entry.id === item.id ? { ...entry, status: nextStatus } : entry
      )
    );
    setLastEvent(`Meeting agenda: ${item.title}`);
  };

  const actionToggle = (item: TaskItem, nextStatus: TaskItemStatus) => {
    setActionItems((prev) =>
      prev.map((entry) =>
        entry.id === item.id ? { ...entry, status: nextStatus } : entry
      )
    );
    setLastEvent(`Action item updated: ${item.title}`);
  };

  const handleAdd = () => {
    const newItem: TaskItem = {
      id: `action-${Date.now()}`,
      title: "Draft launch plan",
      status: "pending",
      meta: "Next week",
      badge: { text: "New", tone: "violet" },
    };
    setActionItems((prev) => [newItem, ...prev]);
    setLastEvent("Added a new action item.");
  };

  const usageCode = useMemo(
    () => `import { TaskCard } from "@/components/task-card";

const items = [
  { id: "task-1", title: "Update kickoff deck", status: "pending", meta: "Today" },
  { id: "task-2", title: "Send recap email", status: "complete", meta: "Done" },
];

export default function TaskCardExample() {
  return (
    <TaskCard
      title="Action Items"
      subtitle="Weekly standup"
      items={items}
      variant="soft"
      size="md"
      onItemToggle={(item, next) => console.log(item, next)}
      onAdd={() => console.log("Add item")}
    />
  );
}`,
    []
  );

  return (
    <div className="flex flex-col gap-12 py-10">
      <div className="space-y-2 px-2">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold tracking-tight"
        >
          Task Card
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          A task list card with variants, density controls, and event hooks.
        </motion.p>
      </div>

      <div className="grid gap-8 px-2 lg:grid-cols-2">
        <TaskCard
          title="Meeting Agenda"
          subtitle="Sync - Tuesday 9:00 AM"
          items={meetingItems}
          onItemToggle={meetingToggle}
          onItemClick={(item) => setLastEvent(`Agenda clicked: ${item.title}`)}
        />
        <TaskCard
          title="Action Items"
          subtitle="Assigned today"
          items={actionItems}
          onItemToggle={actionToggle}
          onItemClick={(item) => setLastEvent(`Action clicked: ${item.title}`)}
          onAdd={handleAdd}
          actionLabel=""
        />
      </div>

      <div className="px-2 text-sm text-muted-foreground">
        Last event: <span className="font-medium text-foreground">{lastEvent}</span>
      </div>

      <div className="space-y-6 px-2">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Variants
          </h2>
          <p className="text-sm text-muted-foreground">
            Switch tone and density to match your dashboard layout.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <TaskCard
            title="Soft"
            subtitle="Default"
            items={meetingItems.slice(0, 2)}
            variant="soft"
            size="sm"
          />
          <TaskCard
            title="Minimal"
            subtitle="Borderless"
            items={meetingItems.slice(1, 3)}
            variant="minimal"
            size="sm"
          />
          <TaskCard
            title="Glass"
            subtitle="Backdrop blur"
            items={meetingItems.slice(2, 4)}
            variant="glass"
            size="sm"
          />
        </div>
      </div>

      <div className="space-y-6 px-2">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Usage
          </h2>
        </div>
        <CodeBlock language="tsx" filename="TaskCardExample.tsx" code={usageCode} />
      </div>
    </div>
  );
}
