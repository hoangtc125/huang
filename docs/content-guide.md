# Content Guide

## Tổng quan

Nguồn nội dung nằm ở `content/` (ngoài app root), gồm 2 nhóm:

- `content/static/`: nội dung tĩnh cho profile/site/about/skills/experience.
- `content/collections/`: nội dung theo collection (`blogs`, `projects`, `topics`, `videos`, `qa`).

Mỗi lần đổi Markdown, cần compile lại để cập nhật module TSX trong app.

## Workflow chuẩn

```bash
cd apps
npm run magic validate
npm run magic compile
npm run dev
```

## Collection và route

| Collection | Folder | Route |
|---|---|---|
| Blogs | `content/collections/blogs/` | `/blog/[id]` |
| Projects | `content/collections/projects/` | `/project/[id]` |
| Topics | `content/collections/topics/` | `/topics/[slug]` |
| Videos | `content/collections/videos/` | `/videos/[slug]` |
| QA | `content/collections/qa/` | `/about` |

## Tạo nội dung mới

```bash
cd apps
npm run magic new blog "Tiêu đề bài viết"
npm run magic new project "Tên dự án"
npm run magic new topic "Tên topic"
npm run magic new video "Tiêu đề video"
npm run magic new qa "Câu hỏi"
```

Sau khi tạo file:

1. Điền frontmatter.
2. Viết nội dung Markdown.
3. Đặt `published: true` khi sẵn sàng publish.
4. Chạy `npm run magic compile`.

## Quy tắc quan trọng

- `_template.md` chỉ là template, không render lên site.
- `slug` phải unique trong từng collection.
- Các liên kết chéo (`related_*`) dùng đúng slug mục tiêu.
- Nếu đổi slug, cần cập nhật các file đang tham chiếu slug cũ.

## Compile output

Compile sinh dữ liệu vào `apps/lib/content/generated/`:

- Mỗi file Markdown tương ứng 1 file TSX/module.
- Có `index.ts` cho từng collection.
- App import trực tiếp từ generated modules khi build/runtime.

Điều này giúp deploy Cloudflare ổn định vì không còn phụ thuộc đọc Markdown bằng `fs` ở runtime.
