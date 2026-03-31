"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ExternalLink,
  Layers,
  Sparkles,
  Image as ImageIcon,
  BookOpen,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project, BlogPost, ProjectFeature } from "@/lib/content/types";
import PageTransition from "@/components/PageTransition";
import RelatedContent from "@/components/RelatedContent";
import ViewCounter from "@/components/ViewCounter";

type Tab = "features" | "architecture" | "gallery";

interface Props {
  project: Project;
  relatedBlogs: BlogPost[];
  architectureHtml: string;
}

// ── Feature Detail Modal ──────────────────────────────────────────────────
function FeatureModal({
  feature,
  onClose,
}: {
  feature: ProjectFeature;
  onClose: () => void;
}) {
  const [currentImg, setCurrentImg] = useState(0);
  const allImages = useMemo(() => {
    const imgs: string[] = [];
    if (feature.image) imgs.push(feature.image);
    if (feature.images) {
      for (const img of feature.images) {
        if (!imgs.includes(img)) imgs.push(img);
      }
    }
    return imgs;
  }, [feature]);

  const prev = useCallback(
    () => setCurrentImg((i) => (i > 0 ? i - 1 : allImages.length - 1)),
    [allImages.length]
  );
  const next = useCallback(
    () => setCurrentImg((i) => (i < allImages.length - 1 ? i + 1 : 0)),
    [allImages.length]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image carousel */}
        {allImages.length > 0 && (
          <div className="relative">
            <div className="aspect-video bg-zinc-800 overflow-hidden rounded-t-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImg}
                  src={allImages[currentImg]}
                  alt={`${feature.title} - ${currentImg + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
            </div>

            {/* Nav arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImg(i)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        i === currentImg ? "bg-white" : "bg-white/40"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Text content */}
        <div className="p-6 sm:p-8 space-y-3">
          {feature.icon && (
            <span className="text-2xl">{feature.icon}</span>
          )}
          <h3 className="text-xl font-bold text-white">{feature.title}</h3>
          <p className="text-zinc-300 leading-relaxed">{feature.desc}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Gallery Lightbox ──────────────────────────────────────────────────────
function GalleryLightbox({
  images,
  labels,
  startIndex,
  onClose,
}: {
  images: string[];
  labels: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(
    () => setCurrent((i) => (i > 0 ? i - 1 : images.length - 1)),
    [images.length]
  );
  const next = useCallback(
    () => setCurrent((i) => (i < images.length - 1 ? i + 1 : 0)),
    [images.length]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-5xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image */}
        <div className="relative aspect-video bg-zinc-900 rounded-xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={images[current]}
              alt={labels[current]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
        </div>

        {/* Nav */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Caption + counter */}
        <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
          <span>{labels[current]}</span>
          <span>
            {current + 1} / {images.length}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────
export default function ProjectDetailClient({
  project,
  relatedBlogs,
  architectureHtml,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("features");
  const [selectedFeature, setSelectedFeature] = useState<ProjectFeature | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Collect all images for gallery (project images + feature images + architecture images)
  const galleryData = useMemo(() => {
    const images: string[] = [];
    const labels: string[] = [];

    // Project-level images
    for (const img of project.images) {
      images.push(img);
      labels.push("Project screenshot");
    }

    // Feature images
    for (const feature of project.features) {
      if (feature.image && !images.includes(feature.image)) {
        images.push(feature.image);
        labels.push(feature.title);
      }
      if (feature.images) {
        for (const img of feature.images) {
          if (!images.includes(img)) {
            images.push(img);
            labels.push(feature.title);
          }
        }
      }
    }

    // Architecture images
    for (const img of project.architectureImages) {
      if (!images.includes(img)) {
        images.push(img);
        labels.push("Architecture");
      }
    }

    return { images, labels };
  }, [project]);

  const tabs = [
    {
      id: "features" as Tab,
      label: "Features",
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: "architecture" as Tab,
      label: "Architecture",
      icon: <Layers className="w-4 h-4" />,
    },
    ...(galleryData.images.length > 0
      ? [
          {
            id: "gallery" as Tab,
            label: "Gallery",
            icon: <ImageIcon className="w-4 h-4" />,
          },
        ]
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
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      statusColors[project.status] ?? "bg-zinc-500"
                    )}
                  />
                  {project.status}
                </span>
                <ViewCounter
                  type="project"
                  slug={project.slug}
                  className="text-zinc-500 flex items-center gap-1.5 text-sm"
                />
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
              {/* ── Features Tab ── */}
              {activeTab === "features" && (
                <motion.div
                  key="features"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {project.features.map((feature, idx) => {
                    const previewImages = [
                      ...(feature.image ? [feature.image] : []),
                      ...(feature.images ?? []),
                    ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3);
                    const hasDetail = previewImages.length > 0;

                    return (
                      <div
                        key={idx}
                        onClick={() => hasDetail && setSelectedFeature(feature)}
                        className={cn(
                          "flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-zinc-900/30 border border-white/5 group transition-colors",
                          hasDetail && "cursor-pointer hover:border-white/15"
                        )}
                      >
                        {/* Left: text */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-zinc-100 mb-1.5">
                            {feature.title}
                          </h3>
                          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                            {feature.desc}
                          </p>
                          {hasDetail && (
                            <span className="inline-block mt-2 text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">
                              View details &rarr;
                            </span>
                          )}
                        </div>

                        {/* Right: stacked preview images */}
                        {previewImages.length > 0 && (
                          <div
                            className="relative shrink-0 w-full sm:w-48 md:w-56 self-center"
                            style={{ height: previewImages.length === 1 ? "auto" : `${110 + (previewImages.length - 1) * 16}px` }}
                          >
                            {previewImages.map((img, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "rounded-xl overflow-hidden border border-white/10 bg-zinc-800 shadow-lg",
                                  "transition-transform duration-300 group-hover:translate-y-0",
                                  previewImages.length === 1
                                    ? "relative aspect-video w-full"
                                    : "absolute w-full aspect-video"
                                )}
                                style={
                                  previewImages.length > 1
                                    ? {
                                        top: `${i * 16}px`,
                                        right: `${i * 8}px`,
                                        zIndex: previewImages.length - i,
                                        transform: `rotate(${(i - Math.floor(previewImages.length / 2)) * 2}deg)`,
                                      }
                                    : undefined
                                }
                              >
                                <img
                                  src={img}
                                  alt={`${feature.title} preview ${i + 1}`}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {/* ── Architecture Tab ── */}
              {activeTab === "architecture" && (
                <motion.div
                  key="architecture"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5">
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
                  </div>

                  {/* Architecture images */}
                  {project.architectureImages.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {project.architectureImages.map((img, idx) => {
                        const galleryIdx = galleryData.images.indexOf(img);
                        return (
                          <div
                            key={idx}
                            onClick={() =>
                              galleryIdx >= 0 && setLightboxIndex(galleryIdx)
                            }
                            className="rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 aspect-video cursor-pointer group"
                          >
                            <img
                              src={img}
                              alt={`Architecture diagram ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Gallery Tab ── */}
              {activeTab === "gallery" && (
                <motion.div
                  key="gallery"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {galleryData.images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightboxIndex(idx)}
                      className="relative rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 aspect-video cursor-pointer group"
                    >
                      <img
                        src={img}
                        alt={galleryData.labels[idx]}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-white/80">
                          {galleryData.labels[idx]}
                        </span>
                      </div>
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
              <h2 className="text-lg font-semibold text-zinc-100">
                Related Blog Posts
              </h2>
            </div>
            <RelatedContent blogs={relatedBlogs} projects={[]} />
          </section>
        )}
      </div>

      {/* ── Feature Detail Modal ── */}
      <AnimatePresence>
        {selectedFeature && (
          <FeatureModal
            feature={selectedFeature}
            onClose={() => setSelectedFeature(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Gallery Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <GalleryLightbox
            images={galleryData.images}
            labels={galleryData.labels}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
