import { ProjectCarousel } from "@/components/new/project-carousel";
import { Reveal } from "@/components/new/reveal";
import { SiteNav } from "@/components/new/site-nav";
import { WaveLogo, Waveform } from "@/components/new/waveform";
import { Icons } from "@/components/icons";
import { PROJECT_BACKGROUNDS } from "@/data/project-backgrounds";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CONTAINER = "mx-auto w-full max-w-[1312px] px-5 sm:px-8";

const BUTTON_PRIMARY =
  "inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#111210] bg-[#111210] px-4 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition-colors hover:bg-[#2a2b28]";
const BUTTON_SECONDARY =
  "inline-flex h-10 items-center gap-2 rounded-[10px] border border-black/10 bg-white px-4 text-sm font-medium text-[#111210] transition-colors hover:bg-[#f5f5f3]";

const LINKEDIN_URL =
  DATA.navbar.find((item) => item.label === "LinkedIn")?.href ?? "#";

const projects = DATA.projects.map((project, i) => ({
  ...project,
  index: i + 1,
  background: PROJECT_BACKGROUNDS[i % PROJECT_BACKGROUNDS.length],
  description: project.description.trim(),
}));
const [featured, ...rest] = projects;
const spotlight = rest.slice(0, 2);
const more = rest.slice(2);

function Eyebrow({
  index,
  children,
  dark,
}: {
  index: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <p
      className={cn(
        "text-[11px] uppercase tracking-[0.09em]",
        dark ? "text-white/45" : "text-[#777a75]",
      )}
    >
      [{index}] {children}
    </p>
  );
}

function ProjectImage({
  src,
  background,
  alt,
  sizes,
  className,
}: {
  src: string;
  background: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[20px] bg-[#efeee9]",
        className,
      )}
    >
      <Image
        src={background}
        alt=""
        aria-hidden
        fill
        sizes={sizes}
        className="object-cover"
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-contain p-1 drop-shadow-[0_16px_32px_rgba(17,18,16,0.18)]"
      />
    </div>
  );
}

