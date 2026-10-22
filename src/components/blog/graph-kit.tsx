import { KATEX_MACROS } from "@/data/math-colors";
import katex from "katex";
import { useMemo } from "react";

// Pieces shared by the interactive graphs in the limit posts.

export type View = { xmin: number; xmax: number; ymin: number; ymax: number };

export const INK = "#111210";

export function Tex({ tex, className }: { tex: string; className?: string }) {
  const html = useMemo(
    () => katex.renderToString(tex, { macros: { ...KATEX_MACROS }, throwOnError: false }),
    [tex],
  );
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function fmt(v: number) {
  return v < 0.1 ? v.toFixed(3) : v.toFixed(2);
}

export function niceStep(range: number, count: number) {
  const raw = range / Math.max(count, 1);
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const err = raw / pow;
  return (err >= 7.5 ? 10 : err >= 3.5 ? 5 : err >= 1.5 ? 2 : 1) * pow;
}

export function ticks(min: number, max: number, step: number) {
  const out: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-9; v += step) {
    out.push(Math.abs(v) < step * 1e-9 ? 0 : Number(v.toFixed(10)));
  }
  return out;
}

// Points inside the punctured window 0 < |x − a| < δ, left side then right.
export function windowSamples(a: number, delta: number, n: number) {
  const left: number[] = [];
  const right: number[] = [];
  for (let k = n; k >= 1; k--) left.push(a - delta * ((k - 0.5) / n));
  for (let k = 1; k <= n; k++) right.push(a + delta * ((k - 0.5) / n));
  return [left, right];
}
