import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getTopics, getTopicBySlug } from "@/lib/content/topics";
import { getBlogPosts } from "@/lib/content/blogs";
import PageTransition from "@/components/PageTransition";

export async function generateStaticParams() {
  const topics = getTopics();
  return topics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return {};

  return {
    title: `${topic.title} | Huang Workspace`,
    description: topic.description,
  };
}

const TOPIC_COLORS: Record<string, string> = {
  indigo: "text-indigo-400",
  emerald: "text-emerald-400",
  amber: "text-amber-400",
  rose: "text-rose-400",
  violet: "text-violet-400",
  cyan: "text-cyan-400",
};

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const posts = getBlogPosts({ topic: slug });
  const colorCls = TOPIC_COLORS[topic.color] ?? TOPIC_COLORS.indigo;

  return (
    <PageTransition>
      <div className="space-y-12 pt-8 max-w-3xl mx-auto">
        {/* Back */}
        <Link
          href="/topics"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Topics
        </Link>

        {/* Topic Header */}
        <header className="space-y-4 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            {topic.icon && <span className="text-4xl">{topic.icon}</span>}
            <h1 className={`text-4xl font-bold tracking-tight ${colorCls}`}>
              {topic.title}
            </h1>
          </div>
          <p className="text-zinc-400 leading-relaxed text-lg max-w-2xl">
            {topic.description}
          </p>
          <p className="text-sm text-zinc-600">
            {posts.length} {posts.length === 1 ? "article" : "articles"}
          </p>
        </header>

        {/* Posts */}
        <section className="space-y-6">
          {posts.length === 0 ? (
            <p className="text-zinc-500 py-8 text-center">
              No articles published yet. Check back soon.
            </p>
          ) : (
            posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/50 hover:border-white/10 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readingTime} min read
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold text-zinc-100 group-hover:text-white transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-zinc-400 leading-relaxed line-clamp-2">
                    {post.description}
                  </p>

                  <div className="flex gap-2 flex-wrap pt-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-zinc-800/50 border border-white/5 text-xs font-medium text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))
          )}
        </section>
      </div>
    </PageTransition>
  );
}
