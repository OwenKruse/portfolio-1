"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type CarouselProject = {
  index: number;
  title: string;
  href: string;
  dates: string;
  description: string;
  image: string;
  background: string;
  technologies: readonly string[];
};

export function ProjectCarousel({
  projects,
  footer,
}: {
  projects: CarouselProject[];
  footer?: React.ReactNode;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const step = (direction: 1 | -1) => {
    const el = scroller.current;
    const card = el?.querySelector<HTMLElement>("[data-card]");
    if (!el || !card) return;
    el.scrollBy({
      left: direction * (card.offsetWidth + 16) * 2,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div
        ref={scroller}
        onScroll={update}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[max(1.25rem,calc((100vw_-_1248px)/2))] pb-4 [scrollbar-width:none] scroll-px-[max(1.25rem,calc((100vw_-_1248px)/2))] sm:px-[max(2rem,calc((100vw_-_1248px)/2))] sm:scroll-px-[max(2rem,calc((100vw_-_1248px)/2))] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project) => (
          <Link
            key={project.title}
            data-card
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="w-[290px] shrink-0 snap-start rounded-[22px] border border-black/[0.06] bg-white p-2.5 sm:w-[340px]"
          >
            <div className="relative aspect-[1.7] overflow-hidden rounded-[16px] bg-[#efeee9]">
              <Image
                src={project.background}
                alt=""
                aria-hidden
                fill
                sizes="340px"
                className="object-cover"
              />
              <Image
                src={project.image}
                alt={`${project.title} screenshot`}
                fill
                sizes="340px"
                className="object-contain p-1 drop-shadow-[0_10px_22px_rgba(17,18,16,0.2)]"
              />
            </div>
            <div className="px-2.5 pb-2.5 pt-4">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.09em] text-[#8a8c86]">
                <span>
                  {String(project.index).padStart(2, "0")} · {project.dates}
                </span>
                <ArrowUpRight className="size-4 text-[#111210]" />
              </div>
              <h3 className="mt-2 text-[19px] font-medium tracking-[-0.03em] text-[#111210]">
                {project.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-[14px] leading-[1.55] text-[#6f7177]">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-[#f3f2ee] px-2.5 py-1 text-[11px] text-[#5f655d]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mx-auto mt-6 flex w-full max-w-[1312px] items-center justify-between gap-6 px-5 sm:px-8">
        <div className="flex items-center gap-2">
          {[
            {
              dir: -1 as const,
              enabled: canPrev,
              Icon: ArrowLeft,
              label: "Previous projects",
            },
            {
              dir: 1 as const,
              enabled: canNext,
              Icon: ArrowRight,
              label: "Next projects",
            },
          ].map(({ dir, enabled, Icon, label }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              disabled={!enabled}
              onClick={() => step(dir)}
              className={cn(
                "grid size-9 place-items-center rounded-full border border-black/10 bg-white text-[#111210] transition-all",
                enabled ? "hover:bg-[#f5f5f3]" : "cursor-default opacity-35",
              )}
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>
        {footer}
      </div>
    </div>
  );
}
