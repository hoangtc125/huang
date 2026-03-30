# Architecture

## Overview

Kiến trúc hiện tại tách rõ:

- `content/` (repo root): Markdown nguồn.
- `apps/`: Next.js app (App Router) chạy trên Cloudflare Workers qua OpenNext.
- `apps/scripts/compile-content.mjs`: compile Markdown sang module TSX tĩnh.

Điểm quan trọng: production runtime **không** dùng `fs` để đọc Markdown. Mọi nội dung đã được compile trước khi build.

## Thư mục

```text
e:/project/huang/
├── apps/
│   ├── app/                     # Routes + pages
│   ├── components/              # UI components
│   ├── lib/
│   │   └── content/
│   │       ├── blogs.ts         # Loader cho blogs
│   │       ├── projects.ts      # Loader cho projects
│   │       ├── topics.ts        # Loader cho topics
│   │       ├── videos.ts        # Loader cho videos
│   │       ├── qa.ts            # Loader cho QA
│   │       └── generated/       # Output compile (TSX + index)
│   ├── scripts/
│   │   ├── compile-content.mjs  # Compile content/ -> lib/content/generated
│   │   └── magic.mjs            # CLI tạo file + validate + compile
│   └── wrangler.jsonc           # Cloudflare Worker config
├── content/
│   ├── static/
│   └── collections/
└── docs/
```

## Content Pipeline

1. Tác giả tạo/sửa Markdown trong `content/`.
2. Chạy `npm run content:compile` (hoặc `npm run magic compile`) trong `apps`.
3. Script parse frontmatter + body, convert markdown thành HTML string và sinh file TSX.
4. Loader (`blogs.ts`, `projects.ts`, ...) import dữ liệu từ `generated/`.
5. `next build` pre-render các route tĩnh bằng `generateStaticParams`.

## Static Rendering

Các route động đều pre-render lúc build:

- `/blog/[id]`
- `/project/[id]`
- `/topics/[slug]`
- `/videos/[slug]`

Vì dữ liệu đã compile sẵn, request runtime không phải đọc Markdown từ filesystem. Điều này phù hợp môi trường Cloudflare Worker (stateless, không có source tree đầy đủ như local).

## SEO

- Trang detail và listing đều render từ Server Components.
- HTML nội dung có sẵn trong response đầu tiên.
- Không phụ thuộc client fetch để hiển thị phần chính của bài viết.

## Build/Deploy

Trong `apps`:

```bash
npm run content:compile
npm run build
pnpm opennextjs-cloudflare build
pnpm opennextjs-cloudflare deploy
```

Khuyến nghị: luôn chạy compile trước build trong CI để tránh lệch giữa Markdown và generated TSX.
