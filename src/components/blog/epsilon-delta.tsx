"use client";

import { fmt, INK, niceStep, Tex, ticks, windowSamples, type View } from "@/components/blog/graph-kit";
import { MATH_COLORS as C } from "@/data/math-colors";
import { cn } from "@/lib/utils";
import { Check, Pause, Play, X, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

type Rule = { label: string; delta: (eps: number) => number };

type Scenario = {
  name: string;
  f: (x: number) => number;
  formula: string;
  a: number;
  L: number;
  view: View;
  epsMax: number;
  eps: number;
  delta: number;
  deltaMax: number;
  // δ formulas from a proof. The first one is selected to start.
  rules?: Rule[];
  note: string;
};

const M = { left: 40, right: 64, top: 40, bottom: 30 };
const SAMPLES = 400;
const MANUAL = -1;

const SQRT: Scenario = {
  name: "Square root",
  f: Math.sqrt,
  formula: "f(x) = \\sqrt{x}",
  a: 4,
  L: 2,
  view: { xmin: -0.5, xmax: 9, ymin: -0.4, ymax: 3.6 },
  epsMax: 1.2,
  eps: 0.5,
  delta: 2.5,
  deltaMax: 4,
  note: "Drag the orange ε handle to set the challenge, then drag the blue δ handle until everything inside the blue window stays inside the orange band. The curve flattens out to the right, so the left side always escapes first.",
};

const LINEAR: Scenario = {
  name: "Line",
  f: (x) => 3 * x - 1,
  formula: "f(x) = 3x - 1",
  a: 2,
  L: 5,
  view: { xmin: -0.25, xmax: 4.25, ymin: -1, ymax: 10.5 },
  epsMax: 3,
  eps: 1.5,
  delta: 0.5,
  deltaMax: 1.5,
  rules: [{ label: "\\del = \\tfrac{\\eps}{3}", delta: (e) => e / 3 }],
  note: "Press play to shrink ε. With δ = ε/3 the window shrinks right along with it, so the curve never leaves the box. Switch to “Pick your own” and play again to watch a fixed δ get left behind.",
};

const QUADRATIC: Scenario = {
  name: "Parabola",
  f: (x) => x * x,
  formula: "f(x) = x^2",
  a: 2,
  L: 4,
  view: { xmin: -0.3, xmax: 4.3, ymin: -1, ymax: 12 },
  epsMax: 6,
  eps: 5,
  delta: 0.6,
  deltaMax: 1.5,
  rules: [
    { label: "\\del = \\tfrac{\\eps}{4}", delta: (e) => e / 4 },
    { label: "\\del = \\min\\!\\left(1, \\tfrac{\\eps}{5}\\right)", delta: (e) => Math.min(1, e / 5) },
  ],
  note: "The naive guess δ = ε/4 lets the right side of the parabola climb out of the band. Switch to min(1, ε/5) and it stays in for every ε. Above ε = 5 the 1 takes over and δ stops growing.",
};

const WRONG_LIMIT: Scenario = {
  name: "Wrong L",
  f: (x) => x * x,
  formula: "f(x) = x^2",
  a: 2,
  L: 4.5,
  view: { xmin: 0.5, xmax: 3.5, ymin: 0, ymax: 9 },
  epsMax: 2,
  eps: 0.3,
  delta: 0.4,
  deltaMax: 1.4,
  note: "Someone claims the limit is 4.5. With ε above 0.5 you can still find a δ. Below 0.5, the curve near x = 2 sits at about 4, outside the band, and no δ is thin enough to fix that.",
};

const JUMP: Scenario = {
  name: "Jump",
  f: Math.floor,
  formula: "f(x) = \\lfloor x \\rfloor",
  a: 1,
  L: 1,
  view: { xmin: -0.5, xmax: 2.8, ymin: -0.8, ymax: 2.6 },
  epsMax: 1.5,
  eps: 0.5,
  delta: 0.5,
  deltaMax: 1.2,
  note: "⌊x⌋ jumps from 0 to 1 at x = 1. Guess L = 1 and the right side behaves, but every window also catches points just left of 1, where f(x) = 0. Pick ε ≤ 1 and nothing works. That's what “the limit does not exist” looks like.",
};

// The x in the window that lands furthest from L. On a tie the left side wins
// with the point nearest a, which is the most convincing one to show.
function worstCase(s: Scenario, delta: number) {
  let x = s.a;
  let gap = 0;
  const [left, right] = windowSamples(s.a, delta, SAMPLES);
  for (const side of [left, right]) {
    for (const t of side) {
      const g = Math.abs(s.f(t) - s.L);
      if (side === left ? g >= gap : g > gap) {
        gap = g;
        x = t;
      }
    }
  }
  return { x, gap };
}

// Shrinking δ never hurts, so the windows that work form an interval we can bisect.
function largestDelta(s: Scenario, eps: number) {
  let lo = 0;
  let hi = s.deltaMax * 4;
  if (worstCase(s, hi).gap < eps) return Infinity;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (worstCase(s, mid).gap < eps) lo = mid;
    else hi = mid;
  }
  return lo;
}

