
"use client";

import { motion } from "framer-motion";
import { KanbanBoard } from "@/components/kanban-board";
import { CodeBlock } from "@/components/ui/code-block";

const primaryBoard = {
  columns: [
    { id: "in-progress", title: "In Progress", accent: "slate" },
    {
      id: "ready-review",
      title: "Ready for Review",
      accent: "emerald",
      emptyText: "Drop here",
    },
  ],
  cards: [
    {
      id: "auth-flow",
      columnId: "in-progress",
      title: "Implement user authentication flow",
      label: { text: "Feature", color: "violet" },
      assignee: {
        name: "Shadcn",
        avatar: "https://avatars.githubusercontent.com/u/124599?v=4",
      },
      description: "Add OAuth, session handling, and new onboarding steps.",
      dueDate: "This week",
      order: 1,
    },
    {
      id: "db-queries",
      columnId: "in-progress",
      title: "Optimize database queries",
      label: { text: "Perf", color: "amber" },
      assignee: {
        name: "Meschac Irung",
        avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=80&h=80&q=80",
      },
      description: "Reduce response times across analytics endpoints.",
      dueDate: "Jan 12",
      order: 2,
    },
  ],
};

const statusBoard = {
  columns: [
    { id: "todo", title: "To Do", accent: "blue" },
    { id: "in-progress", title: "In Progress", accent: "amber" },
    { id: "done", title: "Done", accent: "emerald" },
  ],
  cards: [
    {
      id: "dark-mode",
      columnId: "todo",
      title: "Add dark mode toggle",
      label: { text: "Feature", color: "blue" },
      assignee: {
        name: "Mila",
        avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=facearea&w=80&h=80&q=80",
      },
      dueDate: "Jan 8",
      order: 1,
    },
    {
      id: "login-redirect",
      columnId: "todo",
      title: "Fix login redirect",
      label: { text: "Bug", color: "rose" },
      assignee: {
        name: "Andre",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=80&h=80&q=80",
      },
      dueDate: "Jan 5",
      order: 2,
    },
    {
      id: "dashboard-ui",
      columnId: "in-progress",
      title: "Update dashboard UI",
      label: { text: "Design", color: "violet" },
      assignee: {
        name: "Nora",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=80&h=80&q=80",
      },
      dueDate: "Jan 6",
      order: 1,
    },
    {
      id: "pipeline",
      columnId: "done",
      title: "Setup CI/CD pipeline",
      label: { text: "Done", color: "emerald" },
      assignee: {
        name: "Erik",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&w=80&h=80&q=80",
      },
      dueDate: "Jan 3",
      order: 1,
    },
  ],
};

export default function KanbanPage() {
  return (
    <div className="flex flex-col gap-14 py-12">
      <div className="flex flex-col gap-2 px-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold tracking-tight"
        >
          Kanban Board
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-lg"
        >
          A premium drag and drop task management component built with Framer
          Motion.
        </motion.p>
      </div>

      <div className="px-6 md:px-10">
        <KanbanBoard initialData={primaryBoard} />
      </div>

      <div className="space-y-6 px-6 md:px-10">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Variants
          </h2>
          <p className="text-sm text-muted-foreground">
            Switch between layouts to match the density and tone of your
            dashboard.
          </p>
        </div>
        <div className="space-y-6">
          <KanbanBoard initialData={statusBoard} variant="soft" />
          <KanbanBoard initialData={statusBoard} variant="minimal" />
          <KanbanBoard initialData={statusBoard} variant="glass" />
        </div>
      </div>

      <div className="space-y-10 px-6 md:px-10">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Variants & Sizes
          </h2>
          <p className="text-sm text-muted-foreground">
            Three visual variants and three density sizes to fit dashboards and
            product surfaces.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-background p-5 shadow-sm">
            <h3 className="text-sm font-semibold">Variants</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">soft</span> ·
              <span className="font-medium text-foreground"> minimal</span> ·
              <span className="font-medium text-foreground"> glass</span>
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background p-5 shadow-sm">
            <h3 className="text-sm font-semibold">Sizes</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">sm</span> ·
              <span className="font-medium text-foreground"> md</span> ·
              <span className="font-medium text-foreground"> lg</span>
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background p-5 shadow-sm">
            <h3 className="text-sm font-semibold">Drag Behavior</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Drop indicators, column glow, and spring motion are enabled by
              default.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-6 md:px-10">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Usage
          </h2>
          <p className="text-sm text-muted-foreground">
            Import the component and provide a column + card model.
          </p>
        </div>
        <CodeBlock
          language="tsx"
          filename="KanbanExample.tsx"
          code={`import { KanbanBoard } from "@/components/kanban-board";

const data = {
  columns: [
    { id: "todo", title: "To Do", accent: "blue" },
    { id: "progress", title: "In Progress", accent: "amber" },
    { id: "done", title: "Done", accent: "emerald" },
  ],
  cards: [
    {
      id: "task-1",
      columnId: "todo",
      title: "Add filtering",
      label: { text: "Feature", color: "violet" },
      assignee: { name: "Mina" },
      dueDate: "Apr 12",
      order: 1,
    },
  ],
};

export default function KanbanExample() {
  return (
    <KanbanBoard
      initialData={data}
      variant="soft"
      size="md"
      onChange={(next) => console.log(next)}
    />
  );
}`}
        />
      </div>

      <div className="space-y-8 px-6 md:px-10">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Variant Examples
          </h2>
          <p className="text-sm text-muted-foreground">
            Switch tone and density with a single prop.
          </p>
        </div>
        <CodeBlock
          language="tsx"
          filename="Variants.tsx"
          code={`<KanbanBoard initialData={data} variant="soft" />
<KanbanBoard initialData={data} variant="minimal" />
<KanbanBoard initialData={data} variant="glass" />

<KanbanBoard initialData={data} size="sm" />
<KanbanBoard initialData={data} size="md" />
<KanbanBoard initialData={data} size="lg" />`}
        />
      </div>
    </div>
  );
}
