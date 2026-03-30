import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/content/blogs";
import { getTopics } from "@/lib/content/topics";
import BlogList from "./BlogList";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Blog | Huang Workspace",
  description:
    "Thoughts on software engineering, system design, and the tech industry.",
  openGraph: {
    title: "Blog | Huang Workspace",
    description:
      "Thoughts on software engineering, system design, and the tech industry.",
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getBlogPosts();
  const topics = getTopics();

  return <BlogList posts={posts} topics={topics} />;
}
