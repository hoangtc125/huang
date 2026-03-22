# Hướng dẫn thêm nội dung mới

## Quy trình nhanh

```
Viết file .md  →  npm run magic validate  →  npm run dev (xem thử)  →  npm run build
```

---

## Lệnh thường dùng

```bash
# Chạy dev server (localhost:3043)
cd apps/portfolio
npm run dev

# Build production (pre-render tất cả static pages)
npm run build

# Kiểm tra tất cả content files
npm run magic validate

# Liệt kê toàn bộ content
npm run magic list

# Xem help + stats
npm run magic
```

---

## Thêm Blog Post mới

### Bước 1 — Tạo file

**Cách 1: Dùng CLI (nhanh nhất)**
```bash
cd apps/portfolio
npm run magic new blog "Tiêu đề bài viết của bạn"
```
→ Tạo file `content/collections/blogs/2026-xx-xx-tieu-de-bai-viet.md` với đúng template.

**Cách 2: Copy thủ công**
```bash
cp content/collections/blogs/_template.md \
   content/collections/blogs/2026-03-25-ten-bai-viet.md
```
Naming: `yyyy-mm-dd-slug.md`

---

### Bước 2 — Điền frontmatter

Mở file vừa tạo, cập nhật các trường quan trọng:

```yaml
---
title: "Tiêu đề bài viết"
slug: "url-friendly-slug"          # ← URL sẽ là /blog/url-friendly-slug
description: "Mô tả ~150 ký tự"   # ← Hiện ở listing + Google search

# Chọn topic phù hợp (phải là slug của topic đã có)
topic: "web-development"           # web-development | system-design | career

tags:
  - "React"
  - "TypeScript"

# Link tới project/blog liên quan (dùng slug)
related_projects:
  - "huang-workspace"
related_blogs:
  - "tailwind-css-v4-guide"

published: false    # ← Đặt true khi sẵn sàng publish
date: "2026-03-25"
---
```

---

### Bước 3 — Viết nội dung

Nội dung bắt đầu sau dấu `---` cuối. Dùng Markdown bình thường:

```markdown
# Tiêu đề chính

Đoạn mở đầu...

## Phần 1

Nội dung...

### Phần nhỏ hơn

```typescript
// Code block — được syntax highlight tự động
const hello = "world";
```

> Blockquote để highlight ý quan trọng

![Mô tả ảnh](/images/blog/ten-anh.jpg)
```

**Supported:** GFM (tables, task lists, strikethrough), tất cả ngôn ngữ lập trình phổ biến.

---

### Bước 4 — Publish và build

```bash
# 1. Validate trước khi publish
cd apps/portfolio && npm run magic validate

# 2. Mở file, đổi published: false → true

# 3. Xem thử trên dev
npm run dev
# → Mở http://localhost:3043/blog/slug-cua-ban

# 4. Build production
npm run build
```

---

## Thêm Topic mới

Topics là **phân loại chính** cho blogs — khác với tags, topics có mô tả chi tiết và trang riêng.

### Tạo file

```bash
# Tạo file trong content/collections/topics/
touch content/collections/topics/ten-topic.md
```

### Nội dung file

```yaml
---
slug: "ten-topic"
title: "Tên Topic"
description: "Mô tả đầy đủ về topic này. Giải thích nó bao gồm gì, tại sao quan trọng, và người đọc sẽ tìm thấy gì ở đây. Hiện ở trang /topics và dưới badge topic trong mỗi bài viết."
color: "violet"   # indigo | emerald | amber | rose | violet | cyan
icon: "🔧"        # emoji (tùy chọn)
published: true
---
```

**Màu sắc:**

| color | Trông như thế nào |
|-------|-------------------|
| `indigo` | Tím xanh (mặc định) |
| `emerald` | Xanh lá |
| `amber` | Vàng cam |
| `rose` | Hồng đỏ |
| `violet` | Tím |
| `cyan` | Xanh lam nhạt |

### Sử dụng topic trong blog

Sau khi tạo topic, dùng slug của nó trong frontmatter của blog:

```yaml
topic: "ten-topic"   # phải khớp slug trong file topic
```

**Lưu ý:** Không cần rebuild chỉ để xem topic mới — `npm run dev` sẽ tự load.

---

## Thêm Video mới

### Bước 1 — Lấy YouTube ID

URL YouTube: `https://www.youtube.com/watch?v=`**`dQw4w9WgXcQ`**
→ ID là phần sau `v=`: `dQw4w9WgXcQ`

### Bước 2 — Tạo file

**Dùng CLI:**
```bash
cd apps/portfolio
npm run magic new video "Tiêu đề video của bạn"
```

**Hoặc tạo thủ công** trong `content/collections/videos/`:

