import Link from "next/link";
import { ArrowRight, BookOpen, Code } from "lucide-react";
import type { BlogPost, Project } from "@/lib/content/types";

interface Props {
  blogs: BlogPost[];
  projects: Project[];
}

export default function RelatedContent({ blogs, projects }: Props) {
  if (blogs.length === 0 && projects.length === 0) return null;

  return (
    <aside className="space-y-6 pt-8 border-t border-white/5">
      <h2 className="text-lg font-semibold text-zinc-300">Related Content</h2>

      {blogs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            Articles
          </div>
          <div className="space-y-2">
            {blogs.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex items-center justify-between p-4 rounded-xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/60 hover:border-white/10 transition-all duration-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
                    {post.title}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5 truncate">{post.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
            <Code className="w-3.5 h-3.5" />
            Projects
          </div>
          <div className="space-y-2">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/project/${project.slug}`}
                className="group flex items-center justify-between p-4 rounded-xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/60 hover:border-white/10 transition-all duration-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {project.iconUrl ? (
                    <img
                      src={project.iconUrl}
                      alt={project.title}
                      className="w-8 h-8 rounded-lg object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                      <Code className="w-4 h-4 text-zinc-500" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
                      {project.title}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">{project.shortDesc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
