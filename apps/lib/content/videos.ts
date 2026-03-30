import { getCollectionFiles, readMDFile } from "./utils";
import type { Video } from "./types";

export function getVideos(): Video[] {
  const files = getCollectionFiles("videos");
  const videos: Video[] = [];

  for (const file of files) {
    const parsed = readMDFile(file);
    if (!parsed) continue;
    const { data } = parsed;

    if (data.published === false) continue;

    videos.push({
      slug: String(data.slug ?? ""),
      title: String(data.title ?? ""),
      description: String(data.description ?? ""),
      youtubeId: String(data.youtube_id ?? ""),
      thumbnail: data.thumbnail ? String(data.thumbnail) : undefined,
      publishedAt: String(data.date ?? ""),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      relatedBlogs: Array.isArray(data.related_blogs) ? data.related_blogs.map(String) : [],
      featured: Boolean(data.featured),
      duration: data.duration ? String(data.duration) : undefined,
      views: data.views ? String(data.views) : undefined,
      published: data.published !== false,
    });
  }

  return videos.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getVideoBySlug(slug: string): Video | null {
  return getVideos().find((v) => v.slug === slug) ?? null;
}
