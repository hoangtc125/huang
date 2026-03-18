# Claude Instructions

## Project Overview

Portfolio cá nhân sử dụng Markdown làm data source. Không có backend/CMS.

## Project Structure

- `apps/portfolio/` — Web app chính
- `content/static/` — MD tĩnh, compile trực tiếp vào code (profile, skills, experience)
- `content/collections/` — MD động, load như database (projects, blogs, qa)
- `docs/` — Tài liệu dự án
- `packages/content-loader/` — Utility parse MD files

## Content Rules

### Static MD (`content/static/`)
- Dữ liệu nằm trong YAML frontmatter
- Một số file có body content (about.md) để render HTML
- Parse lúc build time → inject vào components như props/constants
- Khi sửa file → cần rebuild

### Collection MD (`content/collections/`)
- Mỗi file `.md` = 1 record (1 project, 1 blog post, 1 Q&A)
- `_template.md` là template, KHÔNG phải content — bỏ qua khi scan
- Frontmatter = metadata (title, slug, tags, date, published, featured...)
- Body = nội dung chi tiết → render thành HTML
- Hỗ trợ filter, sort, paginate dựa trên frontmatter fields
- `published: false` = draft, không hiển thị trên site

### Naming Conventions
- Collection files: `kebab-case.md`
- Blog files: `yyyy-mm-dd-slug.md`
- Template files: `_template.md`

## Code Style

- Sử dụng TypeScript
- Ưu tiên simple, readable code
- Tránh over-engineering

## Khi thêm collection mới

1. Tạo folder trong `content/collections/`
2. Tạo `_template.md` với frontmatter schema
3. Thêm loader/parser tương ứng
4. Cập nhật `docs/content-guide.md`
