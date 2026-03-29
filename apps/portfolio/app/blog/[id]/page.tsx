import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { getBlogPosts, getBlogBySlug, getBlogsBySlugs } from "@/lib/content/blogs";
import { getTopicBySlug } from "@/lib/content/topics";
import { getProjectsBySlugs } from "@/lib/content/projects";
import { markdownToHtml, extractToc } from "@/lib/content/utils";
import RelatedContent from "@/components/RelatedContent";
import TopicBadge from "@/components/TopicBadge";
import TableOfContents from "@/components/TableOfContents";
import BlogContent from "@/components/BlogContent";

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({ id: post.slug }));
}

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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = getBlogBySlug(id);
  if (!post) notFound();

  const html = await markdownToHtml(post.content);
  const toc = await extractToc(post.content);

  const topic = post.topic ? getTopicBySlug(post.topic) : null;
  const relatedBlogs = getBlogsBySlugs(post.relatedBlogs);
  const relatedProjects = getProjectsBySlugs(post.relatedProjects);

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

      <div className="space-y-10 pb-24 max-w-6xl mx-auto pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {toc.length > 0 && (
          <details className="lg:hidden rounded-2xl border border-[hsl(var(--border)/0.45)] bg-[hsl(var(--card)/0.35)] p-4">
            <summary className="cursor-pointer select-none text-sm font-semibold text-[hsl(var(--foreground))]">
              Mục lục
            </summary>
            <div className="pt-4">
              <TableOfContents items={toc} />
            </div>
          </details>
        )}

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10 lg:items-start">
          <article className="space-y-8">
            <header className="space-y-6 border-b border-[hsl(var(--border)/0.45)] pb-8">
              <div className="flex items-center gap-4 flex-wrap text-sm font-medium text-[hsl(var(--muted-foreground))]">
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

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[hsl(var(--foreground))] leading-tight">
                {post.title}
              </h1>

              <p className="text-lg text-[hsl(var(--muted-foreground))] leading-relaxed">
                {post.description}
              </p>

              {post.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-md bg-[hsl(var(--card)/0.35)] border border-[hsl(var(--border)/0.45)] text-sm font-medium text-[hsl(var(--muted-foreground))]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <BlogContent
              html={html}
              className="blog-content prose prose-invert max-w-none
                prose-headings:font-semibold prose-headings:tracking-tight
                prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                prose-a:text-rose-300 hover:prose-a:text-rose-200
                prose-strong:text-[hsl(var(--foreground))]
                prose-blockquote:border-l-rose-400/60 prose-blockquote:text-[hsl(var(--muted-foreground))]
                prose-code:text-rose-200 prose-code:bg-[hsl(var(--card)/0.6)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-[hsl(var(--card)/0.6)] prose-pre:border prose-pre:border-[hsl(var(--border)/0.45)] prose-pre:rounded-xl prose-pre:p-0
                prose-img:rounded-xl prose-img:border prose-img:border-[hsl(var(--border)/0.45)]
                prose-table:border prose-table:border-[hsl(var(--border)/0.45)]
                prose-th:bg-[hsl(var(--card)/0.6)] prose-th:px-4 prose-th:py-2
                prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-[hsl(var(--border)/0.35)]"
            />
          </article>

          {toc.length > 0 && (
            <aside className="hidden lg:block sticky top-24 rounded-2xl border border-[hsl(var(--border)/0.45)] bg-[hsl(var(--card)/0.35)] p-5">
              <TableOfContents items={toc} />
            </aside>
          )}
        </div>

        {(relatedBlogs.length > 0 || relatedProjects.length > 0) && (
          <RelatedContent blogs={relatedBlogs} projects={relatedProjects} />
        )}
      </div>
    </>
  );
}

