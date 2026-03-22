import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { getBlogPosts, getBlogBySlug, getBlogsBySlugs } from "@/lib/content/blogs";
import { getTopicBySlug } from "@/lib/content/topics";
import { getProjectsBySlugs } from "@/lib/content/projects";
import { markdownToHtml } from "@/lib/content/utils";
import RelatedContent from "@/components/RelatedContent";
import TopicBadge from "@/components/TopicBadge";

// ── Static generation ─────────────────────────────────────────────────────
export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({ id: post.slug }));
}

// ── Per-page SEO metadata ─────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = getBlogBySlug(id);
  if (!post) return {};

  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.description;

  return {
    title: `${title} | Huang Workspace`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: ["Tran Cong Hoang"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = getBlogBySlug(id);
  if (!post) notFound();

  // Convert markdown → HTML server-side (syntax highlighted)
  const html = await markdownToHtml(post.content);

  const topic = post.topic ? getTopicBySlug(post.topic) : null;
  const relatedBlogs = getBlogsBySlugs(post.relatedBlogs);
  const relatedProjects = getProjectsBySlugs(post.relatedProjects);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: "Tran Cong Hoang",
      url: "https://huangwork.space",
    },
    publisher: {
      "@type": "Person",
      name: "Tran Cong Hoang",
    },
    ...(post.coverImage && { image: post.coverImage }),
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-12 pb-24 max-w-3xl mx-auto pt-8">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article className="space-y-8">
          {/* Header */}
          <header className="space-y-6 border-b border-white/5 pb-8">
            <div className="flex items-center gap-4 flex-wrap text-sm font-medium text-zinc-500">
              {topic && <TopicBadge topic={topic} />}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readingTime} min read
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              {post.title}
            </h1>

            <p className="text-lg text-zinc-400 leading-relaxed">
              {post.description}
            </p>

            {post.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-zinc-600" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-md bg-zinc-900 border border-white/5 text-sm font-medium text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Content — server-rendered HTML with syntax highlighting */}
          <div
            className="blog-content prose prose-invert prose-zinc max-w-none
              prose-headings:font-semibold prose-headings:tracking-tight
              prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-a:text-indigo-400 hover:prose-a:text-indigo-300
              prose-strong:text-zinc-200
              prose-blockquote:border-l-indigo-500 prose-blockquote:text-zinc-400
              prose-code:text-indigo-300 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/5 prose-pre:rounded-xl prose-pre:p-0
              prose-img:rounded-xl prose-img:border prose-img:border-white/5
              prose-table:border prose-table:border-white/10
              prose-th:bg-zinc-900 prose-th:px-4 prose-th:py-2
              prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-white/5"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>

        {/* Related Content */}
        {(relatedBlogs.length > 0 || relatedProjects.length > 0) && (
          <RelatedContent blogs={relatedBlogs} projects={relatedProjects} />
        )}
      </div>
    </>
  );
}
