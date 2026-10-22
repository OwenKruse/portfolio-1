"use client";

import { KATEX_MACROS } from "@/data/math-colors";
import { cn } from "@/lib/utils";
import katex from "katex";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

// flip() marks the piece that just changed so it can be highlighted.
const flip = (tex: string) => `\\htmlClass{neg-flip}{${tex}}`;
const NOT = "\\cbad{\\neg}";
const IN_WINDOW = (x: string) => `0 < |${x} - \\ca{a}| < \\del`;
const IN_BAND = (x: string) => `|f(${x}) - \\cL{L}| < \\eps`;
const X = "\\cbad{x}";

const STEPS: { tex: string; caption: string }[] = [
  {
    tex: `\\forall\\, \\eps > 0\\ \\ \\exists\\, \\del > 0\\ \\ ${flip("\\forall\\, x")}:\\ \\ ${IN_WINDOW("x")} \\implies ${IN_BAND("x")}`,
    caption:
      "Start from the definition, with the “for every x” written out. “Whenever 0 < |x − a| < δ” always meant “for every x with 0 < |x − a| < δ.” Negation is about to flip it, so it can't stay hidden.",
  },
  {
    tex: `${flip(NOT)}\\Big[\\forall\\, \\eps > 0\\ \\ \\exists\\, \\del > 0\\ \\ \\forall\\, x:\\ \\ ${IN_WINDOW("x")} \\implies ${IN_BAND("x")}\\Big]`,
    caption: "Put a “not” in front of the whole thing. Now push it to the right, one piece at a time.",
  },
  {
    tex: `${flip("\\exists\\, \\eps > 0")}\\ \\ ${NOT}\\Big[\\exists\\, \\del > 0\\ \\ \\forall\\, x:\\ \\ ${IN_WINDOW("x")} \\implies ${IN_BAND("x")}\\Big]`,
    caption: "“Not true for every ε” means “false for some ε.” Passing the ¬ through flips ∀ into ∃.",
  },
  {
    tex: `\\exists\\, \\eps > 0\\ \\ ${flip("\\forall\\, \\del > 0")}\\ \\ ${NOT}\\Big[\\forall\\, x:\\ \\ ${IN_WINDOW("x")} \\implies ${IN_BAND("x")}\\Big]`,
    caption: "“No δ works” means “every δ fails.” ∃ flips into ∀.",
  },
  {
    tex: `\\exists\\, \\eps > 0\\ \\ \\forall\\, \\del > 0\\ \\ ${flip(`\\exists\\, ${X}`)}:\\ \\ ${NOT}\\Big[${IN_WINDOW(X)} \\implies ${IN_BAND(X)}\\Big]`,
    caption:
      "“Not every x behaves” means “some x misbehaves.” ∀ flips into ∃ again, and x turns pink: it's now a single point you get to choose.",
  },
  {
    tex: `\\exists\\, \\eps > 0\\ \\ \\forall\\, \\del > 0\\ \\ \\exists\\, ${X}:\\ \\ ${IN_WINDOW(X)}\\ ${flip(`\\text{ and }\\ ${NOT}\\big(${IN_BAND(X)}\\big)`)}`,
    caption:
      "“If P then Q” only fails when P is true and Q is false. So the arrow becomes “and,” and the ¬ lands on the conclusion.",
  },
  {
    tex: `\\exists\\, \\eps > 0\\ \\ \\forall\\, \\del > 0\\ \\ \\exists\\, ${X}:\\ \\ ${IN_WINDOW(X)}\\ \\text{ and }\\ ${flip(`|f(${X}) - \\cL{L}| \\ge \\eps`)}`,
    caption: "“Not less than ε” is “at least ε.” The ¬ is gone, and everything it walked past got flipped. That's the negation.",
  },
];

const render = (tex: string) =>
  katex.renderToString(tex, {
    displayMode: true,
    macros: { ...KATEX_MACROS },
    trust: (context) => context.command === "\\htmlClass",
    strict: (code: string) => (code === "htmlExtension" ? "ignore" : "warn"),
    throwOnError: false,
  });

export function NegationSteps() {
  const [step, setStep] = useState(0);
  const html = useMemo(() => STEPS.map((s) => render(s.tex)), []);
  const last = STEPS.length - 1;

  return (
    <div
      className="mx-auto max-w-[960px] overflow-hidden rounded-[28px] border border-black/[0.08] bg-white text-[#111210] shadow-[0_40px_80px_-50px_rgba(17,18,16,0.3)]"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") setStep((s) => Math.min(last, s + 1));
        if (e.key === "ArrowLeft") setStep((s) => Math.max(0, s - 1));
      }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-5 py-3.5 sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.09em] text-[#8a8c86]">
          Step {step + 1} of {STEPS.length}
        </p>
        <div className="flex gap-1.5" aria-hidden>
          {STEPS.map((_, i) => (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              onClick={() => setStep(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === step ? "w-6 bg-[#111210]" : i < step ? "w-1.5 bg-[#111210]/40" : "w-1.5 bg-black/10",
              )}
            />
          ))}
        </div>
      </div>

      <div
        key={step}
        className="neg-step overflow-x-auto px-4 pb-2 pt-6 text-[15px] sm:px-8 sm:text-[17px]"
        dangerouslySetInnerHTML={{ __html: html[step] }}
      />

      <div className="flex flex-col gap-4 border-t border-black/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
        <p className="min-h-[3.2em] flex-1 text-[14.5px] leading-[1.6] text-[#3a3d39]" aria-live="polite">
          {STEPS[step].caption}
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            aria-label="Previous step"
            className="grid size-10 place-items-center rounded-[12px] border border-black/10 text-[#3a3d39] transition-colors hover:bg-[#f3f2ee] disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          {step < last ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex h-10 items-center gap-1.5 rounded-[12px] bg-[#111210] px-4 text-[13.5px] font-medium text-white transition-colors hover:bg-[#2a2b28]"
            >
              {step === 0 ? "Negate it" : "Push the ¬"}
              <ChevronRight className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep(0)}
              className="inline-flex h-10 items-center gap-1.5 rounded-[12px] border border-black/10 px-4 text-[13.5px] font-medium text-[#111210] transition-colors hover:bg-[#f3f2ee]"
            >
              <RotateCcw className="size-3.5" />
              Start over
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
