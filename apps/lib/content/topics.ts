import { getCollectionFiles, readMDFile } from "./utils";
import type { Topic } from "./types";

export function getTopics(): Topic[] {
  const files = getCollectionFiles("topics");
  const topics: Topic[] = [];

  for (const file of files) {
    const parsed = readMDFile(file);
    if (!parsed) continue;
    const { data } = parsed;
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
