export const entry = {
  "file": "huang-workspace.md",
  "data": {
    "slug": "huang-workspace",
    "title": "Huang Workspace",
    "description": "Portfolio cá nhân static-first xây dựng với Next.js 15 App Router, deploy trên Cloudflare Workers. Toàn bộ content là Markdown thuần, không CMS — compile thành static HTML lúc build time. Tích hợp Supabase để đếm lượt xem real-time.",
    "short_desc": "My personal portfolio and digital garden — the site you're currently browsing.",
    "thumbnail": "/images/ava.jpg",
    "icon_url": "/images/ava.jpg",
    "images": [
      "https://picsum.photos/seed/hw-sc1/1200/800",
      "https://picsum.photos/seed/hw-sc2/1200/800"
    ],
    "type": "web",
    "tags": [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Cloudflare",
      "Supabase"
    ],
    "tech_stack": [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Framer Motion",
      "Supabase",
      "Cloudflare Workers"
    ],
    "demo_url": "https://huangwork.space",
    "source_url": "https://github.com/huangtran/huang-workspace",
    "features": [
      {
        "title": "Markdown-first Content System",
        "desc": "Blogs, projects, videos, topics, Q&A — tất cả là file .md. gray-matter parse frontmatter, unified/remark/rehype compile body thành HTML với syntax highlighting. Không CMS, không database cho content.",
        "image": "https://picsum.photos/seed/hw-content/800/450",
        "images": [
          "https://picsum.photos/seed/hw-content-1/1200/800",
          "https://picsum.photos/seed/hw-content-2/1200/800"
        ]
      },
      {
        "title": "Static Generation + SEO",
        "desc": "React Server Components mặc định, generateStaticParams pre-render mọi dynamic route lúc build. generateMetadata + JSON-LD (BlogPosting, VideoObject) cho từng trang — Google crawl được ngay lập tức.",
        "image": "https://picsum.photos/seed/hw-seo/800/450"
      },
      {
        "title": "Cross-linked Content Graph",
        "desc": "Blog posts link tới related projects và related blogs. Projects link tới related blogs. Videos link tới related blogs. Topics là category pages với full description — không chỉ tag.",
        "image": "https://picsum.photos/seed/hw-crosslink/800/450"
      },
      {
        "title": "Magic CLI",
        "desc": "npm run magic — CLI tool để tạo content từ template, validate required fields, liệt kê tất cả content. Workflow thêm blog mới không cần mở browser hay admin UI.",
        "image": "https://picsum.photos/seed/hw-cli/800/450"
      }
    ],
    "architecture_images": [
      "https://picsum.photos/seed/hw-arch/1200/800"
    ],
    "architecture": "Next.js 15 App Router, fully static generation với generateStaticParams. Content system đọc Markdown lúc build time, compile thành HTML. View counter fetch client-side sau render. Deploy trên edge network.",
    "related_blogs": [
      "react-server-components-seo",
      "tailwind-css-v4-guide"
    ],
    "status": "live",
    "published": true,
    "featured": true,
    "order": 3,
    "date": "2026-03-22"
  },
  "content": "# Huang Workspace\n\n## Tổng quan\n\nTrang bạn đang xem. Portfolio cá nhân kiêm digital garden — nơi tôi tập hợp projects, viết blog kỹ thuật, và share videos về software engineering.\n\n## Content System\n\nToàn bộ nội dung được viết bằng Markdown. Mỗi bài viết, project, hay video là một file `.md` riêng với frontmatter chứa metadata và body là nội dung chi tiết. Không có CMS, không có admin UI — chỉ cần editor và git.\n\nContent được compile thành static HTML lúc build, không cần server để serve traffic.\n\n## SEO\n\nMỗi trang có meta tags và Open Graph riêng. Blog posts và videos có structured data để Google hiểu nội dung tốt hơn. Vì tất cả là Server Components, content có trong HTML ngay từ đầu — không cần chờ JavaScript.\n\n## View Counter\n\nLượt xem được track và hiển thị real-time, load sau khi page đã render xong nên không ảnh hưởng tốc độ.\n\n## Thêm nội dung mới\n\nCó CLI tool để tạo content từ template, validate required fields, và liệt kê tất cả content. Workflow đơn giản: tạo file, viết, push."
} as const;
export default entry;