function EpsilonDelta({ scenarios }: { scenarios: Scenario[] }) {
  const [index, setIndex] = useState(0);
  const s = scenarios[index];
  const [eps, setEps] = useState(s.eps);
  const [manualDelta, setManualDelta] = useState(s.delta);
  const [rule, setRule] = useState(s.rules ? 0 : MANUAL);
  const [zoom, setZoom] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [width, setWidth] = useState(720);
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<"eps" | "delta" | null>(null);
  const clipId = `ed-clip-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const pick = (i: number) => {
    const next = scenarios[i];
    setIndex(i);
    setEps(next.eps);
    setManualDelta(next.delta);
    setRule(next.rules ? 0 : MANUAL);
    setPlaying(false);
  };

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Play sweeps ε from its max down to something small, the way a skeptic keeps raising the bar.
  useEffect(() => {
    if (!playing) return;
    const start = performance.now();
    const from = s.epsMax;
    const to = s.epsMax * 0.06;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 4000);
      const eased = 1 - Math.pow(1 - t, 2);
      setEps(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, s.epsMax]);

  const delta = rule === MANUAL ? manualDelta : s.rules![rule].delta(eps);
  const worst = useMemo(() => worstCase(s, delta), [s, delta]);
  const works = worst.gap < eps;
  const best = useMemo(() => largestDelta(s, eps), [s, eps]);

  const W = width;
  const H = Math.round(Math.min(460, Math.max(300, W * 0.6)));
  const pw = W - M.left - M.right;
  const ph = H - M.top - M.bottom;

  const view: View = zoom
    ? {
        xmin: s.a - Math.max(delta * 2.4, 1e-3),
        xmax: s.a + Math.max(delta * 2.4, 1e-3),
        ymin: s.L - eps * 2.6,
        ymax: s.L + eps * 2.6,
      }
    : s.view;
  const sx = (x: number) => M.left + ((x - view.xmin) / (view.xmax - view.xmin)) * pw;
  const sy = (y: number) => M.top + ((view.ymax - y) / (view.ymax - view.ymin)) * ph;
  const ix = (px: number) => view.xmin + ((px - M.left) / pw) * (view.xmax - view.xmin);
  const iy = (py: number) => view.ymax - ((py - M.top) / ph) * (view.ymax - view.ymin);
  const clampPx = (v: number) => Math.max(-1e4, Math.min(1e4, v));

  // The whole curve, broken wherever it jumps.
  const curve = (() => {
    const n = 600;
    const jump = (view.ymax - view.ymin) * 0.2;
    let d = "";
    let prev: number | null = null;
    for (let i = 0; i <= n; i++) {
      const x = view.xmin + ((view.xmax - view.xmin) * i) / n;
      const y = s.f(x);
      if (!Number.isFinite(y)) {
        prev = null;
        continue;
      }
      const pen = prev !== null && Math.abs(y - prev) < jump;
      d += `${pen ? "L" : "M"}${clampPx(sx(x)).toFixed(1)} ${clampPx(sy(y)).toFixed(1)}`;
      prev = y;
    }
    return d;
  })();

  // The part of the curve inside the δ-window, split into runs that stay in the band and runs that escape.
  const runs = (() => {
    const out: { ok: boolean; d: string }[] = [];
    const jump = (view.ymax - view.ymin) * 0.2;
    for (const side of windowSamples(s.a, delta, 220)) {
      let cur: { ok: boolean; d: string } | null = null;
      let prev: number | null = null;
      for (const x of side) {
        const y = s.f(x);
        if (!Number.isFinite(y)) continue;
        const ok = Math.abs(y - s.L) < eps;
        const pt = `${clampPx(sx(x)).toFixed(1)} ${clampPx(sy(y)).toFixed(1)}`;
        const broken = prev !== null && Math.abs(y - prev) >= jump;
        if (!cur || cur.ok !== ok || broken) {
          cur = { ok, d: `M${pt}` };
          out.push(cur);
        } else {
          cur.d += `L${pt}`;
        }
        prev = y;
      }
    }
    return out;
  })();

  const xStep = niceStep(view.xmax - view.xmin, Math.max(3, Math.round(pw / 90)));
  const yStep = niceStep(view.ymax - view.ymin, Math.max(3, Math.round(ph / 60)));

  const bandTop = clampPx(sy(s.L + eps));
  const bandBottom = clampPx(sy(s.L - eps));
  const winLeft = clampPx(sx(s.a - delta));
  const winRight = clampPx(sx(s.a + delta));
  const plotRight = M.left + pw;
  const epsHandle = Math.min(H - 12, Math.max(12, bandTop));

  const pointer = (e: React.PointerEvent) => {
    if (!drag.current || !svg.current) return;
    const box = svg.current.getBoundingClientRect();
    if (drag.current === "eps") {
      const y = iy(e.clientY - box.top);
      setEps(Math.min(s.epsMax, Math.max(s.epsMax * 0.02, y - s.L)));
    } else {
      const x = ix(e.clientX - box.left);
      setManualDelta(Math.min(s.deltaMax, Math.max(s.deltaMax * 0.01, x - s.a)));
    }
  };

  const startDrag = (which: "eps" | "delta") => (e: React.PointerEvent) => {
    e.preventDefault();
    svg.current?.setPointerCapture(e.pointerId);
    drag.current = which;
    setPlaying(false);
    if (which === "delta" && rule !== MANUAL) {
      setManualDelta(delta);
      setRule(MANUAL);
    }
  };

  return (
    <div className="mx-auto max-w-[960px] overflow-hidden rounded-[28px] border border-black/[0.08] bg-white text-[#111210] shadow-[0_40px_80px_-50px_rgba(17,18,16,0.3)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 text-[15px]">
          <Tex tex={s.formula} />
          <Tex tex={`\\displaystyle\\lim_{x \\to \\ca{${s.a}}} f(x) \\overset{?}{=} \\cL{${s.L}}`} />
        </div>
        {scenarios.length > 1 && (
          <div className="flex gap-1 rounded-[12px] bg-[#f3f2ee] p-1">
            {scenarios.map((sc, i) => (
              <button
                key={sc.name}
                type="button"
                onClick={() => pick(i)}
                className={cn(
                  "rounded-[9px] px-3 py-1.5 text-[12.5px] transition-colors",
                  i === index ? "bg-white text-[#111210] shadow-sm" : "text-[#6f7177] hover:text-[#111210]",
                )}
              >
                {sc.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div ref={wrap} className="relative">
        <svg
          ref={svg}
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full select-none"
          onPointerMove={pointer}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
          role="img"
          aria-label={`Graph of ${s.name}: ε = ${fmt(eps)}, δ = ${fmt(delta)}. ${works ? "This δ works." : "This δ fails."}`}
        >
          <defs>
            <clipPath id={clipId}>
              <rect x={M.left} y={M.top} width={pw} height={ph} />
            </clipPath>
          </defs>

          {/* Grid and axes */}
          {ticks(view.xmin, view.xmax, xStep).map((x) => (
            <g key={`x${x}`}>
              <line x1={sx(x)} x2={sx(x)} y1={M.top} y2={M.top + ph} stroke={INK} strokeOpacity={x === 0 ? 0.25 : 0.06} />
              <text x={sx(x)} y={H - 10} textAnchor="middle" className="fill-[#8a8c86] text-[11px]">
                {Number(x.toFixed(6))}
              </text>
            </g>
          ))}
          {ticks(view.ymin, view.ymax, yStep).map((y) => (
            <g key={`y${y}`}>
              <line x1={M.left} x2={plotRight} y1={sy(y)} y2={sy(y)} stroke={INK} strokeOpacity={y === 0 ? 0.25 : 0.06} />
              <text x={M.left - 8} y={sy(y) + 4} textAnchor="end" className="fill-[#8a8c86] text-[11px]">
                {Number(y.toFixed(6))}
              </text>
            </g>
          ))}
          <rect x={M.left} y={M.top} width={pw} height={ph} fill="none" stroke={INK} strokeOpacity={0.1} />

          <g clipPath={`url(#${clipId})`}>
            {/* ε-band around L */}
            <rect x={M.left} y={bandTop} width={pw} height={Math.max(0, bandBottom - bandTop)} fill={C.epsilon} fillOpacity={0.1} />
            <line x1={M.left} x2={plotRight} y1={bandTop} y2={bandTop} stroke={C.epsilon} strokeWidth={1.25} strokeDasharray="5 4" />
            <line x1={M.left} x2={plotRight} y1={bandBottom} y2={bandBottom} stroke={C.epsilon} strokeWidth={1.25} strokeDasharray="5 4" />

            {/* δ-window around a */}
            <rect x={winLeft} y={M.top} width={Math.max(0, winRight - winLeft)} height={ph} fill={C.delta} fillOpacity={0.09} />
            <line x1={winLeft} x2={winLeft} y1={M.top} y2={M.top + ph} stroke={C.delta} strokeWidth={1.25} strokeDasharray="5 4" />
            <line x1={winRight} x2={winRight} y1={M.top} y2={M.top + ph} stroke={C.delta} strokeWidth={1.25} strokeDasharray="5 4" />

            {/* Where the curve has to stay */}
            <rect
              x={winLeft}
              y={bandTop}
              width={Math.max(0, winRight - winLeft)}
              height={Math.max(0, bandBottom - bandTop)}
              fill="none"
              stroke={works ? INK : C.fail}
              strokeOpacity={works ? 0.55 : 0.8}
              strokeWidth={1.5}
            />

            {/* L and a */}
            <line x1={M.left} x2={plotRight} y1={sy(s.L)} y2={sy(s.L)} stroke={C.limit} strokeWidth={1.25} strokeDasharray="2 4" />
            <line x1={sx(s.a)} x2={sx(s.a)} y1={M.top} y2={M.top + ph} stroke={C.point} strokeWidth={1.25} strokeDasharray="2 4" />
            <text x={M.left + 8} y={sy(s.L) - 7} className="text-[12px] font-medium" fill={C.limit}>
              L = {s.L}
            </text>
            <text x={sx(s.a) + 6} y={M.top + ph - 8} className="text-[12px] font-medium" fill={C.point}>
              a = {s.a}
            </text>

            {/* The curve, then the part inside the window on top */}
            <path d={curve} fill="none" stroke={INK} strokeOpacity={0.3} strokeWidth={1.75} strokeLinejoin="round" />
            {runs.map((r, i) => (
              <path
                key={i}
                d={r.d}
                fill="none"
                stroke={r.ok ? INK : C.fail}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* We only care about x near a, never x = a itself */}
            <circle cx={sx(s.a)} cy={sy(s.L)} r={5} fill="white" stroke={C.point} strokeWidth={2} />

            {!works && (
              <g>
                <circle cx={clampPx(sx(worst.x))} cy={clampPx(sy(s.f(worst.x)))} r={7} fill="none" stroke={C.fail} strokeWidth={2} />
                <circle cx={clampPx(sx(worst.x))} cy={clampPx(sy(s.f(worst.x)))} r={13} fill={C.fail} fillOpacity={0.12} />
              </g>
            )}
          </g>

          {/* ε handle: bracket from L to L + ε in the right margin */}
          <g>
            <line x1={plotRight + 10} x2={plotRight + 10} y1={clampPx(sy(s.L))} y2={bandTop} stroke={C.epsilon} strokeWidth={2} />
            <line x1={plotRight + 6} x2={plotRight + 14} y1={clampPx(sy(s.L))} y2={clampPx(sy(s.L))} stroke={C.epsilon} strokeWidth={2} />
            <g className="cursor-ns-resize" style={{ touchAction: "none" }} onPointerDown={startDrag("eps")}>
              <rect x={plotRight + 18} y={epsHandle - 11} width={40} height={22} rx={11} fill={C.epsilon} />
              <text x={plotRight + 38} y={epsHandle + 4.5} textAnchor="middle" className="pointer-events-none fill-white text-[13px] font-semibold italic">
                ε
              </text>
              <rect x={plotRight} y={epsHandle - 16} width={M.right} height={32} fill="transparent" />
            </g>
          </g>

          {/* δ handle: bracket from a to a + δ in the top margin */}
          <g>
            <line x1={clampPx(sx(s.a))} x2={winRight} y1={M.top - 8} y2={M.top - 8} stroke={C.delta} strokeWidth={2} />
            <line x1={clampPx(sx(s.a))} x2={clampPx(sx(s.a))} y1={M.top - 12} y2={M.top - 4} stroke={C.delta} strokeWidth={2} />
            <g className="cursor-ew-resize" style={{ touchAction: "none" }} onPointerDown={startDrag("delta")}>
              <rect x={winRight - 20} y={M.top - 34} width={40} height={20} rx={10} fill={C.delta} />
              <text x={winRight} y={M.top - 19.5} textAnchor="middle" className="pointer-events-none fill-white text-[13px] font-semibold italic">
                δ
              </text>
              <rect x={winRight - 24} y={0} width={48} height={M.top} fill="transparent" />
            </g>
          </g>
        </svg>

        <div className="absolute bottom-[38px] right-[72px] flex overflow-hidden rounded-[10px] border border-black/10 bg-white/90 backdrop-blur">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            title={playing ? "Pause" : "Shrink ε"}
            aria-label={playing ? "Pause" : "Shrink ε"}
            className="grid size-9 place-items-center text-[#3a3d39] transition-colors hover:bg-[#f3f2ee]"
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => !z)}
            title={zoom ? "Zoom out" : "Zoom to the box"}
            aria-label={zoom ? "Zoom out" : "Zoom to the box"}
            className="grid size-9 place-items-center border-l border-black/10 text-[#3a3d39] transition-colors hover:bg-[#f3f2ee]"
          >
            {zoom ? <ZoomOut className="size-4" /> : <ZoomIn className="size-4" />}
          </button>
        </div>
      </div>

      <div className="grid gap-5 border-t border-black/[0.06] px-5 py-5 sm:px-6 md:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          {s.rules && (
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-[0.09em] text-[#8a8c86]">Choose <span className="normal-case">δ</span></p>
              <div className="flex flex-wrap gap-1.5">
                {s.rules.map((r, i) => (
                  <button
                    key={r.label}
                    type="button"
                    onClick={() => setRule(i)}
                    className={cn(
                      "rounded-[10px] border px-3 py-1.5 text-[14px] transition-colors",
                      rule === i ? "border-[#111210] bg-[#111210]/[0.03]" : "border-black/10 hover:border-black/30",
                    )}
                  >
                    <Tex tex={r.label} />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setManualDelta(delta);
                    setRule(MANUAL);
                  }}
                  className={cn(
                    "rounded-[10px] border px-3 py-1.5 text-[13px] transition-colors",
                    rule === MANUAL ? "border-[#111210] bg-[#111210]/[0.03]" : "border-black/10 text-[#5f655d] hover:border-black/30",
                  )}
                >
                  Pick your own
                </button>
              </div>
            </div>
          )}

          <label className="block">
            <span className="flex items-baseline justify-between text-[14px]">
              <span className="text-[#5f655d]">Challenge</span>
              <Tex tex={`\\eps = ${fmt(eps)}`} />
            </span>
            <input
              type="range"
              min={s.epsMax * 0.02}
              max={s.epsMax}
              step={s.epsMax / 1000}
              value={eps}
              onChange={(e) => {
                setPlaying(false);
                setEps(Number(e.target.value));
              }}
              className="mt-2 w-full"
              style={{ accentColor: C.epsilon }}
            />
          </label>

          <label className="block">
            <span className="flex items-baseline justify-between text-[14px]">
              <span className="text-[#5f655d]">{rule === MANUAL ? "Your response" : "Response from the proof"}</span>
              <Tex tex={`\\del = ${fmt(delta)}`} />
            </span>
            <input
              type="range"
              min={s.deltaMax * 0.01}
              max={s.deltaMax}
              step={s.deltaMax / 1000}
              value={Math.min(delta, s.deltaMax)}
              onChange={(e) => {
                setManualDelta(Number(e.target.value));
                setRule(MANUAL);
              }}
              className="mt-2 w-full"
              style={{ accentColor: C.delta }}
            />
          </label>
        </div>

        <div className="space-y-3">
          <div
            className={cn(
              "flex gap-3 rounded-[14px] border p-4 text-[14.5px] leading-[1.55]",
              works ? "border-black/[0.08] bg-[#fbfbfa]" : "bg-[#fdf3f6]",
            )}
            style={works ? undefined : { borderColor: `${C.fail}40` }}
            aria-live="polite"
          >
            <span
              className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-white"
              style={{ background: works ? INK : C.fail }}
            >
              {works ? <Check className="size-3.5" /> : <X className="size-3.5" />}
            </span>
            {works ? (
              <p>
                <strong className="font-semibold">This δ works.</strong> Every <Tex tex="x" /> with{" "}
                <Tex tex={`0 < |x - \\ca{${s.a}}| < \\del`} /> lands inside the band.
              </p>
            ) : (
              <p>
                <strong className="font-semibold">This δ fails.</strong> At <Tex tex={`x = ${worst.x.toFixed(3)}`} />,{" "}
                <Tex tex={`|f(x) - \\cL{${s.L}}| = \\cbad{${worst.gap.toFixed(3)}}`} />, which isn&apos;t less than{" "}
                <Tex tex={`\\eps = ${fmt(eps)}`} />.
              </p>
            )}
          </div>
          <p className="text-[13.5px] leading-[1.55] text-[#6f7177]">
            {best < 1e-4 ? (
              <>
                <strong className="font-semibold" style={{ color: C.fail }}>
                  No δ works for this ε.
                </strong>{" "}
                {s.note}
              </>
            ) : (
              <>
                Largest δ that works here:{" "}
                <Tex tex={Number.isFinite(best) ? `\\approx \\cdel{${fmt(best)}}` : "\\text{any}"} />. {s.note}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export function EpsilonDeltaGame() {
  return <EpsilonDelta scenarios={[SQRT]} />;
}

export function EpsilonDeltaLinear() {
  return <EpsilonDelta scenarios={[LINEAR]} />;
}

export function EpsilonDeltaQuadratic() {
  return <EpsilonDelta scenarios={[QUADRATIC]} />;
}

export function EpsilonDeltaFailure() {
  return <EpsilonDelta scenarios={[WRONG_LIMIT, JUMP]} />;
}
