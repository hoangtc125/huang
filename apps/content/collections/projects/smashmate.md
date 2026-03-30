---
slug: "smashmate"
title: "SmashMate"
description: "Nền tảng giúp người chơi cầu lông tìm trận nhanh hơn bằng cách chuẩn hóa dữ liệu cộng đồng và đưa vào trải nghiệm tìm kiếm trực quan."
short_desc: "Từ dữ liệu thô đến trải nghiệm tìm trận trong vài giây (mobile-first)."
thumbnail: "https://picsum.photos/seed/smashmate-cover/1200/675"
icon_url: "https://picsum.photos/seed/smashmate-icon/256/256"
images:
  - "https://picsum.photos/seed/smashmate-feed/1200/800"
  - "https://picsum.photos/seed/smashmate-map/1200/800"
  - "https://picsum.photos/seed/smashmate-admin/1200/800"

type: "web"
tags:
  - "Next.js"
  - "TypeScript"
  - "Supabase"
  - "Cloudflare"
  - "Data Pipeline"
  - "Gemini AI"
  - "Automa"
tech_stack:
  - "Next.js 16 (React 19)"
  - "TypeScript"
  - "Supabase (Postgres + Auth + Edge Functions)"
  - "Cloudflare Workers (opennextjs-cloudflare)"
  - "Google Gemini (AI extraction)"
  - "Leaflet (Map)"
  - "TailwindCSS + Radix UI"

demo_url: ""
source_url: ""

features:
  - title: "Feed 7 danh mục bài đăng"
    desc: "Giao lưu, sang nhượng sân, dạy cầu, tuyển CLB, tìm người chơi, khuyến mãi sân, mua bán — mỗi danh mục có bộ lọc riêng theo ngữ cảnh thực tế."
  - title: "Chuẩn hóa dữ liệu bằng AI"
    desc: "Dùng Gemini API tự động trích xuất giờ, sân, mức độ, phí, số slot từ bài đăng thô — người dùng không cần đọc thủ công."
  - title: "Bản đồ sân cầu lông"
    desc: "Leaflet interactive map với clustering, lọc theo khoảng cách (tối đa 20km), hiển thị số bài đăng tại mỗi sân."
  - title: "Hệ thống Reminder"
    desc: "Lưu bộ lọc yêu thích (ngày, giờ, trình độ, khu vực), tự match với bài mới và gửi push notification mỗi giờ."
  - title: "Xếp hạng tác giả và sân"
    desc: "Ranking theo ngày/tuần cho tác giả hoạt động nhiều nhất và sân được đăng nhiều nhất — rebuild nightly qua cron."
  - title: "AI Search bằng tiếng Việt"
    desc: "Nhập câu hỏi tự nhiên ('sân nào quận 7 tối nay') → Gemini parse thành bộ lọc có cấu trúc → trả kết quả ngay."
  - title: "Pipeline thu thập tự động"
    desc: "eSuit (Chrome extension) scrape Facebook → Automa tự động hóa workflow → Edge Function batch process + upsert → dữ liệu sẵn sàng trong feed."
  - title: "Admin Dashboard đầy đủ"
    desc: "Quản lý sân, vùng, user, feedback, ingest keys. Upload/ingest UI, execution log, usage analytics, court alias matching queue."

architecture: |
  SmashMate được thiết kế theo kiến trúc 3 lớp zero-trust:

  **Layer 1 — Edge/WAF (Cloudflare Workers)**
  Proxy tất cả request qua Cloudflare, rate limiting, security headers. App chạy trên serverless edge runtime qua opennextjs-cloudflare.

  **Layer 2 — API (Next.js BFF)**
  API routes validate input bằng Zod, enforce usage quota, admin auth guards. Không leak internal error ra ngoài.

  **Layer 3 — Database (Supabase Postgres + RLS)**
  Row-Level Security deny-by-default. Stored functions cho extraction, court matching, ranking, dedup, cleanup cron. Edge Functions xử lý batch ingest và push notification.

  **Data Pipeline:**
  eSuit scrape Facebook groups → Automa automation workflow → JSON upload qua Admin → Edge Function gọi Gemini batch 5 bài → upsert vào 7 extracted tables → auto-match court aliases.

  **Quota System:**
  Backend-driven, atomic RPC consumption. Mỗi plan (Free/Pro/Business) có daily limit cho AI search, premium queries, post creation, reminders, saved posts.

related_blogs:
  - "smashmate-v2-feature-breakdown"
  - "vercel-to-cloudflare-pages-lessons"
  - "smashmate-ddos-incident-lessons"
  - "smashmate-sql-injection-hardening"
  - "facebook-data-crawl-self-host-playbook"
  - "external-ingest-api-key-fallback"
  - "posts-first-schema-without-raw-posts"
  - "selfhost-to-ec2-n8n-migration"

status: "live"
published: true
featured: true
order: 2
date: "2026-03-27"

seo_title: "SmashMate - Nền tảng tìm trận cầu lông (Case Study)"
seo_description: "Portfolio case study: cách xây một sản phẩm dữ liệu thể thao với pipeline chuẩn hóa AI, bộ lọc thực tế, và kiến trúc zero-trust trên Cloudflare + Supabase."
---

# SmashMate

## Bối cảnh

