---
slug: "huang-workspace"
title: "Huang Workspace"
description: "Portfolio cá nhân — hub trung tâm cho projects, blogs, và videos. Xây dựng với Next.js App Router, Tailwind CSS v4, và Markdown-based content system."
short_desc: "My personal portfolio and digital garden — the site you're currently browsing."
thumbnail: "https://picsum.photos/seed/workspace/800/450"
icon_url: "https://picsum.photos/seed/workspace-icon/128/128"
images:
  - "https://picsum.photos/seed/hw-sc1/1200/800"
  - "https://picsum.photos/seed/hw-sc2/1200/800"
type: "web"
tags:
  - "Next.js"
  - "TypeScript"
  - "Tailwind CSS"
  - "Framer Motion"
tech_stack:
  - "Next.js 15"
  - "React 19"
  - "TypeScript"
  - "Tailwind CSS v4"
  - "Framer Motion"
demo_url: "https://huangwork.space"
source_url: "https://github.com/huangtran/huang-workspace"
features:
  - title: "Markdown Content System"
    desc: "Blogs, projects, videos được viết bằng Markdown và compile lúc build time — không cần CMS hay backend."
  - title: "SEO-First Architecture"
    desc: "React Server Components + generateStaticParams = HTML tĩnh cho mọi trang, Google crawl được ngay."
  - title: "Cross-linked Content"
    desc: "Projects link tới blogs liên quan, videos link tới blogs — tạo mạng lưới nội dung có liên kết."
  - title: "Beautiful Dark Theme"
    desc: "Dark UI với parallax animations, smooth page transitions, và syntax-highlighted code blocks."
architecture: "Built with Next.js 15 App Router. Content system reads Markdown files from content/ directory at build time using gray-matter for frontmatter parsing and unified/remark/rehype for Markdown-to-HTML conversion. All pages are Server Components with generateStaticParams for full static generation. Animations use Framer Motion with the new motion library."
related_blogs:
  - "react-server-components-seo"
  - "tailwind-css-v4-guide"
status: "live"
published: true
featured: true
order: 3
date: "2026-03-22"
---

# Huang Workspace

## Tổng quan

Trang bạn đang xem. Portfolio cá nhân kiêm digital garden — nơi tôi tập hợp projects, viết blog, và share videos về software engineering.

## Kiến trúc Content System

Thay vì dùng CMS hay database, toàn bộ nội dung được viết bằng Markdown:

```
content/
  collections/
    blogs/        ← Mỗi .md file = 1 bài viết
    projects/     ← Mỗi .md file = 1 project
    videos/       ← Mỗi .md file = 1 video
    topics/       ← Phân loại blog posts
    qa/           ← Q&A cho trang About
```

Content được parse lúc `next build` và generate thành static HTML. Không cần server, không cần database khi serve traffic.

## SEO Strategy

- **Server Components mặc định**: Mọi page là RSC, content có trong HTML ngay lập tức
- **generateStaticParams**: Pre-render tất cả blog posts, project pages lúc build time
- **generateMetadata**: Meta tags và Open Graph riêng cho từng trang
- **JSON-LD**: Structured data cho blog posts (BlogPosting schema)

## Workflow khi thêm blog mới

1. Tạo file `.md` trong `content/collections/blogs/` theo template
2. Chạy `npm run magic` để validate và xem preview
3. `npm run build` → pre-render tất cả pages

Không cần deploy infrastructure phức tạp.
