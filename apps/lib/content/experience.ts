import type { ExperienceItem } from "./types";
import experienceData from "./generated/static/experience";

export function getExperience(): ExperienceItem[] {
  const timeline = (experienceData.data as Record<string, unknown>).timeline;
  if (!Array.isArray(timeline)) return [];

  return timeline.map((item: Record<string, unknown>) => ({
    company: String(item.company ?? ""),
    role: String(item.role ?? ""),
    period: String(item.period ?? ""),
    description: String(item.description ?? ""),
    logo: item.logo ? String(item.logo) : undefined,
    highlights: Array.isArray(item.highlights) ? item.highlights.map(String) : [],
  }));
}
