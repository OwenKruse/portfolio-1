import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="mx-auto flex h-14 max-w-[1320px] items-center justify-between border border-border/80 bg-background/90 px-4 shadow-[0_10px_40px_rgba(20,20,18,0.05)] backdrop-blur-md sm:px-5">
        <Link
          href="#about"
          className="flex items-center gap-3 text-sm font-medium tracking-[-0.02em]"
        >
          <span className="grid size-7 place-items-center bg-foreground font-mono text-[10px] text-background">
            {DATA.initials}
          </span>
          <span className="hidden sm:inline">{DATA.name}</span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 text-xs text-muted-foreground md:flex"
        >
          <Link
            href="#projects"
            className="transition-colors duration-200 hover:text-foreground"
          >
            Work
          </Link>
          <Link
            href="#experience"
            className="transition-colors duration-200 hover:text-foreground"
          >
            Experience
          </Link>
          <Link
            href="#contact"
            className="transition-colors duration-200 hover:text-foreground"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <ModeToggle />
          <Link
            href={`mailto:${DATA.contact.email}`}
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-9 rounded-none bg-[#3157f6] px-3 text-white shadow-none hover:bg-[#2448db] sm:px-4",
            )}
          >
            <span className="hidden sm:inline">Let&apos;s talk</span>
            <span className="sm:hidden">Email</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
