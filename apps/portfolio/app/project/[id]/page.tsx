"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { projects } from "@/data";
import {
  ArrowLeft,
  ExternalLink,
  Layers,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import PageTransition from "@/components/PageTransition";

type Tab = "features" | "architecture" | "gallery";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === params.id);
  const [activeTab, setActiveTab] = useState<Tab>("features");

  if (!project) {
    notFound();
  }

  return (
    <PageTransition>
      <div className="space-y-12 pb-24">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
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
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors shrink-0"
                  >
                    Visit Project <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm">
                <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 font-medium uppercase tracking-wider text-xs">
                  {project.type}
                </span>
                {project.status && (
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {project.status}
                  </span>
                )}
              </div>

              <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl">
                {project.longDesc}
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
          <div className="flex items-center gap-2 border-b border-white/5 pb-px">
            <button
              onClick={() => setActiveTab("features")}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === "features"
                  ? "border-white text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Sparkles className="w-4 h-4" /> Features
            </button>
            <button
              onClick={() => setActiveTab("architecture")}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === "architecture"
                  ? "border-white text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Layers className="w-4 h-4" /> Architecture
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === "gallery"
                  ? "border-white text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              )}
            >
              <ImageIcon className="w-4 h-4" /> Gallery
            </button>
          </div>

          <div className="min-h-[400px]">
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
                    <div
                      key={idx}
                      className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5"
                    >
                      <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-zinc-400 leading-relaxed">
                        {feature.desc}
                      </p>
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
                  <div className="prose prose-invert prose-zinc max-w-none">
                    <p className="text-lg text-zinc-300 leading-relaxed">
                      {project.architecture}
                    </p>
                  </div>
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
                  {project.screenshots.map((img, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 aspect-video"
                    >
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
      </div>
    </PageTransition>
  );
}
