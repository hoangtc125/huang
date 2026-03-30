# Content Guide

## Tá»•ng quan

Portfolio dÃ¹ng **Markdown files** lÃ m nguá»“n dá»¯ liá»‡u, khÃ´ng cÃ³ CMS hay database. CÃ³ 5 loáº¡i collection content:

| Collection | Folder | Route |
|-----------|--------|-------|
| Blog posts | `content/collections/blogs/` | `/blog/[slug]` |
| Projects | `content/collections/projects/` | `/project/[slug]` |
| Videos | `content/collections/videos/` | `/videos/[slug]` |
| Topics | `content/collections/topics/` | `/topics/[slug]` |
| Q&A | `content/collections/qa/` | `/about` |

---

## Workflow nhanh: ThÃªm bÃ i blog má»›i

```bash
# BÆ°á»›c 1: Táº¡o file tá»« template
npm run magic new blog "TiÃªu Ä‘á» bÃ i viáº¿t cá»§a tÃ´i"

# BÆ°á»›c 2: Edit file Ä‘Æ°á»£c táº¡o trong content/collections/blogs/
# (file sáº½ Ä‘Æ°á»£c má»Ÿ gá»£i Ã½ trong terminal)

# BÆ°á»›c 3: Khi xong, set published: true trong frontmatter

# BÆ°á»›c 4: Build Ä‘á»ƒ pre-render
npm run build
```

---

## Blog Posts

### Frontmatter schema

```yaml
---
title: "TiÃªu Ä‘á» bÃ i viáº¿t"
slug: "url-friendly-slug"          # dÃ¹ng lÃ m URL: /blog/url-friendly-slug
description: "MÃ´ táº£ ~150 kÃ½ tá»±"   # SEO + listing card
cover: "/images/blog/cover.jpg"    # Cover image (tÃ¹y chá»n)

# Topic: PHáº¢I khá»›p vá»›i slug trong content/collections/topics/
topic: "web-development"           # web-development | system-design | career

tags:
  - "React"
  - "TypeScript"

# Cross-links (dÃ¹ng slug cá»§a content liÃªn quan)
related_projects:
  - "huang-workspace"
related_blogs:
  - "tailwind-css-v4-guide"

published: true    # false = draft, khÃ´ng hiá»ƒn thá»‹
featured: false    # true = hiá»ƒn thá»‹ ná»•i báº­t
date: "2026-03-20"
reading_time: 8    # phÃºt (tá»± tÃ­nh náº¿u bá» trá»‘ng)

# SEO (tÃ¹y chá»n)
seo_title: ""
seo_description: ""
---

Ná»™i dung bÃ i viáº¿t...
```

### Naming convention
```
yyyy-mm-dd-slug.md
2026-03-20-react-server-components-seo.md
```

### Markdown features
- GitHub Flavored Markdown (GFM) â€” tables, task lists, strikethrough
- Syntax highlighting: táº¥t cáº£ ngÃ´n ngá»¯ phá»• biáº¿n (JS, TS, Python, Go, SQL...)
- Images, blockquotes, code blocks Ä‘á»u styled

---

## Projects

### Frontmatter schema

```yaml
---
slug: "ten-du-an"
title: "TÃªn dá»± Ã¡n"
description: "MÃ´ táº£ cho SEO vÃ  card (1-2 cÃ¢u)"
short_desc: "CÃ¢u ngáº¯n hÆ¡n cho project list"
thumbnail: "/images/projects/thumb.jpg"
icon_url: "https://..."
images:
  - "/images/projects/screen1.jpg"
type: "web"    # web | app | extension
tech_stack:
  - "Next.js"
  - "TypeScript"
demo_url: "https://demo.com"
source_url: "https://github.com/..."

# Features tab content
features:
  - title: "TÃªn tÃ­nh nÄƒng"
    desc: "MÃ´ táº£ tÃ­nh nÄƒng"

# Architecture tab content
architecture: "MÃ´ táº£ kiáº¿n trÃºc ká»¹ thuáº­t..."

# Cross-links
related_blogs:
  - "blog-slug"

status: "live"     # live | in-progress | archived | review
published: true
featured: true
order: 1           # thá»© tá»± hiá»ƒn thá»‹ (nhá» hÆ¡n = trÆ°á»›c)
date: "2026-01-15"
---

# Body (optional, khÃ´ng hiá»ƒn thá»‹ trá»±c tiáº¿p hiá»‡n táº¡i)
```

