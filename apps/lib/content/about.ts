import aboutData from "./generated/static/about";

export function getAboutContent(): string {
  return (aboutData as unknown as { content: string }).content ?? "";
}
