"use client";

import { fmt, INK, niceStep, Tex, ticks, windowSamples, type View } from "@/components/blog/graph-kit";
import { MATH_COLORS as C } from "@/data/math-colors";
import { cn } from "@/lib/utils";
import { Check, Pause, Play, X, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type Witness = { label: string; x: (delta: number, L: number) => number };

type Scenario = {
  name: string;
  f: (x: number) => number;
  formula: string;
  a: number;
  L: number;
  // Set when proving the limit doesn't exist: the proof has to beat every L, so L gets a slider.
  Lrange?: [number, number];
  eps: { label: string; value: number }[];
  delta: number;
  deltaMax: number;
  witnesses: Witness[];
  view: View;
  // Zoom the view in on the δ-window as it shrinks.
  follow?: boolean;
  // Break the curve where it jumps instead of drawing a vertical line.
  jumps?: boolean;
  samples?: number;
  note: string;
};

const M = { left: 40, right: 20, top: 40, bottom: 30 };
const MANUAL = -1;
const STRIP = 160;

const sign = (x: number) => (x === 0 ? NaN : x / Math.abs(x));
// The first peak and trough of sin(1/x) inside (0, δ).
const crest = (delta: number, offset: number) =>
  1 / (offset + 2 * Math.PI * (Math.floor(1 / (2 * Math.PI * delta)) + 1));

const WRONG_LIMIT: Scenario = {
  name: "Wrong L",
  f: (x) => 3 * x - 1,
  formula: "f(x) = 3x - 1",
  a: 2,
  L: 4,
  eps: [
    { label: "\\eps = \\tfrac{1}{2}", value: 0.5 },
    { label: "\\eps = 2", value: 2 },
  ],
  delta: 0.6,
  deltaMax: 0.9,
  witnesses: [
    { label: "\\cbad{x} = \\ca{2} + \\tfrac{\\del}{2}", x: (d) => 2 + d / 2 },
    { label: "\\cbad{x} = \\ca{2} - \\tfrac{\\del}{2}", x: (d) => 2 - d / 2 },
  ],
  view: { xmin: -0.25, xmax: 4.25, ymin: -1, ymax: 10.5 },
  note: "Pick your ε and a rule for x, then drag the opponent's δ or press play. The strip checks every δ at once. You need pink all the way across.",
};

const JUMP: Scenario = {
  name: "Jump",
  f: sign,
  formula: "f(x) = \\frac{x}{|x|}",
  a: 0,
  L: 0.6,
  Lrange: [-1.6, 1.6],
  eps: [{ label: "\\eps = 1", value: 1 }],
  delta: 0.8,
  deltaMax: 1.6,
  witnesses: [
    { label: "\\cbad{x} = \\tfrac{\\del}{2}", x: (d) => d / 2 },
    { label: "\\cbad{x} = -\\tfrac{\\del}{2}", x: (d) => -d / 2 },
    { label: "\\text{split on } \\cL{L}", x: (d, L) => (L >= 0 ? -d / 2 : d / 2) },
  ],
  view: { xmin: -2, xmax: 2, ymin: -2, ymax: 2 },
  jumps: true,
  note: "Here the proof has to beat every L, so drag L too. Each one-sided rule loses to half of the L values. Splitting on the sign of L beats all of them.",
};

const OSCILLATION: Scenario = {
  name: "Oscillation",
  f: (x) => Math.sin(1 / x),
  formula: "f(x) = \\sin(1/x)",
  a: 0,
  L: 0.7,
  Lrange: [-1.4, 1.4],
  eps: [{ label: "\\eps = \\tfrac{1}{2}", value: 0.5 }],
  delta: 0.2,
  deltaMax: 0.3,
  witnesses: [
    { label: "\\text{always a peak}", x: (d) => crest(d, Math.PI / 2) },
    { label: "\\text{split on } \\cL{L}", x: (d, L) => crest(d, L >= 0 ? (3 * Math.PI) / 2 : Math.PI / 2) },
  ],
  view: { xmin: -0.6, xmax: 0.6, ymin: -1.6, ymax: 1.6 },
  follow: true,
  samples: 2400,
  note: "sin(1/x) hits 1 and −1 inside every window, however small. Press play and the view follows δ in. Splitting on L takes a trough when L ≥ 0 and a peak otherwise.",
};

function NegationWitness({ scenario: s }: { scenario: Scenario }) {
  const [epsIndex, setEpsIndex] = useState(0);
  const [L, setL] = useState(s.L);
  const [delta, setDelta] = useState(s.delta);
  const [rule, setRule] = useState(0);
  // A hand-picked x is stored as a fraction of δ so it stays inside the window as δ moves.
  const [t, setT] = useState(0.5);
  const [follow, setFollow] = useState(!!s.follow);
  const [playing, setPlaying] = useState(false);
  const [width, setWidth] = useState(720);
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<"delta" | "x" | null>(null);
  const clipId = `nw-clip-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Play is the opponent shrinking δ toward 0, one window after another.
  useEffect(() => {
    if (!playing) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 5000);
      setDelta(s.deltaMax * Math.pow(0.01, p));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, s.deltaMax]);

  const eps = s.eps[epsIndex].value;
  const witnessAt = (d: number, l: number) => (rule === MANUAL ? s.a + t * d : s.witnesses[rule].x(d, l));
  const wins = (d: number, l: number) => {
    const x = witnessAt(d, l);
    const dist = Math.abs(x - s.a);
    return dist > 0 && dist < d && Math.abs(s.f(x) - l) >= eps;
  };

  const x = witnessAt(delta, L);
  const fx = s.f(x);
  const gap = Math.abs(fx - L);
  const found = wins(delta, L);
  const anyEscape = windowSamples(s.a, delta, 300).some((side) => side.some((v) => Math.abs(s.f(v) - L) >= eps));

  const deltaStrip = Array.from({ length: STRIP }, (_, i) => wins((s.deltaMax * (i + 1)) / STRIP, L));
  const Lstrip = s.Lrange
    ? Array.from({ length: STRIP }, (_, i) => wins(delta, s.Lrange![0] + ((s.Lrange![1] - s.Lrange![0]) * (i + 0.5)) / STRIP))
    : null;

  const W = width;
  const H = Math.round(Math.min(440, Math.max(300, W * 0.56)));
  const pw = W - M.left - M.right;
  const ph = H - M.top - M.bottom;
  const view: View = follow ? { ...s.view, xmin: s.a - delta * 2.6, xmax: s.a + delta * 2.6 } : s.view;
  const sx = (v: number) => M.left + ((v - view.xmin) / (view.xmax - view.xmin)) * pw;
  const sy = (v: number) => M.top + ((view.ymax - v) / (view.ymax - view.ymin)) * ph;
  const ix = (px: number) => view.xmin + ((px - M.left) / pw) * (view.xmax - view.xmin);
  const clampPx = (v: number) => Math.max(-1e4, Math.min(1e4, v));
  const plotRight = M.left + pw;
  const jump = (view.ymax - view.ymin) * 0.4;

  const path = (xs: number[]) => {
    let d = "";
    let prev: number | null = null;
    for (const v of xs) {
      const y = s.f(v);
      if (!Number.isFinite(y)) {
        prev = null;
        continue;
      }
      const pen = prev !== null && !(s.jumps && Math.abs(y - prev) > jump);
      d += `${pen ? "L" : "M"}${clampPx(sx(v)).toFixed(1)} ${clampPx(sy(y)).toFixed(1)}`;
      prev = y;
    }
    return d;
  };

  const n = s.samples ?? 800;
  const curve = path(Array.from({ length: n + 1 }, (_, i) => view.xmin + ((view.xmax - view.xmin) * i) / n));

  // Inside the window, pink marks every point that escapes the band: each one is a possible witness.
  const runs: { escapes: boolean; d: string }[] = [];
  for (const side of windowSamples(s.a, delta, s.samples ? 600 : 220)) {
    let cur: { escapes: boolean; pts: number[] } | null = null;
    const flush = () => {
      if (cur) runs.push({ escapes: cur.escapes, d: path(cur.pts) });
    };
    for (const v of side) {
      const escapes = Math.abs(s.f(v) - L) >= eps;
      if (!cur || cur.escapes !== escapes) {
        flush();
        cur = { escapes, pts: cur ? [cur.pts[cur.pts.length - 1], v] : [v] };
      } else cur.pts.push(v);
    }
    flush();
  }

  const bandTop = clampPx(sy(L + eps));
  const bandBottom = clampPx(sy(L - eps));
  const winLeft = clampPx(sx(s.a - delta));
  const winRight = clampPx(sx(s.a + delta));
  const xPx = clampPx(sx(x));
  const fxPx = Number.isFinite(fx) ? clampPx(sy(fx)) : sy(L);

  const xStep = niceStep(view.xmax - view.xmin, Math.max(3, Math.round(pw / 90)));
  const yStep = niceStep(view.ymax - view.ymin, Math.max(3, Math.round(ph / 60)));
  const label = (v: number) => {
    const r = Number(v.toPrecision(6));
    return Math.abs(r) < 1e-12 ? "0" : String(r);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !svg.current) return;
    const box = svg.current.getBoundingClientRect();
    const v = ix(((e.clientX - box.left) / box.width) * W);
    if (drag.current === "delta") {
      setDelta(Math.min(s.deltaMax, Math.max(s.deltaMax * 0.005, Math.abs(v - s.a))));
    } else {
      const r = Math.max(-0.98, Math.min(0.98, (v - s.a) / delta));
      setT(Math.abs(r) < 0.02 ? 0.02 * Math.sign(r || 1) : r);
    }
  };

  const startDrag = (which: "delta" | "x") => (e: React.PointerEvent) => {
    e.preventDefault();
    svg.current?.setPointerCapture(e.pointerId);
    drag.current = which;
    setPlaying(false);
    if (which === "x" && rule !== MANUAL) {
      setT((x - s.a) / delta);
      setRule(MANUAL);
    }
  };

  const stripPointer = (set: (ratio: number) => void) => (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.type === "pointermove" && !e.buttons) return;
    if (e.type === "pointerdown") e.currentTarget.setPointerCapture(e.pointerId);
    const box = e.currentTarget.getBoundingClientRect();
    setPlaying(false);
    set(Math.max(0, Math.min(1, (e.clientX - box.left) / box.width)));
  };

  const deltaLoses = deltaStrip.findIndex((ok) => !ok);
  const Lloses = Lstrip?.findIndex((ok) => !ok) ?? -1;

  return (
    <div className="mx-auto max-w-[960px] overflow-hidden rounded-[28px] border border-black/[0.08] bg-white text-[#111210] shadow-[0_40px_80px_-50px_rgba(17,18,16,0.3)]">
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-black/[0.06] px-5 py-4 text-[15px] sm:px-6">
        <Tex tex={s.formula} />
        <Tex tex={`\\text{Claim to beat: } \\lim_{x \\to \\ca{${s.a}}} f(x) = \\cL{${Number(L.toFixed(2))}}`} />
      </div>

      <div ref={wrap} className="relative">
        <svg
          ref={svg}
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full select-none"
          onPointerMove={onPointerMove}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
          role="img"
          aria-label={`Graph of ${s.name}: ε = ${eps}, δ = ${fmt(delta)}, x = ${x.toFixed(3)}. ${found ? "x escapes the band." : "x stays in the band."}`}
        >
          <defs>
            <clipPath id={clipId}>
              <rect x={M.left} y={M.top} width={pw} height={ph} />
            </clipPath>
          </defs>

          {ticks(view.xmin, view.xmax, xStep).map((v) => (
            <g key={`x${v}`}>
              <line x1={sx(v)} x2={sx(v)} y1={M.top} y2={M.top + ph} stroke={INK} strokeOpacity={v === 0 ? 0.25 : 0.06} />
              <text x={sx(v)} y={H - 10} textAnchor="middle" className="fill-[#8a8c86] text-[11px]">
                {label(v)}
              </text>
            </g>
          ))}
          {ticks(view.ymin, view.ymax, yStep).map((v) => (
            <g key={`y${v}`}>
              <line x1={M.left} x2={plotRight} y1={sy(v)} y2={sy(v)} stroke={INK} strokeOpacity={v === 0 ? 0.25 : 0.06} />
              <text x={M.left - 8} y={sy(v) + 4} textAnchor="end" className="fill-[#8a8c86] text-[11px]">
                {label(v)}
              </text>
            </g>
          ))}
          <rect x={M.left} y={M.top} width={pw} height={ph} fill="none" stroke={INK} strokeOpacity={0.1} />

          <g clipPath={`url(#${clipId})`}>
            {/* Your ε-band around the claimed L */}
            <rect x={M.left} y={bandTop} width={pw} height={Math.max(0, bandBottom - bandTop)} fill={C.epsilon} fillOpacity={0.1} />
            <line x1={M.left} x2={plotRight} y1={bandTop} y2={bandTop} stroke={C.epsilon} strokeWidth={1.25} strokeDasharray="5 4" />
            <line x1={M.left} x2={plotRight} y1={bandBottom} y2={bandBottom} stroke={C.epsilon} strokeWidth={1.25} strokeDasharray="5 4" />
            <text x={M.left + 8} y={bandTop - 6} className="text-[11.5px] font-medium" fill={C.epsilon}>
              L + ε
            </text>

            {/* The opponent's δ-window */}
            <rect x={winLeft} y={M.top} width={Math.max(0, winRight - winLeft)} height={ph} fill={C.delta} fillOpacity={0.09} />
            <line x1={winLeft} x2={winLeft} y1={M.top} y2={M.top + ph} stroke={C.delta} strokeWidth={1.25} strokeDasharray="5 4" />
            <line x1={winRight} x2={winRight} y1={M.top} y2={M.top + ph} stroke={C.delta} strokeWidth={1.25} strokeDasharray="5 4" />

            <line x1={M.left} x2={plotRight} y1={sy(L)} y2={sy(L)} stroke={C.limit} strokeWidth={1.25} strokeDasharray="2 4" />
            <line x1={sx(s.a)} x2={sx(s.a)} y1={M.top} y2={M.top + ph} stroke={C.point} strokeWidth={1.25} strokeDasharray="2 4" />
            <text x={M.left + 8} y={sy(L) - 7} className="text-[12px] font-medium" fill={C.limit}>
              L = {Number(L.toFixed(2))}
            </text>
            <text x={sx(s.a) + 6} y={M.top + 16} className="text-[12px] font-medium" fill={C.point}>
              a = {s.a}
            </text>

            <path d={curve} fill="none" stroke={INK} strokeOpacity={0.3} strokeWidth={1.5} strokeLinejoin="round" />
            {runs.map((r, i) => (
              <path
                key={i}
                d={r.d}
                fill="none"
                stroke={r.escapes ? C.fail : INK}
                strokeWidth={r.escapes ? 3.5 : 2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            <circle cx={sx(s.a)} cy={sy(L)} r={5} fill="white" stroke={C.point} strokeWidth={2} />

            {/* Your witness, and how far f(x) lands from L */}
            <line x1={xPx} x2={xPx} y1={M.top + ph} y2={fxPx} stroke={found ? C.fail : INK} strokeOpacity={0.5} strokeDasharray="3 3" />
            <line x1={xPx} x2={xPx} y1={clampPx(sy(L))} y2={fxPx} stroke={found ? C.fail : INK} strokeWidth={2.5} />
            <circle cx={xPx} cy={fxPx} r={13} fill={found ? C.fail : INK} fillOpacity={0.12} />
            <circle cx={xPx} cy={fxPx} r={6} fill="white" stroke={found ? C.fail : INK} strokeWidth={2.5} />
          </g>

          {/* x handle along the bottom of the plot */}
          <g className="cursor-ew-resize" style={{ touchAction: "none" }} onPointerDown={startDrag("x")}>
            <rect x={xPx - 18} y={M.top + ph - 26} width={36} height={20} rx={10} fill={found ? C.fail : INK} />
            <text x={xPx} y={M.top + ph - 11.5} textAnchor="middle" className="pointer-events-none fill-white text-[13px] font-semibold italic">
              x
            </text>
            <rect x={xPx - 22} y={M.top + ph - 32} width={44} height={32} fill="transparent" />
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

        <div className="absolute right-[28px] top-[48px] flex overflow-hidden rounded-[10px] border border-black/10 bg-white/90 backdrop-blur">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            title={playing ? "Pause" : "Shrink δ"}
            aria-label={playing ? "Pause" : "Shrink δ"}
            className="grid size-9 place-items-center text-[#3a3d39] transition-colors hover:bg-[#f3f2ee]"
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <button
            type="button"
            onClick={() => setFollow((z) => !z)}
            title={follow ? "Zoom out" : "Follow the window"}
            aria-label={follow ? "Zoom out" : "Follow the window"}
            className="grid size-9 place-items-center border-l border-black/10 text-[#3a3d39] transition-colors hover:bg-[#f3f2ee]"
          >
            {follow ? <ZoomOut className="size-4" /> : <ZoomIn className="size-4" />}
          </button>
        </div>
      </div>

      <div className="grid gap-5 border-t border-black/[0.06] px-5 py-5 sm:px-6 md:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.09em] text-[#8a8c86]">Your <span className="normal-case">ε</span></p>
            <div className="flex flex-wrap gap-1.5">
              {s.eps.map((option, i) => (
                <Chip key={option.label} active={epsIndex === i} onClick={() => setEpsIndex(i)}>
                  <Tex tex={option.label} />
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.09em] text-[#8a8c86]">Your x</p>
            <div className="flex flex-wrap gap-1.5">
              {s.witnesses.map((w, i) => (
                <Chip key={w.label} active={rule === i} onClick={() => setRule(i)}>
                  <Tex tex={w.label} />
                </Chip>
              ))}
              <Chip
                active={rule === MANUAL}
                onClick={() => {
                  setT((x - s.a) / delta);
                  setRule(MANUAL);
                }}
              >
                <span className="text-[13px]">Drag your own</span>
              </Chip>
            </div>
          </div>

          <label className="block">
            <span className="flex items-baseline justify-between text-[14px]">
              <span className="text-[#5f655d]">Opponent&apos;s window</span>
              <Tex tex={`\\del = ${fmt(delta)}`} />
            </span>
            <input
              type="range"
              min={s.deltaMax * 0.005}
              max={s.deltaMax}
              step={s.deltaMax / 1000}
              value={delta}
              onChange={(e) => {
                setPlaying(false);
                setDelta(Number(e.target.value));
              }}
              className="mt-2 w-full"
              style={{ accentColor: C.delta }}
            />
          </label>

          {s.Lrange && (
            <label className="block">
              <span className="flex items-baseline justify-between text-[14px]">
                <span className="text-[#5f655d]">Claimed limit</span>
                <Tex tex={`\\cL{L} = \\cL{${L.toFixed(2)}}`} />
              </span>
              <input
                type="range"
                min={s.Lrange[0]}
                max={s.Lrange[1]}
                step={(s.Lrange[1] - s.Lrange[0]) / 1000}
                value={L}
                onChange={(e) => setL(Number(e.target.value))}
                className="mt-2 w-full"
                style={{ accentColor: C.limit }}
              />
            </label>
          )}
        </div>

        <div className="space-y-4">
          <div
            className={cn(
              "flex gap-3 rounded-[14px] border p-4 text-[14.5px] leading-[1.55]",
              found ? "bg-[#fdf3f6]" : "border-black/[0.08] bg-[#fbfbfa]",
            )}
            style={found ? { borderColor: `${C.fail}40` } : undefined}
            aria-live="polite"
          >
            <span
              className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-white"
              style={{ background: found ? C.fail : INK }}
            >
              {found ? <Check className="size-3.5" /> : <X className="size-3.5" />}
            </span>
            {found ? (
              <p>
                <strong className="font-semibold">Witness found.</strong> <Tex tex={`\\cbad{x} = ${x.toFixed(3)}`} /> is in the
                window, and <Tex tex={`|f(\\cbad{x}) - \\cL{L}| = \\cbad{${gap.toFixed(3)}} \\ge \\eps`} />.
              </p>
            ) : (
              <p>
                <strong className="font-semibold">Not a witness.</strong> <Tex tex={`|f(x) - \\cL{L}| = ${gap.toFixed(3)}`} /> is less
                than <Tex tex={`\\eps = ${eps}`} />, so <Tex tex="f(x)" /> is still in the band.
                {!anyEscape && " Nothing in this window escapes, so no x can work. Your ε is too big."}
              </p>
            )}
          </div>

          <Strip
            title={<>Every <span className="normal-case">δ</span> the opponent could pick</>}
            cells={deltaStrip}
            marker={delta / s.deltaMax}
            start="0"
            end={`δ = ${s.deltaMax}`}
            verdict={
              deltaLoses < 0
                ? "Your x escapes for every δ."
                : `Your x stays in the band at δ ≈ ${fmt((s.deltaMax * (deltaLoses + 1)) / STRIP)}.`
            }
            ok={deltaLoses < 0}
            onPointer={stripPointer((r) => setDelta(Math.max(s.deltaMax * 0.005, r * s.deltaMax)))}
          />
          {Lstrip && s.Lrange && (
            <Strip
              title="Every L someone could claim"
              cells={Lstrip}
              marker={(L - s.Lrange[0]) / (s.Lrange[1] - s.Lrange[0])}
              start={`L = ${s.Lrange[0]}`}
              end={`L = ${s.Lrange[1]}`}
              verdict={
                Lloses < 0
                  ? "Your x beats every L."
                  : `Loses to L ≈ ${(s.Lrange[0] + ((s.Lrange[1] - s.Lrange[0]) * (Lloses + 0.5)) / STRIP).toFixed(2)}.`
              }
              ok={Lloses < 0}
              onPointer={stripPointer((r) => setL(s.Lrange![0] + r * (s.Lrange![1] - s.Lrange![0])))}
            />
          )}
          <p className="text-[13.5px] leading-[1.55] text-[#6f7177]">{s.note}</p>
        </div>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-[10px] border px-3 py-1.5 text-[14px] transition-colors",
        active ? "border-[#111210] bg-[#111210]/[0.03]" : "border-black/10 text-[#5f655d] hover:border-black/30",
      )}
    >
      {children}
    </button>
  );
}

// One cell per δ (or L): pink where your x escapes, gray where it doesn't.
function Strip({
  title,
  cells,
  marker,
  start,
  end,
  verdict,
  ok,
  onPointer,
}: {
  title: React.ReactNode;
  cells: boolean[];
  marker: number;
  start: string;
  end: string;
  verdict: string;
  ok: boolean;
  onPointer: (e: React.PointerEvent<HTMLDivElement>) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-[12.5px]">
        <span className="text-[11px] uppercase tracking-[0.09em] text-[#8a8c86]">{title}</span>
        <span className="text-right font-medium" style={{ color: ok ? C.fail : "#6f7177" }}>
          {verdict}
        </span>
      </div>
      <div
        className="relative mt-2 h-5 cursor-pointer touch-none"
        onPointerDown={onPointer}
        onPointerMove={onPointer}
        aria-hidden
      >
        <div className="flex h-full overflow-hidden rounded-[6px]">
          {cells.map((good, i) => (
            <span key={i} className="h-full flex-1" style={{ background: good ? C.fail : "#e4e3de" }} />
          ))}
        </div>
        <span
          className="absolute -top-1 h-7 w-[3px] -translate-x-1/2 rounded-full bg-[#111210] ring-2 ring-white"
          style={{ left: `${marker * 100}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-[#a9aca4]">
        <span>{start}</span>
        <span>{end}</span>
      </div>
    </div>
  );
}

export function NegationWrongLimit() {
  return <NegationWitness scenario={WRONG_LIMIT} />;
}

export function NegationJump() {
  return <NegationWitness scenario={JUMP} />;
}

export function NegationOscillation() {
  return <NegationWitness scenario={OSCILLATION} />;
}
