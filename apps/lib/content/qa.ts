import type { QA } from "./types";
import raw from "./generated-content.json";

type RawEntry = {
  file: string;
  data: Record<string, unknown>;
  content: string;
};

export function getQAs(): QA[] {
  const qas: QA[] = [];
  const entries = (raw.qa ?? []) as RawEntry[];

  for (const entry of entries) {
    const { data, content } = entry;

    if (data.published === false) continue;

    qas.push({
      slug: String(data.slug ?? ""),
      question: String(data.question ?? ""),
      answer: content || String(data.answer ?? ""),
      category: String(data.category ?? "general"),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      published: data.published !== false,
      featured: Boolean(data.featured),
      order: typeof data.order === "number" ? data.order : 99,
    });
  }

  return qas.sort((a, b) => a.order - b.order);
}
