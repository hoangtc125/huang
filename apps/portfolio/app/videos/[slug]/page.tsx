import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { getVideos, getVideoBySlug } from "@/lib/content/videos";
import { getBlogsBySlugs } from "@/lib/content/blogs";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import RelatedContent from "@/components/RelatedContent";
import PageTransition from "@/components/PageTransition";

export async function generateStaticParams() {
  const videos = getVideos();
  return videos.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  if (!video) return {};

  return {
    title: `${video.title} | Huang Workspace`,
    description: video.description,
    openGraph: {
      title: video.title,
      description: video.description,
      type: "video.other",
      videos: [`https://www.youtube.com/watch?v=${video.youtubeId}`],
    },
  };
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  if (!video) notFound();

  const relatedBlogs = getBlogsBySlugs(video.relatedBlogs);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    uploadDate: video.publishedAt,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
    thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageTransition>
        <div className="space-y-10 pb-24 max-w-4xl mx-auto pt-8">
          {/* Back */}
          <Link
            href="/videos"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Videos
          </Link>

          {/* YouTube Embed */}
          <YouTubeEmbed youtubeId={video.youtubeId} title={video.title} />

          {/* Video Info */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              {video.title}
            </h1>

            <div className="flex items-center gap-4 flex-wrap text-sm text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(video.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {video.duration && (
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs font-medium">
                  {video.duration}
                </span>
              )}
              {video.views && <span>{video.views} views</span>}
            </div>

            {video.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-zinc-600" />
                {video.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-md bg-zinc-900 border border-white/5 text-sm text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-zinc-400 leading-relaxed text-lg">{video.description}</p>
          </div>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div className="pt-8 border-t border-white/5">
              <RelatedContent blogs={relatedBlogs} projects={[]} />
            </div>
          )}
        </div>
      </PageTransition>
    </>
  );
}
