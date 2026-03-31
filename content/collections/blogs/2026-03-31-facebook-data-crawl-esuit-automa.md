---
title: "Crawl dữ liệu Facebook Groups bằng eSuit + Automa: Pipeline tự động từ A-Z"
slug: "facebook-data-crawl-esuit-automa"
description: "Hướng dẫn xây pipeline crawl dữ liệu từ Facebook Groups bằng eSuit (Chrome extension) và Automa (browser automation), chạy 24/7 trên cloud VM."
cover: "https://picsum.photos/seed/crawl-esuit-automa/1200/630"
topic: "system-design"
tags:
  - "Data Pipeline"
  - "Web Scraping"
  - "Browser Automation"
  - "RPA"
related_projects:
  - "smashmate"
related_blogs: []
published: true
featured: true
date: "2026-03-31"
reading_time: 10
seo_title: "Crawl dữ liệu Facebook Groups bằng eSuit + Automa — Pipeline tự động 24/7"
seo_description: "Cách xây pipeline crawl dữ liệu từ Facebook Groups bằng Chrome extensions, chạy 24/7 trên cloud VM, tự động gửi về backend xử lý bằng AI."
---

# Crawl dữ liệu Facebook Groups bằng eSuit + Automa

## Vấn đề

Khi xây SmashMate — nền tảng tìm trận cầu lông — mình cần thu thập hàng trăm bài đăng mỗi ngày từ 10+ nhóm Facebook cầu lông ở Việt Nam. Mỗi bài đăng chứa thông tin: sân, giờ chơi, trình độ, phí, số slot — nhưng tất cả đều dưới dạng text tự do.

Thử qua các approach:

| Approach | Kết quả |
| --- | --- |
| Facebook Graph API | Không hỗ trợ đọc posts từ groups (deprecated) |
| Puppeteer/Playwright | Facebook detect headless browser, block nhanh |
| Manual copy-paste | Không scale, tốn thời gian |
| **eSuit + Automa** | **Chạy trên Chrome thật, Facebook không phân biệt được** |

Cuối cùng mình chọn combo **eSuit** (Chrome extension chuyên scrape Facebook) + **Automa** (browser automation) — chạy trên Chrome thật nên Facebook không detect.

## Tổng quan Pipeline

```
Facebook Groups (10+ nhóm)
       │
       ▼
  eSuit (Chrome Extension)
  ├── Scroll + load posts
  └── Export dữ liệu ra clipboard
       │
       ▼
  Automa (Browser Automation)
  ├── Loop qua danh sách groups
  ├── Trigger eSuit export
  ├── Capture dữ liệu từ clipboard
  ├── Parse + normalize
  ├── Gắn metadata (region, source)
  └── POST → Backend API
       │
       ▼
  Backend
  ├── Validate request
  ├── AI extract structured fields
  ├── Phân loại danh mục
  └── Lưu vào database
       │
       ▼
  User App (Feed + Map + Search)
```

## eSuit là gì?

**eSuit** là Chrome extension cho phép scrape dữ liệu từ Facebook mà không cần dùng API. Nó chạy trên chính trình duyệt Chrome đã đăng nhập Facebook, nên Facebook coi đó là hoạt động browse bình thường.

### Cách eSuit hoạt động

1. Mở trang Facebook Group
2. eSuit tự scroll và load thêm posts
3. Parse DOM để extract thông tin mỗi bài (ID, tác giả, nội dung, thời gian, reactions...)
4. Click export → copy dữ liệu dạng bảng vào clipboard

Vấn đề: eSuit chỉ có UI manual — cần click button để export. Để tự động hóa, cần Automa.

## Automa là gì?

**Automa** là Chrome extension cho phép tạo browser automation workflows bằng giao diện kéo-thả (no-code RPA). Mỗi workflow gồm các blocks:

- **New Tab** — mở URL
- **Click Element** — click vào element trên trang
- **JavaScript Code** — chạy logic tùy ý
- **Loop** — lặp qua data array
- **Delay** — chờ

Automa có hai API quan trọng cho JavaScript blocks:
- **automaRefData** — đọc dữ liệu từ workflow context (biến, loop data, global config)
- **automaFetch** — gọi HTTP request bypass CORS (chạy từ extension background, không bị giới hạn bởi trang web hiện tại)

## Kết hợp eSuit + Automa

### Ý tưởng chính

Automa không thể trực tiếp gọi eSuit. Nhưng eSuit export ra clipboard, và JavaScript có thể **hook clipboard API** để capture dữ liệu. Flow:

1. Automa mở Facebook Group
2. JavaScript block **hook clipboard** — override hàm ghi clipboard để capture data
3. Automa **click eSuit export button**
4. eSuit ghi dữ liệu vào clipboard → JavaScript capture được
5. JavaScript **parse + normalize** dữ liệu
6. JavaScript **gửi về backend** qua automaFetch

### Clipboard hooking — kỹ thuật cốt lõi

Ý tưởng đơn giản: override hàm ghi clipboard của browser, lưu data vào một biến global trước khi ghi clipboard thật.

Sau khi hook, workflow polling chờ biến global có data hợp lệ. Khi eSuit click export → data tự động được capture mà không cần user interaction.

### Parse và normalize

eSuit export dữ liệu dạng bảng (TSV). Parser cần xử lý:
- Quoted fields (nội dung bài đăng có thể chứa tab, newline)
- Escaped quotes
- Các cột: ID bài, tác giả, nội dung, URL, thời gian đăng, reactions, comments, shares

Sau khi parse, mỗi post được normalize: extract avatar URL, convert timestamp, đính kèm metadata (region, source, group info).

### Loop qua nhiều groups

