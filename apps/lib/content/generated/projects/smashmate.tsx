export const entry = {
  "file": "smashmate.md",
  "data": {
    "slug": "smashmate",
    "title": "SmashMate",
    "description": "Nền tảng giúp người chơi cầu lông tìm trận nhanh hơn bằng cách chuẩn hóa dữ liệu cộng đồng và đưa vào trải nghiệm tìm kiếm trực quan.",
    "short_desc": "Từ dữ liệu thô đến trải nghiệm tìm trận trong vài giây.",
    "thumbnail": "/images/projects/smashmate/giaoluucaulong-xyz-hero.jpg",
    "icon_url": "/images/projects/smashmate/giaoluucaulong-xyz-hero.jpg",
    "images": [
      "/images/projects/smashmate/giaoluucaulong-xyz-hero.jpg"
    ],
    "type": "web",
    "tags": [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Cloudflare",
      "Data Pipeline",
      "AI",
      "Browser Automation",
      "SaaS"
    ],
    "tech_stack": [
      "Next.js (App Router)",
      "TypeScript",
      "Supabase (Postgres + Auth + Edge Functions)",
      "Cloudflare Workers",
      "Google Gemini (AI extraction + search)",
      "Leaflet (Map + clustering)",
      "TailwindCSS + Radix UI",
      "Browser Automation (eSuit + Automa)"
    ],
    "demo_url": "https://giaoluucaulong.xyz",
    "source_url": "",
    "features": [
      {
        "title": "Feed 7 danh mục bài đăng",
        "desc": "Giao lưu, sang nhượng sân, dạy cầu, tuyển CLB, tìm người chơi, khuyến mãi sân, mua bán — mỗi danh mục có bộ lọc riêng theo ngữ cảnh thực tế. Hỗ trợ sort theo mới nhất, giá, thời gian, khoảng cách.",
        "images": [
          "/images/projects/smashmate/giaoluucaulong-xyz-feed-filter.jpg",
          "/images/projects/smashmate/giaoluucaulong-xyz-feed-post.jpg",
          "/images/projects/smashmate/giaoluucaulong-xyz-install.jpg"
        ]
      },
      {
        "title": "Chuẩn hóa dữ liệu bằng AI",
        "desc": "AI tự động trích xuất giờ, sân, mức độ, phí, số slot từ bài đăng thô Facebook. Batch process qua Edge Function, tự động phân loại danh mục và match tên sân.",
        "images": [
          "/images/projects/smashmate/giaoluucaulong-xyz-ai-assisstant.jpg"
        ]
      },
      {
        "title": "Bản đồ sân cầu lông",
        "desc": "Interactive map với marker clustering, lọc theo bán kính, hiển thị số bài đăng tại mỗi sân. Feed và map dùng chung bộ lọc — chuyển qua lại không mất context.",
        "images": [
          "/images/projects/smashmate/giaoluucaulong-xyz-map-list.jpg",
          "/images/projects/smashmate/giaoluucaulong-xyz-map-court.jpg",
          "/images/projects/smashmate/giaoluucaulong-xyz-map-select.jpg",
          "/images/projects/smashmate/giaoluucaulong-xyz-map-posts.jpg",
          "/images/projects/smashmate/giaoluucaulong-xyz-map-filter.jpg",
          "/images/projects/smashmate/giaoluucaulong-xyz-map-pick.jpg"
        ]
      },
      {
        "title": "Hệ thống Reminder & Push Notification",
        "desc": "Lưu bộ lọc yêu thích (ngày, giờ, trình độ, khu vực), tự match với bài mới và gửi push notification định kỳ.",
        "images": [
          "/images/projects/smashmate/giaoluucaulong-xyz-reminders.jpg",
          "/images/projects/smashmate/giaoluucaulong-xyz-interests.jpg"
        ]
      },
      {
        "title": "Xếp hạng tác giả và sân",
        "desc": "Ranking theo ngày/tuần cho tác giả hoạt động nhiều nhất và sân được đăng nhiều nhất, rebuild tự động qua scheduled jobs.",
        "image": "/images/projects/smashmate/giaoluucaulong-xyz-ranking.jpg"
      },
      {
        "title": "AI Search bằng tiếng Việt",
        "desc": "Nhập câu hỏi tự nhiên ('sân nào quận 7 tối nay') → AI parse thành bộ lọc có cấu trúc → trả kết quả ngay. Hiểu viết tắt trình độ, tên đường, thời gian tương đối.",
        "images": [
          "/images/projects/smashmate/giaoluucaulong-xyz-feed-ai.jpg"
        ]
      },
      {
        "title": "Pipeline thu thập dữ liệu tự động",
        "desc": "Chrome extension scrape Facebook groups → browser automation xử lý workflow → backend AI extract + phân loại + lưu trữ. Chạy 24/7 trên cloud VM với watchdog tự restart và Telegram alerts.",
        "image": ""
      },
      {
        "title": "Marketplace mua bán dụng cụ",
        "desc": "Hỗ trợ bán, mua, trao đổi cho nhiều loại sản phẩm cầu lông: vợt, giày, cầu, quần áo, phụ kiện.",
        "image": ""
      },
      {
        "title": "Hệ thống Quota & Subscription",
        "desc": "Nhiều tầng plan với daily limit cho AI search, đăng bài, reminders, saved posts. Enforcement tại API layer, response trả usage info.",
        "image": "/images/projects/smashmate/giaoluucaulong-xyz-pricing.jpg"
      },
      {
        "title": "Admin Dashboard",
        "desc": "Quản lý sân, vùng, users, feedback. Upload UI cho manual data entry. Execution log, usage analytics. Role-based access control."
      },
      {
        "title": "Multi-region & Geolocation",
        "desc": "Hỗ trợ nhiều vùng (Hà Nội, HCM, ...). Chuyển vùng không reload. Geolocation cho phép lọc sân gần nhất.",
        "image": "/images/projects/smashmate/giaoluucaulong-xyz-region.jpg"
      },
      {
        "title": "Authentication & User Profile",
        "desc": "Đăng nhập qua Google/Facebook OAuth. Profile với thống kê sử dụng, tùy chỉnh hiển thị contact."
      }
    ],
    "architecture_images": [
      "/images/projects/smashmate/giaoluucaulong-xyz-hero.jpg"
    ],
    "architecture": "SmashMate được thiết kế theo kiến trúc 3 lớp zero-trust, monorepo với nhiều apps độc lập:\n\n**Monorepo Structure**\n- User-facing web app (Next.js + Cloudflare Workers)\n- Admin dashboard (Next.js + Cloudflare Workers)\n- Database schema + migrations + serverless functions\n- Data pipeline orchestration\n- Browser automation workflows\n- 24/7 headless Chrome trên cloud VM\n\n**Layer 1 — Edge/WAF**\nProxy tất cả request qua Cloudflare, rate limiting phân tầng, security headers. App chạy trên serverless edge runtime toàn cầu.\n\n**Layer 2 — API (BFF)**\nAPI routes validate input, enforce usage quota, admin auth guards. Server Components cho SSR + metadata, Client Components cho interactive UI.\n\n**Layer 3 — Database**\nRow-Level Security deny-by-default. Normalized schema cho từng danh mục bài đăng. Stored functions, scheduled jobs cho cleanup, ranking, push notification.\n\n**Data Pipeline:**\nChrome extension scrape Facebook groups → Browser automation workflow → Webhook → Serverless function (AI extract + classify) → Upsert vào database → Auto-match tên sân → Feed ready.\n\n**Quota System:**\nBackend-driven, atomic consumption. Mỗi plan có daily limit cho AI search, premium queries, post creation, reminders, saved posts.\n",
    "related_blogs": [
      "facebook-data-crawl-esuit-automa",
      "smashmate-v2-feature-breakdown",
      "vercel-to-cloudflare-pages-lessons",
      "smashmate-ddos-incident-lessons",
      "smashmate-sql-injection-hardening",
      "facebook-data-crawl-self-host-playbook",
      "external-ingest-api-key-fallback",
      "posts-first-schema-without-raw-posts",
      "selfhost-to-ec2-n8n-migration"
    ],
    "status": "live",
    "published": true,
    "featured": true,
    "order": 2,
    "date": "2026-03-27",
    "seo_title": "SmashMate - Nền tảng tìm trận cầu lông (Case Study)",
    "seo_description": "Portfolio case study: cách xây một sản phẩm dữ liệu thể thao với pipeline chuẩn hóa AI, bộ lọc thực tế, và kiến trúc zero-trust trên Cloudflare + Supabase."
  },
  "content": "# SmashMate\n\n## Bối cảnh\n\nCộng đồng cầu lông Việt Nam hoạt động chủ yếu qua các nhóm Facebook. Mỗi ngày có hàng trăm bài đăng tìm người chơi, sang nhượng sân, mở lớp dạy — nhưng tất cả đều dưới dạng text tự do, không có cấu trúc. Để tìm một trận giao lưu phù hợp, người chơi phải lướt nhiều nhóm, đọc từng bài, tự suy luận thời gian, khu vực, trình độ.\n\nSmashMate giải quyết vấn đề này: biến quá trình tìm trận từ \"đọc và đoán\" thành \"lọc và chọn trong vài giây\".\n\n## Kiến trúc tổng quan\n\n### Pipeline dữ liệu\n\n```\nFacebook Groups (10+ nhóm)\n      │\n      ▼\nChrome Extension ── scrape posts\n      │\n      ▼\nBrowser Automation ── scheduled workflow\n      │\n      ▼\nWebhook → Serverless Function\n  ├── Normalize text\n  ├── AI batch extract + classify\n  ├── Auto-match tên sân\n  └── Upsert → database\n      │\n      ▼\nUser App (Feed + Map + Search)\n```\n\n### Kiến trúc 3 lớp Zero-Trust\n\n| Lớp | Vai trò |\n| --- | --- |\n| **Edge/WAF** | Rate limiting phân tầng, CDN, serverless runtime |\n| **API (BFF)** | Input validation, quota enforcement, SSR |\n| **Database** | Row-Level Security, stored functions, scheduled jobs |\n\nMỗi lớp có trách nhiệm riêng. Khi collector crash, feed vẫn chạy. Khi AI timeout, bài vào queue retry. Không có single point of failure.\n\n### Database Design\n\nSchema theo approach **extracted-first** — mỗi danh mục bài đăng có table riêng với columns đã chuẩn hóa (thay vì lưu raw text rồi query). Điều này giúp:\n- Query nhanh hơn nhiều lần so với full-text search trên raw content\n- Tỷ lệ dữ liệu thiếu (NULL) giảm đáng kể nhờ AI extraction\n- Dễ scale và cleanup theo từng danh mục\n\nNgoài ra có các bảng hỗ trợ cho: quản lý sân, user profiles, reminders, push subscriptions, usage tracking, ranking, execution logs.\n\n## Tính năng chi tiết\n\n### Feed thông minh\n\nMỗi danh mục có bộ lọc riêng theo ngữ cảnh thực tế của người chơi: ngày giờ, trình độ, giới tính, khu vực, giá, khoảng cách. Hỗ trợ nhiều kiểu sắp xếp và phân trang.\n\n### Bản đồ tương tác\n\nInteractive map với marker clustering. Mỗi marker hiển thị số bài đăng tại sân đó. Lọc theo bán kính. Feed và map dùng chung bộ lọc — chuyển qua lại không mất context.\n\n### Reminder & Push Notification\n\nNgười dùng tạo preset lọc (ngày trong tuần, khung giờ, trình độ, thành phố). Hệ thống match bài mới và gửi push notification định kỳ. Số lượng reminders giới hạn theo plan.\n\n### AI Search\n\nNhập tiếng Việt tự nhiên → AI parse thành bộ lọc có cấu trúc → trả kết quả. Hiểu viết tắt trình độ, tên đường, thời gian tương đối (\"tối nay\", \"mai\", \"cuối tuần\").\n\n### Ranking\n\nXếp hạng tác giả và sân theo ngày/tuần. Rebuild tự động qua scheduled jobs.\n\n### Marketplace\n\nHỗ trợ bán, mua, trao đổi nhiều loại sản phẩm cầu lông. Thông tin chi tiết: brand, tình trạng, giá, địa điểm.\n\n### Quota & Subscription\n\nNhiều tầng plan với daily limit cho từng tính năng. Enforcement tại API layer.\n\n## Hạ tầng & Vận hành\n\n### Thu thập dữ liệu\n\nCloud VM chạy Chrome 24/7 với virtual display. Chrome extension scrape Facebook groups, browser automation tự động hóa workflow theo schedule. Watchdog check định kỳ, restart nếu crash. Telegram notify trạng thái real-time.\n\n### Deployment\n\n- **Frontend + API**: Cloudflare Workers (serverless edge, global CDN)\n- **Database**: Supabase managed Postgres\n- **Collector**: Cloud VM (Chrome automation 24/7)\n\n### Security\n\n- Input validation toàn bộ trên mọi API route\n- Row-Level Security deny-by-default\n- Admin role tách riêng khỏi user profiles\n- Error standardization — không leak internal details\n- Rate limiting phân tầng: edge → distributed cache → database\n- API key rotation cho data ingestion\n- Server-only secrets — không expose ra client\n\n## Bài học chính\n\n1. **Sản phẩm dữ liệu thành công nhờ chuẩn hóa, không nhờ khối lượng.** 1,000 bài đã extract đúng fields có giá trị hơn 10,000 bài thô.\n\n2. **Schema extracted-first.** Mỗi danh mục có table riêng, query nhanh, dễ scale, dễ cleanup.\n\n3. **Bảo mật cần tính từ MVP.** SmashMate đã trải qua DDoS, injection attempts, và abuse — dẫn đến kiến trúc zero-trust hiện tại.\n\n4. **Tách lớp rõ ràng giúp vận hành bền.** Mỗi thành phần có thể fail độc lập mà không kéo theo toàn hệ thống.\n\n5. **Automation pipeline là competitive advantage.** Pipeline end-to-end từ Facebook groups đến structured feed — chạy 24/7, tự heal, tự notify."
} as const;
export default entry;
