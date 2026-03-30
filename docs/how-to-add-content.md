# HÆ°á»›ng dáº«n thÃªm ná»™i dung má»›i

## Quy trÃ¬nh nhanh

```
Viáº¿t file .md  â†’  npm run magic validate  â†’  npm run dev (xem thá»­)  â†’  npm run build
```

---

## Lá»‡nh thÆ°á»ng dÃ¹ng

```bash
# Cháº¡y dev server (localhost:3043)
cd apps
npm run dev

# Build production (pre-render táº¥t cáº£ static pages)
npm run build

# Kiá»ƒm tra táº¥t cáº£ content files
npm run magic validate

# Liá»‡t kÃª toÃ n bá»™ content
npm run magic list

# Xem help + stats
npm run magic
```

---

## ThÃªm Blog Post má»›i

### BÆ°á»›c 1 â€” Táº¡o file

**CÃ¡ch 1: DÃ¹ng CLI (nhanh nháº¥t)**
```bash
cd apps
npm run magic new blog "TiÃªu Ä‘á» bÃ i viáº¿t cá»§a báº¡n"
```
â†’ Táº¡o file `content/collections/blogs/2026-xx-xx-tieu-de-bai-viet.md` vá»›i Ä‘Ãºng template.

**CÃ¡ch 2: Copy thá»§ cÃ´ng**
```bash
cp content/collections/blogs/_template.md \
   content/collections/blogs/2026-03-25-ten-bai-viet.md
```
Naming: `yyyy-mm-dd-slug.md`

---

### BÆ°á»›c 2 â€” Äiá»n frontmatter

Má»Ÿ file vá»«a táº¡o, cáº­p nháº­t cÃ¡c trÆ°á»ng quan trá»ng:

```yaml
---
title: "TiÃªu Ä‘á» bÃ i viáº¿t"
slug: "url-friendly-slug"          # â† URL sáº½ lÃ  /blog/url-friendly-slug
description: "MÃ´ táº£ ~150 kÃ½ tá»±"   # â† Hiá»‡n á»Ÿ listing + Google search

# Chá»n topic phÃ¹ há»£p (pháº£i lÃ  slug cá»§a topic Ä‘Ã£ cÃ³)
topic: "web-development"           # web-development | system-design | career

tags:
  - "React"
  - "TypeScript"

# Link tá»›i project/blog liÃªn quan (dÃ¹ng slug)
related_projects:
  - "huang-workspace"
related_blogs:
  - "tailwind-css-v4-guide"

published: false    # â† Äáº·t true khi sáºµn sÃ ng publish
date: "2026-03-25"
---
```

---

### BÆ°á»›c 3 â€” Viáº¿t ná»™i dung

Ná»™i dung báº¯t Ä‘áº§u sau dáº¥u `---` cuá»‘i. DÃ¹ng Markdown bÃ¬nh thÆ°á»ng:

```markdown
# TiÃªu Ä‘á» chÃ­nh

Äoáº¡n má»Ÿ Ä‘áº§u...

## Pháº§n 1

Ná»™i dung...

### Pháº§n nhá» hÆ¡n

```typescript
// Code block â€” Ä‘Æ°á»£c syntax highlight tá»± Ä‘á»™ng
const hello = "world";
```

> Blockquote Ä‘á»ƒ highlight Ã½ quan trá»ng

![MÃ´ táº£ áº£nh](/images/blog/ten-anh.jpg)
```

**Supported:** GFM (tables, task lists, strikethrough), táº¥t cáº£ ngÃ´n ngá»¯ láº­p trÃ¬nh phá»• biáº¿n.

---

### BÆ°á»›c 4 â€” Publish vÃ  build

```bash
# 1. Validate trÆ°á»›c khi publish
cd apps && npm run magic validate

# 2. Má»Ÿ file, Ä‘á»•i published: false â†’ true

# 3. Xem thá»­ trÃªn dev
npm run dev
# â†’ Má»Ÿ http://localhost:3043/blog/slug-cua-ban

# 4. Build production
npm run build
```

---

## ThÃªm Topic má»›i

Topics lÃ  **phÃ¢n loáº¡i chÃ­nh** cho blogs â€” khÃ¡c vá»›i tags, topics cÃ³ mÃ´ táº£ chi tiáº¿t vÃ  trang riÃªng.

### Táº¡o file

```bash
# Táº¡o file trong content/collections/topics/
touch content/collections/topics/ten-topic.md
```

### Ná»™i dung file

```yaml
---
slug: "ten-topic"
title: "TÃªn Topic"
description: "MÃ´ táº£ Ä‘áº§y Ä‘á»§ vá» topic nÃ y. Giáº£i thÃ­ch nÃ³ bao gá»“m gÃ¬, táº¡i sao quan trá»ng, vÃ  ngÆ°á»i Ä‘á»c sáº½ tÃ¬m tháº¥y gÃ¬ á»Ÿ Ä‘Ã¢y. Hiá»‡n á»Ÿ trang /topics vÃ  dÆ°á»›i badge topic trong má»—i bÃ i viáº¿t."
color: "violet"   # indigo | emerald | amber | rose | violet | cyan
icon: "ðŸ”§"        # emoji (tÃ¹y chá»n)
published: true
---
```

