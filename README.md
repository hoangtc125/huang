# Huang Portfolio

Portfolio cá nhân dùng Markdown làm nguồn nội dung, compile sang mã TypeScript/TSX tĩnh trước khi build.

## Cấu trúc chính

```text
apps/                 -> Next.js app + UI + API routes + scripts
content/              -> Markdown nguồn (ngoài app root)
  collections/        -> blogs, projects, topics, videos, qa
  static/             -> profile, skills, about, site, experience
docs/                 -> tài liệu dự án
```

## Luồng nội dung

1. Viết file Markdown trong `content/`.
2. Chạy `npm run content:compile` trong thư mục `apps`.
3. Script sinh file TSX vào `apps/lib/content/generated/`.
4. `next build` chỉ dùng mã TSX đã compile (không đọc FS runtime trên Cloudflare).

## Lệnh thường dùng

```bash
cd apps
npm install
npm run content:compile
npm run dev
npm run build
```

## Magic CLI

```bash
cd apps
npm run magic list
npm run magic validate
npm run magic compile
npm run magic new blog "Tiêu đề bài viết"
npm run magic new project "Tên dự án"
npm run magic new video "Tiêu đề video"
npm run magic new qa "Câu hỏi"
```

## Tài liệu

- [Content Guide](docs/content-guide.md)
- [How To Add Content](docs/how-to-add-content.md)
- [Architecture](docs/architecture.md)
- [Deployment](docs/deployment.md)
