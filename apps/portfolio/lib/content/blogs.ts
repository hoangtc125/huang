import { getCollectionFiles, readMDFile, calcReadingTime } from "./utils";
import type { BlogPost } from "./types";

export function getBlogPosts(options?: {
  topic?: string;
  featured?: boolean;
  publishedOnly?: boolean;
}): BlogPost[] {
  const files = getCollectionFiles("blogs");
  const posts: BlogPost[] = [];
  const publishedOnly = options?.publishedOnly ?? true;

  for (const file of files) {
    const parsed = readMDFile(file);
    if (!parsed) continue;
    const { data, content } = parsed;

    if (publishedOnly && data.published === false) continue;
    if (options?.topic && data.topic !== options.topic && data.category !== options.topic) continue;
    if (options?.featured !== undefined && Boolean(data.featured) !== options.featured) continue;

    posts.push({
      slug: String(data.slug ?? ""),
      title: String(data.title ?? ""),
      description: String(data.description ?? data.excerpt ?? ""),
      content,
      coverImage: data.cover ? String(data.cover) : data.coverImage ? String(data.coverImage) : undefined,
      topic: String(data.topic ?? data.category ?? "general"),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      readingTime: typeof data.reading_time === "number" ? data.reading_time : calcReadingTime(content),
      publishedAt: String(data.date ?? data.publishedAt ?? ""),
      published: data.published !== false,
      featured: Boolean(data.featured),
      relatedProjects: Array.isArray(data.related_projects) ? data.related_projects.map(String) : [],
      relatedBlogs: Array.isArray(data.related_blogs) ? data.related_blogs.map(String) : [],
      seoTitle: data.seo_title ? String(data.seo_title) : undefined,
      seoDescription: data.seo_description ? String(data.seo_description) : undefined,
    });
  }

  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getBlogBySlug(slug: string): BlogPost | null {
  return getBlogPosts({ publishedOnly: false }).find((p) => p.slug === slug) ?? null;
}

export function getBlogsBySlugs(slugs: string[]): BlogPost[] {
  if (!slugs.length) return [];
  const all = getBlogPosts({ publishedOnly: false });
  return slugs.map((s) => all.find((p) => p.slug === s)).filter((p): p is BlogPost => Boolean(p));
}
