"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { projects } from "@/data";
import { ProjectType } from "@/types";
import { cn } from "@/lib/utils";
import { ArrowRight, Code, Smartphone, Globe } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const TABS: { id: ProjectType | "all"; label: string; icon: ReactNode }[] = [
  { id: "all", label: "All Projects", icon: <Code className="w-4 h-4" /> },
  { id: "web", label: "Web", icon: <Globe className="w-4 h-4" /> },
  { id: "app", label: "Apps", icon: <Smartphone className="w-4 h-4" /> },
  {
    id: "extension",
    label: "Extensions",
    icon: <Code className="w-4 h-4" />,
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ProjectType | "all">("all");

  const filteredProjects = projects.filter(
    (p) => activeTab === "all" || p.type === activeTab
  );

  return (
    <PageTransition>
      <div className="space-y-24">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-4 pt-24 pb-16">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-400"
          >
            Hey, I&apos;m{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-white to-zinc-400 animate-text-shimmer">
              Tran Cong Hoang
            </span>
          </motion.h1>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-zinc-500 font-medium tracking-tight"
          >
            Software Engineer{" "}
            <span className="text-zinc-700">and</span> Technical Content
            Specialist
          </motion.h2>
        </section>

        {/* Projects Section */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-white tracking-tight">
              Garden
            </h2>

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-zinc-900/50 rounded-lg border border-white/5 backdrop-blur-sm">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    activeTab === tab.id
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                  )}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Project List */}
          <motion.div layout className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Link
                    href={`/project/${project.id}`}
                    className="group flex items-center gap-4 md:gap-6 p-4 rounded-2xl bg-zinc-900/20 border border-white/5 hover:bg-zinc-900/60 hover:border-white/10 transition-all duration-300"
                  >
                    {project.iconUrl ? (
                      <img
                        src={project.iconUrl}
                        alt={project.title}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                        <Code className="w-6 h-6 text-zinc-500" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base md:text-lg font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                          {project.title}
                        </h3>
                        <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-400 uppercase tracking-wider shrink-0">
                          {project.type}
                        </span>
                      </div>

                      <p className="text-sm text-zinc-500 line-clamp-1 md:line-clamp-2 mb-2">
                        {project.shortDesc}
                      </p>

                      <div className="hidden md:flex items-center gap-2">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="text-xs text-zinc-600">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 pl-4">
                      <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-300 transform group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>
      </div>
    </PageTransition>
  );
}
