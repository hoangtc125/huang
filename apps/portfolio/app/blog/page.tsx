"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { blogs } from "@/data";
import PageTransition from "@/components/PageTransition";

export default function BlogPage() {
  return (
    <PageTransition>
      <div className="space-y-12 pt-12 max-w-3xl mx-auto">
        <section className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight text-white"
          >
            Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400"
          >
            Thoughts on software engineering, architecture, and the tech
            industry.
          </motion.p>
        </section>

        <section className="space-y-6">
          {blogs.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/blog/${post.id}`}
                className="group block p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/50 hover:border-white/10 transition-all duration-300"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.publishedAt}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-zinc-100 group-hover:text-white transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-zinc-400 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md bg-zinc-800/50 border border-white/5 text-xs font-medium text-zinc-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                      Read article{" "}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </section>
      </div>
    </PageTransition>
  );
}
