"use client"

import { motion } from "framer-motion"
import {
  Fingerprint,
  FileSignature,
  ArrowRight,
  Keyboard,
  ListChecks,
  LayoutGrid,
  Highlighter,
  CreditCard,
  Activity,
  MessageSquareQuote,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TouchID } from "@/components/touch-id"
import { TransactionCard } from "@/components/transaction-card"
import { TextHighlight } from "@/components/text-highlight"
import { KeyboardKey } from "@/components/keyboard-key"
import { TaskCard } from "@/components/task-card"
import { KanbanBoard } from "@/components/kanban-board"
import { PricingCard } from "@/components/pricing-card"
import { ActivityFeed } from "@/components/activity-feed"
import { TestimonialCard } from "@/components/testimonial-card"
import type { TaskItem } from "@/components/task-card"
import type { KanbanBoardData } from "@/components/kanban-board"

const kanbanPreview: KanbanBoardData = {
  columns: [
    { id: "progress", title: "In Progress", accent: "violet" },
    { id: "review", title: "Review", accent: "emerald", emptyText: "Drop here" },
  ],
  cards: [
    {
      id: "design-system",
      columnId: "progress",
      title: "Refresh design system",
      label: { text: "Design", color: "violet" },
      assignee: { name: "Maya" },
      description: "Update spacing + type scale.",
      order: 1,
    },
    {
      id: "analytics",
      columnId: "review",
      title: "Ship analytics tags",
      label: { text: "Release", color: "emerald" },
      assignee: { name: "Alex" },
      description: "Verify tracking coverage.",
      order: 1,
    },
  ],
}

const taskPreviewItems: TaskItem[] = [
  {
    id: "task-1",
    title: "Finalize homepage hero",
    description: "Adjust layout + primary CTA.",
    status: "active",
    badge: { text: "Design", tone: "violet" },
    meta: "Today",
    metaTone: "primary",
    assignee: { name: "Sam" },
  },
  {
    id: "task-2",
    title: "QA checkout flow",
    description: "Test on mobile breakpoints.",
    status: "pending",
    badge: { text: "QA", tone: "zinc" },
    meta: "Thu",
    metaTone: "default",
    assignee: { name: "Jordan" },
  },
]

