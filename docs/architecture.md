# Architecture - Kiến trúc dự án

## Cấu trúc thư mục

```
huang/
├── apps/
│   └── portfolio/          # Web app chính (Next.js hoặc framework khác)
│       ├── public/
│       │   └── images/     # Ảnh, favicon, og-image...
│       ├── src/
│       │   ├── components/ # UI components
│       │   ├── pages/      # Routes/Pages
│       │   ├── lib/        # Utilities, content loaders
│       │   ├── styles/     # Global styles
│       │   └── types/      # TypeScript types
│       └── package.json
│
├── content/
│   ├── static/             # Thông tin tĩnh (compile vào code)
│   │   ├── profile.md      # Thông tin cá nhân
│   │   ├── about.md        # Giới thiệu bản thân
│   │   ├── skills.md       # Kỹ năng
│   │   ├── experience.md   # Kinh nghiệm
│   │   └── site.md         # Cấu hình site
│   │
│   └── collections/        # Nội dung động (load như DB)
│       ├── projects/       # Dự án
│       │   ├── _template.md
│       │   └── *.md
│       ├── blogs/          # Blog posts
│       │   ├── _template.md
│       │   └── *.md
│       └── qa/             # Q&A
│           ├── _template.md
│           └── *.md
│
├── docs/                   # Tài liệu dự án
│   ├── content-guide.md    # Hướng dẫn quản lý content
│   └── architecture.md     # Kiến trúc (file này)
│
├── packages/               # Shared packages
│   └── content-loader/     # Utility parse MD files
│
└── README.md
```

## Data Flow

```
content/static/*.md ──→ Build time parse ──→ Inject vào components
                                              (props / constants)

content/collections/**/*.md ──→ Build time scan ──→ Generate static pages
                                 hoặc                (SSG)
                               Runtime load  ──→ Dynamic render
                                                  (API routes / getStaticProps)
```

## Cách xử lý 2 loại MD

### Static MD → Direct Inject
```
1. Đọc file .md
2. Parse YAML frontmatter → Object
3. Parse body (nếu có) → HTML string
4. Truyền vào component như props/constants
5. Không cần dynamic routing
```

### Collection MD → DB-like Loading
```
1. Scan tất cả .md files trong folder (bỏ qua _template.md)
2. Parse từng file: frontmatter + body
3. Tạo index/list từ frontmatter (title, date, tags...)
4. Hỗ trợ: filter, sort, paginate, search
5. Mỗi file tạo 1 dynamic route (dựa trên slug)
```

## Mở rộng

Khi cần thêm collection mới (ví dụ: testimonials, services):
1. Tạo folder mới trong `content/collections/`
2. Tạo `_template.md` với frontmatter phù hợp
3. Thêm loader tương ứng trong app
4. Cập nhật `content-guide.md`
