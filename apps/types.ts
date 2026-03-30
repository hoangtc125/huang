export type ProjectType = 'app' | 'web' | 'extension';

export interface Project {
  id: string;
  title: string;
  type: ProjectType;
  shortDesc: string;
  longDesc: string;
  imageUrl: string;
  iconUrl?: string;
  link?: string;
  status?: string;
  features: { title: string; desc: string; icon?: string }[];
  architecture: string;
  techStack: string[];
  screenshots: string[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  publishedAt: string;
  views: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  publishedAt: string;
  tags: string[];
}

export interface QA {
  question: string;
  answer: string;
}
