import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Content root is at <repo-root>/content, 2 levels up from apps/portfolio
export const CONTENT_ROOT = path.join(process.cwd(), "..", "..", "content");

export function getContentPath(...segments: string[]): string {
  return path.join(CONTENT_ROOT, ...segments);
}

export function getCollectionFiles(collection: string): string[] {
  const dir = getContentPath("collections", collection);
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
  const { default: rehypeStringify } = await import("rehype-stringify");

  _processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify);

  return _processor as import("unified").Processor;
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const processor = await getProcessor();
  const result = await processor.process(markdown);
  return String(result);
}
