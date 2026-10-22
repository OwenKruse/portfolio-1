import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { KATEX_MACROS, KATEX_TIP_OPTIONS } from "@/data/math-colors";
import type { Element, Root } from "hast";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

type Tip = { q: string; a: string };

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  tips?: Record<string, Tip>;
};

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

// [text](#tip:id) in a post marks a hover tip trigger instead of a link.
function rehypeTipLinks() {
  const walk = (node: Root | Element) => {
    for (const child of node.children) {
      if (child.type !== "element") continue;
      const href = child.properties.href;
      if (child.tagName === "a" && typeof href === "string" && href.startsWith("#tip:")) {
        child.tagName = "span";
        child.properties = { dataTip: href.slice("#tip:".length) };
      }
      walk(child);
    }
  };
  return (tree: Root) => walk(tree);
}

export async function markdownToHTML(markdown: string) {
  const p = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeTipLinks)
    .use(rehypeKatex, { macros: { ...KATEX_MACROS }, ...KATEX_TIP_OPTIONS })
    .use(rehypePrettyCode, {
      // https://rehype-pretty.pages.dev/#usage
      theme: {
        light: "min-light",
        dark: "min-dark",
      },
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(markdown);

  return p.toString();
}

export async function getPost(slug: string) {
  const filePath = path.join("content", `${slug}.mdx`);
  let source = fs.readFileSync(filePath, "utf-8");
  const { content: rawContent, data: metadata } = matter(source);
  const content = await markdownToHTML(rawContent);
  // Count from the Markdown, since KaTeX turns each formula into dozens of tiny spans.
  const tips: Record<string, Tip> = {};
  for (const [id, tip] of Object.entries((metadata as Metadata).tips ?? {})) {
    tips[id] = { q: await markdownToHTML(tip.q), a: await markdownToHTML(tip.a) };
  }
  const words = rawContent
    .replace(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$/g, "math")
    .split(/\s+/)
    .filter(Boolean).length;
  return {
    source: content,
    metadata,
    slug,
    words,
    tips,
  };
}

async function getAllPosts(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  return Promise.all(
    mdxFiles.map(async (file) => {
      let slug = path.basename(file, path.extname(file));
      let { metadata, source } = await getPost(slug);
      return {
        metadata,
        slug,
        source,
      };
    }),
  );
}

export async function getBlogPosts() {
  return getAllPosts(path.join(process.cwd(), "content"));
}