```yaml
---
slug: "ten-video-slug"
title: "Tiêu đề video"
description: "Mô tả nội dung video (hiện ở listing và trang detail)"

youtube_id: "dQw4w9WgXcQ"   # ← Bắt buộc

tags:
  - "React"
  - "Tutorial"

# Blog liên quan sẽ hiện ở cuối trang video
related_blogs:
  - "slug-blog-lien-quan"

published: true
date: "2026-03-25"
duration: "15:30"    # tùy chọn
views: "1.2K"        # tùy chọn
---
```

**Thumbnail:** Lấy tự động từ YouTube — không cần upload ảnh.

### Kết quả
- Listing tại `/videos`
- Trang detail tại `/videos/ten-video-slug` với YouTube embed + related blogs

---

## Thêm Project mới

### Tạo file trong `content/collections/projects/`

```yaml
---
slug: "ten-project"
title: "Tên Project"
description: "Mô tả cho SEO và card (1-2 câu)"
short_desc: "Câu ngắn hơn cho danh sách projects trên trang chủ"

# Ảnh (có thể dùng picsum.photos để test)
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

# Tab "Features" — hiện dạng card grid
features:
  - title: "Tính năng 1"
    desc: "Mô tả tính năng 1"
  - title: "Tính năng 2"
    desc: "Mô tả tính năng 2"

# Tab "Architecture" — hiện dạng đoạn văn
architecture: "Mô tả kiến trúc kỹ thuật: framework, database, deploy, các quyết định thiết kế..."

# Cross-links — blog nào nói về project này?
related_blogs:
  - "react-server-components-seo"

status: "live"       # live | in-progress | archived | review
published: true
featured: true        # true = hiện trên trang chủ
order: 4             # thứ tự trong danh sách (nhỏ hơn = lên trước)
date: "2026-03-25"
---

# Nội dung chi tiết (tùy chọn, chưa hiển thị trực tiếp)

Mô tả chi tiết hơn về project...
```

---

## Cross-linking giữa nội dung

Kết nối nội dung với nhau để người đọc khám phá thêm.

### Blog → Project và Blog khác

```yaml
# Trong frontmatter của blog
related_projects:
  - "huang-workspace"
  - "dev-tools-pro"
related_blogs:
  - "tailwind-css-v4-guide"
  - "react-server-components-seo"
```

### Project → Blog

```yaml
# Trong frontmatter của project
related_blogs:
  - "react-server-components-seo"
  - "tailwind-css-v4-guide"
```

### Video → Blog

```yaml
# Trong frontmatter của video
related_blogs:
  - "react-server-components-seo"
```

**Lưu ý:** Khai báo ở đâu thì `RelatedContent` hiện ở đó. Không tự động bidirectional — nếu muốn hiện ở cả hai phía, khai báo ở cả hai.

---

## Q&A (trang About)

Thêm câu hỏi mới vào `content/collections/qa/`:

```yaml
---
slug: "cau-hoi-moi"
question: "Câu hỏi của bạn là gì?"
category: "general"   # general | technical | career
tags:
  - "tag"
published: true
featured: false
order: 5              # thứ tự trong accordion (nhỏ hơn = lên trước)
date: "2026-03-25"
---

Câu trả lời viết ở đây, hỗ trợ Markdown bình thường.

Có thể nhiều đoạn, **in đậm**, *in nghiêng*, danh sách:

- Điểm 1
- Điểm 2
```

---

## Build và Deploy

### Dev (local preview)

```bash
cd apps/portfolio
npm run dev
# → http://localhost:3043
```

Hot reload — thay đổi file MD, refresh browser là thấy ngay (không cần restart).

### Production Build

```bash
cd apps/portfolio
npm run build
```

**Output:** `.next/` folder với 21+ static HTML files. Mỗi blog/project/video là 1 file HTML riêng — không cần server để serve.

Sau khi `build`, có thể:
```bash
npm run start    # chạy production server local để test
```

### Deploy lên Vercel

```bash
# Nếu đã cài Vercel CLI
vercel --prod
```

Hoặc push lên GitHub và Vercel tự build.

---

## Checklist trước khi publish

- [ ] `slug` unique trong collection (không trùng với bài khác)
- [ ] `title` và `description` đã điền (cần cho SEO)
- [ ] `topic` đúng slug của topic đã có (với blog)
- [ ] `youtube_id` đã điền (với video)
- [ ] `published: true` đã bật
- [ ] Chạy `npm run magic validate` — không có lỗi
- [ ] Xem thử trên `npm run dev` trước khi build

---

## Cấu trúc URL

| Content | File | URL |
|---------|------|-----|
| Blog | `blogs/2026-03-25-my-post.md` (slug: `my-post`) | `/blog/my-post` |
| Project | `projects/my-project.md` (slug: `my-project`) | `/project/my-project` |
| Video | `videos/my-video.md` (slug: `my-video`) | `/videos/my-video` |
| Topic | `topics/my-topic.md` (slug: `my-topic`) | `/topics/my-topic` |

**Quan trọng:** URL được xác định bởi trường `slug` trong frontmatter, **không phải** tên file.
