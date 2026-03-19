# Planning - Hoàn thiện nội dung Portfolio

## Trạng thái hiện tại

- [x] Chuyển đổi từ Vite + React Router → Next.js App Router
- [x] Build thành công, UI giữ nguyên
- [ ] **Kết nối app với content markdown files** (hiện app đang dùng `data.ts` hardcoded)
- [ ] Điền thông tin thật vào content files
- [ ] Build content-loader để parse markdown → inject vào components

---

## Vấn đề cần giải quyết

> App hiện đang đọc data từ `apps/portfolio/data.ts` (hardcoded).
> Theo kiến trúc, data phải được đọc từ `content/` markdown files.
> Cần build content-loader (`packages/content-loader/`) để parse MD → data cho app.

---

## Danh sách file content cần điền

### 1. Static Content — `content/static/`

Thông tin cố định, compile lúc build. **Sửa file → rebuild → cập nhật.**

#### `content/static/profile.md`
- [ ] `name` — Họ tên đầy đủ (hiện: "Nguyen Van A")
- [ ] `nickname` — Nickname (hiện: "Huang")
- [ ] `title` — Chức danh (hiện: "Full-stack Developer")
- [ ] `email` — Email liên hệ (hiện: "your@email.com")
- [ ] `phone` — Số điện thoại
- [ ] `location` — Địa điểm
- [ ] `website` — URL website
- [ ] `socials.github` — GitHub URL
- [ ] `socials.linkedin` — LinkedIn URL
- [ ] `socials.twitter` — Twitter URL (hoặc bỏ nếu không dùng)
- [ ] `avatar` — Ảnh đại diện (đặt vào `apps/portfolio/public/images/`)
- [ ] `og_image` — Ảnh Open Graph cho SEO

#### `content/static/about.md`
- [ ] `headline` — Tagline ngắn (hiện: "Crafting digital experiences with passion")
- [ ] `years_of_experience` — Số năm kinh nghiệm (hiện: 3)
- [ ] `available_for_hire` — Có nhận việc không (true/false)
- [ ] `resume_url` — Link CV/Resume PDF
- [ ] **Body content** — Viết giới thiệu bản thân bằng Markdown (phần sau `---`)

#### `content/static/skills.md`
- [ ] Cập nhật danh sách skills theo thực tế
- [ ] Mỗi skill có `name` và `level` (0-100)
- [ ] Thêm/bớt categories nếu cần (hiện có: Frontend, Backend, DevOps & Tools)

#### `content/static/experience.md`
- [ ] `timeline[]` — Danh sách kinh nghiệm làm việc
  - Mỗi mục cần: `company`, `role`, `period`, `description`, `highlights[]`
  - Logo công ty (tùy chọn): đặt vào `apps/portfolio/public/images/companies/`
- [ ] `education[]` — Học vấn
  - Mỗi mục cần: `school`, `degree`, `period`

#### `content/static/site.md`
- [ ] `site_name` — Tên site
- [ ] `site_url` — URL production
- [ ] `seo.default_description` — Mô tả SEO mặc định
- [ ] `nav[]` — Menu navigation (thêm/bớt mục nếu cần)
- [ ] `footer.copyright` — Dòng copyright

---

### 2. Collection Content — `content/collections/`

Nội dung động, mỗi file `.md` = 1 record. **Copy `_template.md` → đổi tên → điền nội dung.**

#### `content/collections/projects/` — Dự án
- [ ] Xóa `sample-portfolio-website.md` (hoặc cập nhật thành project thật)
- [ ] Tạo 1 file `.md` cho mỗi project thật
  - Filename: `kebab-case.md` (ví dụ: `everminute.md`)
  - Frontmatter: title, slug, description, category, tags, status, featured, order...
  - Body: mô tả chi tiết project
  - Ảnh: đặt vào `apps/portfolio/public/images/projects/`

#### `content/collections/blogs/` — Blog posts
- [ ] Cập nhật `2026-03-18-xin-chao.md` (hoặc xóa nếu không cần)
- [ ] Tạo thêm blog posts nếu có
  - Filename: `yyyy-mm-dd-slug.md`
  - Frontmatter: title, slug, description, category, tags, date, published...
  - Body: nội dung bài viết Markdown

#### `content/collections/qa/` — Q&A
- [ ] Cập nhật `why-hire-me.md` với câu trả lời thật
- [ ] Tạo thêm Q&A nếu cần
  - Filename: `slug-cau-hoi.md`
  - Frontmatter: question, slug, category, order...
  - Body: câu trả lời chi tiết

---

### 3. Assets — `apps/portfolio/public/images/`

- [ ] `avatar.jpg` — Ảnh đại diện
- [ ] `og-default.jpg` — Ảnh SEO (1200x630px recommended)
- [ ] `projects/` — Ảnh thumbnail + screenshots cho mỗi project
- [ ] `blog/` — Ảnh cover cho blog posts
- [ ] `companies/` — Logo công ty (nếu dùng trong experience)

---

## Thứ tự triển khai đề xuất

| # | Việc cần làm | Ưu tiên |
|---|---|---|
| 1 | Điền `profile.md` + `about.md` + `site.md` | ⚡ Cao |
| 2 | Điền `experience.md` + `skills.md` | ⚡ Cao |
| 3 | Tạo project files trong `collections/projects/` | ⚡ Cao |
| 4 | Build content-loader để parse MD → app | ⚡ Cao |
| 5 | Tạo Q&A files trong `collections/qa/` | 🔶 Trung bình |
| 6 | Viết blog posts trong `collections/blogs/` | 🔶 Trung bình |
| 7 | Thêm ảnh thật (avatar, project screenshots...) | 🔶 Trung bình |
| 8 | Xóa data hardcoded trong `data.ts` | ⬇️ Sau khi content-loader xong |

---

## Ghi chú

- Hiện tại app **chưa đọc** từ markdown files, đang dùng `data.ts`
- Cần build `packages/content-loader/` để parse frontmatter + body từ MD files
- Sau khi có content-loader, sẽ thay `data.ts` bằng data load từ `content/`
- File `_template.md` trong mỗi collection là template, **không hiển thị** trên site
