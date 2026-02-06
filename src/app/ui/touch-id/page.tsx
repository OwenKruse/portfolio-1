"use client";

import { useState } from "react";
import { TouchID } from "@/components/touch-id";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";

export default function TouchIDPage() {
  const [complete, setComplete] = useState(false);

  return (
    <div className="w-full flex flex-col items-center py-12">
      <div className="max-w-xl w-full flex flex-col items-center gap-12">
        <div className="text-center space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight"
          >
            Touch ID Authentication
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Press and hold the sensor to authorize access
          </motion.p>
        </div>

        <div className="relative">
          <TouchID 
            onComplete={() => setComplete(true)} 
            size="lg"
          />
          
          <AnimatePresence>
            {complete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-3xl z-20"
              >
                <CheckCircle2 className="w-16 h-16 text-[#7d8eff] mb-4" />
                <p className="font-semibold text-lg">Identity Verified</p>
                <button 
                  onClick={() => setComplete(false)}
                  className="mt-6 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full space-y-12"
        >
          {/* Sizes Section */}
          <div className="space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sizes & Speeds</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end justify-items-center bg-muted/30 p-8 rounded-3xl border border-border/50">
              <div className="flex flex-col items-center gap-4">
                <TouchID size="sm" speed={1000} />
                <span className="text-xs font-medium text-muted-foreground text-center">Small (Fast: 1s)</span>
              </div>
              <div className="flex flex-col items-center gap-4">
                <TouchID size="md" speed={2000} />
                <span className="text-xs font-medium text-muted-foreground text-center">Medium (Standard: 2s)</span>
              </div>
              <div className="flex flex-col items-center gap-4">
                <TouchID size="lg" speed={3000} />
                <span className="text-xs font-medium text-muted-foreground text-center">Large (Secure: 3s)</span>
              </div>
            </div>
          </div>

          {/* npx link */}
          <CodeBlock 
            language="bash"
            filename="Terminal"
            code="npx shadcn@latest add touch-id"
          />

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Component Example: Login Card</h2>
            <div className="bg-white dark:bg-slate-900/50 rounded-2xl p-8 border border-border/50 flex flex-col items-center gap-6 shadow-xl shadow-black/5 dark:shadow-none backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-primary/5 dark:bg-primary/10 flex items-center justify-center mb-2">
                <div className="w-6 h-6 rounded-sm bg-[#7d8eff]/20 animate-pulse" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold">Welcome Back</h3>
                <p className="text-sm text-muted-foreground">Confirm your identity to continue</p>
              </div>
              
              <div className="py-4">
                <TouchID 
                  size={160} 
                  onComplete={() => alert("Login Successful!")}
                />
              </div>

              <div className="w-full space-y-3 pt-4 border-t border-border/50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Account</span>
                  <span className="font-medium">o***@example.com</span>
                </div>
                <button className="w-full py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors border border-border/50 dark:border-none">
                  Use Password Instead
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Usage</h2>
            <CodeBlock 
              language="tsx"
              filename="MyPage.tsx"
              code={`import { TouchID } from "@/components/touch-id";

export default function MyPage() {
  return (
    <div className="flex gap-4">
      {/* Named size */}
      <TouchID size="sm" speed={1000} />
      
      {/* Custom size and speed */}
      <TouchID size={120} speed={4000} />
      
      <TouchID 
        onComplete={() => console.log("Verified!")} 
      />
    </div>
  );
}`}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
