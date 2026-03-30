# How To Add Content

## Nhanh nhất

```bash
cd apps
npm run magic new blog "Tiêu đề"
# sửa file markdown được tạo trong content/collections/blogs/
npm run magic validate
npm run magic compile
npm run dev
```

## Lệnh chính

```bash
cd apps
npm run magic list
npm run magic validate
npm run magic compile
npm run content:compile
```

## Thêm Blog

1. Tạo file:

```bash
cd apps
npm run magic new blog "Tiêu đề bài viết"
```

2. Điền frontmatter cơ bản:

```yaml
---
title: "Tiêu đề bài viết"
slug: "tieu-de-bai-viet"
description: "Mô tả ngắn cho SEO"
date: "2026-03-30"
author: "Huang"
topic: "web-development"
tags: ["nextjs", "seo"]
published: true
featured: false
reading_time: 8
---
```

3. Viết body Markdown.
4. Compile lại:

```bash
cd apps
npm run magic compile
```

## Thêm Project

```bash
cd apps
npm run magic new project "Tên dự án"
```

Frontmatter tối thiểu:

```yaml
---
title: "Tên dự án"
slug: "ten-du-an"
description: "Mô tả ngắn"
status: "completed"
featured: true
order: 1
published: true
stack: ["Next.js", "Cloudflare", "Supabase"]
---
```

## Thêm Video

```bash
cd apps
npm run magic new video "Tiêu đề video"
```

Frontmatter tối thiểu:

```yaml
---
title: "Tiêu đề video"
slug: "tieu-de-video"
description: "Mô tả video"
youtube_id: "dQw4w9WgXcQ"
published: true
---
```

## Thêm Topic

```bash
cd apps
npm run magic new topic "Web Development"
```

## Thêm QA

```bash
cd apps
npm run magic new qa "Tại sao nên chọn tôi?"
```

## Checklist trước commit

- [ ] `npm run magic validate` không có lỗi.
- [ ] `npm run magic compile` chạy thành công.
- [ ] Route detail mở đúng slug mới.
- [ ] `published` đã đúng trạng thái mong muốn.
- [ ] Cross-links (`related_*`) không bị sai slug.
