import { getCollectionFiles, readMDFile } from "./utils";
import type { QA } from "./types";

export function getQAs(): QA[] {
  const files = getCollectionFiles("qa");
  const qas: QA[] = [];

  for (const file of files) {
    const parsed = readMDFile(file);
    if (!parsed) continue;
    const { data, content } = parsed;

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
