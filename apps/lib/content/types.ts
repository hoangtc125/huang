// ==============================================
// Content System Types
// ==============================================

export type ProjectType = "web" | "app" | "extension";
export type ProjectStatus = "live" | "in-progress" | "archived" | "review";

// ------ Topic ------
export interface Topic {
  slug: string;
  title: string;
  description: string;
  color: string; // tailwind color name e.g. "indigo", "emerald"
  icon?: string;
  published: boolean;
}

// ------ Blog Post ------
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string; // raw markdown
  coverImage?: string;
  topic: string; // topic slug
  tags: string[];
  readingTime: number; // minutes
  publishedAt: string; // ISO date e.g. "2026-03-20"
  published: boolean;
  featured: boolean;
  relatedProjects: string[]; // project slugs
  relatedBlogs: string[]; // blog slugs
  seoTitle?: string;
  seoDescription?: string;
}

// ------ Project ------
export interface ProjectFeature {
  title: string;
  desc: string;
  icon?: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  shortDesc: string;
  thumbnail?: string;
  images: string[];
  iconUrl?: string;
  type: ProjectType;
  tags: string[];
  techStack: string[];
  demoUrl?: string;
  sourceUrl?: string;
  status: ProjectStatus;
  featured: boolean;
  order: number;
  publishedAt: string;
  published: boolean;
  relatedBlogs: string[]; // blog slugs
  features: ProjectFeature[];
  architecture: string;
  content: string; // raw markdown body
  seoTitle?: string;
  seoDescription?: string;
}

// ------ Video ------
export interface Video {
  slug: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnail?: string;
  publishedAt: string;
  tags: string[];
  relatedBlogs: string[]; // blog slugs
  featured: boolean;
  duration?: string;
  views?: string;
  published: boolean;
}

// ------ Q&A ------
export interface QA {
  slug: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  order: number;
}

// ------ Static: Profile ------
export interface Profile {
  name: string;
  title: string;
  email: string;
  avatar?: string;
  location?: string;
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
}
