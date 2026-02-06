"use client"

import { motion } from "framer-motion"
import { Globe } from "lucide-react"

import { KeyboardKey } from "@/components/keyboard-key"
import { CodeBlock } from "@/components/ui/code-block"

export default function KeyboardKeyPage() {
  return (
    <div className="w-full flex flex-col items-center py-12">
      <div className="max-w-3xl w-full flex flex-col items-center gap-12">
        <div className="text-center space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight"
          >
            Keyboard Key
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            A keycap component that supports symbols, icons, and custom content.
          </motion.p>
        </div>

        <div className="w-full flex flex-col items-center gap-8">
          <div className="flex flex-wrap items-center justify-center gap-6 rounded-3xl border border-border/50 bg-muted/30 p-10">
            <KeyboardKey>
              <span className="absolute right-3 top-2 text-[10px] font-semibold text-white/70">
                fn
              </span>
              <Globe className="absolute left-3 bottom-3 h-4 w-4 text-white/90" />
            </KeyboardKey>
            <KeyboardKey size="lg">
              <span className="text-xl font-semibold">K</span>
            </KeyboardKey>
            <KeyboardKey size={72}>
              <span className="text-2xl font-semibold">⌘</span>
            </KeyboardKey>
            <KeyboardKey>
              <div className="flex flex-col items-center leading-none">
                <span className="text-[10px] text-white/70">shift</span>
                <span className="text-lg font-semibold">⇧</span>
              </div>
            </KeyboardKey>
          </div>

          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-background p-6">
              <KeyboardKey size="sm">
                <span className="font-semibold">A</span>
              </KeyboardKey>
              <p className="text-xs text-muted-foreground">Small</p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-background p-6">
              <KeyboardKey size="md">
                <span className="font-semibold">S</span>
              </KeyboardKey>
              <p className="text-xs text-muted-foreground">Medium</p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-background p-6">
              <KeyboardKey size="lg">
                <span className="font-semibold">D</span>
              </KeyboardKey>
              <p className="text-xs text-muted-foreground">Large</p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full space-y-6"
        >
          <CodeBlock
            language="bash"
            filename="Terminal"
            code="npx shadcn@latest add keyboard-key"
          />

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Usage
            </h2>
            <CodeBlock
              language="tsx"
              filename="MyPage.tsx"
              code={`import { Globe } from "lucide-react";
import { KeyboardKey } from "@/components/keyboard-key";

export default function MyPage() {
  return (
    <div className="flex gap-4">
      <KeyboardKey>
        <span className="absolute right-3 top-2 text-[10px] font-semibold text-white/70">
          fn
        </span>
        <Globe className="absolute left-3 bottom-3 h-4 w-4 text-white/90" />
      </KeyboardKey>

      <KeyboardKey size={72}>
        <span className="text-2xl font-semibold">⌘</span>
      </KeyboardKey>
    </div>
  );
}`}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
