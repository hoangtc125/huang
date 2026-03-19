"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { blogs } from "@/data";
import Markdown from "react-markdown";
import { notFound } from "next/navigation";
import PageTransition from "@/components/PageTransition";

export default function BlogPostPage() {
  const params = useParams<{ id: string }>();
  const post = blogs.find((b) => b.id === params.id);

  if (!post) {
    notFound();
  }

  return (
    <PageTransition>
      <div className="space-y-12 pb-24 max-w-3xl mx-auto pt-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <header className="space-y-6 border-b border-white/5 pb-8">
            <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {post.publishedAt}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-md bg-zinc-900 border border-white/5 text-sm font-medium text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="prose prose-invert prose-zinc max-w-none prose-headings:font-semibold prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-img:rounded-xl">
            <Markdown>{post.content}</Markdown>
          </div>
        </motion.article>
      </div>
    </PageTransition>
  );
}
