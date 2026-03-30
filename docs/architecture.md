# Architecture

## Overview

Portfolio cá nhân static-first — không có backend, không có CMS. Toàn bộ content được viết bằng Markdown và compile thành static HTML lúc build time.

```
e:/project/huang/
├── apps/
│   └── portfolio/           ← Next.js 15 App Router
│       ├── app/             ← Pages (RSC + client components)
│       ├── components/      ← Shared UI components
│       ├── lib/content/     ← Content loader (types + loaders)
│       └── scripts/         ← magic.mjs CLI tool
├── content/
│   ├── static/              ← Dữ liệu tĩnh (profile, skills...)
│   └── collections/         ← Dynamic content (blogs, projects...)
├── docs/                    ← Tài liệu dự án
└── packages/
    └── content-loader/      ← Placeholder (logic hiện ở apps/portfolio/lib/content/)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.8 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion (motion/react) |
| Frontmatter parsing | gray-matter |
| MD → HTML | unified + remark-parse + remark-gfm + remark-rehype + rehype-stringify |
| Syntax highlighting | rehype-highlight + highlight.js (server-side) |

## Content System

### Luồng dữ liệu

```
content/collections/blogs/*.md
         │
         ▼ gray-matter parse frontmatter
apps/portfolio/lib/content/blogs.ts
         │ getBlogPosts() / getBlogBySlug()
         ▼
app/blog/page.tsx (RSC) ──────────────→ BlogList.tsx ("use client", topic filter)
app/blog/[id]/page.tsx (RSC + SSG)
         │
         ▼ markdownToHtml() (remark → rehype → rehype-highlight → HTML string)
         HTML đầy đủ trong source → Google crawl được ngay, SEO tốt
```

### Collections

| Collection | Route | Description |
|-----------|-------|-------------|
| `blogs/` | `/blog/[slug]` | Blog posts với syntax highlighting |
| `projects/` | `/project/[slug]` | Project showcase với tabs |
| `videos/` | `/videos/[slug]` | YouTube embeds với related blogs |
| `topics/` | `/topics/[slug]` | Topic categories với description đầy đủ |
| `qa/` | `/about` | Q&A cho trang About |

### Content Loader (`apps/portfolio/lib/content/`)

```typescript
lib/content/
├── types.ts      ← TypeScript interfaces (BlogPost, Project, Video, Topic, QA...)
├── utils.ts      ← FS helpers, markdownToHtml() async pipeline
├── blogs.ts      ← getBlogPosts(), getBlogBySlug(), getBlogsBySlugs()
├── projects.ts   ← getProjects(), getProjectBySlug(), getProjectsBySlugs()
├── videos.ts     ← getVideos(), getVideoBySlug()
├── topics.ts     ← getTopics(), getTopicBySlug()
├── qa.ts         ← getQAs()
└── index.ts      ← Re-exports all
```

## SEO Architecture

### Tại sao RSC?
Client-side rendering gửi HTML rỗng về browser — bot phải chạy JS để thấy nội dung. RSC gửi HTML đầy đủ ngay lập tức.

### Static Site Generation (SSG)
Pages với dynamic routes dùng `generateStaticParams` để pre-render tất cả lúc `next build`:

```typescript
// app/blog/[id]/page.tsx
export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map(post => ({ id: post.slug }));
}
```

**Build output (21 pages pre-rendered):**
- `/blog/[slug]` — mỗi blog post = 1 static HTML file
- `/project/[slug]` — mỗi project = 1 static HTML file
- `/topics/[slug]` — mỗi topic = 1 static HTML file
- `/videos/[slug]` — mỗi video = 1 static HTML file

### Per-page Metadata
```typescript
export async function generateMetadata({ params }) {
  const post = getBlogBySlug(params.id);
  return {
    title: `${post.title} | Huang Workspace`,
    description: post.description,
    openGraph: { type: "article", publishedTime: post.publishedAt },
  };
}
```

### JSON-LD Structured Data
- Blog posts: `BlogPosting` schema (headline, datePublished, author)
- Videos: `VideoObject` schema (name, embedUrl, thumbnailUrl)

## Cross-linking System

Content types liên kết với nhau qua slug references trong frontmatter:

```yaml
# Blog post frontmatter
related_projects:
  - "huang-workspace"    ← slug của project
related_blogs:
  - "tailwind-css-v4-guide"   ← slug của blog khác

# Project frontmatter
related_blogs:
  - "react-server-components-seo"

# Video frontmatter
related_blogs:
  - "tailwind-css-v4-guide"
```

Các references được resolve lúc build và render thành `RelatedContent` component ở cuối mỗi trang.

## YouTube Embed (Facade Pattern)

```typescript
// components/YouTubeEmbed.tsx — "use client"
// State: playing = false → thumbnail | true → iframe

// Trạng thái ban đầu: thumbnail + play button
<img src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`} />

// Sau khi click: load iframe với autoplay
<iframe src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`} />
```

Tốt cho performance: không load iframe/YouTube JS cho mỗi video card.

## Mobile-First Responsive Design

Layout và typography được thiết kế mobile-first — styles mặc định cho màn hình nhỏ, scale up qua breakpoints.

### Breakpoints

| Breakpoint | Ý nghĩa |
|-----------|---------|
| Default | Mobile (<640px) |
| `sm:` (640px) | Tablet nhỏ |
| `md:` (768px) | Tablet / laptop nhỏ |
| `lg:` (1024px) | Desktop (sidebar layouts) |

### Header

- Mobile: hamburger menu (slide-down), header height `h-14`
- Desktop (`sm:`): inline nav links, height `h-16`
- Component: `components/Header.tsx` ("use client" — cần state cho menu toggle)

### Landing Page (HomeClient)

- **Hero**: font size scale `text-2xl → sm:text-3xl → md:text-4xl` để title/subtitle vừa 1 dòng trên mobile
- **Garden tabs**: luôn hiện cả icon + text label (text nhỏ hơn trên mobile: `text-xs → sm:text-sm`)
- **Project cards**: description hiện 2 dòng (`line-clamp-2`) trên mọi breakpoint; padding lớn hơn trên `sm:`

### Blog List (BlogList)

- Mobile: topic filter là sticky button dưới header (`sticky top-14`), click mở slide-out panel
- Desktop (`sm:`): inline flex-wrap topic buttons
- Post cards: padding và font size giảm trên mobile

### Blog Detail

- Mobile: TOC (mục lục) là sticky floating button (`components/MobileToc.tsx`), click mở slide-out panel
- Desktop (`lg:`): sidebar sticky TOC bên phải (`lg:grid lg:grid-cols-[minmax(0,1fr)_18rem]`)
- Blog title: `text-2xl → sm:text-4xl → md:text-5xl`

## RSC + Client Split Pattern

Khi page cần cả data fetching và interactivity:

```
app/blog/page.tsx              ← RSC: load data, export metadata
app/blog/BlogList.tsx          ← "use client": topic filter, animations

app/project/[id]/page.tsx           ← RSC: generateStaticParams, load data
app/project/[id]/ProjectDetailClient.tsx  ← "use client": tab switching

app/about/page.tsx             ← RSC: load QAs from MD
app/about/AboutClient.tsx      ← "use client": accordion, scroll nav
```

**Rule:** RSC handles data + SEO. Client components handle state + animations.

## Magic CLI

```bash
npm run magic                       # Help + content stats
npm run magic new blog "Title"      # Tạo blog MD từ template
npm run magic new video "Title"     # Tạo video MD từ template
npm run magic validate              # Kiểm tra tất cả content files
npm run magic list                  # Liệt kê tất cả content
```

Script: `apps/portfolio/scripts/magic.mjs` — Node.js ES module, không cần cài thêm deps.
