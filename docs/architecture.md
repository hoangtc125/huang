# Architecture

## Overview

Portfolio cÃ¡ nhÃ¢n â€” content tá»« Markdown, deploy trÃªn Cloudflare Workers, backend nháº¹ qua Supabase (contact form + view counting).

```
e:/project/huang/
â”œâ”€â”€ apps/
â”‚   â”œâ”€â”€ app/             â† Pages (RSC + client) + API routes
â”‚   â”‚   â””â”€â”€ api/         â† Server-side API (contact, views)
â”‚   â”œâ”€â”€ components/      â† Shared UI components
â”‚   â”œâ”€â”€ lib/
â”‚   â”‚   â”œâ”€â”€ content/     â† Content loader (types + loaders)
â”‚   â”‚   â”œâ”€â”€ server/      â† Server utilities (api-error)
â”‚   â”‚   â”œâ”€â”€ supabase-server.ts  â† Supabase client
â”‚   â”‚   â””â”€â”€ env.server.ts       â† Env validation
â”‚   â”œâ”€â”€ content/
â”‚   â”‚   â”œâ”€â”€ static/      â† Dá»¯ liá»‡u tÄ©nh (profile, skills...)
â”‚   â”‚   â””â”€â”€ collections/ â† Dynamic content (blogs, projects...)
â”‚   â”œâ”€â”€ supabase/        â† SQL migration scripts
â”‚   â”œâ”€â”€ scripts/         â† magic.mjs CLI tool
â”‚   â”œâ”€â”€ wrangler.jsonc   â† Cloudflare Worker config
â”‚   â””â”€â”€ open-next.config.ts     â† OpenNext adapter
â”œâ”€â”€ docs/                    â† TÃ i liá»‡u dá»± Ã¡n
â””â”€â”€ packages/
    â””â”€â”€ content-loader/      â† Placeholder (logic hiá»‡n á»Ÿ apps/lib/content/)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.8 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion (motion/react) |
| Hosting | Cloudflare Workers (via @opennextjs/cloudflare) |
| Database | Supabase (PostgreSQL) |
| Frontmatter parsing | gray-matter |
| MD â†’ HTML | unified + remark-parse + remark-gfm + remark-rehype + rehype-stringify |
| Syntax highlighting | rehype-highlight + highlight.js (server-side) |

## Content System

### Luá»“ng dá»¯ liá»‡u

```
apps/content/collections/blogs/*.md
         â”‚
         â–¼ gray-matter parse frontmatter
apps/lib/content/blogs.ts
         â”‚ getBlogPosts() / getBlogBySlug()
         â–¼
app/blog/page.tsx (RSC) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â†’ BlogList.tsx ("use client", topic filter)
app/blog/[id]/page.tsx (RSC + SSG)
         â”‚
         â–¼ markdownToHtml() (remark â†’ rehype â†’ rehype-highlight â†’ HTML string)
         HTML Ä‘áº§y Ä‘á»§ trong source â†’ Google crawl Ä‘Æ°á»£c ngay, SEO tá»‘t
```

### Collections

| Collection | Route | Description |
|-----------|-------|-------------|
| `blogs/` | `/blog/[slug]` | Blog posts vá»›i syntax highlighting |
| `projects/` | `/project/[slug]` | Project showcase vá»›i tabs |
| `videos/` | `/videos/[slug]` | YouTube embeds vá»›i related blogs |
| `topics/` | `/topics/[slug]` | Topic categories vá»›i description Ä‘áº§y Ä‘á»§ |
| `qa/` | `/about` | Q&A cho trang About |

### Content Loader (`apps/lib/content/`)

```typescript
lib/content/
â”œâ”€â”€ types.ts      â† TypeScript interfaces (BlogPost, Project, Video, Topic, QA...)
â”œâ”€â”€ utils.ts      â† FS helpers, markdownToHtml() async pipeline
â”œâ”€â”€ blogs.ts      â† getBlogPosts(), getBlogBySlug(), getBlogsBySlugs()
â”œâ”€â”€ projects.ts   â† getProjects(), getProjectBySlug(), getProjectsBySlugs()
â”œâ”€â”€ videos.ts     â† getVideos(), getVideoBySlug()
â”œâ”€â”€ topics.ts     â† getTopics(), getTopicBySlug()
â”œâ”€â”€ qa.ts         â† getQAs()
â””â”€â”€ index.ts      â† Re-exports all
```

## SEO Architecture

### Táº¡i sao RSC?
Client-side rendering gá»­i HTML rá»—ng vá» browser â€” bot pháº£i cháº¡y JS Ä‘á»ƒ tháº¥y ná»™i dung. RSC gá»­i HTML Ä‘áº§y Ä‘á»§ ngay láº­p tá»©c.

### Static Site Generation (SSG)
Pages vá»›i dynamic routes dÃ¹ng `generateStaticParams` Ä‘á»ƒ pre-render táº¥t cáº£ lÃºc `next build`:

```typescript
// app/blog/[id]/page.tsx
export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map(post => ({ id: post.slug }));
}
```

**Build output (21 pages pre-rendered):**
- `/blog/[slug]` â€” má»—i blog post = 1 static HTML file
- `/project/[slug]` â€” má»—i project = 1 static HTML file
- `/topics/[slug]` â€” má»—i topic = 1 static HTML file
- `/videos/[slug]` â€” má»—i video = 1 static HTML file

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

Content types liÃªn káº¿t vá»›i nhau qua slug references trong frontmatter:

```yaml
# Blog post frontmatter
related_projects:
  - "huang-workspace"    â† slug cá»§a project
related_blogs:
  - "tailwind-css-v4-guide"   â† slug cá»§a blog khÃ¡c

# Project frontmatter
related_blogs:
  - "react-server-components-seo"

# Video frontmatter
related_blogs:
  - "tailwind-css-v4-guide"
```

CÃ¡c references Ä‘Æ°á»£c resolve lÃºc build vÃ  render thÃ nh `RelatedContent` component á»Ÿ cuá»‘i má»—i trang.

## YouTube Embed (Facade Pattern)

```typescript
// components/YouTubeEmbed.tsx â€” "use client"
// State: playing = false â†’ thumbnail | true â†’ iframe

// Tráº¡ng thÃ¡i ban Ä‘áº§u: thumbnail + play button
<img src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`} />

// Sau khi click: load iframe vá»›i autoplay
<iframe src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`} />
```

Tá»‘t cho performance: khÃ´ng load iframe/YouTube JS cho má»—i video card.

## Mobile-First Responsive Design

Layout vÃ  typography Ä‘Æ°á»£c thiáº¿t káº¿ mobile-first â€” styles máº·c Ä‘á»‹nh cho mÃ n hÃ¬nh nhá», scale up qua breakpoints.

### Breakpoints

| Breakpoint | Ã nghÄ©a |
|-----------|---------|
| Default | Mobile (<640px) |
| `sm:` (640px) | Tablet nhá» |
| `md:` (768px) | Tablet / laptop nhá» |
| `lg:` (1024px) | Desktop (sidebar layouts) |

### Header

- Mobile: dropdown overlay (absolute, gÃ³c pháº£i), backdrop blur, header height `h-14`
- Desktop (`sm:`): inline nav links, height `h-16`
- Component: `components/Header.tsx` ("use client" â€” cáº§n state cho menu toggle)

### Landing Page (HomeClient)

- **Hero**: font size scale `text-2xl â†’ sm:text-3xl â†’ md:text-4xl` Ä‘á»ƒ title/subtitle vá»«a 1 dÃ²ng trÃªn mobile
- **Garden tabs**: luÃ´n hiá»‡n cáº£ icon + text label (text nhá» hÆ¡n trÃªn mobile: `text-xs â†’ sm:text-sm`)
- **Project cards**: description hiá»‡n 2 dÃ²ng (`line-clamp-2`) trÃªn má»i breakpoint; padding lá»›n hÆ¡n trÃªn `sm:`

### Blog List (BlogList)

- Mobile: topic filter lÃ  button gÃ³c pháº£i dÆ°á»›i header (`sticky top-14`), click má»Ÿ dropdown overlay vá»›i backdrop blur
- Desktop (`sm:`): inline flex-wrap topic buttons
- Post cards: padding vÃ  font size giáº£m trÃªn mobile

### Blog Detail

- Mobile: TOC (má»¥c lá»¥c) lÃ  button gÃ³c pháº£i trÃªn dÆ°á»›i header (`components/MobileToc.tsx`), click má»Ÿ dropdown vá»›i backdrop blur
- Desktop (`lg:`): sidebar sticky TOC bÃªn pháº£i (`lg:grid lg:grid-cols-[minmax(0,1fr)_18rem]`)
- Blog title: `text-2xl â†’ sm:text-4xl â†’ md:text-5xl`

## RSC + Client Split Pattern

Khi page cáº§n cáº£ data fetching vÃ  interactivity:

```
app/blog/page.tsx              â† RSC: load data, export metadata
app/blog/BlogList.tsx          â† "use client": topic filter, animations

app/project/[id]/page.tsx           â† RSC: generateStaticParams, load data
app/project/[id]/ProjectDetailClient.tsx  â† "use client": tab switching

app/about/page.tsx             â† RSC: load QAs from MD
app/about/AboutClient.tsx      â† "use client": accordion, scroll nav
```

**Rule:** RSC handles data + SEO. Client components handle state + animations.

## Magic CLI

```bash
npm run magic                       # Help + content stats
npm run magic new blog "Title"      # Táº¡o blog MD tá»« template
npm run magic new video "Title"     # Táº¡o video MD tá»« template
npm run magic validate              # Kiá»ƒm tra táº¥t cáº£ content files
npm run magic list                  # Liá»‡t kÃª táº¥t cáº£ content
```

Script: `apps/scripts/magic.mjs` â€” Node.js ES module, khÃ´ng cáº§n cÃ i thÃªm deps.

## Cloudflare Deployment

### Kiáº¿n trÃºc

```
Next.js build
     â”‚
     â–¼  @opennextjs/cloudflare
.open-next/
â”œâ”€â”€ worker.js     â† Cloudflare Worker (SSR + API routes)
â””â”€â”€ assets/       â† Static files (CSS, JS, images)
     â”‚
     â–¼  wrangler deploy
Cloudflare Workers + Assets CDN
```

### Config files

| File | Má»¥c Ä‘Ã­ch |
|------|---------|
| `wrangler.jsonc` | Worker name, compatibility flags (`nodejs_compat`), assets binding |
| `open-next.config.ts` | OpenNext adapter config (cÃ³ thá»ƒ báº­t R2 cache) |
| `next.config.ts` | Security headers + `initOpenNextCloudflareForDev()` |

### Scripts

```bash
npm run dev       # Local dev (turbopack)
npm run build     # Next.js build
npm run preview   # Build + preview trÃªn Cloudflare local
npm run deploy    # Build + deploy lÃªn Cloudflare production
npm run upload    # Build + upload (khÃ´ng activate)
```

### Security Headers

Táº¥t cáº£ responses Ä‘á»u cÃ³:
- `X-Frame-Options: DENY` â€” chá»‘ng clickjacking
- `X-Content-Type-Options: nosniff` â€” chá»‘ng MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-DNS-Prefetch-Control: on`

### Environment Variables

Cáº§n set trÃªn Cloudflare Dashboard (Workers > Settings > Variables):

| Variable | MÃ´ táº£ | Báº£o máº­t |
|----------|-------|---------|
| `SUPABASE_URL` | URL Supabase project | Server-only (khÃ´ng `NEXT_PUBLIC_`) |
| `SUPABASE_ANON_KEY` | Publishable anon key | Server-only (khÃ´ng `NEXT_PUBLIC_`) |

## Supabase Backend

### Tá»•ng quan

Supabase cung cáº¥p 2 tÃ­nh nÄƒng:
1. **Contact form** â€” lÆ°u tin nháº¯n liÃªn há»‡ tá»« trang About
2. **View counting** â€” Ä‘áº¿m lÆ°á»£t xem cho blog, project, video

### Database Schema

```
contacts
â”œâ”€â”€ id           BIGINT (auto)
â”œâ”€â”€ name         TEXT (max 100)
â”œâ”€â”€ email        TEXT (max 254)
â”œâ”€â”€ message      TEXT (max 2000)
â””â”€â”€ created_at   TIMESTAMPTZ

page_views
â”œâ”€â”€ id              BIGINT (auto)
â”œâ”€â”€ resource_type   TEXT ('blog' | 'project' | 'video')
â”œâ”€â”€ slug            TEXT (max 200)
â”œâ”€â”€ view_count      BIGINT (default 0)
â”œâ”€â”€ created_at      TIMESTAMPTZ
â”œâ”€â”€ updated_at      TIMESTAMPTZ
â””â”€â”€ UNIQUE (resource_type, slug)
```

### RPC Functions

- `increment_page_view(p_resource_type, p_slug)` â€” atomic upsert + increment, tráº£ vá» view count má»›i. An toÃ n race condition nhá» `ON CONFLICT DO UPDATE`.

### Row Level Security (RLS)

| Table | Policy | Quyá»n |
|-------|--------|-------|
| `contacts` | `anon_insert_contacts` | Anon chá»‰ Ä‘Æ°á»£c INSERT |
| `page_views` | `anon_read_page_views` | Anon Ä‘Æ°á»£c SELECT |
| `page_views` | `anon_upsert_page_views` | Anon Ä‘Æ°á»£c INSERT (qua RPC) |
| `page_views` | `anon_update_page_views` | Anon Ä‘Æ°á»£c UPDATE (qua RPC) |

> KhÃ´ng cÃ³ policy SELECT cho `contacts` â†’ client khÃ´ng thá»ƒ Ä‘á»c danh sÃ¡ch contact. Chá»‰ admin qua Supabase Dashboard má»›i xem Ä‘Æ°á»£c.

### API Routes

```
POST /api/contact
â”œâ”€â”€ Input: { name, email, message }
â”œâ”€â”€ Validation: required fields, email regex, max length
â”œâ”€â”€ Action: INSERT vÃ o contacts table
â””â”€â”€ Response: { success: true } | { error: "..." }

POST /api/views
â”œâ”€â”€ Input: { type: "blog"|"project"|"video", slug: "..." }
â”œâ”€â”€ Validation: whitelist type, regex slug
â”œâ”€â”€ Action: RPC increment_page_view (atomic upsert)
â””â”€â”€ Response: { views: number }

GET /api/views?type=blog&slug=my-post
â”œâ”€â”€ Validation: whitelist type, regex slug
â”œâ”€â”€ Action: SELECT view_count
â””â”€â”€ Response: { views: number }
```

### Báº£o máº­t

1. **Env vars server-only** â€” `SUPABASE_URL` vÃ  `SUPABASE_ANON_KEY` khÃ´ng cÃ³ prefix `NEXT_PUBLIC_`, chá»‰ accessible trong API routes
2. **Parameterized queries** â€” Supabase SDK tá»± escape táº¥t cáº£ values, khÃ´ng SQL injection
3. **Input validation** â€” táº¥t cáº£ input Ä‘Æ°á»£c validate (type, length, regex) trÆ°á»›c khi query
4. **Error masking** â€” server log chi tiáº¿t error, client chá»‰ nháº­n generic message
5. **RLS** â€” database-level access control, ngay cáº£ khi bypass API
6. **No auth required** â€” portfolio public, dÃ¹ng anon key vá»›i RLS restricted

### Luá»“ng dá»¯ liá»‡u

```
User má»Ÿ blog post
     â”‚
     â–¼ ViewCounter component (client)
POST /api/views { type: "blog", slug: "my-post" }
     â”‚
     â–¼ API route (server)
     Validate input â†’ Supabase RPC increment_page_view
     â”‚
     â–¼ Supabase (database)
     UPSERT page_views SET view_count = view_count + 1
     â”‚
     â–¼ Response
     { views: 42 } â†’ hiá»ƒn thá»‹ "42 views" trÃªn UI
```

### Server Utilities

| File | Má»¥c Ä‘Ã­ch |
|------|---------|
| `lib/env.server.ts` | `requireEnv()` â€” throw náº¿u thiáº¿u env var |
| `lib/supabase-server.ts` | `createSupabaseServerClient()` â€” táº¡o Supabase client |
| `lib/server/api-error.ts` | `dbError()` â€” log tháº­t, tráº£ generic message |