---

## Topics

Topics lÃ  **phÃ¢n loáº¡i chÃ­nh** cho blog posts â€” khÃ¡c vá»›i tags, topics cÃ³ description Ä‘áº§y Ä‘á»§ vÃ  trang riÃªng.

### Táº¡o topic má»›i

```yaml
# content/collections/topics/my-topic.md
---
slug: "my-topic"
title: "My Topic"
description: "MÃ´ táº£ Ä‘áº§y Ä‘á»§ vá» topic nÃ y, giáº£i thÃ­ch nÃ³ bao gá»“m gÃ¬ vÃ  táº¡i sao quan trá»ng."
color: "indigo"   # indigo | emerald | amber | rose | violet | cyan
icon: "ðŸ“"        # emoji
published: true
---
```

### LiÃªn káº¿t blog â†’ topic
Trong blog frontmatter: `topic: "my-topic"` (pháº£i khá»›p slug)

---

## Videos

### Frontmatter schema

```yaml
---
slug: "ten-video"
title: "TiÃªu Ä‘á» video"
description: "MÃ´ táº£ video"
youtube_id: "dQw4w9WgXcQ"   # láº¥y tá»« youtube.com/watch?v=<ID>
tags:
  - "React"
related_blogs:
  - "blog-slug"
published: true
date: "2026-03-12"
duration: "45:20"
views: "12.5K"
---
```

YouTube thumbnail tá»± Ä‘á»™ng láº¥y tá»«: `img.youtube.com/vi/{youtube_id}/maxresdefault.jpg`

---

## Q&A

```yaml
---
slug: "cau-hoi-slug"
question: "CÃ¢u há»i?"
category: "general"
tags: ["tech"]
published: true
featured: false
order: 1          # thá»© tá»± hiá»ƒn thá»‹
---

CÃ¢u tráº£ lá»i viáº¿t á»Ÿ body Markdown...
```

---

## Cross-linking Guide

```
Project "huang-workspace"
    â””â”€ related_blogs:
          â”œâ”€ "react-server-components-seo"  â†â”€â”€ Blog vá» RSC/SEO liÃªn quan tá»›i project nÃ y
          â””â”€ "tailwind-css-v4-guide"        â†â”€â”€ Blog vá» Tailwind liÃªn quan tá»›i project nÃ y

Blog "react-server-components-seo"
    â””â”€ related_projects: ["huang-workspace"]   â†â”€â”€ Link ngÆ°á»£c láº¡i project
    â””â”€ related_blogs: ["tailwind-css-v4-guide"] â†â”€â”€ Blogs liÃªn quan khÃ¡c

Video "react-performance-2026"
    â””â”€ related_blogs: ["react-server-components-seo"] â†â”€â”€ Blog liÃªn quan tá»›i video
```

**LÆ°u Ã½:** Cross-links chá»‰ render theo má»™t chiá»u â€” khai bÃ¡o á»Ÿ Ä‘Ã¢u thÃ¬ hiá»ƒn thá»‹ á»Ÿ Ä‘Ã³. KhÃ´ng tá»± Ä‘á»™ng bidirectional.

---

## Content Rules

- `_template.md` files â€” KHÃ”NG pháº£i content, bá» qua khi scan
- `published: false` â€” draft, khÃ´ng hiá»ƒn thá»‹ trÃªn site
- Slug pháº£i unique trong cÃ¹ng collection
- Slug dÃ¹ng `kebab-case`, khÃ´ng dáº¥u, khÃ´ng space

---

## Magic CLI Reference

```bash
npm run magic                        # Help + stats
npm run magic list                   # Liá»‡t kÃª táº¥t cáº£ content
npm run magic validate               # Kiá»ƒm tra required fields
npm run magic new blog "Title"       # Táº¡o blog tá»« template
npm run magic new video "Title"      # Táº¡o video tá»« template
```

