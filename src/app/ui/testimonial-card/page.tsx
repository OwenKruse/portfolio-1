"use client";

import { TestimonialCard } from "@/components/testimonial-card";
import { motion } from "framer-motion";
import { CodeBlock } from "@/components/ui/code-block";

export default function TestimonialCardPage() {
  return (
    <div className="w-full flex flex-col items-center py-12">
      <div className="max-w-4xl w-full flex flex-col items-center gap-12">
        <div className="text-center space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight"
          >
            Testimonial Card
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            An elegant, modern review card with beautiful glass aesthetics.
          </motion.p>
        </div>

        <div className="w-full flex justify-center mt-8 relative">
          <TestimonialCard
            testimonial={{
              id: "1",
              content: "This component library has completely transformed how we build user interfaces. The attention to detail and animations are unprecedented.",
              author: {
                name: "Sarah Jenkins",
                role: "Design Lead",
                company: "TechNova",
                avatar: "https://i.pravatar.cc/150?u=sarah",
              },
            }}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full space-y-12 max-w-xl mx-auto"
        >
          {/* Variants Section */}
          <div className="space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start justify-items-center bg-muted/30 p-8 rounded-3xl border border-border/50 overflow-hidden">
              <div className="flex flex-col items-center gap-4 w-full">
                <TestimonialCard
                  testimonial={{
                    id: "2",
                    content: "A game changer for my personal workflow. I shipped my startup in exactly half the time!",
                    author: {
                      name: "Alex",
                      role: "Indie Developer",
                      company: "Self-Employed",
                    },
                  }}
                  className="scale-75 origin-top min-w-[320px]"
                />
                <span className="text-xs font-medium text-muted-foreground text-center">Without Avatar</span>
              </div>
              <div className="flex flex-col items-center gap-4 w-full">
                <TestimonialCard
                  testimonial={{
                    id: "3",
                    content: "We were able to migrate our extensive design system over flawlessly.",
                    author: {
                      name: "Maria",
                      role: "Frontend Engineer",
                      company: "Globex",
                      avatar: "https://i.pravatar.cc/150?u=maria",
                    },
                  }}
                  className="scale-75 origin-top min-w-[320px]"
                />
                <span className="text-xs font-medium text-muted-foreground text-center">Short Form</span>
              </div>
            </div>
          </div>

          {/* npx link */}
          <CodeBlock 
            language="bash"
            filename="Terminal"
            code="npx shadcn@latest add testimonial-card"
          />

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Usage</h2>
            <CodeBlock 
              language="tsx"
              filename="MyPage.tsx"
              code={`import { TestimonialCard } from "@/components/testimonial-card";

export default function MyPage() {
  return (
    <TestimonialCard
      testimonial={{
        id: "1",
        content: "This product exceeded all our expectations.",
        author: {
          name: "John Doe",
          role: "CEO",
          company: "Acme Corp",
          avatar: "https://github.com/shadcn.png"
        }
      }}
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
