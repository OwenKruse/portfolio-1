"use client";

import { parseExpression, type Fn2 } from "@/lib/math-expr";
import { METHODS, reference, solve, type Method } from "@/lib/ode";
import { cn } from "@/lib/utils";
import {
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  StepBack,
  StepForward,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

type View = { xmin: number; xmax: number; ymin: number; ymax: number };

type Preset = {
  name: string;
  expr: string;
  x0: number;
  y0: number;
  xEnd: number;
  h: number;
  view: View;
  note: string;
};

const PRESETS: Preset[] = [
  {
    name: "Growth",
    expr: "y",
    x0: 0,
    y0: 1,
    xEnd: 2,
    h: 0.5,
    view: { xmin: -0.5, xmax: 2.5, ymin: -1, ymax: 8.5 },
    note: "The curve keeps bending upward, so every tangent line falls short. Euler always undershoots here.",
  },
  {
    name: "Mathlets classic",
    expr: "0.5y + 1",
    x0: 0,
    y0: 0,
    xEnd: 3,
    h: 1,
    view: { xmin: -1, xmax: 3.5, ymin: -1, ymax: 8 },
    note: "The default equation from MIT's Euler's Method Mathlet, starting from their biggest step, h = 1.",
  },
  {
    name: "Catch-up",
    expr: "x - y",
    x0: -1,
    y0: 2,
    xEnd: 4,
    h: 0.5,
    view: { xmin: -1.5, xmax: 4.5, ymin: -1, ymax: 4 },
    note: "Every solution gets pulled toward the line y = x − 1, so early mistakes fade away instead of piling up.",
  },
  {
    name: "Logistic",
    expr: "y(1 - y)",
    x0: -4,
    y0: 0.05,
    xEnd: 6,
    h: 1,
    view: { xmin: -4.5, xmax: 6.5, ymin: -0.3, ymax: 1.4 },
    note: "Growth that levels off at y = 1. Big steps overshoot the bend in the middle.",
  },
  {
    name: "Bell curve",
    expr: "-2xy",
    x0: 0,
    y0: 1,
    xEnd: 3,
    h: 0.5,
    view: { xmin: -0.5, xmax: 3.5, ymin: -0.6, ymax: 1.4 },
    note: "With h = 0.5, Euler lands exactly on y = 0 and stays there forever. Shrink h to escape the trap.",
  },
  {
    name: "Stiff",
    expr: "-12(y - cos(x))",
    x0: 0,
    y0: 0,
    xEnd: 4,
    h: 0.18,
    view: { xmin: -0.3, xmax: 4.3, ymin: -3, ymax: 3 },
    note: "A stiff equation. Above h = 1/6 Euler goes unstable and swings wildly. Try 0.15, then 0.18.",
  },
  {
    name: "Blow-up",
    expr: "x^2 + y^2",
    x0: 0,
    y0: 0,
    xEnd: 2.4,
    h: 0.2,
    view: { xmin: -0.3, xmax: 2.6, ymin: -1, ymax: 10 },
    note: "The true solution races off to infinity near x ≈ 2. Euler can't see it coming.",
  },
  {
    name: "Wavy",
    expr: "sin(xy)",
    x0: 0,
    y0: 2,
    xEnd: 6,
    h: 0.5,
    view: { xmin: -0.5, xmax: 6.5, ymin: -0.5, ymax: 3.5 },
    note: "There's no tidy formula for this one, which is exactly when numerical methods earn their keep.",
  },
];

// h, h/2, h/4, h/8
const SERIES = ["#e8590c", "#3157f6", "#0f9d76", "#9b51e0"];
const EXACT = "#111210";
const M = { left: 44, right: 14, top: 14, bottom: 30 };
const H_MIN = 0.01;
const H_MAX = 2;
const MAX_TABLE_ROWS = 400;

const SUBSCRIPTS = "₀₁₂₃₄₅₆₇₈₉";
const sub = (n: number) =>
  String(n)
    .split("")
    .map((d) => SUBSCRIPTS[+d])
    .join("");

function fmt(v: number, digits = 4) {
  if (!Number.isFinite(v)) return "—";
  if (v === 0) return "0";
  const abs = Math.abs(v);
  if (abs >= 1e5 || abs < 1e-3) return v.toExponential(2);
  return String(Number(v.toFixed(digits)));
}

function niceStep(range: number, count: number) {
  const raw = range / Math.max(count, 1);
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const err = raw / pow;
  return (err >= 7.5 ? 10 : err >= 3.5 ? 5 : err >= 1.5 ? 2 : 1) * pow;
}

function ticks(min: number, max: number, step: number) {
  const out: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-9; v += step) {
    out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
  }
  return out;
}

const snap = (v: number, q: number) => Number((Math.round(v / q) * q).toFixed(10));
const clampPx = (v: number) => Math.max(-1e5, Math.min(1e5, v));

