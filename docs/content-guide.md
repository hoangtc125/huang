# Content Guide

## Tổng quan

Portfolio dùng **Markdown files** làm nguồn dữ liệu, không có CMS hay database. Có 5 loại collection content:

| Collection | Folder | Route |
|-----------|--------|-------|
| Blog posts | `content/collections/blogs/` | `/blog/[slug]` |
| Projects | `content/collections/projects/` | `/project/[slug]` |
| Videos | `content/collections/videos/` | `/videos/[slug]` |
| Topics | `content/collections/topics/` | `/topics/[slug]` |
| Q&A | `content/collections/qa/` | `/about` |

---

## Workflow nhanh: Thêm bài blog mới

```bash
# Bước 1: Tạo file từ template
npm run magic new blog "Tiêu đề bài viết của tôi"

# Bước 2: Edit file được tạo trong content/collections/blogs/
# (file sẽ được mở gợi ý trong terminal)

# Bước 3: Khi xong, set published: true trong frontmatter

# Bước 4: Build để pre-render
npm run build
```

---

## Blog Posts

### Frontmatter schema

```yaml
---
title: "Tiêu đề bài viết"
slug: "url-friendly-slug"          # dùng làm URL: /blog/url-friendly-slug
description: "Mô tả ~150 ký tự"   # SEO + listing card
cover: "/images/blog/cover.jpg"    # Cover image (tùy chọn)

# Topic: PHẢI khớp với slug trong content/collections/topics/
topic: "web-development"           # web-development | system-design | career

tags:
  - "React"
  - "TypeScript"

# Cross-links (dùng slug của content liên quan)
related_projects:
  - "huang-workspace"
related_blogs:
  - "tailwind-css-v4-guide"

published: true    # false = draft, không hiển thị
featured: false    # true = hiển thị nổi bật
date: "2026-03-20"
reading_time: 8    # phút (tự tính nếu bỏ trống)

# SEO (tùy chọn)
seo_title: ""
seo_description: ""
---

Nội dung bài viết...
```

### Naming convention
```
yyyy-mm-dd-slug.md
2026-03-20-react-server-components-seo.md
```

### Markdown features
- GitHub Flavored Markdown (GFM) — tables, task lists, strikethrough
- Syntax highlighting: tất cả ngôn ngữ phổ biến (JS, TS, Python, Go, SQL...)
- Images, blockquotes, code blocks đều styled

---

## Projects

### Frontmatter schema

```yaml
---
slug: "ten-du-an"
title: "Tên dự án"
description: "Mô tả cho SEO và card (1-2 câu)"
short_desc: "Câu ngắn hơn cho project list"
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
  - title: "Tên tính năng"
    desc: "Mô tả tính năng"

# Architecture tab content
architecture: "Mô tả kiến trúc kỹ thuật..."

# Cross-links
related_blogs:
  - "blog-slug"

status: "live"     # live | in-progress | archived | review
published: true
featured: true
order: 1           # thứ tự hiển thị (nhỏ hơn = trước)
date: "2026-01-15"
---

# Body (optional, không hiển thị trực tiếp hiện tại)
```

---

## Topics

Topics là **phân loại chính** cho blog posts — khác với tags, topics có description đầy đủ và trang riêng.

### Tạo topic mới

```yaml
# content/collections/topics/my-topic.md
---
slug: "my-topic"
title: "My Topic"
description: "Mô tả đầy đủ về topic này, giải thích nó bao gồm gì và tại sao quan trọng."
color: "indigo"   # indigo | emerald | amber | rose | violet | cyan
icon: "📝"        # emoji
published: true
---
```

### Liên kết blog → topic
Trong blog frontmatter: `topic: "my-topic"` (phải khớp slug)

---

## Videos

### Frontmatter schema

```yaml
---
slug: "ten-video"
title: "Tiêu đề video"
description: "Mô tả video"
youtube_id: "dQw4w9WgXcQ"   # lấy từ youtube.com/watch?v=<ID>
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

YouTube thumbnail tự động lấy từ: `img.youtube.com/vi/{youtube_id}/maxresdefault.jpg`

---

## Q&A

```yaml
---
slug: "cau-hoi-slug"
question: "Câu hỏi?"
category: "general"
tags: ["tech"]
published: true
featured: false
order: 1          # thứ tự hiển thị
---

Câu trả lời viết ở body Markdown...
```

---

## Cross-linking Guide

```
Project "huang-workspace"
    └─ related_blogs:
          ├─ "react-server-components-seo"  ←── Blog về RSC/SEO liên quan tới project này
          └─ "tailwind-css-v4-guide"        ←── Blog về Tailwind liên quan tới project này

Blog "react-server-components-seo"
    └─ related_projects: ["huang-workspace"]   ←── Link ngược lại project
    └─ related_blogs: ["tailwind-css-v4-guide"] ←── Blogs liên quan khác

Video "react-performance-2026"
    └─ related_blogs: ["react-server-components-seo"] ←── Blog liên quan tới video
```

**Lưu ý:** Cross-links chỉ render theo một chiều — khai báo ở đâu thì hiển thị ở đó. Không tự động bidirectional.

---

## Content Rules

- `_template.md` files — KHÔNG phải content, bỏ qua khi scan
- `published: false` — draft, không hiển thị trên site
- Slug phải unique trong cùng collection
- Slug dùng `kebab-case`, không dấu, không space

---

## Magic CLI Reference

```bash
npm run magic                        # Help + stats
npm run magic list                   # Liệt kê tất cả content
npm run magic validate               # Kiểm tra required fields
npm run magic new blog "Title"       # Tạo blog từ template
npm run magic new video "Title"      # Tạo video từ template
```
