"use client";

import { WaveLogo } from "@/components/new/waveform";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
];

function Collapsible({
  open,
  className,
  children,
}: {
  open: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-grid transition-[grid-template-columns,opacity,margin] duration-500 ease-in-out",
        open ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0",
        className,
      )}
    >
      <span className="overflow-hidden whitespace-nowrap">{children}</span>
    </span>
  );
}

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [first, last] = DATA.name.split(" ");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-8">
      <div
        className={cn(
          "mx-auto flex items-center justify-between border transition-all duration-500 ease-in-out",
          scrolled
            ? "max-w-[820px] rounded-full border-black/[0.06] bg-white/70 py-2 pl-5 pr-2 shadow-lg shadow-black/[0.04] backdrop-blur-xl"
            : "max-w-[1248px] rounded-none border-transparent bg-transparent py-3 pl-0 pr-0",
        )}
      >
        <Link
          href="#top"
          aria-label={DATA.name}
          className="flex items-center text-[17px] font-semibold tracking-[-0.03em] text-[#111210]"
        >
          <span aria-hidden>{first[0]}</span>
          <Collapsible
            open={!scrolled}
            className={scrolled ? "mr-0" : "mr-[0.3em]"}
          >
            {first.slice(1)}
          </Collapsible>
          <span aria-hidden>{last[0]}</span>
          <Collapsible open={!scrolled}>{last.slice(1)}</Collapsible>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-1.5 text-[15px] font-medium text-[#6f7177] transition-colors duration-200 hover:text-[#111210]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={DATA.contact.social.GitHub.url}
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 items-center rounded-[10px] border border-black/10 bg-white px-3.5 text-sm font-medium text-[#111210] transition-colors hover:bg-[#f5f5f3] sm:inline-flex"
          >
            GitHub
          </Link>
       
        </div>
      </div>
    </header>
  );
}
