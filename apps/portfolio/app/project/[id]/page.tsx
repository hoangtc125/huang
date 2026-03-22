import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug } from "@/lib/content/projects";
import { getBlogsBySlugs } from "@/lib/content/blogs";
import ProjectDetailClient from "./ProjectDetailClient";

// ── Static generation ─────────────────────────────────────────────────────
export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((p) => ({ id: p.slug }));
}

// ── Per-page SEO metadata ─────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = getProjectBySlug(id);
  if (!project) return {};

  const title = project.seoTitle ?? project.title;
  const description = project.seoDescription ?? project.description;

  return {
    title: `${title} | Huang Workspace`,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProjectBySlug(id);
  if (!project) notFound();

  const relatedBlogs = getBlogsBySlugs(project.relatedBlogs);

  return <ProjectDetailClient project={project} relatedBlogs={relatedBlogs} />;
}
