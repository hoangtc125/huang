import type { Topic } from "./types";
import topicEntries from "./generated/topics";

type RawEntry = {
  file: string;
  data: Record<string, unknown>;
  content: string;
};

export function getTopics(): Topic[] {
  const topics: Topic[] = [];
  const entries = topicEntries as unknown as RawEntry[];

  for (const entry of entries) {
    const { data } = entry;
    if (data.published === false) continue;

    topics.push({
      slug: String(data.slug ?? ""),
      title: String(data.title ?? ""),
      description: String(data.description ?? ""),
      color: String(data.color ?? "indigo"),
      icon: data.icon ? String(data.icon) : undefined,
      published: data.published !== false,
    });
  }

  return topics;
}

export function getTopicBySlug(slug: string): Topic | null {
  return getTopics().find((t) => t.slug === slug) ?? null;
}
