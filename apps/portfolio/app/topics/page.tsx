import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTopics } from "@/lib/content/topics";
import { getBlogPosts } from "@/lib/content/blogs";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Topics | Huang Workspace",
  description:
    "Browse blog posts by topic — web development, system design, career, and more.",
};

const TOPIC_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  indigo: {
    bg: "bg-indigo-500/5",
    border: "border-indigo-500/20",
    text: "text-indigo-400",
    dot: "bg-indigo-500",
  },
  emerald: {
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    dot: "bg-emerald-500",
  },
  amber: {
    bg: "bg-amber-500/5",
    border: "border-amber-500/20",
    text: "text-amber-400",
    dot: "bg-amber-500",
  },
  rose: {
    bg: "bg-rose-500/5",
    border: "border-rose-500/20",
    text: "text-rose-400",
    dot: "bg-rose-500",
  },
  violet: {
    bg: "bg-violet-500/5",
    border: "border-violet-500/20",
    text: "text-violet-400",
    dot: "bg-violet-500",
  },
  cyan: {
    bg: "bg-cyan-500/5",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    dot: "bg-cyan-500",
  },
};

export default function TopicsPage() {
  const topics = getTopics();
  const allPosts = getBlogPosts();

  const postCountByTopic = Object.fromEntries(
    topics.map((t) => [t.slug, allPosts.filter((p) => p.topic === t.slug).length])
  );

  return (
    <PageTransition>
      <div className="space-y-12 pt-12 max-w-3xl mx-auto">
        <section className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">Topics</h1>
          <p className="text-zinc-400">
            Browse articles organized by topic. Each topic covers a specific area of
            software engineering with depth.
          </p>
        </section>

        <section className="grid gap-6">
          {topics.map((topic) => {
            const colors = TOPIC_COLORS[topic.color] ?? TOPIC_COLORS.indigo;
            const count = postCountByTopic[topic.slug] ?? 0;

            return (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className={`group block p-6 rounded-2xl border transition-all duration-300 hover:bg-zinc-900/40 ${colors.bg} ${colors.border}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      {topic.icon && (
                        <span className="text-2xl">{topic.icon}</span>
                      )}
                      <h2 className={`text-xl font-semibold ${colors.text}`}>
                        {topic.title}
                      </h2>
                      <span className="text-xs font-medium text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-full">
                        {count} {count === 1 ? "post" : "posts"}
                      </span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed">{topic.description}</p>
                  </div>
                  <ArrowRight
                    className={`w-5 h-5 shrink-0 mt-1 ${colors.text} group-hover:translate-x-1 transition-transform`}
                  />
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </PageTransition>
  );
}
