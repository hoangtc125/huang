import type { Video } from "./types";
import videoEntries from "./generated/videos";

type RawEntry = {
  file: string;
  data: Record<string, unknown>;
  content: string;
};

export function getVideos(): Video[] {
  const videos: Video[] = [];
  const entries = videoEntries as unknown as RawEntry[];

  for (const entry of entries) {
    const { data } = entry;

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
