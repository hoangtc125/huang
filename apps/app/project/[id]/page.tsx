import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug } from "@/lib/content/projects";
import { getBlogsBySlugs } from "@/lib/content/blogs";
import { markdownToHtml } from "@/lib/content/utils";
import ProjectDetailClient from "./ProjectDetailClient";

export const dynamic = "force-static";

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
      ...(project.thumbnail && {
        images: [{ url: project.thumbnail, width: 1200, height: 675, alt: title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(project.thumbnail && { images: [project.thumbnail] }),
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
  const architectureHtml = project.architecture
    ? await markdownToHtml(project.architecture)
    : "";

  return (
    <ProjectDetailClient
      project={project}
      relatedBlogs={relatedBlogs}
      architectureHtml={architectureHtml}
    />
  );
}
