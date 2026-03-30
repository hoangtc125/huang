import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Eye, Tag } from "lucide-react";
import { getVideos } from "@/lib/content/videos";
import PageTransition from "@/components/PageTransition";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Videos | Huang Workspace",
  description:
    "Deep dives into software engineering, performance optimization, and system design.",
};

export default function VideosPage() {
  const videos = getVideos();

  return (
    <PageTransition>
      <div className="space-y-12 pt-12">
        <section className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">Videos</h1>
          <p className="text-zinc-400 max-w-2xl">
            Deep dives into software engineering, performance optimization, and system
            design.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => {
            const thumb =
              video.thumbnail ??
              `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;

            return (
              <Link
                key={video.slug}
                href={`/videos/${video.slug}`}
                className="group flex flex-col gap-4 rounded-2xl bg-zinc-900/30 border border-white/5 overflow-hidden hover:bg-zinc-900/50 hover:border-white/10 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-zinc-800">
                  <img
                    src={thumb}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                      {/* Play icon */}
                      <svg
                        className="w-5 h-5 text-white ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/80 text-xs font-medium text-white backdrop-blur-md">
                      {video.duration}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 pt-2 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors line-clamp-2 mb-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-4 flex-1">
                    {video.description}
                  </p>

                  {video.tags.length > 0 && (
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <Tag className="w-3 h-3 text-zinc-600" />
                      {video.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(video.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {video.views && (
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        {video.views} views
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </PageTransition>
  );
}