function polyline(points: [number, number][], sx: (x: number) => number, sy: (y: number) => number) {
  let d = "";
  let pen = false;
  for (const [x, y] of points) {
    if (!Number.isFinite(y)) {
      pen = false;
      continue;
    }
    d += `${pen ? "L" : "M"}${clampPx(sx(x)).toFixed(1)} ${clampPx(sy(y)).toFixed(1)}`;
    pen = true;
  }
  return d;
}

const hToSlider = (h: number) =>
  Math.round(
    (1000 * (Math.log10(Math.min(Math.max(h, H_MIN), H_MAX)) - Math.log10(H_MIN))) /
      (Math.log10(H_MAX) - Math.log10(H_MIN)),
  );
const sliderToH = (s: number) => {
  const h = Math.pow(10, Math.log10(H_MIN) + (s / 1000) * (Math.log10(H_MAX) - Math.log10(H_MIN)));
  const q = h < 0.1 ? 0.001 : h < 1 ? 0.01 : 0.05;
  return snap(h, q);
};

export function EulerExplorer() {
  const initial = PRESETS[0];
  const [preset, setPreset] = useState<number | null>(0);
  const [exprText, setExprText] = useState(initial.expr);
  const [fn, setFn] = useState<Fn2>(() => (_x: number, y: number) => y);
  const [exprError, setExprError] = useState<{ error: string; index: number } | null>(null);
  const [x0, setX0] = useState(initial.x0);
  const [y0, setY0] = useState(initial.y0);
  const [xEnd, setXEnd] = useState(initial.xEnd);
  const [h, setH] = useState(initial.h);
  const [method, setMethod] = useState<Method>("euler");
  const [compare, setCompare] = useState(false);
  const [showField, setShowField] = useState(true);
  const [showExact, setShowExact] = useState(true);
  const [view, setView] = useState<View>(initial.view);
  const [cursor, setCursor] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const [size, setSize] = useState({ w: 760, h: 470 });

  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    mode: "start" | "end" | "pan";
    clientX: number;
    clientY: number;
    view: View;
    moved: boolean;
  } | null>(null);
  const clipId = `euler-clip-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  // Size the SVG in real pixels so text and strokes never scale.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({
        w: Math.round(entry.contentRect.width),
        h: Math.round(entry.contentRect.height),
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pw = Math.max(size.w - M.left - M.right, 10);
  const ph = Math.max(size.h - M.top - M.bottom, 10);
  const xr = view.xmax - view.xmin;
  const yr = view.ymax - view.ymin;
  const sx = useCallback((x: number) => M.left + ((x - view.xmin) / xr) * pw, [view.xmin, xr, pw]);
  const sy = useCallback((y: number) => M.top + ((view.ymax - y) / yr) * ph, [view.ymax, yr, ph]);

  const xStep = niceStep(xr, pw / 80);
  const yStep = niceStep(yr, ph / 60);

  const stepSizes = useMemo(() => (compare ? [h, h / 2, h / 4, h / 8] : [h]), [compare, h]);
  const paths = useMemo(
    () => stepSizes.map((step) => solve(fn, method, x0, y0, xEnd, step)),
    [fn, method, x0, y0, xEnd, stepSizes],
  );
  const primary = paths[0];
  const N = primary.xs.length - 1;
  const c = cursor === null ? null : Math.min(cursor, N);

  const exact = useMemo(
    () =>
      reference(
        fn,
        x0,
        y0,
        Math.min(view.xmin, x0, xEnd),
        Math.max(view.xmax, x0, xEnd),
      ),
    [fn, x0, y0, xEnd, view.xmin, view.xmax],
  );
  const exactEnd = exact.sample(xEnd);
  const exactBlowsUp = !Number.isFinite(exactEnd);

  const results = paths.map((path, i) => {
    const reached = !path.diverged && !path.truncated;
    const yN = path.ys[path.ys.length - 1];
    const error = reached && !exactBlowsUp ? yN - exactEnd : NaN;
    return { h: stepSizes[i], color: SERIES[i], path, reached, yN, error };
  });
  // Estimate order from the finest pair; coarse or unstable steps skew it.
  const finest = results.length > 1
    ? Math.abs(results[results.length - 2].error) / Math.abs(results[results.length - 1].error)
    : NaN;
  const observedOrder = Number.isFinite(finest) && finest > 0 ? Math.log2(finest) : null;

  // Playback
  useEffect(() => {
    if (!playing) return;
    const ms = Math.min(700, Math.max(110, 3200 / Math.max(N, 1)));
    const id = setInterval(() => setCursor((v) => Math.min((v ?? 0) + 1, N)), ms);
    return () => clearInterval(id);
  }, [playing, N]);
  useEffect(() => {
    if (playing && c !== null && c >= N) setPlaying(false);
  }, [playing, c, N]);

  // Keep the highlighted table row visible without scrolling the page.
  useEffect(() => {
    const box = tableRef.current;
    const row = box?.querySelector<HTMLElement>(`[data-row="${c}"]`);
    if (!box || !row) return;
    const top = row.offsetTop - box.clientHeight / 2 + row.clientHeight / 2;
    box.scrollTo({ top, behavior: "smooth" });
  }, [c]);

  function applyExpression(text: string) {
    setExprText(text);
    setPreset(null);
    const result = parseExpression(text);
    if (result.ok) {
      setFn(() => result.fn);
      setExprError(null);
    } else {
      setExprError({ error: result.error, index: result.index });
    }
  }

  function loadPreset(i: number) {
    const p = PRESETS[i];
    const result = parseExpression(p.expr);
    if (!result.ok) return;
    setPreset(i);
    setExprText(p.expr);
    setFn(() => result.fn);
    setExprError(null);
    setX0(p.x0);
    setY0(p.y0);
    setXEnd(p.xEnd);
    setH(p.h);
    setView(p.view);
    setCursor(null);
    setPlaying(false);
  }

  function toData(clientX: number, clientY: number) {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: view.xmin + ((clientX - rect.left - M.left) / pw) * xr,
      y: view.ymax - ((clientY - rect.top - M.top) / ph) * yr,
    };
  }

  function zoom(factor: number, cx = (view.xmin + view.xmax) / 2, cy = (view.ymin + view.ymax) / 2) {
    setView((v) => ({
      xmin: cx - (cx - v.xmin) * factor,
      xmax: cx + (v.xmax - cx) * factor,
      ymin: cy - (cy - v.ymin) * factor,
      ymax: cy + (v.ymax - cy) * factor,
    }));
  }

  function fit() {
    const lo = Math.min(x0, xEnd);
    const hi = Math.max(x0, xEnd);
    const ys = [y0];
    for (const [x, y] of exact.points) if (x >= lo && x <= hi && Number.isFinite(y)) ys.push(y);
    for (const r of results) for (const y of r.path.ys) ys.push(y);
    const sorted = ys.filter((y) => Math.abs(y) < 1e6).sort((a, b) => a - b);
    // Trim extreme outliers so one runaway step doesn't flatten everything.
    const yLo = sorted[Math.floor(sorted.length * 0.02)] ?? -1;
    const yHi = sorted[Math.ceil(sorted.length * 0.98) - 1] ?? 1;
    const xPad = Math.max((hi - lo) * 0.1, 0.5);
    const yPad = Math.max((yHi - yLo) * 0.15, 0.5);
    setView({ xmin: lo - xPad, xmax: hi + xPad, ymin: yLo - yPad, ymax: yHi + yPad });
  }

  // Ctrl/⌘ + wheel zooms; a plain wheel keeps scrolling the article.
  const zoomAt = useRef(zoom);
  const toDataRef = useRef(toData);
  useEffect(() => {
    zoomAt.current = zoom;
    toDataRef.current = toData;
  });
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const p = toDataRef.current(e.clientX, e.clientY);
      zoomAt.current(Math.exp(e.deltaY * 0.0025), p.x, p.y);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, []);

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (e.button !== 0) return;
    const handle = (e.target as Element).closest("[data-handle]")?.getAttribute("data-handle");
    drag.current = {
      mode: handle === "start" || handle === "end" ? handle : "pan",
      clientX: e.clientX,
      clientY: e.clientY,
      view,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setPlaying(false);
  }

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const d = drag.current;
    const p = toData(e.clientX, e.clientY);
    if (!d) {
      setHover(p);
      return;
    }
    if (Math.hypot(e.clientX - d.clientX, e.clientY - d.clientY) > 3) d.moved = true;
    if (d.mode === "start") {
      setX0(snap(p.x, xStep / 20));
      setY0(snap(p.y, yStep / 20));
      setPreset(null);
    } else if (d.mode === "end") {
      setXEnd(snap(p.x, xStep / 20));
    } else if (d.moved) {
      const dx = ((e.clientX - d.clientX) / pw) * (d.view.xmax - d.view.xmin);
      const dy = ((e.clientY - d.clientY) / ph) * (d.view.ymax - d.view.ymin);
      setView({
        xmin: d.view.xmin - dx,
        xmax: d.view.xmax - dx,
        ymin: d.view.ymin + dy,
        ymax: d.view.ymax + dy,
      });
    }
  }

  function onPointerUp(e: React.PointerEvent<SVGSVGElement>) {
    const d = drag.current;
    drag.current = null;
    if (d?.mode === "pan" && !d.moved) {
      // A click (not a drag) on empty space moves the starting point there.
      const p = toData(e.clientX, e.clientY);
      setX0(snap(p.x, xStep / 20));
      setY0(snap(p.y, yStep / 20));
      setPreset(null);
    }
  }

  function onHandleKey(e: React.KeyboardEvent) {
    const big = e.shiftKey ? 10 : 1;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-xStep / 10, 0],
      ArrowRight: [xStep / 10, 0],
      ArrowUp: [0, yStep / 10],
      ArrowDown: [0, -yStep / 10],
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    setX0((v) => snap(v + move[0] * big, xStep / 20));
    setY0((v) => snap(v + move[1] * big, yStep / 20));
    setPreset(null);
  }

  // Slope field: short segments drawn in screen space so they look right at any zoom.
  const field = useMemo(() => {
    if (!showField) return "";
    const gap = 34;
    const cols = Math.max(2, Math.floor(pw / gap));
    const rows = Math.max(2, Math.floor(ph / gap));
    const len = 10;
    let d = "";
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const px = M.left + ((i + 0.5) * pw) / cols;
        const py = M.top + ((j + 0.5) * ph) / rows;
        const x = view.xmin + ((px - M.left) / pw) * xr;
        const y = view.ymax - ((py - M.top) / ph) * yr;
        const s = fn(x, y);
        if (!Number.isFinite(s)) continue;
        const vx = pw / xr;
        const vy = (-s * ph) / yr;
        const mag = Math.hypot(vx, vy);
        const dx = (vx / mag) * len;
        const dy = (vy / mag) * len;
        d += `M${(px - dx).toFixed(1)} ${(py - dy).toFixed(1)}L${(px + dx).toFixed(1)} ${(py + dy).toFixed(1)}`;
      }
    }
    return d;
  }, [showField, fn, view.xmin, view.ymax, xr, yr, pw, ph]);

  const xTicks = ticks(view.xmin, view.xmax, xStep);
  const yTicks = ticks(view.ymin, view.ymax, yStep);
  const tickDigits = (step: number) => Math.max(0, -Math.floor(Math.log10(step)));

  const primaryPoints = primary.xs.map((x, i) => [x, primary.ys[i]] as [number, number]);
  const shownPoints = c === null ? primaryPoints : primaryPoints.slice(0, c + 1);
  const showDots = N <= 80;

  // The step being taken right now, when stepping through.
  const current =
    c !== null && c < N
      ? {
          x: primary.xs[c],
          y: primary.ys[c],
          slope: primary.slopes[c],
          nx: primary.xs[c + 1],
          ny: primary.ys[c + 1],
        }
      : null;

  const hoverSlope = hover ? fn(hover.x, hover.y) : NaN;
  const errorStart = exprError?.index ?? -1;

  return (
    <section
      aria-label="Euler's method explorer"
      className="overflow-hidden rounded-[28px] border border-black/[0.08] bg-white text-[#111210] shadow-[0_40px_80px_-50px_rgba(17,18,16,0.3)]"
    >
      {/* Equation */}
      <div className="border-b border-black/[0.07] p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <label
              className={cn(
                "flex items-center gap-3 rounded-[14px] border bg-[#fbfbfa] px-4 py-2.5 transition-colors focus-within:border-[#111210]/40 focus-within:bg-white",
                exprError ? "border-[#d9480f]/50" : "border-black/10",
              )}
            >
              <span className="shrink-0 font-serif text-[19px] italic text-[#5f655d]">
                dy/dx =
              </span>
              <input
                value={exprText}
                onChange={(e) => applyExpression(e.target.value)}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                aria-label="Right-hand side f(x, y)"
                aria-invalid={!!exprError}
                className="min-w-0 flex-1 bg-transparent font-mono text-[17px] outline-none"
              />
            </label>
            <p
              className={cn(
                "mt-2 min-h-[18px] px-1 text-[12.5px]",
                exprError ? "text-[#c2410c]" : "text-[#8a8c86]",
              )}
              aria-live="polite"
            >
              {exprError ? (
                <>
                  {exprError.error}
                  {errorStart >= 0 && exprText && (
                    <span className="ml-2 font-mono text-[#8a8c86]">
                      {exprText.slice(0, errorStart)}
                      <span className="rounded bg-[#ffe8d9] px-0.5 text-[#c2410c]">
                        {exprText.slice(errorStart, errorStart + 1) || "␣"}
                      </span>
                      {exprText.slice(errorStart + 1)}
                    </span>
                  )}
                </>
              ) : (
                <>
                  Use x and y with + − × ÷ ^ and sin, cos, tan, exp, ln, sqrt, abs. Implicit
                  multiplication works: <span className="font-mono">2xy</span>,{" "}
                  <span className="font-mono">y(1 − y)</span>.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {PRESETS.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => loadPreset(i)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-[13px] transition-colors",
                preset === i
                  ? "border-[#111210] bg-[#111210] text-white"
                  : "border-black/10 bg-white text-[#3a3d39] hover:border-black/25",
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
      
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_290px]">
        {/* Plot */}
        <div className="flex flex-col lg:border-r lg:border-black/[0.07]">
          <div
            ref={wrapRef}
            className="relative flex-1"
            style={{ minHeight: Math.round(Math.min(540, Math.max(320, size.w * 0.64))) }}
          >
            <svg
              ref={svgRef}
              width={size.w}
              height={size.h}
              className="absolute inset-0 block cursor-crosshair select-none"
              style={{ touchAction: "pan-y" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={() => (drag.current = null)}
              onPointerLeave={() => setHover(null)}
              aria-label={`Plot of dy/dx = ${exprText} with Euler approximation from (${x0}, ${y0}) to x = ${xEnd}`}
            >
              <defs>
                <clipPath id={clipId}>
                  <rect x={M.left} y={M.top} width={pw} height={ph} />
                </clipPath>
              </defs>

              {/* Grid + axes */}
              <g>
                {xTicks.map((t) => (
                  <line key={`gx${t}`} x1={sx(t)} x2={sx(t)} y1={M.top} y2={M.top + ph} stroke={t === 0 ? "#b9bbb4" : "#efeee9"} />
                ))}
                {yTicks.map((t) => (
                  <line key={`gy${t}`} y1={sy(t)} y2={sy(t)} x1={M.left} x2={M.left + pw} stroke={t === 0 ? "#b9bbb4" : "#efeee9"} />
                ))}
                {xTicks.map((t) => (
                  <text key={`tx${t}`} x={sx(t)} y={M.top + ph + 19} textAnchor="middle" className="fill-[#8a8c86] text-[11px] tabular-nums">
                    {t.toFixed(tickDigits(xStep))}
                  </text>
                ))}
                {yTicks.map((t) => (
                  <text key={`ty${t}`} x={M.left - 8} y={sy(t) + 4} textAnchor="end" className="fill-[#8a8c86] text-[11px] tabular-nums">
                    {t.toFixed(tickDigits(yStep))}
                  </text>
                ))}
                <rect x={M.left} y={M.top} width={pw} height={ph} fill="none" stroke="#e4e3de" />
              </g>

              <g clipPath={`url(#${clipId})`}>
                {showField && (
                  <path d={field} stroke="#a9aca4" strokeWidth={1.1} strokeLinecap="round" opacity={0.75} />
                )}

                {/* End marker */}
                <line x1={sx(xEnd)} x2={sx(xEnd)} y1={M.top} y2={M.top + ph} stroke="#111210" strokeOpacity={0.25} strokeDasharray="3 4" />

                {showExact && (
                  <path
                    d={polyline(exact.points, sx, sy)}
                    fill="none"
                    stroke={EXACT}
                    strokeOpacity={0.75}
                    strokeWidth={1.75}
                  />
                )}

                {/* Finer comparison polygons, finest at the back */}
                {results
                  .slice(1)
                  .reverse()
                  .map((r) => (
                    <path
                      key={r.h}
                      d={polyline(r.path.xs.map((x, i) => [x, r.path.ys[i]]), sx, sy)}
                      fill="none"
                      stroke={r.color}
                      strokeWidth={1.75}
                      strokeLinejoin="round"
                      opacity={0.85}
                    />
                  ))}

                {/* Ghost of the full polygon while stepping */}
                {c !== null && (
                  <path d={polyline(primaryPoints, sx, sy)} fill="none" stroke={SERIES[0]} strokeWidth={2} strokeOpacity={0.15} strokeLinejoin="round" />
                )}
                <path d={polyline(shownPoints, sx, sy)} fill="none" stroke={SERIES[0]} strokeWidth={2.5} strokeLinejoin="round" />
                {showDots &&
                  shownPoints.map(([x, y], i) => (
                    <circle key={i} cx={clampPx(sx(x))} cy={clampPx(sy(y))} r={i === c ? 4.5 : 3} fill={SERIES[0]} stroke="white" strokeWidth={1.25} />
                  ))}

                {/* Current step: tangent line plus rise/run triangle */}
                {current && (
                  <g>
                    <line
                      x1={sx(current.x - xr)}
                      y1={clampPx(sy(current.y - xr * current.slope))}
                      x2={sx(current.x + xr)}
                      y2={clampPx(sy(current.y + xr * current.slope))}
                      stroke={SERIES[0]}
                      strokeOpacity={0.35}
                      strokeDasharray="5 5"
                    />
                    <line x1={sx(current.x)} y1={sy(current.y)} x2={sx(current.nx)} y2={sy(current.y)} stroke="#111210" strokeOpacity={0.55} strokeDasharray="3 3" />
                    <line x1={sx(current.nx)} y1={sy(current.y)} x2={sx(current.nx)} y2={clampPx(sy(current.ny))} stroke="#111210" strokeOpacity={0.55} strokeDasharray="3 3" />
                    <text x={(sx(current.x) + sx(current.nx)) / 2} y={sy(current.y) + (current.ny >= current.y ? 16 : -8)} textAnchor="middle" className="fill-[#111210] text-[12px] font-medium">
                      h
                    </text>
                    <text x={sx(current.nx) + 6} y={(sy(current.y) + clampPx(sy(current.ny))) / 2 + 4} className="fill-[#111210] text-[12px] font-medium">
                      {method === "euler" ? "h·f" : "Δy"}
                    </text>
                    <circle cx={sx(current.nx)} cy={clampPx(sy(current.ny))} r={6} fill="none" stroke={SERIES[0]} strokeWidth={2} />
                  </g>
                )}

                {/* Slope under the cursor */}
                {hover && !drag.current && Number.isFinite(hoverSlope) && (
                  <line
                    x1={sx(hover.x - xr * 0.04)}
                    y1={sy(hover.y - xr * 0.04 * hoverSlope)}
                    x2={sx(hover.x + xr * 0.04)}
                    y2={sy(hover.y + xr * 0.04 * hoverSlope)}
                    stroke="#111210"
                    strokeWidth={2}
                    strokeLinecap="round"
                    opacity={0.5}
                    pointerEvents="none"
                  />
                )}

                {/* End handle */}
                <g data-handle="end" className="cursor-ew-resize" style={{ touchAction: "none" }}>
                  <rect x={sx(xEnd) - 20} y={M.top + 6} width={40} height={20} rx={10} fill="#111210" />
                  <text x={sx(xEnd)} y={M.top + 20} textAnchor="middle" className="pointer-events-none fill-white text-[11px] font-medium">
                    end
                  </text>
                  <rect x={sx(xEnd) - 10} y={M.top} width={20} height={ph} fill="transparent" />
                </g>

                {/* Start handle */}
                <g
                  data-handle="start"
                  className="cursor-grab outline-none active:cursor-grabbing"
                  style={{ touchAction: "none" }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Initial point (${fmt(x0)}, ${fmt(y0)}). Use arrow keys to move it.`}
                  onKeyDown={onHandleKey}
                >
                  <circle cx={clampPx(sx(x0))} cy={clampPx(sy(y0))} r={18} fill="transparent" />
                  <circle cx={clampPx(sx(x0))} cy={clampPx(sy(y0))} r={7.5} fill="white" stroke="#111210" strokeWidth={2.5} />
                </g>
              </g>
            </svg>

            {/* Readout + zoom controls */}
            <div className="pointer-events-none absolute left-[52px] top-[22px] rounded-[10px] bg-white/85 px-2.5 py-1.5 font-mono text-[11.5px] text-[#5f655d] backdrop-blur">
              {hover ? (
                <>
                  x {fmt(hover.x, 2)} · y {fmt(hover.y, 2)} · slope {fmt(hoverSlope, 2)}
                </>
              ) : (
                <>start ({fmt(x0)}, {fmt(y0)})</>
              )}
            </div>
            <div className="absolute bottom-[40px] right-[22px] flex overflow-hidden rounded-[10px] border border-black/10 bg-white/90 backdrop-blur">
              {[
                { label: "Zoom in", icon: ZoomIn, onClick: () => zoom(0.8) },
                { label: "Zoom out", icon: ZoomOut, onClick: () => zoom(1.25) },
                { label: "Fit to solution", icon: Maximize2, onClick: fit },
              ].map(({ label, icon: Icon, onClick }) => (
                <button
                  key={label}
                  type="button"
                  onClick={onClick}
                  title={label}
                  aria-label={label}
                  className="grid size-8 place-items-center text-[#3a3d39] transition-colors hover:bg-[#f3f2ee] [&+&]:border-l [&+&]:border-black/10"
                >
                  <Icon className="size-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Step-through bar */}
          <div className="flex flex-col gap-3 border-t border-black/[0.06] px-4 py-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-1">
              {[
                { label: "Back to start", icon: RotateCcw, onClick: () => { setPlaying(false); setCursor(0); } },
                { label: "Previous step", icon: StepBack, onClick: () => { setPlaying(false); setCursor((v) => Math.max(0, Math.min(v ?? N, N) - 1)); } },
              ].map(({ label, icon: Icon, onClick }) => (
                <button key={label} type="button" onClick={onClick} title={label} aria-label={label} className="grid size-9 place-items-center rounded-[10px] text-[#3a3d39] transition-colors hover:bg-[#f3f2ee]">
                  <Icon className="size-4" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  if (playing) return setPlaying(false);
                  if (c === null || c >= N) setCursor(0);
                  setPlaying(true);
                }}
                aria-label={playing ? "Pause" : "Play steps"}
                className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-[#111210] px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-[#2a2b28]"
              >
                {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                {playing ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                onClick={() => { setPlaying(false); setCursor((v) => Math.min((v ?? -1) + 1, N)); }}
                title="Next step"
                aria-label="Next step"
                className="grid size-9 place-items-center rounded-[10px] text-[#3a3d39] transition-colors hover:bg-[#f3f2ee]"
              >
                <StepForward className="size-4" />
              </button>
              {c !== null && (
                <button
                  type="button"
                  onClick={() => { setPlaying(false); setCursor(null); }}
                  className="ml-1 rounded-[10px] px-2.5 py-1.5 text-[12.5px] text-[#6f7177] transition-colors hover:bg-[#f3f2ee] hover:text-[#111210]"
                >
                  Show all
                </button>
              )}
            </div>
            <p className="min-w-0 flex-1 font-mono text-[12.5px] leading-[1.5] text-[#5f655d] sm:text-right" aria-live="polite">
              {c === null ? (
                <>{N} step{N === 1 ? "" : "s"} · press play to watch them one at a time</>
              ) : current ? (
                method === "euler" ? (
                  <>
                    step {c + 1}/{N}: y{sub(c + 1)} = {fmt(current.y)} + {fmt(current.nx - current.x)} × {fmt(current.slope)} ={" "}
                    <span className="text-[#111210]">{fmt(current.ny)}</span>
                  </>
                ) : (
                  <>
                    step {c + 1}/{N}: slope at start {fmt(current.slope)}, averaged to land at{" "}
                    <span className="text-[#111210]">{fmt(current.ny)}</span>
                  </>
                )
              ) : (
                <>done: y({fmt(primary.xs[N])}) ≈ <span className="text-[#111210]">{fmt(primary.ys[N])}</span></>
              )}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col divide-y divide-black/[0.07] border-t border-black/[0.07] lg:border-t-0">
          <Panel title="Method">
            <div className="grid grid-cols-3 gap-1 rounded-[12px] bg-[#f3f2ee] p-1">
              {(Object.keys(METHODS) as Method[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={cn(
                    "rounded-[9px] px-1 py-1.5 text-[12.5px] transition-colors",
                    method === m ? "bg-white font-medium text-[#111210] shadow-sm" : "text-[#6f7177] hover:text-[#111210]",
                  )}
                >
                  {m === "euler" ? "Euler" : m === "heun" ? "Heun" : "RK4"}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[12px] text-[#8a8c86]">
              {METHODS[method].label} · order {METHODS[method].order}
            </p>
          </Panel>

          <Panel title="Step size" aside={<NumberField label="h" value={h} onCommit={(v) => v > 0 && setH(v)} className="w-[92px]" />}>
            <input
              type="range"
              min={0}
              max={1000}
              value={hToSlider(h)}
              onChange={(e) => setH(sliderToH(+e.target.value))}
              aria-label="Step size"
              className="w-full accent-[#e8590c]"
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {[1, 0.5, 0.25, 0.1, 0.05].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setH(v)}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 font-mono text-[12px] transition-colors",
                    h === v ? "border-[#e8590c] bg-[#fff4ec] text-[#c2410c]" : "border-black/10 text-[#5f655d] hover:border-black/25",
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            <Toggle checked={compare} onChange={setCompare} className="mt-3">
              Compare h, h/2, h/4, h/8
            </Toggle>
          </Panel>

          <Panel title="Start and end">
            <div className="grid grid-cols-3 gap-1.5">
              <NumberField label="x₀" value={x0} onCommit={(v) => { setX0(v); setPreset(null); }} />
              <NumberField label="y₀" value={y0} onCommit={(v) => { setY0(v); setPreset(null); }} />
              <NumberField label="end x" value={xEnd} onCommit={setXEnd} />
            </div>
            <p className="mt-2 text-[12px] leading-[1.45] text-[#8a8c86]">
              Drag the white point or click anywhere to start there. Drag “end” to change how far to go.
            </p>
          </Panel>

          <Panel title="Show">
            <div className="flex flex-col gap-2">
              <Toggle checked={showField} onChange={setShowField}>Slope field</Toggle>
              <Toggle checked={showExact} onChange={setShowExact}>True solution</Toggle>
            </div>
          </Panel>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 border-t border-black/[0.07] lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="order-2 overflow-hidden border-t border-black/[0.07] lg:order-1 lg:border-r lg:border-t-0">
          <div className="flex items-center justify-between px-4 pb-2 pt-3.5">
            <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#8a8c86]">Steps</p>
            {N + 1 > MAX_TABLE_ROWS && (
              <p className="text-[12px] text-[#8a8c86]">first {MAX_TABLE_ROWS} of {N + 1}</p>
            )}
          </div>
          <div ref={tableRef} className="relative max-h-[248px] overflow-auto">
            <table className="w-full border-collapse font-mono text-[12.5px] tabular-nums">
              <thead className="sticky top-0 z-10 bg-white text-left text-[#8a8c86]">
                <tr className="[&>th]:whitespace-nowrap [&>th]:border-b [&>th]:border-black/[0.06] [&>th]:px-4 [&>th]:py-2 [&>th]:font-normal">
                  <th>n</th>
                  <th>xₙ</th>
                  <th>yₙ</th>
                  <th>f(xₙ, yₙ)</th>
                  <th>true y</th>
                  <th>error</th>
                </tr>
              </thead>
              <tbody>
                {primary.xs.slice(0, MAX_TABLE_ROWS).map((x, i) => {
                  const truth = exact.sample(x);
                  return (
                    <tr
                      key={i}
                      data-row={i}
                      onClick={() => { setPlaying(false); setCursor(i); }}
                      className={cn(
                        "cursor-pointer transition-colors [&>td]:px-4 [&>td]:py-1.5",
                        i === c ? "bg-[#fff4ec] text-[#111210]" : "text-[#3a3d39] hover:bg-[#fbfbfa]",
                      )}
                    >
                      <td className="text-[#8a8c86]">{i}</td>
                      <td>{fmt(x)}</td>
                      <td>{fmt(primary.ys[i])}</td>
                      <td>{fmt(primary.slopes[i])}</td>
                      <td>{fmt(truth)}</td>
                      <td className={cn(Math.abs(primary.ys[i] - truth) > 0.05 * Math.max(1, Math.abs(truth)) && "text-[#c2410c]")}>
                        {fmt(primary.ys[i] - truth)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="order-1 p-4 lg:order-2">
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#8a8c86]">
            Error at x = {fmt(xEnd)}
          </p>
          <ul className="mt-3 space-y-2">
            {results.map((r, i) => (
              <li key={r.h} className="flex items-center gap-2.5 text-[13px]">
                <span className="h-[3px] w-4 shrink-0 rounded-full" style={{ background: r.color }} />
                <span className="w-[88px] shrink-0 whitespace-nowrap font-mono text-[12px] text-[#5f655d]">h = {fmt(r.h)}</span>
                <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-[#111210]">
                  {r.path.diverged ? "blew up" : r.path.truncated ? "too many steps" : fmt(r.error)}
                </span>
                {i > 0 && Number.isFinite(results[i - 1].error / r.error) && (
                  <span className="font-mono text-[11.5px] text-[#8a8c86]">
                    ÷{fmt(Math.abs(results[i - 1].error / r.error), 1)}
                  </span>
                )}
              </li>
            ))}
            {showExact && (
              <li className="flex items-center gap-2.5 text-[13px]">
                <span className="h-[3px] w-4 shrink-0 rounded-full bg-[#111210]" />
                <span className="text-[12.5px] text-[#5f655d]">
                  true y = {exactBlowsUp ? "∞" : fmt(exactEnd)}
                </span>
              </li>
            )}
          </ul>
          <p className="mt-3 border-t border-black/[0.06] pt-3 text-[12.5px] leading-[1.5] text-[#5f655d]">
            {exactBlowsUp ? (
              <>The true solution blows up near x ≈ {fmt(xEnd > x0 ? exact.hi : exact.lo, 2)}, so there’s nothing to compare against.</>
            ) : !compare ? (
              <>Turn on <span className="text-[#111210]">Compare</span> to see how the error shrinks each time h is halved.</>
            ) : observedOrder !== null ? (
              <>
                Going from h/4 to h/8 divides the error by {fmt(Math.pow(2, observedOrder), 1)}, an observed order of{" "}
                <span className="text-[#111210]">≈ {fmt(observedOrder, 1)}</span>. {METHODS[method].label} should be order {METHODS[method].order}.
              </>
            ) : (
              <>Errors are too small or too large to estimate an order here.</>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

function Panel({ title, aside, children }: { title: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="p-4">
      <div className="mb-3 flex min-h-[28px] items-center justify-between gap-2">
        <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#8a8c86]">{title}</p>
        {aside}
      </div>
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  children,
  className,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex cursor-pointer items-center justify-between gap-3 text-[13.5px] text-[#3a3d39]", className)}>
      {children}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn("relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors", checked ? "bg-[#111210]" : "bg-[#dcdbd5]")}
      >
        <span className={cn("absolute top-[3px] size-4 rounded-full bg-white shadow transition-[left]", checked ? "left-[19px]" : "left-[3px]")} />
      </button>
    </label>
  );
}

// Accepts numbers or constant expressions like "pi/2".
function NumberField({
  label,
  value,
  onCommit,
  className,
}: {
  label: string;
  value: number;
  onCommit: (v: number) => void;
  className?: string;
}) {
  const [text, setText] = useState(fmt(value));
  const [focused, setFocused] = useState(false);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (!focused) {
      setText(fmt(value));
      setInvalid(false);
    }
  }, [value, focused]);

  return (
    <label
      className={cn(
        "flex items-center gap-1.5 rounded-[10px] border bg-[#fbfbfa] px-2.5 py-1.5 focus-within:border-[#111210]/40 focus-within:bg-white",
        invalid ? "border-[#d9480f]/50" : "border-black/10",
        className,
      )}
    >
      <span className="shrink-0 text-[12px] text-[#8a8c86]">{label}</span>
      <input
        value={text}
        inputMode="decimal"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          setText(e.target.value);
          const result = parseExpression(e.target.value);
          const v = result.ok ? result.fn(0, 0) : NaN;
          setInvalid(!Number.isFinite(v));
          if (Number.isFinite(v)) onCommit(v);
        }}
        className="w-full min-w-0 bg-transparent font-mono text-[13px] outline-none"
      />
    </label>
  );
}
