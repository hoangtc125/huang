"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Filter, X } from "lucide-react";
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
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered =
    activeTopic === "all" ? posts : posts.filter((p) => p.topic === activeTopic);

  const topicMap = Object.fromEntries(topics.map((t) => [t.slug, t]));

  const activeTopicLabel =
    activeTopic === "all" ? "All" : topicMap[activeTopic]?.title ?? activeTopic;

  const handleTopicSelect = (slug: string) => {
    setActiveTopic(slug);
    setFilterOpen(false);
  };

  return (
    <PageTransition>
      <div className="space-y-12 pt-12 max-w-3xl mx-auto">
        {/* Header */}
        <section className="space-y-4">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-bold tracking-tight text-white"
          >
            Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[hsl(var(--muted-foreground))]"
          >
            Thoughts on software engineering, architecture, and the tech industry.
          </motion.p>
        </section>

        {/* Topic Filter — Desktop: inline, Mobile: sticky button + slide-out */}
        {topics.length > 0 && (
          <>
            {/* Desktop filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="hidden sm:flex flex-wrap gap-2"
            >
              <button
                onClick={() => setActiveTopic("all")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                  activeTopic === "all"
                    ? "bg-rose-200 text-[#2b1216] border-rose-200"
                    : "bg-transparent text-[hsl(var(--muted-foreground))] border-[hsl(var(--border)/0.45)] hover:border-[hsl(var(--border)/0.7)] hover:text-[hsl(var(--foreground))]"
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
                        : "bg-transparent text-[hsl(var(--muted-foreground))] border-[hsl(var(--border)/0.45)] hover:border-[hsl(var(--border)/0.7)] hover:text-[hsl(var(--foreground))]"
                    )}
                  >
                    {topic.icon && <span className="mr-1.5">{topic.icon}</span>}
                    {topic.title}
                  </button>
                );
              })}
            </motion.div>

            {/* Mobile filter — sticky bar with absolute dropdown */}
            <div className="sm:hidden sticky top-14 z-40">
              <div className="flex justify-end">
                <button
                  onClick={() => setFilterOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[hsl(var(--card)/0.8)] border border-[hsl(var(--border)/0.45)] backdrop-blur-md text-sm font-medium text-[hsl(var(--foreground))] shadow-lg"
                >
                  <Filter className="w-4 h-4" />
                  {activeTopicLabel}
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">({filtered.length})</span>
                </button>
              </div>

              {/* Backdrop blur */}
              {filterOpen && (
                <div
                  className="fixed inset-0 top-14 z-40 bg-black/40 backdrop-blur-sm"
                  onClick={() => setFilterOpen(false)}
                />
              )}

              {/* Dropdown panel — absolute, right-aligned */}
              <div
                className={cn(
                  "absolute right-0 mt-2 z-50 w-64 rounded-xl border border-[hsl(var(--border)/0.45)] bg-[hsl(var(--background)/0.95)] backdrop-blur-md shadow-xl transition-all duration-200 origin-top-right",
                  filterOpen
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                )}
              >
                <div className="flex flex-wrap gap-2 p-3">
                  <button
                    onClick={() => handleTopicSelect("all")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                      activeTopic === "all"
                        ? "bg-rose-200 text-[#2b1216] border-rose-200"
                        : "bg-transparent text-[hsl(var(--muted-foreground))] border-[hsl(var(--border)/0.45)]"
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
                        onClick={() => handleTopicSelect(topic.slug)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                          isActive
                            ? colorCls
                            : "bg-transparent text-[hsl(var(--muted-foreground))] border-[hsl(var(--border)/0.45)]"
                        )}
                      >
                        {topic.icon && <span className="mr-1.5">{topic.icon}</span>}
                        {topic.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Post List */}
        <section className="space-y-6">
          {filtered.length === 0 ? (
            <p className="text-[hsl(var(--muted-foreground))] py-8 text-center">
              No posts in this topic yet.
            </p>
          ) : (
            filtered.map((post, index) => {
              const topic = topicMap[post.topic];
              const colorCls = TOPIC_COLORS[topic?.color ?? "indigo"] ?? TOPIC_COLORS.indigo;
              return (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block p-4 sm:p-6 rounded-2xl bg-[hsl(var(--card)/0.35)] border border-[hsl(var(--border)/0.45)] hover:bg-[hsl(var(--card)/0.55)] transition-all duration-300"
                  >
                    <div className="flex flex-col gap-3 sm:gap-4">
                      {/* Meta */}
                      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
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
                        <span className="flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))]">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readingTime} min read
                        </span>
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <h2 className="text-lg sm:text-xl font-semibold text-zinc-100 group-hover:text-white transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))] leading-relaxed line-clamp-2">
                          {post.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-1 sm:mt-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-[hsl(var(--card)/0.35)] border border-[hsl(var(--border)/0.35)] text-xs font-medium text-[hsl(var(--muted-foreground))]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))] transition-colors shrink-0">
                          <span className="hidden sm:inline">Read article</span>
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
