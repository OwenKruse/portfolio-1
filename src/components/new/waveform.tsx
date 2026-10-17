import { cn } from "@/lib/utils";

const LOGO_BARS = [7, 13, 18, 11, 15];

export function WaveLogo({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex h-[18px] items-center gap-[3px]", className)}
    >
      {LOGO_BARS.map((height, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-current"
          style={{ height }}
        />
      ))}
    </span>
  );
}

// Deterministic bar heights so server and client markup always match.
function barHeight(i: number, seed: number) {
  const v = Math.abs(Math.sin(i * 1.37 + seed * 2.11) * Math.cos(i * 0.53 + seed));
  return 18 + Math.round(v * 82);
}

export function Waveform({
  bars = 44,
  seed = 1,
  className,
}: {
  bars?: number;
  seed?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex h-8 items-center gap-[3px]", className)}
    >
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className="w-[3px] shrink-0 rounded-full bg-current"
          style={{ height: `${barHeight(i, seed)}%` }}
        />
      ))}
    </div>
  );
}
