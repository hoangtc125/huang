import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

// Local/dev/build: run from apps/ so content is ./content
const CWD_CONTENT_ROOT = path.join(process.cwd(), "content");
// Cloudflare runtime bundle: content is copied next to server function root
const BUNDLED_CONTENT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "content"
);

export const CONTENT_ROOT = fs.existsSync(path.join(CWD_CONTENT_ROOT, "collections"))
  ? CWD_CONTENT_ROOT
  : BUNDLED_CONTENT_ROOT;

export function getContentPath(...segments: string[]): string {
  return path.join(CONTENT_ROOT, ...segments);
}

export function getCollectionFiles(collection: string): string[] {
  const dir = getContentPath("collections", collection);
  if (!fs.existsSync(dir)) {
    throw new Error(
      `Missing content directory: ${dir}. Tried CWD root: ${CWD_CONTENT_ROOT} and bundle root: ${BUNDLED_CONTENT_ROOT}.`
    );
  }
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
      .map((f) => path.join(dir, f));
  } catch {
    return [];
  }
}

export function readMDFile(
  filePath: string
): { data: Record<string, unknown>; content: string } | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    return { data, content: content.trim() };
  } catch {
    return null;
  }
}

export function calcReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Convert markdown to HTML with syntax highlighting (server-side)
// Uses unified/remark/rehype pipeline
let _processor: unknown = null;

async function getProcessor() {
  if (_processor) return _processor as import("unified").Processor;
  const { unified } = await import("unified");
  const { default: remarkParse } = await import("remark-parse");
  const { default: remarkGfm } = await import("remark-gfm");
  const { default: remarkRehype } = await import("remark-rehype");
  const { default: rehypeHighlight } = await import("rehype-highlight");
  const { default: rehypeSlug } = await import("rehype-slug");
  const { default: rehypeStringify } = await import("rehype-stringify");

  _processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug) // adds id=... to headings so TOC links can work
    .use(rehypeHighlight)
    .use(rehypeStringify);

  return _processor as import("unified").Processor;
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const processor = await getProcessor();
  const result = await processor.process(markdown);
  return String(result);
}

type TocItem = { id: string; text: string; level: 2 | 3 };

function headingText(node: unknown): string {
  // Extract plain text from a mdast heading node (handles nested emphasis/links).
  const parts: string[] = [];
  const stack: any[] = [node];
  while (stack.length) {
    const cur = stack.pop();
    if (!cur) continue;
    if (typeof cur.value === "string") parts.push(cur.value);
    if (Array.isArray(cur.children)) {
      for (let i = cur.children.length - 1; i >= 0; i--) stack.push(cur.children[i]);
    }
  }
  return parts.join("").replace(/\s+/g, " ").trim();
}

export async function extractToc(markdown: string): Promise<TocItem[]> {
  const { unified } = await import("unified");
  const { default: remarkParse } = await import("remark-parse");
  const { visit } = await import("unist-util-visit");
  const { default: GithubSlugger } = await import("github-slugger");

  const tree = unified().use(remarkParse).parse(markdown);
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  visit(tree as any, "heading", (node: any) => {
    const depth = Number(node.depth);
    if (depth !== 2 && depth !== 3) return;
    const text = headingText(node);
    if (!text) return;
    const id = slugger.slug(text);
    items.push({ id, text, level: depth as 2 | 3 });
  });

  return items;
}