function TechList({ items }: { items: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((tech) => (
        <span
          key={tech}
          className="rounded-full bg-[#f3f2ee] px-2.5 py-1 text-[11px] text-[#5f655d]"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <main
      id="top"
      className="min-h-[100dvh] overflow-x-clip bg-white text-[#111210] antialiased selection:bg-[#f6d9b4]"
    >
      <SiteNav />

      {/* Hero */}
      <section className={cn(CONTAINER, "pb-16 pt-[120px] sm:pt-[150px]")}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <Reveal>
            <h1 className="max-w-[640px] text-[clamp(44px,5vw,74px)] font-normal leading-[1.04] tracking-[-0.055em]">
              Hi I&apos;m Owen{" "}
            </h1>
            <p className="mt-6 max-w-[520px] text-[18px] leading-[1.55] text-[#5f655d]">
              software engineer and computer science student
            </p>
            <Link
              href="#work"
              className="group mt-9 inline-flex items-center gap-2.5 rounded-full py-1.5 pr-3 text-[15px] font-medium text-[#111210]"
            >
              <span className="grid size-[18px] place-items-center">
                <svg
                  viewBox="0 0 12 14"
                  className="size-3 fill-current transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <path d="M0 0.8v12.4a.8.8 0 0 0 1.2.7l10.4-6.2a.8.8 0 0 0 0-1.4L1.2.1A.8.8 0 0 0 0 .8Z" />
                </svg>
              </span>
              See my work
            </Link>
          </Reveal>

          <Reveal delay={0.12} className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[34px] bg-[linear-gradient(120deg,#c8d5e2_0%,#ece6da_38%,#f6dcb9_68%,#efc39a_100%)] opacity-70 blur-2xl"
            />
            <div className="relative rounded-[26px] bg-[linear-gradient(120deg,#cdd9e5_0%,#f1ebdf_38%,#f7dfbf_68%,#f0c8a2_100%)] p-[9px] shadow-[0_30px_70px_-35px_rgba(150,105,60,0.45)]">
              <div className="rounded-[18px] bg-white px-5 pb-6 pt-5">
         
               


                <Link
                  href={`mailto:${DATA.contact.email}`}
                  className="group flex flex-col items-center rounded-[12px] py-2 text-center"
                >
                  <Mail className="size-4 text-[#292826] transition-transform group-hover:-translate-y-0.5" />
                  <span className="mt-2.5 text-[15px] font-medium text-[#111210]">
                    Send me an email
                  </span>
                  <span className="mt-1 text-[12px] text-[#8a8c86]">
                    {DATA.contact.email}
                  </span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Work */}
      <section
        id="work"
        className="mt-10 scroll-mt-10 overflow-hidden rounded-t-[36px] border-t border-black/[0.05] bg-[#fbfbfa] pb-28 pt-24 sm:pt-[112px]"
      >
        <div className={CONTAINER}>
          <Reveal className="mx-auto max-w-[760px] text-center">
            <Eyebrow index="01">Selected work</Eyebrow>
            <h2 className="mt-5 text-[clamp(42px,4.6vw,68px)] font-normal leading-[1.06] tracking-[-0.055em]">
              Built to be used.
            </h2>
            <p className="mx-auto mt-5 max-w-[520px] text-[18px] leading-[1.55] text-[#5f655d]">
              A selection of independent products, client work, and experiments
              spanning AI, finance, media, and commerce.
            </p>
          </Reveal>

          {/* Featured */}
          <Reveal className="mt-16 sm:mt-20">
            <Link
              href={featured.href}
              target="_blank"
              rel="noreferrer"
              className="group grid overflow-hidden rounded-[28px] border border-black/[0.06] bg-white p-2.5 shadow-[0_40px_80px_-50px_rgba(17,18,16,0.25)] xl:grid-cols-[0.8fr_1.4fr]"
            >
              <div className="flex flex-col p-6 sm:p-9">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.09em] text-[#8a8c86]">
                  <span>01 · Featured</span>
                  <span>{featured.dates}</span>
                </div>
                <h3 className="mt-8 text-[clamp(32px,3vw,44px)] font-normal leading-[1.05] tracking-[-0.05em]">
                  {featured.title}
                </h3>
                <p className="mt-4 text-[16px] leading-[1.6] text-[#5f655d]">
                  {featured.description}
                </p>
                <div className="mt-6">
                  <TechList items={featured.technologies} />
                </div>
                <span className={cn(BUTTON_PRIMARY, "mt-10 w-fit xl:mt-auto")}>
                  Visit site
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
              <ProjectImage
                src={featured.image}
                background={featured.background}
                alt={`${featured.title} screenshot`}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="aspect-[1.7] xl:aspect-auto"
              />
            </Link>
          </Reveal>

          {/* Spotlight pair */}
          <div className="mt-3.5 grid gap-3.5 md:grid-cols-2">
            {spotlight.map((project, i) => (
              <Reveal key={project.title} delay={i * 0.08}>
                <Link
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-full flex-col rounded-[28px] border border-black/[0.06] bg-white p-2.5"
                >
                  <ProjectImage
                    src={project.image}
                    background={project.background}
                    alt={`${project.title} screenshot`}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="aspect-[1.7]"
                  />
                  <div className="flex flex-1 flex-col px-4 pb-4 pt-6 sm:px-6">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.09em] text-[#8a8c86]">
                      <span>
                        {String(project.index).padStart(2, "0")} ·{" "}
                        {project.dates}
                      </span>
                      <ArrowUpRight className="size-4 text-[#111210]" />
                    </div>
                    <h3 className="mt-3 text-[26px] font-normal tracking-[-0.045em]">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-[1.6] text-[#5f655d]">
                      {project.description}
                    </p>
                    <div className="mt-auto pt-6">
                      <TechList items={project.technologies} />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-24 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h3 className="text-[30px] font-[480] leading-[1.15] tracking-[-0.03em] text-[#292826]">
              More from the shelf
            </h3>
            <p className="max-w-[360px] text-[15px] leading-[1.55] text-[#6f7177]">
              Client sites, side projects, and earlier experiments.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-8">
          <ProjectCarousel
            projects={more.map((p) => ({
              index: p.index,
              title: p.title,
              href: p.href,
              dates: p.dates,
              description: p.description,
              image: p.image,
              background: p.background,
              technologies: p.technologies,
            }))}
            footer={
              <Link
                href={DATA.contact.social.GitHub.url}
                target="_blank"
                rel="noreferrer"
                className={cn(BUTTON_SECONDARY, "h-9 text-[13px]")}
              >
                More on GitHub
                <ArrowUpRight className="size-3.5" />
              </Link>
            }
          />
        </Reveal>
      </section>

      {/* Experience */}
      <section
        id="experience"
        className="scroll-mt-10 bg-[#171817] py-24 text-white sm:py-[128px]"
      >
        <div className={CONTAINER}>
          <Reveal className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <Eyebrow index="02" dark>
                Experience
              </Eyebrow>
              <h2 className="mt-5 max-w-[720px] text-[clamp(42px,4.6vw,68px)] font-normal leading-[1.06] tracking-[-0.055em]">
                The work behind the work.
              </h2>
            </div>
            <p className="max-w-[420px] text-[16px] leading-[1.6] text-white/55 lg:justify-self-end">
              Internships and roles across AI training, full-stack product
              engineering, and operations.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
            {DATA.work.map((work, i) => (
              <Reveal key={work.company} delay={i * 0.08} className="h-full">
                <article className="group flex h-full flex-col rounded-[22px] border border-white/[0.06] bg-[#212220] p-6 transition-colors duration-300 hover:bg-[#262725] sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="relative size-14 overflow-hidden rounded-full bg-white shadow-[0_0_0_6px_rgba(255,255,255,0.04)]">
                      <Image
                        src={work.logoUrl}
                        alt={`${work.company} logo`}
                        fill
                        sizes="56px"
                        className="object-contain p-2.5"
                      />
                    </div>
                    <span className="whitespace-nowrap pt-1 text-right text-[10px] uppercase tracking-[0.09em] text-white/40">
                      {work.start} — {work.end ?? "Present"}
                    </span>
                  </div>
                  <h3 className="mt-8 text-[24px] font-normal tracking-[-0.04em]">
                    {work.company}
                  </h3>
                  <p className="mt-1 text-[14px] text-white/60">{work.title}</p>
                  <p className="mt-5 text-[14px] leading-[1.65] text-white/45">
                    {work.description}
                  </p>
                  <Waveform
                    seed={i + 2}
                    className="mt-auto pt-10 text-white/[0.14] transition-colors duration-500 group-hover:text-[#f0c8a2]/50"
                  />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Education + toolkit */}
      <section
        id="education"
        className="scroll-mt-10 border-b border-black/[0.07] bg-[#fbfbfa] py-24 sm:py-[118px]"
      >
        <div className={CONTAINER}>
          <Reveal className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <Eyebrow index="03">Foundations</Eyebrow>
              <h2 className="mt-5 text-[clamp(42px,4.6vw,68px)] font-normal leading-[1.06] tracking-[-0.055em]">
                Education
              </h2>
            </div>
            <p className="max-w-[420px] text-[16px] leading-[1.6] text-[#6f7177] lg:justify-self-end">
              {DATA.description}
            </p>
          </Reveal>

          <Reveal className="mt-14">
            <div className="hidden grid-cols-[1fr_1.4fr_auto] gap-6 border-b border-black/[0.08] pb-4 text-[10px] uppercase tracking-[0.09em] text-[#8a8c86] md:grid">
              <span>School</span>
              <span>Program</span>
              <span>Years</span>
            </div>
            {DATA.education.map((education) => (
              <Link
                key={education.school}
                href={education.href}
                target="_blank"
                rel="noreferrer"
                className="group grid items-center gap-x-6 gap-y-1 border-b border-black/[0.08] py-6 md:grid-cols-[1fr_1.4fr_auto]"
              >
                <span className="flex items-center gap-3.5 text-[15px] font-medium">
                  <span className="relative size-9 shrink-0 overflow-hidden rounded-full border border-black/[0.06] bg-white">
                    <Image
                      src={education.logoUrl}
                      alt=""
                      fill
                      sizes="36px"
                      className="object-contain p-1.5"
                    />
                  </span>
                  {education.school}
                </span>
                <span className="text-[15px] text-[#5f655d] max-md:pl-[50px]">
                  {education.degree}
                </span>
                <span className="text-[14px] tabular-nums text-[#8a8c86] max-md:pl-[50px]">
                  {education.start} — {education.end}
                </span>
              </Link>
            ))}

          </Reveal>
        </div>
      </section>

      {/* Contact + footer */}
      <footer
        id="contact"
        className="relative isolate overflow-hidden bg-[#060908] text-white"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute -left-[10%] -top-[20%] h-[70%] w-[60%] rounded-full bg-[#3c6a78] opacity-50 blur-[120px]" />
          <div className="absolute -right-[5%] top-[-10%] h-[60%] w-[50%] rounded-full bg-[#c98a54] opacity-40 blur-[130px]" />
          <div className="absolute left-[30%] top-[25%] h-[45%] w-[45%] rounded-full bg-[#445b3d] opacity-50 blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,29,35,0.15)_0%,rgba(10,17,18,0.45)_40%,rgba(6,9,8,0.94)_75%,#050606_100%)]" />
        </div>

        <div className={cn(CONTAINER, "pt-28 sm:pt-36")}>
          <Reveal>
            <Eyebrow index="04" dark>
              Contact
            </Eyebrow>
            <h2 className="mt-5 max-w-[900px] text-[clamp(46px,5.4vw,80px)] font-normal leading-[1.02] tracking-[-0.06em]">
              Have something worth building?
            </h2>
            <p className="mt-6 max-w-[520px] text-[17px] leading-[1.6] text-white/60">
              I&apos;m always interested in thoughtful products, hard technical
              problems, and teams that care about the details.
            </p>
            <div className="mt-10 flex flex-wrap gap-2.5">
              <Link
                href={`mailto:${DATA.contact.email}`}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-[#111210] transition-colors hover:bg-white/90"
              >
                <Mail className="size-4" />
                {DATA.contact.email}
              </Link>
              <Link
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/15"
              >
                LinkedIn
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-28 grid gap-12 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
            <div>
              <span className="flex items-center gap-2.5 text-[17px] font-semibold tracking-[-0.03em]">
                <WaveLogo />
                {DATA.name}
              </span>
              <p className="mt-4 max-w-[300px] text-[14px] leading-[1.6] text-white/50">
                {DATA.description}
              </p>
            </div>
            <div>
              <p className="text-[13px] font-medium text-white">Work</p>
              <ul className="mt-4 space-y-2.5 text-[14px] text-white/50">
                {projects.slice(0, 4).map((project) => (
                  <li key={project.title}>
                    <Link
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors hover:text-white"
                    >
                      {project.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[13px] font-medium text-white">Elsewhere</p>
              <ul className="mt-4 space-y-2.5 text-[14px] text-white/50">
                {[
                  { label: "GitHub", href: DATA.contact.social.GitHub.url },
                  { label: "LinkedIn", href: LINKEDIN_URL },
                  { label: "Email", href: `mailto:${DATA.contact.email}` },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={
                        link.href.startsWith("mailto") ? undefined : "_blank"
                      }
                      rel="noreferrer"
                      className="transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="#top"
                    className="transition-colors hover:text-white"
                  >
                    Back to top ↑
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 flex flex-col justify-between gap-2 border-t border-white/10 pt-6 text-[12px] text-white/35 sm:flex-row">
            <span>
              © {new Date().getFullYear()} {DATA.name}
            </span>
            <span>{DATA.location}</span>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none mt-10 select-none overflow-hidden"
        >
          <p className="translate-y-[18%] whitespace-nowrap bg-gradient-to-b from-white/60 to-white/0 bg-clip-text text-center text-[clamp(88px,18.5vw,300px)] font-medium leading-[0.85] tracking-[-0.07em] text-transparent">
            {DATA.name}
          </p>
        </div>
      </footer>
    </main>
  );
}
