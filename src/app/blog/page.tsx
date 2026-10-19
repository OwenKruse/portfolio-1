import { Reveal } from "@/components/new/reveal";
import { SiteNav } from "@/components/new/site-nav";
import { getBlogPosts } from "@/data/blog";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const CONTAINER = "mx-auto w-full max-w-[1312px] px-5 sm:px-8";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on building products, AI, and whatever I'm working on.",
};

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = (await getBlogPosts()).sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime(),
  );

  return (
    <main className="min-h-[100dvh] overflow-x-clip bg-white text-[#111210] antialiased selection:bg-[#f6d9b4]">
      <SiteNav />

      <section className={cn(CONTAINER, "pb-16 pt-[120px] sm:pt-[150px]")}>
        <Reveal className="max-w-[760px]">
       
          <h1 className="mt-5 text-[clamp(44px,5vw,74px)] font-normal leading-[1.04] tracking-[-0.055em]">
            blog
          </h1>
          <p className="mt-6 max-w-[520px] text-[18px] leading-[1.55] text-[#5f655d]">
            Notes on the things I build, what I learn building them, and where
            I think AI is going.
          </p>
        </Reveal>
      </section>

      <section className="rounded-t-[36px] border-t border-black/[0.05] bg-[#fbfbfa] pb-28 pt-16 sm:pt-20">
        <div className={cn(CONTAINER, "grid gap-3.5")}>
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.06}>
              <Link
                href={`/blog/${post.slug}`}
                className="group grid overflow-hidden rounded-[28px] border border-black/[0.06] bg-white p-2.5 transition-shadow duration-300  md:grid-cols-[1.1fr_1fr]"
              >
                <div className="flex flex-col p-6 sm:p-9">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.09em] text-[#8a8c86]">
                    <span>{formatDate(post.metadata.publishedAt)}</span>
                    <ArrowUpRight className="size-4 text-[#111210] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <h2 className="mt-8 text-[clamp(28px,2.6vw,38px)] font-normal leading-[1.08] tracking-[-0.045em]">
                    {post.metadata.title}
                  </h2>
                  <p className="mt-4 text-[16px] leading-[1.6] text-[#5f655d]">
                    {post.metadata.summary}
                  </p>
                  <span className="mt-8 text-[14px] font-medium text-[#111210] md:mt-auto">
                    Read post →
                  </span>
                </div>
                {post.metadata.image && (
                  <div className="relative aspect-[1.6] overflow-hidden rounded-[20px] bg-[#efeee9]">
                    <Image
                      src={post.metadata.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className="object-cover object-left-top "
                    />
                  </div>
                )}
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
