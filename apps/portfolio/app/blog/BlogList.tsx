"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { BlogPost, Topic } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";

interface Props {
  posts: BlogPost[];
  topics: Topic[];
}

const TOPIC_COLORS: Record<string, string> = {
  indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

export default function BlogList({ posts, topics }: Props) {
  const [activeTopic, setActiveTopic] = useState<string>("all");

  const filtered =
    activeTopic === "all" ? posts : posts.filter((p) => p.topic === activeTopic);

  const topicMap = Object.fromEntries(topics.map((t) => [t.slug, t]));

  return (
    <PageTransition>
      <div className="space-y-12 pt-12 max-w-3xl mx-auto">
        {/* Header */}
        <section className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight text-white"
          >
            Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400"
          >
            Thoughts on software engineering, architecture, and the tech industry.
          </motion.p>
        </section>

        {/* Topic Filter */}
        {topics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-2"
          >
            <button
              onClick={() => setActiveTopic("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                activeTopic === "all"
                  ? "bg-zinc-100 text-zinc-900 border-zinc-100"
                  : "bg-transparent text-zinc-400 border-white/10 hover:border-white/20 hover:text-zinc-300"
              )}
            >
              All
            </button>
            {topics.map((topic) => {
              const colorCls = TOPIC_COLORS[topic.color] ?? TOPIC_COLORS.indigo;
              const isActive = activeTopic === topic.slug;
              return (
                <button
                  key={topic.slug}
                  onClick={() => setActiveTopic(topic.slug)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                    isActive
                      ? colorCls
                      : "bg-transparent text-zinc-400 border-white/10 hover:border-white/20 hover:text-zinc-300"
                  )}
                >
                  {topic.icon && <span className="mr-1.5">{topic.icon}</span>}
                  {topic.title}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Post List */}
        <section className="space-y-6">
          {filtered.length === 0 ? (
            <p className="text-zinc-500 py-8 text-center">No posts in this topic yet.</p>
          ) : (
            filtered.map((post, index) => {
              const topic = topicMap[post.topic];
              const colorCls = TOPIC_COLORS[topic?.color ?? "indigo"] ?? TOPIC_COLORS.indigo;
              return (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/50 hover:border-white/10 transition-all duration-300"
                  >
                    <div className="flex flex-col gap-4">
                      {/* Meta */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {topic && (
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-md border text-xs font-medium",
                              colorCls
                            )}
                          >
                            {topic.icon && <span className="mr-1">{topic.icon}</span>}
                            {topic.title}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readingTime} min read
                        </span>
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-zinc-100 group-hover:text-white transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-zinc-400 leading-relaxed line-clamp-2">
                          {post.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 rounded-md bg-zinc-800/50 border border-white/5 text-xs font-medium text-zinc-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 group-hover:text-white transition-colors shrink-0">
                          Read article
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })
          )}
        </section>
      </div>
    </PageTransition>
  );
}
