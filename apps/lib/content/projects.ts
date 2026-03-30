import type { Project, ProjectFeature } from "./types";
import raw from "./generated-content.json";

type RawEntry = {
  file: string;
  data: Record<string, unknown>;
  content: string;
};

export function getProjects(options?: { featured?: boolean }): Project[] {
  const projects: Project[] = [];
  const entries = (raw.projects ?? []) as RawEntry[];

  for (const entry of entries) {
    const { data, content } = entry;

    if (data.published === false) continue;
    if (options?.featured !== undefined && Boolean(data.featured) !== options.featured) continue;

    const features: ProjectFeature[] = Array.isArray(data.features)
      ? data.features.map((f: Record<string, string>) => ({
          title: String(f.title ?? ""),
          desc: String(f.desc ?? ""),
          icon: f.icon ? String(f.icon) : undefined,
        }))
      : [];

    projects.push({
      slug: String(data.slug ?? ""),
      title: String(data.title ?? ""),
      description: String(data.description ?? ""),
      shortDesc: String(data.short_desc ?? data.description ?? ""),
      thumbnail: data.thumbnail ? String(data.thumbnail) : undefined,
      images: Array.isArray(data.images) ? data.images.map(String) : [],
      iconUrl: data.icon_url ? String(data.icon_url) : data.iconUrl ? String(data.iconUrl) : undefined,
      type: (data.type ?? data.category ?? "web") as Project["type"],
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      techStack: Array.isArray(data.tech_stack) ? data.tech_stack.map(String) : Array.isArray(data.tags) ? data.tags.map(String) : [],
      demoUrl: data.demo_url ? String(data.demo_url) : undefined,
      sourceUrl: data.source_url ? String(data.source_url) : undefined,
      status: (data.status ?? "live") as Project["status"],
      featured: Boolean(data.featured),
      order: typeof data.order === "number" ? data.order : 99,
      publishedAt: String(data.date ?? ""),
      published: data.published !== false,
      relatedBlogs: Array.isArray(data.related_blogs) ? data.related_blogs.map(String) : [],
      features,
      architecture: String(data.architecture ?? ""),
      content,
      seoTitle: data.seo_title ? String(data.seo_title) : undefined,
      seoDescription: data.seo_description ? String(data.seo_description) : undefined,
    });
  }

  return projects.sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string): Project | null {
  return getProjects().find((p) => p.slug === slug) ?? null;
}

export function getProjectsBySlugs(slugs: string[]): Project[] {
  if (!slugs.length) return [];
  const all = getProjects();
  return slugs.map((s) => all.find((p) => p.slug === s)).filter((p): p is Project => Boolean(p));
}
