"use client";

import React, { useState } from "react";
import { TextHighlight } from "@/components/text-highlight";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Copy, Check, Terminal, Code2, Layers, Cpu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TextHighlightDemo() {
  const [copied, setCopied] = useState(false);
  const installCommand = "npx shadcn@latest add avatar && npm install framer-motion lucide-react";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-16 px-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          href="/ui" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Library
        </Link>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Live Component</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="space-y-4 max-w-2xl">
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs font-bold uppercase tracking-widest mb-2"
        >
            <Layers className="w-3.5 h-3.5" />
            Interactive Element
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70 mb-4"
        >
          Text Highlighting
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-xl leading-relaxed"
        >
          A high-performance component for real-time collaboration interfaces. Perfect for 
          simulating multiplayer presence, active reviews, or highlighting key insights.
        </motion.p>
      </div>

      {/* Main Feature: Multiplayer Editor Mockup */}
      <Card className="border shadow-2xl overflow-hidden bg-background/50 backdrop-blur-xl">
        <div className="bg-muted/50 border-b px-6 py-4 flex items-center justify-between">
            <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/30" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
            </div>
            <div className="text-xs font-medium text-muted-foreground">multiplayer-proposal.md</div>
            <div className="w-8" />
        </div>
        <CardContent className="p-10 md:p-16 space-y-12 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent">
          <div className="space-y-10 max-w-3xl mx-auto">
            <div className="text-3xl font-bold tracking-tight">Q1 Product Strategy</div>
            
            <div className="text-xl leading-[1.8] text-foreground/90 font-normal">
              Our primary goal for the upcoming quarter is to 
              <TextHighlight color="indigo" content="Sarah K." logo="https://github.com/shadcn.png" showCursor delay={1}>
                enhance the core user experience across all platforms and devices, ensuring a seamless journey for our growing user base
              </TextHighlight>
              {" "}by focusing on performance and accessibility. We need to ensure that 
              <TextHighlight color="emerald" content="Marcus" logo="https://github.com/mischac.png" showCursor delay={2}>
                every interaction feels instantaneous
              </TextHighlight>
              {" "}and intuitive for our global user base.
            </div>

            <div className="text-xl leading-[1.8] text-foreground/90 font-normal">
              The introduction of 
              <TextHighlight color="rose" content="Designer" logo="https://github.com/paco.png" delay={3}>
                dynamic design systems
              </TextHighlight>
              {" "}will allow us to iterate faster. As noted by the 
              <TextHighlight color="amber" content="Reviewer" logo="https://github.com/nutlope.png" showCursor delay={4.5}>
                engineering team
              </TextHighlight>
              , we should prioritize the 
              <TextHighlight color="blue" content="Lead Dev" logo="https://github.com/shadcn.png" delay={5.5}>
                refactoring of the legacy modules
              </TextHighlight>
              {" "}before implementing new features.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid: Installation & Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Installation */}
        <div className="lg:col-span-12 space-y-6">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-500" />
            <h2 className="text-2xl font-bold">Quick Installation</h2>
          </div>
          <CodeBlock
            language="bash"
            filename="Terminal"
            code={installCommand}
          />
        </div>

        {/* Usage & Variants */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-500" />
            <h2 className="text-2xl font-bold">Usage Patterns</h2>
          </div>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-full justify-start h-12 bg-muted/30 p-1 border-none">
              <TabsTrigger value="basic" className="flex-1 rounded-md">Basic Usage</TabsTrigger>
              <TabsTrigger value="advanced" className="flex-1 rounded-md">Advanced</TabsTrigger>
              <TabsTrigger value="colors" className="flex-1 rounded-md">Colors</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="mt-4">
              <CodeBlock
                language="tsx"
                filename="Example.tsx"
                code={`<TextHighlight 
  color="indigo" 
  content="John Doe"
>
  The highlighted text
</TextHighlight>`}
              />
            </TabsContent>
            <TabsContent value="advanced" className="mt-4">
              <CodeBlock
                language="tsx"
                filename="AdvancedExample.tsx"
                code={`<TextHighlight 
  color="rose" 
  content="Lead Designer" 
  showCursor={true}
  delay={0.5}
  logo="/avatars/user.png"
>
  Dynamic interactions
</TextHighlight>`}
              />
            </TabsContent>
            <TabsContent value="colors" className="mt-4">
               <Card>
                <CardContent className="p-6 grid grid-cols-2 gap-4">
                    <TextHighlight color="indigo" content="Indigo">Indigo</TextHighlight>
                    <TextHighlight color="emerald" content="Emerald">Emerald</TextHighlight>
                    <TextHighlight color="amber" content="Amber">Amber</TextHighlight>
                    <TextHighlight color="rose" content="Rose">Rose</TextHighlight>
                    <TextHighlight color="cyan" content="Cyan">Cyan</TextHighlight>
                    <TextHighlight color="orange" content="Orange">Orange</TextHighlight>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Props Table */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-500" />
            <h2 className="text-2xl font-bold">Properties</h2>
          </div>
          <Card>
            <CardContent className="p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Prop</th>
                    <th className="px-4 py-3 text-left font-semibold">Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Default</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">color</td>
                    <td className="px-4 py-3 text-muted-foreground italic">string</td>
                    <td className="px-4 py-3 text-muted-foreground">"indigo"</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">content</td>
                    <td className="px-4 py-3 text-muted-foreground italic">string</td>
                    <td className="px-4 py-3 text-muted-foreground">"John Doe"</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">logo</td>
                    <td className="px-4 py-3 text-muted-foreground italic">string</td>
                    <td className="px-4 py-3 text-muted-foreground">GitHub URL</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">showCursor</td>
                    <td className="px-4 py-3 text-muted-foreground italic">boolean</td>
                    <td className="px-4 py-3 text-muted-foreground">false</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">delay</td>
                    <td className="px-4 py-3 text-muted-foreground italic">number</td>
                    <td className="px-4 py-3 text-muted-foreground">0</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
