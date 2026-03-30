export const entry = {
  "file": "sample-portfolio-website.md",
  "data": {
    "published": false,
    "title": "Portfolio Website",
    "slug": "portfolio-website",
    "description": "Trang portfolio cá nhân được xây dựng với Next.js và TailwindCSS",
    "thumbnail": "/images/projects/portfolio-thumb.jpg",
    "images": [
      "/images/projects/portfolio-1.jpg",
      "/images/projects/portfolio-2.jpg"
    ],
    "type": "web",
    "tags": [
      "Next.js",
      "TypeScript",
      "TailwindCSS",
      "Markdown"
    ],
    "demo_url": "https://yoursite.com",
    "source_url": "https://github.com/you/portfolio",
    "status": "completed",
    "featured": true,
    "order": 1,
    "date": "2026-03-01"
  },
  "content": "# Portfolio Website\r\n\r\n## Tổng quan\r\n\r\nTrang portfolio cá nhân sử dụng Markdown làm nguồn dữ liệu chính,\r\nkhông cần backend hay CMS phức tạp.\r\n\r\n## Tech Stack\r\n\r\n- **Framework:** Next.js 14\r\n- **Styling:** TailwindCSS\r\n- **Content:** Markdown + YAML frontmatter\r\n- **Deploy:** Vercel"
} as const;
export default entry;