const components = [
  {
    title: "Touch ID",
    description: "Realistic biometric authentication component with smooth animations and customizable feedback.",
    href: "/ui/touch-id",
    icon: Fingerprint,
    color: "bg-blue-500/10 text-blue-500",
    preview: (
      <div className="flex items-center justify-center rounded-2xl bg-muted/40 p-6">
        <TouchID size="sm" />
      </div>
    ),
  },
  {
    title: "Transaction Signing",
    description: "High-precision signature pad for secure authorizations with glassmorphism aesthetics.",
    href: "/ui/signing",
    icon: FileSignature,
    color: "bg-purple-500/10 text-purple-500",
    preview: (
      <div className="flex items-center justify-center rounded-2xl bg-muted/40">
        <TransactionCard
          id="INV-1824"
          amount="$8,420.00"
          dueDate="Due in 6 days"
          className=""
        />
      </div>
    ),
  },
  {
    title: "Text Highlighting",
    description: "Collaborative text highlighting with floating badges and smooth animations.",
    href: "/ui/text-highlight",
    icon: Highlighter,
    color: "bg-emerald-500/10 text-emerald-500",
    preview: (
      <div className="rounded-2xl bg-muted/40 p-6 text-sm text-foreground">
        <p className="leading-relaxed">
          Build in{" "}
          <TextHighlight color="emerald" content="Ava">
            real-time highlights
          </TextHighlight>{" "}
          for docs, reviews, and product notes.
        </p>
      </div>
    ),
  },
  {
    title: "Keyboard Key",
    description: "Keycap component with support for symbols, icons, and custom layouts.",
    href: "/ui/keyboard-key",
    icon: Keyboard,
    color: "bg-slate-500/10 text-slate-600",
    preview: (
      <div className="flex items-center justify-center gap-3 rounded-2xl bg-muted/40 p-6">
        <KeyboardKey size="sm">K</KeyboardKey>
        <KeyboardKey size="md">Shift</KeyboardKey>
        <KeyboardKey size="sm">Enter</KeyboardKey>
      </div>
    ),
  },
  {
    title: "Task Card",
    description: "Task list card with variants, density, and event hooks.",
    href: "/ui/task-card",
    icon: ListChecks,
    color: "bg-rose-500/10 text-rose-500",
    preview: (
      <div className="rounded-2xl bg-muted/40 p-6">
        <TaskCard
          title="Team Tasks"
          subtitle="Weekly priorities"
          items={taskPreviewItems}
          size="sm"
          variant="soft"
        />
      </div>
    ),
  },
  {
    title: "Kanban Board",
    description: "Drag and drop board with variants, density, and polished card styling.",
    href: "/ui/kanban",
    icon: LayoutGrid,
    color: "bg-indigo-500/10 text-indigo-500",
    span: "lg:col-span-2",
    preview: (
      <div className="rounded-2xl bg-muted/40 p-6">
        <KanbanBoard
          initialData={kanbanPreview}
          size="sm"
          variant="minimal"
          className="border-0 bg-transparent p-0"
          columnClassName="min-w-[13rem] max-w-[15rem]"
        />
      </div>
    ),
  },
  {
    title: "Pricing Card",
    description: "Premium billing or tier section block with scaling and gradient hover effects.",
    href: "/ui/pricing-card",
    icon: CreditCard,
    color: "bg-blue-500/10 text-blue-500",
    preview: (
      <div className="flex justify-center rounded-2xl bg-muted/40 p-6 overflow-hidden">
        <div className="scale-[0.80] origin-top w-full max-w-[320px]">
          <PricingCard
            title="Pro"
            price="$29"
            description="Everything to scale."
            features={[
              { name: "Unlimited projects", included: true },
              { name: "Advanced analytics", included: true }
            ]}
            isPopular
          />
        </div>
      </div>
    ),
  },
  {
    title: "Activity Feed",
    description: "Timeline/log block to render user actions like commits or deploys.",
    href: "/ui/activity-feed",
    icon: Activity,
    color: "bg-amber-500/10 text-amber-500",
    preview: (
      <div className="flex justify-center rounded-2xl bg-muted/40 p-6 overflow-hidden">
        <div className="scale-[0.80] origin-top w-full">
          <ActivityFeed 
            title="Notifications" 
            activities={[
              {
                id: "1",
                type: "commit",
                user: { name: "Alice" },
                content: "pushed to main",
                timestamp: "Just now",
              },
              {
                id: "2",
                type: "comment",
                user: { name: "Bob" },
                content: "Looks great!",
                timestamp: "2h ago",
              }
            ]} 
          />
        </div>
      </div>
    ),
  },
  {
    title: "Testimonial Card",
    description: "Elegant review card with glass aesthetics and hover gestures.",
    href: "/ui/testimonial-card",
    icon: MessageSquareQuote,
    color: "bg-pink-500/10 text-pink-500",
    preview: (
      <div className="flex justify-center rounded-2xl bg-muted/40 p-6 overflow-hidden">
        <div className="scale-[0.80] origin-top w-full max-w-[400px]">
          <TestimonialCard
            testimonial={{
              id: "1",
              content: "Beautifully crafted UI components.",
              author: {
                name: "Sarah",
                role: "Designer",
                company: "Acme",
              }
            }}
          />
        </div>
      </div>
    ),
  },
]

export default function UIPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="space-y-2">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight"
        >
          UI Components
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-lg"
        >
          Explore a collection of premium, interactive components built with Framer Motion and Shadcn/UI.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {components.map((component, index) => (
          <motion.div
            key={component.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={component.span ?? ""}
          >
            <Card className="border border-border/60 bg-background/60 shadow-sm backdrop-blur transition-colors p-4">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div
                      className={`w-12 h-12 rounded-lg ${component.color} flex items-center justify-center`}
                    >
                      <component.icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{component.title}</CardTitle>
                      <CardDescription>{component.description}</CardDescription>
                    </div>
                  </div>
                  <Link
                    href={component.href}
                    className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                  >
                    View
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {component.preview}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
