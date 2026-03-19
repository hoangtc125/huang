"use client";

import { motion } from "motion/react";
import { Play, Clock, Eye } from "lucide-react";
import { videos } from "@/data";
import PageTransition from "@/components/PageTransition";

export default function VideosPage() {
  return (
    <PageTransition>
      <div className="space-y-12 pt-12">
        <section className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight text-white"
          >
            Videos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-2xl"
          >
            Deep dives into software engineering, performance optimization, and
            system design.
          </motion.p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <motion.a
              key={video.id}
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col gap-4 rounded-2xl bg-zinc-900/30 border border-white/5 overflow-hidden hover:bg-zinc-900/50 hover:border-white/10 transition-all duration-300"
            >
              <div className="relative aspect-video overflow-hidden bg-zinc-800">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-5 h-5 text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/80 text-xs font-medium text-white backdrop-blur-md">
                  {video.duration}
                </div>
              </div>

              <div className="p-5 pt-2 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors line-clamp-2 mb-2">
                  {video.title}
                </h3>
                <p className="text-sm text-zinc-400 line-clamp-2 mb-4 flex-1">
                  {video.description}
                </p>
                <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {video.publishedAt}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    {video.views} views
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </section>
      </div>
    </PageTransition>
  );
}
