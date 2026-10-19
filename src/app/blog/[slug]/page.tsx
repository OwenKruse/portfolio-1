import { SiteNav } from "@/components/new/site-nav";
import { getBlogPosts, getPost } from "@/data/blog";
import { DATA } from "@/data/resume";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { params: Promise<{ slug: string }> };

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

async function loadPost(slug: string) {
  const posts = await getBlogPosts();
  if (!posts.some((post) => post.slug === slug)) return null;
  return getPost(slug);
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) return {};

  const { title, summary, image } = post.metadata;
  return {
    title,
    description: summary,
    openGraph: {
      title,
      description: summary,
      type: "article",
      publishedTime: post.metadata.publishedAt,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: summary,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogPost({ params }: Params) {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) notFound();

  const words = post.source.replace(/<[^>]+>/g, " ").split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 230));

  return (
    <main className="min-h-[100dvh] overflow-x-clip bg-white text-[#111210] antialiased selection:bg-[#f6d9b4]">
      <SiteNav />

      <article className="mx-auto w-full max-w-[720px] px-5 pb-28 pt-[120px] sm:px-8 sm:pt-[150px]">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#6f7177] transition-colors hover:text-[#111210]"
        >
          <ArrowLeft className="size-3.5" />
          All posts
        </Link>

        <header className="mt-10">
          <p className="text-[11px] uppercase tracking-[0.09em] text-[#8a8c86]">
            {formatDate(post.metadata.publishedAt)} · {minutes} min read
          </p>
          <h1 className="mt-5 text-[clamp(36px,4.4vw,56px)] font-normal leading-[1.06] tracking-[-0.05em]">
            {post.metadata.title}
          </h1>
          <p className="mt-5 text-[19px] leading-[1.55] text-[#5f655d]">
            {post.metadata.summary}
          </p>
          <p className="mt-6 text-[14px] text-[#8a8c86]">By {DATA.name}</p>
        </header>

        {post.metadata.image && (
          <div className="relative mt-12 aspect-[1.63] overflow-hidden rounded-[20px] border border-black/[0.06] bg-[#efeee9]">
            <Image
              src={post.metadata.image}
              alt={post.metadata.title}
              fill
              priority
              sizes="(min-width: 768px) 720px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div
          className="prose prose-neutral mt-12 max-w-none text-[17px] leading-[1.75] text-[#2f322e] prose-headings:font-normal prose-headings:tracking-[-0.035em] prose-headings:text-[#111210] prose-h2:mt-14 prose-h2:text-[30px] prose-h3:text-[22px] prose-p:text-[#3a3d39] prose-a:text-[#111210] prose-a:decoration-[#f0c8a2] prose-a:decoration-2 prose-a:underline-offset-4 hover:prose-a:decoration-[#111210] prose-strong:font-semibold prose-strong:text-[#111210] prose-blockquote:border-l-[#f0c8a2] prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-[#5f655d] prose-code:rounded prose-code:bg-[#f3f2ee] prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-[14px] prose-pre:border prose-pre:border-black/[0.06] prose-pre:bg-[#fbfbfa] prose-li:marker:text-[#b0b2ab] prose-hr:border-black/[0.08]"
          dangerouslySetInnerHTML={{ __html: post.source }}
        />
      </article>
    </main>
  );
}
