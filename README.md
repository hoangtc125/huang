# Huang Portfolio

Portfolio cá nhân sử dụng Markdown làm nguồn dữ liệu chính — không cần backend hay CMS.

## Cấu trúc

```
apps/              → Ứng dụng (portfolio web app)
content/
  static/          → Thông tin tĩnh (profile, skills, experience) — compile vào code
  collections/     → Nội dung động (projects, blogs, qa) — load như database
docs/              → Tài liệu dự án
packages/          → Shared utilities
```

## 2 loại Markdown

| Loại | Folder | Cách dùng | Ví dụ |
|------|--------|-----------|-------|
| **Static** | `content/static/` | Sửa file → rebuild → cập nhật | Tên, skills, kinh nghiệm |
| **Collection** | `content/collections/` | Thêm file .md = thêm record | Dự án, blog, Q&A |

## Bắt đầu nhanh

### Thêm dự án mới
```bash
cp content/collections/projects/_template.md content/collections/projects/ten-du-an.md
# Sửa frontmatter và nội dung
```

### Viết blog mới
```bash
cp content/collections/blogs/_template.md content/collections/blogs/2026-03-18-tieu-de.md
# Sửa frontmatter và nội dung
```

### Thêm Q&A
```bash
cp content/collections/qa/_template.md content/collections/qa/cau-hoi-moi.md
# Sửa frontmatter và nội dung
```

### Cập nhật thông tin cá nhân
Sửa trực tiếp các file trong `content/static/`

## Tài liệu

- [Content Guide](docs/content-guide.md) — Hướng dẫn quản lý nội dung
- [Architecture](docs/architecture.md) — Kiến trúc dự án
