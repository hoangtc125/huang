# Claude Instructions

## Project Overview

Portfolio cá nhân static-first — Markdown làm data source, không có backend/CMS. Content compile thành static HTML lúc build time qua Next.js generateStaticParams.

## Project Structure

```
apps/portfolio/
├── app/                   ← Next.js App Router pages (RSC + client components)
├── components/            ← Shared UI (Header, Footer, YouTubeEmbed, RelatedContent, TopicBadge...)
├── lib/content/           ← Content loader (types + loaders cho blogs/projects/videos/topics/qa)
└── scripts/magic.mjs      ← CLI tool cho content management

content/
├── static/                ← MD tĩnh (profile, skills, experience)
└── collections/
    ├── blogs/             ← Blog posts (yyyy-mm-dd-slug.md)
    ├── projects/          ← Projects
    ├── videos/            ← YouTube video entries
    ├── topics/            ← Topic categories với description đầy đủ
    └── qa/                ← Q&A cho trang About
```

## Content Rules

### Collection MD (`content/collections/`)
- Mỗi file `.md` = 1 record
- `_template.md` = KHÔNG phải content — bỏ qua khi scan
- Frontmatter = metadata; Body = nội dung chi tiết (render thành HTML)
- `published: false` = draft, không hiển thị
- Naming: `kebab-case.md`; blogs: `yyyy-mm-dd-slug.md`

### Cross-linking
- Blog posts có `related_projects` và `related_blogs` (danh sách slugs)
- Projects có `related_blogs` (danh sách slugs)
- Videos có `related_blogs` (danh sách slugs)
- Topics có description đầy đủ — KHÔNG phải chỉ tag

### Topics System
- Mỗi topic = 1 file MD trong `content/collections/topics/`
- Blog posts trỏ tới topic qua `topic: "slug-of-topic"`
- Topics có: slug, title, description, color, icon
- Routes: `/topics` và `/topics/[slug]`

## Content Loader (`apps/portfolio/lib/content/`)

```typescript
// Import từ index
import { getBlogPosts, getBlogBySlug, getProjects, getTopics } from '@/lib/content'
import { markdownToHtml } from '@/lib/content'  // async, server-side
```

Content path resolved relative: `process.cwd() + '/../../content'`

## SEO Architecture

- **Pages mặc định là RSC** — nội dung có trong HTML ngay lập tức
- **`generateStaticParams`** cho dynamic routes — pre-render tất cả lúc build
- **`generateMetadata`** cho mỗi page — meta tags + OpenGraph per page
- **JSON-LD** trong blog posts (BlogPosting) và videos (VideoObject)
- **markdownToHtml()** — remark → rehype → rehype-highlight → HTML string, chạy server-side

## RSC + Client Pattern

```typescript
// app/blog/page.tsx — RSC (data + metadata)
export default function BlogPage() {
  const posts = getBlogPosts()  // FS read, sync
  return <BlogList posts={posts} />  // client component
}

// app/blog/BlogList.tsx — "use client" (state + animations)
```

## Magic CLI

```bash
npm run magic                        # Help + content stats
npm run magic new blog "Title"       # Tạo blog từ template
npm run magic new video "Title"      # Tạo video từ template
npm run magic validate               # Kiểm tra required fields
npm run magic list                   # Liệt kê tất cả content
```

## Code Style

- TypeScript — strict nhưng không pedantic
- Simple, readable code — không over-engineer
- RSC mặc định, thêm "use client" chỉ khi cần state/events/animations
- Tránh hardcode data — mọi content đều qua MD files

## Khi thêm collection mới

1. Tạo folder `content/collections/<name>/`
2. Tạo `_template.md` với frontmatter schema đầy đủ
3. Tạo `apps/portfolio/lib/content/<name>.ts` với loader functions
4. Thêm export vào `apps/portfolio/lib/content/index.ts`
5. Tạo pages tương ứng trong `apps/portfolio/app/<name>/`
6. Cập nhật `docs/content-guide.md` và `docs/architecture.md`