**MÃ u sáº¯c:**

| color | TrÃ´ng nhÆ° tháº¿ nÃ o |
|-------|-------------------|
| `indigo` | TÃ­m xanh (máº·c Ä‘á»‹nh) |
| `emerald` | Xanh lÃ¡ |
| `amber` | VÃ ng cam |
| `rose` | Há»“ng Ä‘á» |
| `violet` | TÃ­m |
| `cyan` | Xanh lam nháº¡t |

### Sá»­ dá»¥ng topic trong blog

Sau khi táº¡o topic, dÃ¹ng slug cá»§a nÃ³ trong frontmatter cá»§a blog:

```yaml
topic: "ten-topic"   # pháº£i khá»›p slug trong file topic
```

**LÆ°u Ã½:** KhÃ´ng cáº§n rebuild chá»‰ Ä‘á»ƒ xem topic má»›i â€” `npm run dev` sáº½ tá»± load.

---

## ThÃªm Video má»›i

### BÆ°á»›c 1 â€” Láº¥y YouTube ID

URL YouTube: `https://www.youtube.com/watch?v=`**`dQw4w9WgXcQ`**
â†’ ID lÃ  pháº§n sau `v=`: `dQw4w9WgXcQ`

### BÆ°á»›c 2 â€” Táº¡o file

**DÃ¹ng CLI:**
```bash
cd apps
npm run magic new video "TiÃªu Ä‘á» video cá»§a báº¡n"
```

**Hoáº·c táº¡o thá»§ cÃ´ng** trong `content/collections/videos/`:

```yaml
---
slug: "ten-video-slug"
title: "TiÃªu Ä‘á» video"
description: "MÃ´ táº£ ná»™i dung video (hiá»‡n á»Ÿ listing vÃ  trang detail)"

youtube_id: "dQw4w9WgXcQ"   # â† Báº¯t buá»™c

tags:
  - "React"
  - "Tutorial"

# Blog liÃªn quan sáº½ hiá»‡n á»Ÿ cuá»‘i trang video
related_blogs:
  - "slug-blog-lien-quan"

published: true
date: "2026-03-25"
duration: "15:30"    # tÃ¹y chá»n
views: "1.2K"        # tÃ¹y chá»n
---
```

**Thumbnail:** Láº¥y tá»± Ä‘á»™ng tá»« YouTube â€” khÃ´ng cáº§n upload áº£nh.

### Káº¿t quáº£
- Listing táº¡i `/videos`
- Trang detail táº¡i `/videos/ten-video-slug` vá»›i YouTube embed + related blogs

---

## ThÃªm Project má»›i

### Táº¡o file trong `content/collections/projects/`

```yaml
---
slug: "ten-project"
title: "TÃªn Project"
description: "MÃ´ táº£ cho SEO vÃ  card (1-2 cÃ¢u)"
short_desc: "CÃ¢u ngáº¯n hÆ¡n cho danh sÃ¡ch projects trÃªn trang chá»§"

# áº¢nh (cÃ³ thá»ƒ dÃ¹ng picsum.photos Ä‘á»ƒ test)
thumbnail: "https://picsum.photos/seed/myproject/800/450"
icon_url: "https://picsum.photos/seed/myproject-icon/128/128"
images:
  - "https://picsum.photos/seed/myproject-sc1/1200/800"
  - "https://picsum.photos/seed/myproject-sc2/1200/800"

type: "web"      # web | app | extension
tech_stack:
  - "Next.js"
  - "TypeScript"
  - "Tailwind CSS"

demo_url: "https://your-demo.com"
source_url: "https://github.com/you/project"

# Tab "Features" â€” hiá»‡n dáº¡ng card grid
features:
  - title: "TÃ­nh nÄƒng 1"
    desc: "MÃ´ táº£ tÃ­nh nÄƒng 1"
  - title: "TÃ­nh nÄƒng 2"
    desc: "MÃ´ táº£ tÃ­nh nÄƒng 2"

# Tab "Architecture" â€” hiá»‡n dáº¡ng Ä‘oáº¡n vÄƒn
architecture: "MÃ´ táº£ kiáº¿n trÃºc ká»¹ thuáº­t: framework, database, deploy, cÃ¡c quyáº¿t Ä‘á»‹nh thiáº¿t káº¿..."

# Cross-links â€” blog nÃ o nÃ³i vá» project nÃ y?
related_blogs:
  - "react-server-components-seo"

status: "live"       # live | in-progress | archived | review
published: true
featured: true        # true = hiá»‡n trÃªn trang chá»§
order: 4             # thá»© tá»± trong danh sÃ¡ch (nhá» hÆ¡n = lÃªn trÆ°á»›c)
date: "2026-03-25"
---

# Ná»™i dung chi tiáº¿t (tÃ¹y chá»n, chÆ°a hiá»ƒn thá»‹ trá»±c tiáº¿p)

MÃ´ táº£ chi tiáº¿t hÆ¡n vá» project...
```

