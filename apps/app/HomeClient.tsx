"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowRight, Code, Smartphone, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project, ProjectType } from "@/lib/content/types";
import PageTransition from "@/components/PageTransition";

const TABS: { id: ProjectType | "all"; label: string; icon: ReactNode }[] = [
  { id: "all", label: "Projects", icon: <Code className="w-4 h-4" /> },
  { id: "web", label: "Web", icon: <Globe className="w-4 h-4" /> },
  { id: "app", label: "Apps", icon: <Smartphone className="w-4 h-4" /> },
  { id: "extension", label: "Ext", icon: <Code className="w-4 h-4" /> },
];

const statusColors: Record<string, string> = {
  live: "bg-emerald-500",
  "in-progress": "bg-amber-500",
  review: "bg-rose-400",
  archived: "bg-zinc-500",
};

export default function HomeClient({ projects }: { projects: Project[] }) {
  const [activeTab, setActiveTab] = useState<ProjectType | "all">("all");
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  const useLightMotion = Boolean(prefersReducedMotion) || isMobile;

  const filteredProjects = projects.filter(
    (p) => activeTab === "all" || p.type === activeTab
  );

  return (
    <PageTransition>
      <div className="space-y-24">
        {/* Hero */}
        <section className="flex flex-col items-center text-center space-y-4 pt-24 pb-16">
          <motion.h1
            initial={useLightMotion ? { opacity: 0 } : { y: 20, opacity: 0 }}
            animate={useLightMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            transition={useLightMotion ? { duration: 0.2 } : { delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[hsl(var(--muted-foreground))]"
          >
            Hey, I&apos;m not {" "} 
            <span className={cn(
              "font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-amber-100 to-rose-300",
              !prefersReducedMotion && "animate-text-shimmer"
            )}>
              Jensen Huang
            </span>
          </motion.h1>
          <motion.h2
            initial={useLightMotion ? { opacity: 0 } : { y: 20, opacity: 0 }}
            animate={useLightMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            transition={useLightMotion ? { duration: 0.2, delay: 0.05 } : { delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg max-[370px]:text-[11px] max-[370px]:whitespace-nowrap max-[370px]:tracking-normal text-[hsl(var(--muted-foreground))] font-medium tracking-tight"
          >
            Software Engineer <span className="text-[hsl(var(--muted-foreground)/0.7)]">and</span> Technical
            Content Specialist
          </motion.h2>
        </section>

        {/* Projects */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-white tracking-tight">
              Garden
            </h2>
            <div className="flex items-center gap-1 p-1 bg-[hsl(var(--card)/0.35)] rounded-lg border border-[hsl(var(--border)/0.45)] backdrop-blur-sm">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    activeTab === tab.id
                      ? "bg-[hsl(var(--card)/0.65)] text-[hsl(var(--foreground))] shadow-sm"
                      : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--card)/0.45)]"
                  )}
                >
                  {tab.icon}
                  <span className="text-xs sm:text-sm">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: useLightMotion ? 0.12 : 0.2, delay: useLightMotion ? 0 : index * 0.05 }}
                >
                  <Link
                    href={`/project/${project.slug}`}
                    className="group flex items-center gap-4 md:gap-6 p-4 sm:p-5 rounded-2xl bg-[hsl(var(--card)/0.25)] border border-[hsl(var(--border)/0.45)] hover:bg-[hsl(var(--card)/0.55)] transition-all duration-300"
                  >
                    {project.iconUrl ? (
                      <img
                        src={project.iconUrl}
                        alt={project.title}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-[hsl(var(--card)/0.6)] border border-[hsl(var(--border)/0.35)] flex items-center justify-center shrink-0">
                        <Code className="w-6 h-6 text-[hsl(var(--muted-foreground))]" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base md:text-lg font-semibold text-[hsl(var(--foreground))] transition-colors truncate">
                          {project.title}
                        </h3>
                        <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-400 uppercase tracking-wider shrink-0">
                          {project.type}
                        </span>
                        {project.status && (
                          <span className="hidden md:inline-flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                            <span className={cn("w-1.5 h-1.5 rounded-full", statusColors[project.status] ?? "bg-zinc-500")} />
                            {project.status}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-2 mb-2">
                        {project.shortDesc}
                      </p>

                      <div className="hidden md:flex items-center gap-2">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs text-[hsl(var(--muted-foreground))] bg-[hsl(var(--card)/0.35)] border border-[hsl(var(--border)/0.25)] px-2 py-0.5 rounded-md"
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
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
