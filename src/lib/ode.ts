import type { Fn2 } from "@/lib/math-expr";

export type Method = "euler" | "heun" | "rk4";

export const METHODS: Record<Method, { label: string; order: number }> = {
  euler: { label: "Euler", order: 1 },
  heun: { label: "Improved Euler", order: 2 },
  rk4: { label: "Runge–Kutta 4", order: 4 },
};

// Past this, treat the solution as having blown up.
const LIMIT = 1e8;

function advance(f: Fn2, method: Method, x: number, y: number, h: number) {
  const k1 = f(x, y);
  if (method === "euler") return y + h * k1;
  if (method === "heun") {
    const k2 = f(x + h, y + h * k1);
    return y + (h / 2) * (k1 + k2);
  }
  const k2 = f(x + h / 2, y + (h / 2) * k1);
  const k3 = f(x + h / 2, y + (h / 2) * k2);
  const k4 = f(x + h, y + h * k3);
  return y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
}

export type Path = {
  xs: number[];
  ys: number[];
  /** f(xₙ, yₙ) at each point, i.e. the slope Euler follows from it. */
  slopes: number[];
  diverged: boolean;
  truncated: boolean;
};

/** Steps from x0 toward xEnd with step size h, shortening the last step to land on xEnd. */
export function solve(
  f: Fn2,
  method: Method,
  x0: number,
  y0: number,
  xEnd: number,
  h: number,
  maxSteps = 4000,
): Path {
  const dir = Math.sign(xEnd - x0) || 1;
  const xs = [x0];
  const ys = [y0];
  const slopes = [f(x0, y0)];
  let x = x0;
  let y = y0;
  let diverged = !Number.isFinite(y0);
  let truncated = false;

  while (!diverged && dir * (xEnd - x) > 1e-9 * Math.max(1, Math.abs(h))) {
    if (xs.length > maxSteps) {
      truncated = true;
      break;
    }
    const step = dir * Math.min(h, Math.abs(xEnd - x));
    y = advance(f, method, x, y, step);
    x += step;
    if (!Number.isFinite(y) || Math.abs(y) > LIMIT) {
      diverged = true;
      break;
    }
    xs.push(x);
    ys.push(y);
    slopes.push(f(x, y));
  }
  return { xs, ys, slopes, diverged, truncated };
}

/**
 * A high-accuracy stand-in for the exact solution: RK4 with tiny steps in
 * both directions from the initial point, sampled with cubic Hermite
 * interpolation.
 */
export type Reference = {
  sample: (x: number) => number;
  /** Polyline segments through the visible range (split where it blows up). */
  points: [number, number][];
  lo: number;
  hi: number;
};

export function reference(
  f: Fn2,
  x0: number,
  y0: number,
  lo: number,
  hi: number,
): Reference {
  const span = Math.max(hi - lo, 1e-6);
  const steps = Math.min(6000, Math.max(400, Math.ceil(span / 0.004)));
  const dx = span / steps;

  const side = (end: number) => {
    const xs = [x0];
    const ys = [y0];
    const ds = [f(x0, y0)];
    const dir = Math.sign(end - x0);
    if (!dir) return { xs, ys, ds };
    let x = x0;
    let y = y0;
    while (dir * (end - x) > 1e-12) {
      const h = dir * Math.min(dx, Math.abs(end - x));
      y = advance(f, "rk4", x, y, h);
      x += h;
      if (!Number.isFinite(y) || Math.abs(y) > LIMIT) break;
      xs.push(x);
      ys.push(y);
      ds.push(f(x, y));
    }
    return { xs, ys, ds };
  };

  const right = side(Math.max(hi, x0));
  const left = side(Math.min(lo, x0));

  const sampleSide = (s: { xs: number[]; ys: number[]; ds: number[] }, x: number) => {
    const n = s.xs.length;
    const last = s.xs[n - 1];
    const dir = Math.sign(last - x0);
    if (n < 2) return x === x0 ? y0 : NaN;
    if (dir * (x - last) > 1e-9) return NaN;
    const t = Math.abs(x - x0) / dx;
    const i = Math.min(Math.floor(t), n - 2);
    const xa = s.xs[i];
    const xb = s.xs[i + 1];
    const h = xb - xa;
    const u = (x - xa) / h;
    const u2 = u * u;
    const u3 = u2 * u;
    return (
      (2 * u3 - 3 * u2 + 1) * s.ys[i] +
      (u3 - 2 * u2 + u) * h * s.ds[i] +
      (-2 * u3 + 3 * u2) * s.ys[i + 1] +
      (u3 - u2) * h * s.ds[i + 1]
    );
  };

  const points: [number, number][] = [];
  for (let i = left.xs.length - 1; i > 0; i--) points.push([left.xs[i], left.ys[i]]);
  for (let i = 0; i < right.xs.length; i++) points.push([right.xs[i], right.ys[i]]);

  return {
    sample: (x) => (x >= x0 ? sampleSide(right, x) : sampleSide(left, x)),
    points,
    lo: left.xs[left.xs.length - 1],
    hi: right.xs[right.xs.length - 1],
  };
}
