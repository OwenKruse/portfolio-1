"use client";

import { TransactionCard } from "@/components/transaction-card";
import { motion } from "framer-motion";
import { CodeBlock } from "@/components/ui/code-block";

export default function SigningPage() {
  return (
    <div className="w-full flex flex-col items-center py-12 bg-zinc-50/50 dark:bg-zinc-950/50 rounded-3xl mt-4">
      <div className="max-w-2xl w-full flex flex-col items-center gap-12">
        <div className="text-center space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white"
          >
            Transaction Signing
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            A high-precision signature component for critical authorizations
          </motion.p>
        </div>

        <div className="w-full flex justify-center">
          <TransactionCard />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full space-y-12"
        >
          {/* npx link */}
          <CodeBlock 
            language="bash"
            filename="Terminal"
            code="npx shadcn@latest add transaction-card"
          />

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Usage</h2>
            <CodeBlock 
              language="tsx"
              filename="MyPage.tsx"
              code={`import { TransactionCard } from "@/components/transaction-card";

export default function MyPage() {
  return (
    <div className="max-w-md mx-auto">
      <TransactionCard 
        id="INV-001"
        amount="$1,200.00"
        onSign={(data) => console.log("Signed:", data)}
      />
    </div>
  );
}`}
            />
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-border/50">
              <h3 className="font-bold mb-2">Canvas Based</h3>
              <p className="text-sm text-muted-foreground">High-precision signature capture using native HTML5 Canvas API.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-border/50">
              <h3 className="font-bold mb-2">Touch Optimized</h3>
              <p className="text-sm text-muted-foreground">Fully responsive and supports mobile touch interactions out of the box.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-border/50">
              <h3 className="font-bold mb-2">Theme Aware</h3>
              <p className="text-sm text-muted-foreground">Beautifully styled for both light and dark modes with glassmorphism effects.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-border/50">
              <h3 className="font-bold mb-2">State Management</h3>
              <p className="text-sm text-muted-foreground">Built-in validation, clearing, and success animations.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
