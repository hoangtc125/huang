# Content Guide - Hướng dẫn quản lý nội dung

## Tổng quan

Portfolio này sử dụng **Markdown files** làm nguồn dữ liệu chính, chia thành 2 loại:

### 1. Static Content (`content/static/`)

Thông tin **ít thay đổi**, được compile trực tiếp vào source code lúc build.

| File              | Mục đích                              |
| ----------------- | ------------------------------------- |
| `profile.md`      | Họ tên, email, social links           |
| `about.md`        | Giới thiệu bản thân (có body content) |
| `skills.md`       | Danh sách kỹ năng theo category       |
| `experience.md`   | Timeline kinh nghiệm & học vấn       |
| `site.md`         | Cấu hình website, nav, SEO, footer   |

**Cách hoạt động:**
- Dữ liệu nằm trong YAML frontmatter (`---` ... `---`)
- Một số file có body content (phần sau frontmatter) dùng để render HTML
- Code sẽ parse các file này lúc build time → static data

**Khi nào sửa:** Khi đổi thông tin cá nhân, thêm skill, cập nhật kinh nghiệm.

---

### 2. Collection Content (`content/collections/`)

Thông tin **thay đổi thường xuyên**, load như database. Mỗi file = 1 record.

| Folder       | Mục đích           | Filename convention              |
| ------------ | ------------------- | -------------------------------- |
| `projects/`  | Dự án đã làm       | `slug-du-an.md`                  |
| `blogs/`     | Bài viết blog       | `yyyy-mm-dd-slug-bai-viet.md`   |
| `qa/`        | Câu hỏi & trả lời  | `slug-cau-hoi.md`               |

**Cách hoạt động:**
- Mỗi folder có `_template.md` — copy ra để tạo record mới
- Frontmatter = metadata (title, tags, date, status...)
- Body = nội dung chi tiết, render thành HTML
- Code sẽ scan folder, parse tất cả `.md` files (trừ `_template.md`)
- Hỗ trợ filter, sort, paginate dựa trên frontmatter

**Khi nào thêm:** Khi có dự án mới, viết blog mới, thêm Q&A mới.

---

## Quy tắc chung

### Frontmatter
- Luôn đặt trong cặp `---`
- Dùng YAML syntax
- Các field bắt buộc được ghi rõ trong template

### Body Content
- Dùng Markdown chuẩn (CommonMark)
- Hỗ trợ: headings, bold, italic, links, images, code blocks, tables
- Ảnh đặt trong `apps/portfolio/public/images/`

### Naming
- Filename dùng **kebab-case**: `my-awesome-project.md`
- Blog thêm prefix ngày: `2026-03-18-tieu-de.md`
- Template files bắt đầu bằng `_`: `_template.md`

### Trạng thái
- `published: true/false` — Kiểm soát hiển thị
- `featured: true/false` — Đánh dấu nổi bật
- `status` (projects) — `completed`, `in-progress`, `archived`