Cộng đồng cầu lông Việt Nam hoạt động chủ yếu qua các nhóm Facebook. Mỗi ngày có hàng trăm bài đăng tìm người chơi, sang nhượng sân, mở lớp dạy — nhưng tất cả đều dưới dạng text tự do, không có cấu trúc. Để tìm một trận giao lưu phù hợp, người chơi phải lướt nhiều nhóm, đọc từng bài, tự suy luận thời gian, khu vực, trình độ.

SmashMate giải quyết vấn đề này: biến quá trình tìm trận từ "đọc và đoán" thành "lọc và chọn trong vài giây".

## Kiến trúc tổng quan

### Pipeline dữ liệu

```
Facebook Groups
      │
      ▼
eSuit (Chrome Extension) ── scrape posts → JSON
      │
      ▼
Automa (Browser Automation) ── scheduled workflow
      │
      ▼
Admin Dashboard ── upload JSON / trigger ingest
      │
      ▼
Supabase Edge Function
  ├── Normalize text
  ├── Batch 5 posts → Gemini API
  ├── Classify category (1 trong 7)
  ├── Extract structured fields
  ├── Auto-match court aliases
  └── Upsert → extracted tables
      │
      ▼
User App (Feed + Map + Search)
```

### Hệ thống 3 lớp

| Lớp | Công nghệ | Vai trò |
| --- | --- | --- |
| **Edge** | Cloudflare Workers | WAF, rate limiting, CDN, serverless runtime |
| **App** | Next.js 16 (BFF) | API validation (Zod), quota enforcement, SSR |
| **Data** | Supabase Postgres | RLS, stored functions, edge functions, real-time |

### 7 danh mục nội dung

1. **Giao lưu** (`friendly_matches`) — trận đấu, có trích xuất: sân, giờ, trình độ, phí, slot, loại cầu
2. **Sang nhượng sân** (`court_transfers`) — pass sân, trading
3. **Dạy cầu** (`coaching_classes`) — lớp học, huấn luyện
4. **CLB** (`club_memberships`) — tuyển thành viên
5. **Tìm người chơi** (`player_searches`) — người chơi tìm trận
6. **Khuyến mãi sân** (`court_promotions`) — ưu đãi từ sân
7. **Mua bán** (`marketplace`) — thiết bị cầu lông

## Tính năng chi tiết

### Feed thông minh

Mỗi danh mục có bộ lọc riêng theo ngữ cảnh thực tế của người chơi. Feed hỗ trợ sắp xếp theo: mới nhất, giá, thời gian, khoảng cách. Phân trang tối đa 50 bài/trang, query tối ưu không join raw_posts.

### Bản đồ tương tác

Leaflet map với marker clustering. Mỗi marker hiển thị số bài đăng tại sân đó. Lọc theo bán kính (tối đa 20km). Feed và map dùng chung bộ lọc — chuyển qua lại không mất context.

### Reminder & Push Notification

Người dùng tạo preset lọc (ngày trong tuần, khung giờ, trình độ, thành phố, giới tính, format). Hệ thống match bài mới mỗi ngày và gửi push notification mỗi giờ qua Web Push API. Limit theo plan: Free 5 reminders, Pro 20, Business 50.

### AI Search

Nhập tiếng Việt tự nhiên → Gemini parse thành structured filters → trả kết quả. Timeout 8s, retry 1 lần. Daily limit theo plan.

### Ranking

Xếp hạng tác giả và sân theo ngày/tuần. Retention 7 ngày. Rebuild nightly qua PostgreSQL cron job. Dữ liệu tính từ extracted tables, không phụ thuộc raw_posts.

### Quota & Pricing

4 tầng: Welcome → Free → Pro → Business. Mỗi tầng có daily limit cho AI search, premium query, post creation, reminders, saved posts. Enforcement tại API layer bằng atomic RPC, response trả headers usage info.

## Hạ tầng & Vận hành

### Thu thập dữ liệu

EC2 Ubuntu (`t3.small`, ~$17/tháng) chạy Chrome 24/7 với Xvfb (màn hình ảo). eSuit scrape Facebook groups ra JSON, Automa tự động hóa workflow theo schedule. Watchdog check mỗi 5 phút, Telegram notify khi start/crash.

### Deployment

- **Frontend + API**: Cloudflare Workers (serverless edge, global)
- **Database**: Supabase managed Postgres
- **Edge Functions**: Supabase Deno runtime (ingest + push)
- **Collector**: EC2 VM (Chrome automation)

### Security (V2 Hardening)

- Input validation toàn bộ bằng Zod
- RLS deny-by-default trên mọi table
- Admin role tách riêng (`admin_accounts`), không dùng `profiles`
- Error standardization — không leak internal details
- Rate limiting tại Cloudflare + in-memory fallback
- Ingest API key rotation
- Timing-safe secret comparison cho edge functions

## Bài học chính

1. **Sản phẩm dữ liệu thành công nhờ chuẩn hóa, không nhờ khối lượng.** Crawl 10,000 bài thô ít giá trị bằng 1,000 bài đã extract đúng fields.

2. **Schema extracted-first.** V2 loại bỏ dependency vào `raw_posts` — mỗi danh mục có table riêng, query nhanh, dễ scale, dễ cleanup.

3. **Bảo mật cần tính từ MVP.** SmashMate đã trải qua DDoS, SQL injection attempts, và abuse — những bài học đắt giá dẫn đến kiến trúc zero-trust hiện tại.

4. **Tách lớp rõ ràng giúp vận hành bền.** Khi collector crash, feed vẫn chạy. Khi Gemini timeout, bài vào queue retry. Không có single point of failure.
