import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DATA } from "@/data/resume";
import { ArrowDownRight, ArrowUpRight, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BLUR_FADE_DELAY = 0.035;

export default function Page() {
  return (
    <main className="min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <section
        id="about"
        className="relative mx-auto grid min-h-[860px] w-full max-w-[1400px] border-x border-border/80 px-5 pt-32 sm:px-8 sm:pt-40 lg:grid-cols-[minmax(0,1.18fr)_minmax(360px,0.82fr)] lg:px-12"
      >
        <div className="relative z-10 flex flex-col justify-between pb-12 lg:pb-16 lg:pr-12">
          <div>
            <BlurFade delay={BLUR_FADE_DELAY}>
              <div className="mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="size-2 rounded-full bg-[#3157f6] shadow-[0_0_0_5px_rgba(49,87,246,0.12)]" />
                Available for ambitious builds
              </div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 2}>
              <h1 className="max-w-[880px] font-serif text-[clamp(4rem,8vw,8.7rem)] leading-[0.84] tracking-[-0.065em]">
                I build useful
                <br />
                software with
                <br />
                <span className="font-normal italic text-[#3157f6]">
                  a point of view.
                </span>
              </h1>
            </BlurFade>
          </div>

          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <div className="mt-16 grid gap-8 border-t border-border pt-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end lg:max-w-[760px]">
              <p className="max-w-xl text-balance text-lg leading-8 text-muted-foreground sm:text-xl">
                I&apos;m Owen, a software engineer and computer science student
                turning complex ideas into clear, dependable products.
              </p>
              <Button
                asChild
                size="lg"
                className="h-12 w-fit rounded-none bg-[#3157f6] px-6 text-white shadow-none transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#2448db]"
              >
                <Link href="#projects">
                  Explore work
                  <ArrowDownRight className="size-4" />
                </Link>
              </Button>
            </div>
          </BlurFade>
        </div>

        <BlurFade
          delay={BLUR_FADE_DELAY * 2}
          className="relative -mx-5 min-h-[520px] border-t border-border sm:-mx-8 lg:mx-0 lg:min-h-0 lg:border-l lg:border-t-0"
        >
          <div className="absolute inset-0 bg-[#3157f6]" />
        
          <div className="absolute inset-0 bg-gradient-to-t from-[#142154]/75 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 text-white sm:p-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/65">
                Based in
              </p>
              <p className="mt-1 text-sm">{DATA.location}</p>
            </div>
            <span className="font-serif text-6xl leading-none text-white/25">
              OK
            </span>
          </div>
        </BlurFade>
      </section>

      <section
        aria-label="Introduction"
        className="mx-auto grid w-full max-w-[1400px] border-x border-t border-border/80 lg:grid-cols-3"
      >
        <div className="border-b border-border p-6 lg:border-b-0 lg:border-r lg:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Current focus
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6">
            AI products, thoughtful interfaces, and full-stack systems that
            hold up in the real world.
          </p>
        </div>
        <div className="border-b border-border p-6 lg:col-span-2 lg:border-b-0 lg:p-10">
          <p className="max-w-3xl font-serif text-3xl leading-tight tracking-[-0.025em] sm:text-4xl">
            From multilingual audio to prediction-market tooling, I like
            building products where engineering rigor and interaction design
            have to meet.
          </p>
        </div>
      </section>

      <section
        id="projects"
        className="mx-auto w-full max-w-[1400px] border-x border-t border-border/80 px-5 py-24 sm:px-8 sm:py-32 lg:px-12"
      >
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="mb-14 grid gap-6 border-b border-border pb-8 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#3157f6]">
                01 / Selected work
              </p>
              <h2 className="mt-4 font-serif text-5xl leading-none tracking-[-0.045em] sm:text-7xl">
                Built to be used.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground sm:text-right">
              A selection of independent products, client work, and experiments
              spanning AI, finance, media, and commerce.
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 gap-x-6 gap-y-14 lg:grid-cols-2">
          {DATA.projects.map((project, index) => (
            <BlurFade
              key={project.title}
              delay={BLUR_FADE_DELAY * 2 + index * 0.025}
              className={index === 0 ? "lg:col-span-2" : ""}
            >
              <ProjectCard
                index={index + 1}
                featured={index === 0}
                href={project.href}
                title={project.title}
                description={project.description}
                dates={project.dates}
                tags={project.technologies}
                image={project.image}
                video={project.video}
                links={project.links}
                underConstruction={"underConstruction" in project}
              />
            </BlurFade>
          ))}
        </div>
      </section>

      <section
        id="experience"
        className="mx-auto grid w-full max-w-[1400px] border-x border-t border-border/80 lg:grid-cols-[0.72fr_1.28fr]"
      >
        <div className="border-b border-border p-5 sm:p-8 lg:border-b-0 lg:border-r lg:p-12">
          <div className="lg:sticky lg:top-28">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#3157f6]">
              02 / Practice
            </p>
            <h2 className="mt-4 max-w-md font-serif text-5xl leading-[0.96] tracking-[-0.045em] sm:text-7xl">
              The work behind the work.
            </h2>
            <p className="mt-8 max-w-md text-base leading-7 text-muted-foreground">
              {DATA.summary}
            </p>

            <div className="mt-10 flex flex-wrap gap-2">
              {DATA.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="rounded-none border-border bg-transparent px-2.5 py-1 font-mono text-[10px] font-normal uppercase tracking-[0.08em]"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8 lg:p-12">
          <div className="mb-12 flex items-end justify-between gap-4 border-b border-border pb-4">
            <h3 className="text-sm font-medium">Experience</h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              2024 — Now
            </span>
          </div>

          <div className="space-y-0">
            {DATA.work.map((work) => (
              <ResumeCard
                key={work.company}
                logoUrl={work.logoUrl}
                altText={work.company}
                title={work.company}
                subtitle={work.title}
                href={work.href}
                badges={work.badges}
                period={`${work.start} — ${work.end ?? "Present"}`}
                description={work.description}
              />
            ))}
          </div>

          <div className="mb-6 mt-20 flex items-end justify-between gap-4 border-b border-border pb-4">
            <h3 className="text-sm font-medium">Education</h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Foundations
            </span>
          </div>
          <div className="space-y-0">
            {DATA.education.map((education) => (
              <ResumeCard
                key={education.school}
                href={education.href}
                logoUrl={education.logoUrl}
                altText={education.school}
                title={education.school}
                subtitle={education.degree}
                period={`${education.start} — ${education.end}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="mx-auto w-full max-w-[1400px] border-x border-t border-[#34342f] bg-[#171712] p-5 text-[#f4f0e6] sm:p-8 lg:p-12"
      >
        <div className="relative overflow-hidden border border-white/15 px-5 py-20 sm:px-10 sm:py-28 lg:px-16">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-36 size-[420px] rounded-full border-[84px] border-[#3157f6] opacity-90 sm:size-[560px]"
          />
          <div className="relative z-10 max-w-4xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
              03 / Start a conversation
            </p>
            <h2 className="mt-5 max-w-3xl font-serif text-5xl leading-[0.92] tracking-[-0.05em] sm:text-7xl lg:text-8xl">
              Have something worth building?
            </h2>
            <p className="mt-8 max-w-xl text-base leading-7 text-white/65">
              I&apos;m always interested in thoughtful products, hard technical
              problems, and teams that care about the details.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-10 h-12 rounded-none bg-[#f4f0e6] px-6 text-[#171712] shadow-none hover:bg-white"
            >
              <Link href={`mailto:${DATA.contact.email}`}>
                <Mail className="size-4" />
                {DATA.contact.email}
              </Link>
            </Button>
          </div>
        </div>

        <Separator className="my-8 bg-white/15" />
        <footer className="flex flex-col gap-4 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-7 border border-white/20">
              <AvatarImage
                src={DATA.avatarUrl}
                alt={`Portrait of ${DATA.name}`}
                className="object-cover"
              />
              <AvatarFallback>{DATA.initials}</AvatarFallback>
            </Avatar>
            <span>{DATA.name} · Software engineer</span>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href={DATA.contact.social.GitHub.url}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              GitHub
            </Link>
            <Link
              href={DATA.navbar[1].href}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              LinkedIn
            </Link>
            <Link
              href="#about"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              Back to top
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