---

## Cross-linking giá»¯a ná»™i dung

Káº¿t ná»‘i ná»™i dung vá»›i nhau Ä‘á»ƒ ngÆ°á»i Ä‘á»c khÃ¡m phÃ¡ thÃªm.

### Blog â†’ Project vÃ  Blog khÃ¡c

```yaml
# Trong frontmatter cá»§a blog
related_projects:
  - "huang-workspace"
  - "dev-tools-pro"
related_blogs:
  - "tailwind-css-v4-guide"
  - "react-server-components-seo"
```

### Project â†’ Blog

```yaml
# Trong frontmatter cá»§a project
related_blogs:
  - "react-server-components-seo"
  - "tailwind-css-v4-guide"
```

### Video â†’ Blog

```yaml
# Trong frontmatter cá»§a video
related_blogs:
  - "react-server-components-seo"
```

**LÆ°u Ã½:** Khai bÃ¡o á»Ÿ Ä‘Ã¢u thÃ¬ `RelatedContent` hiá»‡n á»Ÿ Ä‘Ã³. KhÃ´ng tá»± Ä‘á»™ng bidirectional â€” náº¿u muá»‘n hiá»‡n á»Ÿ cáº£ hai phÃ­a, khai bÃ¡o á»Ÿ cáº£ hai.

---

## Q&A (trang About)

ThÃªm cÃ¢u há»i má»›i vÃ o `content/collections/qa/`:

```yaml
---
slug: "cau-hoi-moi"
question: "CÃ¢u há»i cá»§a báº¡n lÃ  gÃ¬?"
category: "general"   # general | technical | career
tags:
  - "tag"
published: true
featured: false
order: 5              # thá»© tá»± trong accordion (nhá» hÆ¡n = lÃªn trÆ°á»›c)
date: "2026-03-25"
---

CÃ¢u tráº£ lá»i viáº¿t á»Ÿ Ä‘Ã¢y, há»— trá»£ Markdown bÃ¬nh thÆ°á»ng.

CÃ³ thá»ƒ nhiá»u Ä‘oáº¡n, **in Ä‘áº­m**, *in nghiÃªng*, danh sÃ¡ch:

- Äiá»ƒm 1
- Äiá»ƒm 2
```

---

## Build vÃ  Deploy

### Dev (local preview)

```bash
cd apps
npm run dev
# â†’ http://localhost:3043
```

Hot reload â€” thay Ä‘á»•i file MD, refresh browser lÃ  tháº¥y ngay (khÃ´ng cáº§n restart).

### Production Build

```bash
cd apps
npm run build
```

**Output:** `.next/` folder vá»›i 21+ static HTML files. Má»—i blog/project/video lÃ  1 file HTML riÃªng â€” khÃ´ng cáº§n server Ä‘á»ƒ serve.

Sau khi `build`, cÃ³ thá»ƒ:
```bash
npm run start    # cháº¡y production server local Ä‘á»ƒ test
```

### Deploy lÃªn Vercel

```bash
# Náº¿u Ä‘Ã£ cÃ i Vercel CLI
vercel --prod
```

Hoáº·c push lÃªn GitHub vÃ  Vercel tá»± build.

---

## Checklist trÆ°á»›c khi publish

- [ ] `slug` unique trong collection (khÃ´ng trÃ¹ng vá»›i bÃ i khÃ¡c)
- [ ] `title` vÃ  `description` Ä‘Ã£ Ä‘iá»n (cáº§n cho SEO)
- [ ] `topic` Ä‘Ãºng slug cá»§a topic Ä‘Ã£ cÃ³ (vá»›i blog)
- [ ] `youtube_id` Ä‘Ã£ Ä‘iá»n (vá»›i video)
- [ ] `published: true` Ä‘Ã£ báº­t
- [ ] Cháº¡y `npm run magic validate` â€” khÃ´ng cÃ³ lá»—i
- [ ] Xem thá»­ trÃªn `npm run dev` trÆ°á»›c khi build

---

## Cáº¥u trÃºc URL

| Content | File | URL |
|---------|------|-----|
| Blog | `blogs/2026-03-25-my-post.md` (slug: `my-post`) | `/blog/my-post` |
| Project | `projects/my-project.md` (slug: `my-project`) | `/project/my-project` |
| Video | `videos/my-video.md` (slug: `my-video`) | `/videos/my-video` |
| Topic | `topics/my-topic.md` (slug: `my-topic`) | `/topics/my-topic` |

**Quan trá»ng:** URL Ä‘Æ°á»£c xÃ¡c Ä‘á»‹nh bá»Ÿi trÆ°á»ng `slug` trong frontmatter, **khÃ´ng pháº£i** tÃªn file.