Automa hỗ trợ **Loop Data** — lặp qua một mảng config. Mình cấu hình danh sách groups với thông tin: tên nhóm, URL, vùng (Hà Nội, HCM...).

Automa loop qua từng group: mở tab → chờ eSuit load → click export → capture → parse → gửi. Mỗi iteration khoảng 30-60 giây tùy số posts.

### Monitoring qua Telegram

Mỗi workflow run gửi Telegram notify để biết trạng thái: bắt đầu chạy, đang xử lý nhóm nào, gửi thành công bao nhiêu bài, hoặc lỗi gì. Monitor từ điện thoại mà không cần mở server.

## Chạy 24/7 trên Cloud VM

### Tại sao cần VM?

Automa + eSuit chạy trên Chrome extension — cần Chrome browser thật đang chạy. Không thể dùng headless Puppeteer vì eSuit cần DOM rendering thật. Giải pháp: chạy Chrome trên cloud VM với virtual display.

### Setup

Các bước chính:

1. **Tạo swap** — VM nhỏ thường ít RAM, swap giúp tránh OOM kill
2. **Cài Chrome + Xvfb** — Xvfb là virtual display, cho phép Chrome chạy mà không cần màn hình vật lý
3. **Cài window manager nhẹ** — Fluxbox đủ để Chrome render đúng
4. **Chạy Chrome trong screen session** — giữ Chrome chạy sau khi disconnect SSH
5. **Cài extensions qua VNC** — kết nối VNC Viewer một lần để cài eSuit + Automa + import workflow, sau đó đóng VNC

### Watchdog — tự restart khi crash

Chrome trên VM đôi khi crash (memory, extension conflict). Watchdog là script chạy qua crontab mỗi 5 phút:
- Check process Chrome còn sống không
- Nếu chết → gửi Telegram alert → restart Chrome trong screen session

Crontab cũng có rule auto-start Chrome khi VM reboot.

### Chi phí

| Resource | Chi phí |
| --- | --- |
| VM nhỏ (2 vCPU, 2GB RAM) | ~$17/tháng |
| Storage 20GB | ~$2/tháng |
| **Tổng** | **~$19/tháng** |

So với SaaS scraping tools ($50-200/tháng), self-host rẻ hơn nhiều và kiểm soát được hoàn toàn.

## Xử lý phía Backend

Sau khi Automa gửi dữ liệu về backend:

1. **Validate request** — kiểm tra API key, region
2. **Deduplicate** — loại bài đã có trong database
3. **AI extraction** — gửi batch bài tới AI model, trích xuất các trường có cấu trúc: sân, giờ, trình độ, phí, slot, liên hệ...
4. **Phân loại** — AI classify bài vào đúng danh mục (giao lưu, sang sân, dạy cầu, CLB, mua bán...)
5. **Match tên sân** — fuzzy matching tên sân trong bài với danh sách sân đã biết
6. **Lưu trữ** — upsert vào database, mỗi danh mục có bảng riêng

Nhờ AI extraction, tỷ lệ dữ liệu thiếu giảm đáng kể so với raw text, và query performance cải thiện nhiều lần nhờ filter trên columns đã chuẩn hóa.

## Bài học rút ra

### 1. Chrome extension scraping là viable

Facebook block headless browsers nhưng không block Chrome extensions chạy trên browser thật. Đây là lỗ hổng logic: extension scrape qua DOM thực, Facebook coi đó là user browsing bình thường.

### 2. Clipboard là bridge giữa extensions

Khi hai Chrome extensions không có API chung, clipboard là kênh giao tiếp đơn giản nhất. Hook hàm ghi clipboard cho phép extension A capture output của extension B mà không cần modify B.

### 3. automaFetch bypass CORS

JavaScript trong Automa blocks chạy trong context trang web. Gọi fetch trực tiếp tới backend sẽ bị CORS block. automaFetch giải quyết bằng cách gọi HTTP từ extension background script — không bị ràng buộc bởi same-origin policy.

### 4. Virtual display trên Linux là đủ

Không cần GPU, không cần desktop environment nặng. Xvfb + window manager nhẹ là đủ để chạy Chrome ổn định. VNC chỉ cần khi cài extension ban đầu.

### 5. Watchdog + Telegram = low-cost monitoring

Không cần monitoring tools đắt tiền cho side project. Một bash script check process + Telegram bot là đủ để biết khi nào Chrome crash và tự restart.

### 6. Tách scraping và processing

Browser automation chỉ lo scrape + gửi raw data. Backend lo validate, deduplicate, AI extract, lưu trữ. Mỗi phần có thể fail độc lập: khi automation crash, data đã gửi vẫn an toàn; khi AI timeout, bài vào queue retry.

## Khi nào nên dùng approach này?

**Phù hợp khi:**
- Cần scrape Facebook Groups (Graph API không hỗ trợ)
- Volume vừa phải (vài trăm đến vài nghìn bài/ngày)
- Cần chạy tự động 24/7
- Budget thấp (~$20/tháng)

**Không phù hợp khi:**
- Volume cực lớn (10K+ bài/ngày) — cần distributed crawlers
- Cần scrape nhiều loại trang khác nhau — Playwright flexible hơn
- Không muốn maintain VM — dùng SaaS tools

## Kết

Pipeline này đã chạy ổn định cho SmashMate, thu thập hàng trăm bài/ngày từ 10+ nhóm Facebook. Chi phí ~$19/tháng. Watchdog restart Chrome trung bình 1-2 lần/tuần. Telegram notify trạng thái real-time.

Điểm mấu chốt: **dùng Chrome thật thay vì headless browser**. eSuit lo scrape DOM, Automa lo automation, clipboard hooking là cầu nối giữa hai extension. Đơn giản, rẻ, và chạy được.
