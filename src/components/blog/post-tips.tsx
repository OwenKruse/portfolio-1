"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Tip = { q: string; a: string };
type Open = { id: string; el: HTMLElement; pinned: boolean };
type Position = { left: number; top: number; arrow: number; above: boolean };

const GAP = 10;
const EDGE = 12;
// Leaves room for the fixed site nav when deciding whether a tip fits above.
const NAV = 84;

// Hover, focus or tap anything marked data-tip inside to see that tip's popup.
export function PostTips({ tips, children }: { tips: Record<string, Tip>; children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<number | undefined>(undefined);
  const [open, setOpen] = useState<Open | null>(null);
  const [pos, setPos] = useState<Position | null>(null);
  const tipId = useId();

  // KaTeX can only give a trigger a data attribute, so make it reachable here.
  useEffect(() => {
    root.current?.querySelectorAll<HTMLElement>("[data-tip]").forEach((el) => {
      if (!tips[el.dataset.tip!]) return;
      el.classList.add("tip-trigger");
      el.tabIndex = 0;
      el.setAttribute("role", "button");
      el.setAttribute("aria-haspopup", "dialog");
    });
  }, [tips]);

  const triggerFor = (target: EventTarget | null) => {
    const el = (target as Element | null)?.closest?.<HTMLElement>(".tip-trigger");
    return el && root.current?.contains(el) ? el : null;
  };

  const show = (el: HTMLElement, pinned: boolean) => {
    window.clearTimeout(hideTimer.current);
    setOpen((cur) => (cur?.el === el && cur.pinned && !pinned ? cur : { id: el.dataset.tip!, el, pinned }));
  };

  const hideSoon = () => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setOpen((cur) => (cur?.pinned ? cur : null)), 120);
  };

  const place = useCallback(() => {
    if (!open || !card.current) return;
    const rects = open.el.getClientRects();
    const r = rects.length ? rects[0] : open.el.getBoundingClientRect();
    const w = card.current.offsetWidth;
    const h = card.current.offsetHeight;
    const above = r.top - h - GAP > NAV;
    const center = r.left + r.width / 2;
    const left = Math.min(window.innerWidth - w - EDGE, Math.max(EDGE, center - w / 2));
    setPos({
      left,
      top: above ? r.top - h - GAP : r.bottom + GAP,
      arrow: Math.min(w - 18, Math.max(18, center - left)),
      above,
    });
  }, [open]);

  useLayoutEffect(() => {
    open?.el.setAttribute("aria-expanded", "true");
    place();
    return () => open?.el.removeAttribute("aria-expanded");
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        open.el.focus();
        setOpen(null);
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!card.current?.contains(t) && !open.el.contains(t)) setOpen(null);
    };
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, place]);

  const tip = open && tips[open.id];

  return (
    <div
      ref={root}
      onPointerOver={(e) => {
        const el = e.pointerType === "mouse" ? triggerFor(e.target) : null;
        if (el) show(el, false);
      }}
      onPointerOut={(e) => {
        if (e.pointerType === "mouse" && triggerFor(e.target) && !triggerFor(e.relatedTarget)) hideSoon();
      }}
      onClick={(e) => {
        const el = triggerFor(e.target);
        if (!el) return;
        setOpen((cur) => (cur?.el === el && cur.pinned ? null : { id: el.dataset.tip!, el, pinned: true }));
      }}
      onKeyDown={(e) => {
        const el = triggerFor(e.target);
        if (el && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          el.click();
        }
      }}
      onFocus={(e) => {
        const el = triggerFor(e.target);
        if (el && el.matches(":focus-visible")) show(el, false);
      }}
      onBlur={(e) => {
        if (triggerFor(e.target) && !card.current?.contains(e.relatedTarget as Node)) hideSoon();
      }}
    >
      {children}
      {tip &&
        createPortal(
          <div
            ref={card}
            id={tipId}
            role="dialog"
            aria-labelledby={`${tipId}-q`}
            onPointerEnter={() => window.clearTimeout(hideTimer.current)}
            onPointerLeave={(e) => e.pointerType === "mouse" && hideSoon()}
            className="tip-card fixed z-[60] w-[min(340px,calc(100vw-24px))] rounded-[16px] border border-black/[0.08] bg-white px-4 py-3.5 text-[#111210] shadow-[0_24px_60px_-20px_rgba(17,18,16,0.35)]"
            style={{
              left: pos?.left ?? -9999,
              top: pos?.top ?? 0,
              visibility: pos ? "visible" : "hidden",
            }}
          >
            <span
              aria-hidden
              className="absolute size-3 rotate-45 border-black/[0.08] bg-white"
              style={{
                left: (pos?.arrow ?? 0) - 6,
                ...(pos?.above
                  ? { bottom: -6.5, borderRightWidth: 1, borderBottomWidth: 1 }
                  : { top: -6.5, borderLeftWidth: 1, borderTopWidth: 1 }),
              }}
            />
            <p className="text-[10.5px] uppercase tracking-[0.09em] text-[#a9aca4]">Common question</p>
            <div
              id={`${tipId}-q`}
              className="mt-1 text-[15px] font-medium leading-[1.4] [&_p]:m-0"
              dangerouslySetInnerHTML={{ __html: tip.q }}
            />
            <div
              className="mt-2 text-[14px] leading-[1.6] text-[#3a3d39] [&_p+p]:mt-2 [&_p]:m-0 [&_strong]:font-semibold [&_strong]:text-[#111210]"
              dangerouslySetInnerHTML={{ __html: tip.a }}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
