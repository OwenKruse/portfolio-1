import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  image?: string;
  video?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
  underConstruction?: boolean;
  featured?: boolean;
  index?: number;
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  image,
  video,
  className,
  underConstruction,
  featured = false,
  index = 1,
}: Props) {
  return (
    <Card
      className={cn(
        "group grid h-full overflow-hidden rounded-none border-0 border-t border-border bg-transparent text-card-foreground",
        featured && "lg:grid-cols-[1.18fr_0.82fr]",
        className,
      )}
    >
      <Link
        href={href || "#"}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noreferrer" : undefined}
        aria-label={`View ${title}`}
        className={cn(
          "relative block min-h-[260px] overflow-hidden bg-muted sm:min-h-[340px]",
          featured && "lg:min-h-[560px]",
        )}
      >
        {underConstruction && (
          <div className="absolute right-3 top-3 z-20 border border-black/10 bg-[#f2bd3b] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-black">
            In progress
          </div>
        )}
        {video ? (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="pointer-events-none absolute inset-0 size-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.015]"
          />
        ) : null}
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes={featured ? "100vw" : "(min-width: 1024px) 50vw, 100vw"}
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.015]"
          />
        ) : null}
        <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
      </Link>

      <div
        className={cn(
          "flex flex-col border-t border-border pt-5",
          featured && "lg:border-l lg:border-t-0 lg:p-8",
        )}
      >
        <CardContent className="flex flex-1 flex-col p-0">
          <div className="flex items-start justify-between gap-6">
            <span className="font-mono text-[10px] tabular-nums tracking-[0.14em] text-muted-foreground">
              {String(index).padStart(2, "0")} / {dates}
            </span>
            <ArrowUpRight className="size-5 transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </div>

          <div className={cn("mt-8", featured && "lg:mt-auto")}>
            <h3
              className={cn(
                "font-serif text-4xl leading-none tracking-[-0.035em]",
                featured && "sm:text-6xl lg:text-7xl",
              )}
            >
              {title}
            </h3>
            <p
              className={cn(
                "mt-4 max-w-xl text-sm leading-6 text-muted-foreground",
                featured && "text-base leading-7",
              )}
            >
              {description}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-1.5 px-0 pb-0 pt-7">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="rounded-none border-border bg-transparent px-2 py-1 font-mono text-[9px] font-normal uppercase tracking-[0.08em] text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </div>
    </Card>
  );
}
