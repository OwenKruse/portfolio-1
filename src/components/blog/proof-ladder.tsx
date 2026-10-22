import { KATEX_MACROS, MATH_COLORS as C } from "@/data/math-colors";
import katex from "katex";

type Rung = { tex: string; note?: string };

const tex = (source: string) =>
  katex.renderToString(source, { macros: { ...KATEX_MACROS }, throwOnError: false });

// One chain of inequalities read two ways: down while you hunt for δ, up when you write the proof.
function ProofLadder({ rungs, result }: { rungs: Rung[]; result: string }) {
  return (
    <figure className="mx-auto max-w-[760px] rounded-[28px] border border-black/[0.08] bg-white px-4 py-6 text-[#111210] shadow-[0_40px_80px_-50px_rgba(17,18,16,0.3)] sm:px-8">
      <div className="flex flex-wrap justify-between gap-2 text-[12.5px] font-medium">
        <span className="rounded-full px-3 py-1" style={{ color: C.epsilon, background: `${C.epsilon}14` }}>
          ↓ Scratch work: start at the goal, dig for δ
        </span>
        <span className="rounded-full px-3 py-1" style={{ color: C.delta, background: `${C.delta}14` }}>
          ↑ Proof: start from δ, climb to the goal
        </span>
      </div>

      <div className="mt-5 grid grid-cols-[18px_minmax(0,1fr)_18px] gap-3 sm:grid-cols-[28px_minmax(0,1fr)_28px] sm:gap-5">
        <Rail color={C.epsilon} direction="down" />
        <ol className="space-y-2.5">
          {rungs.map((rung, i) => (
            <li
              key={i}
              className="flex flex-col items-center gap-1 overflow-x-auto rounded-[14px] border border-black/[0.06] bg-[#fbfbfa] px-3 py-3 text-[16px] sm:text-[18px]"
            >
              <span dangerouslySetInnerHTML={{ __html: tex(rung.tex) }} />
              {rung.note && (
                <span className="text-center text-[12.5px] leading-[1.45] text-[#6f7177]">{rung.note}</span>
              )}
            </li>
          ))}
          <li
            className="flex justify-center rounded-[14px] px-3 py-3 text-[18px] sm:text-[20px]"
            style={{ background: `${C.delta}12`, boxShadow: `inset 0 0 0 1.5px ${C.delta}55` }}
          >
            <span dangerouslySetInnerHTML={{ __html: tex(result) }} />
          </li>
        </ol>
        <Rail color={C.delta} direction="up" />
      </div>
    </figure>
  );
}

function Rail({ color, direction }: { color: string; direction: "up" | "down" }) {
  return (
    <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 20 100" aria-hidden>
      <line x1="10" x2="10" y1="3" y2="97" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
      {direction === "down" ? (
        <path d="M3 90 L10 98 L17 90" fill="none" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M3 10 L10 2 L17 10" fill="none" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

export function ProofLadderLinear() {
  return (
    <ProofLadder
      rungs={[
        { tex: "|(3x - 1) - \\cL{5}| < \\eps", note: "The goal. This is what the definition demands." },
        { tex: "|3x - 6| < \\eps" },
        { tex: "3\\,|x - \\ca{2}| < \\eps", note: "Factor out the 3 so |x − a| shows up." },
        { tex: "|x - \\ca{2}| < \\cdel{\\dfrac{\\eps}{3}}", note: "This has the shape |x − a| < something. That something is δ." },
      ]}
      result={"\\del = \\frac{\\eps}{3}"}
    />
  );
}

export function ProofLadderQuadratic() {
  return (
    <ProofLadder
      rungs={[
        { tex: "|x^2 - \\cL{4}| < \\eps", note: "The goal." },
        { tex: "|x - \\ca{2}|\\,\\cbad{|x + 2|} < \\eps", note: "|x − 2| is in our control. |x + 2| changes with x, so it needs a bound." },
        {
          tex: "|x - \\ca{2}| \\cdot \\cdel{5} < \\eps",
          note: "If we promise δ ≤ 1, then 1 < x < 3, so |x + 2| < 5.",
        },
        { tex: "|x - \\ca{2}| < \\cdel{\\dfrac{\\eps}{5}}", note: "Now δ also has to be at most ε/5." },
      ]}
      result={"\\del = \\min\\!\\left(\\cdel{1}, \\frac{\\eps}{5}\\right)"}
    />
  );
}
