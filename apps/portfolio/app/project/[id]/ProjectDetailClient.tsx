"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ExternalLink,
  Layers,
  Sparkles,
  Image as ImageIcon,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project, BlogPost } from "@/lib/content/types";
import PageTransition from "@/components/PageTransition";
import RelatedContent from "@/components/RelatedContent";
import ViewCounter from "@/components/ViewCounter";

type Tab = "features" | "architecture" | "gallery";

interface Props {
  project: Project;
  relatedBlogs: BlogPost[];
  architectureHtml: string;
}

export default function ProjectDetailClient({ project, relatedBlogs, architectureHtml }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("features");

  const tabs = [
    { id: "features" as Tab, label: "Features", icon: <Sparkles className="w-4 h-4" /> },
    { id: "architecture" as Tab, label: "Architecture", icon: <Layers className="w-4 h-4" /> },
    ...(project.images.length > 0
      ? [{ id: "gallery" as Tab, label: "Gallery", icon: <ImageIcon className="w-4 h-4" /> }]
      : []),
  ];

  const statusColors: Record<string, string> = {
    live: "bg-emerald-500",
    "in-progress": "bg-amber-500",
    review: "bg-indigo-500",
    archived: "bg-zinc-500",
  };

  return (
    <PageTransition>
      <div className="space-y-12 pb-24">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </motion.div>

        {/* Hero */}
        <section className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            {project.iconUrl && (
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-zinc-900">
                <img
                  src={project.iconUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="space-y-4 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                  {project.title}
                </h1>
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors shrink-0"
                  >
                    Visit Project <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm flex-wrap">
                <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 font-medium uppercase tracking-wider text-xs">
                  {project.type}
                </span>
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <span className={cn("w-1.5 h-1.5 rounded-full", statusColors[project.status] ?? "bg-zinc-500")} />
                  {project.status}
                </span>
                <ViewCounter type="project" slug={project.slug} className="text-zinc-500 flex items-center gap-1.5 text-sm" />
              </div>

              <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full border border-white/10 text-xs font-medium text-zinc-400 bg-zinc-900/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Tabs */}
        <section className="space-y-8 pt-8 border-t border-white/5">
          <div className="flex items-center gap-2 border-b border-white/5 pb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-white text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                )}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              {activeTab === "features" && (
                <motion.div
                  key="features"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {project.features.map((feature, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5">
                      <h3 className="text-lg font-semibold text-zinc-100 mb-2">{feature.title}</h3>
                      <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "architecture" && (
                <motion.div
                  key="architecture"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5"
                >
                  <div
                    className="blog-content prose prose-invert max-w-none
                      prose-headings:font-semibold prose-headings:tracking-tight
                      prose-h2:text-xl prose-h3:text-lg
                      prose-a:text-rose-300 hover:prose-a:text-rose-200
                      prose-strong:text-zinc-100
                      prose-code:text-rose-200 prose-code:bg-zinc-800/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                      prose-pre:bg-zinc-800/60 prose-pre:border prose-pre:border-white/5 prose-pre:rounded-xl prose-pre:p-0
                      prose-table:border prose-table:border-white/10
                      prose-th:bg-zinc-800/60 prose-th:px-4 prose-th:py-2
                      prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-white/5
                      prose-p:text-zinc-300 prose-li:text-zinc-300"
                    dangerouslySetInnerHTML={{ __html: architectureHtml }}
                  />
                </motion.div>
              )}

              {activeTab === "gallery" && (
                <motion.div
                  key="gallery"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  {project.images.map((img, idx) => (
                    <div key={idx} className="rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 aspect-video">
                      <img
                        src={img}
                        alt={`Screenshot ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <section className="pt-8 border-t border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-zinc-400">
              <BookOpen className="w-4 h-4" />
              <h2 className="text-lg font-semibold text-zinc-100">Related Blog Posts</h2>
            </div>
            <RelatedContent blogs={relatedBlogs} projects={[]} />
          </section>
        )}
      </div>
    </PageTransition>
  );
}
