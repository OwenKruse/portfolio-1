"use client";

import { PricingCard } from "@/components/pricing-card";
import { motion } from "framer-motion";
import { CodeBlock } from "@/components/ui/code-block";

export default function PricingCardPage() {
  return (
    <div className="w-full flex flex-col items-center py-12">
      <div className="max-w-4xl w-full flex flex-col items-center gap-12">
        <div className="text-center space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight"
          >
            Pricing Card
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Premium billing or tier section blocks with scaling and gradient hover effects.
          </motion.p>
        </div>

        <div className="w-full flex items-center justify-center gap-6 mt-8 flex-col md:flex-row relative">
          <PricingCard
            title="Starter"
            price="$9"
            description="Perfect for small projects."
            features={[
              { name: "Up to 3 projects", included: true },
              { name: "Basic analytics", included: true },
              { name: "24-hour support response time", included: false },
              { name: "Custom domains", included: false },
            ]}
          />
          <PricingCard
            isPopular
            title="Pro"
            price="$29"
            description="Everything you need to scale."
            features={[
              { name: "Unlimited projects", included: true },
              { name: "Advanced analytics", included: true },
              { name: "1-hour support response time", included: true },
              { name: "Custom domains", included: true },
            ]}
            buttonText="Upgrade to Pro"
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
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Variants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start justify-items-center bg-muted/30 p-8 rounded-3xl border border-border/50">
              <div className="flex flex-col items-center gap-4 w-full">
                <PricingCard
                  title="Basic"
                  price="Free"
                  description="Lifetime access."
                  features={[
                    { name: "Core Features", included: true },
                    { name: "Support", included: false }
                  ]}
                  className="scale-90"
                />
                <span className="text-xs font-medium text-muted-foreground text-center">Standard Outline</span>
              </div>
              <div className="flex flex-col items-center gap-4 w-full">
                <PricingCard
                  isPopular
                  title="Premium"
                  price="$99"
                  description="All features unlocked."
                  features={[
                    { name: "Core Features", included: true },
                    { name: "Support", included: true }
                  ]}
                  className="scale-90"
                />
                <span className="text-xs font-medium text-muted-foreground text-center">Popular Gradient</span>
              </div>
            </div>
          </div>

          {/* npx link */}
          <CodeBlock 
            language="bash"
            filename="Terminal"
            code="npx shadcn@latest add pricing-card"
          />

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Usage</h2>
            <CodeBlock 
              language="tsx"
              filename="MyPage.tsx"
              code={`import { PricingCard } from "@/components/pricing-card";

export default function MyPage() {
  return (
    <PricingCard
      title="Pro"
      price="$29"
      description="Everything to scale."
      features={[
        { name: "Unlimited projects", included: true },
        { name: "Advanced analytics", included: true }
      ]}
      isPopular
      buttonText="Upgrade"
      onSubscribe={() => alert("Subscribed!")}
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
