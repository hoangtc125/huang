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

Khi xây SmashMate — nền tảng tìm trận cầu lông — mình cần thu thập hàng nghìn bài đăng mỗi ngày từ 10+ nhóm Facebook cầu lông ở Việt Nam. Mỗi bài đăng chứa thông tin: sân, giờ chơi, trình độ, phí, số slot — nhưng tất cả đều dưới dạng text tự do.

Thử qua các approach:

| Approach | Vấn đề |
| --- | --- |
| Facebook Graph API | Không hỗ trợ đọc posts từ groups (deprecated từ lâu) |
| Puppeteer/Playwright | Facebook detect headless browser, block nhanh. Muốn qua được phải xoay proxy, IP rotation, fake fingerprint — phức tạp và vẫn fragile |
| Apify / SaaS scraping tools | Subscription $10–30/tháng + tiền execute từng lần chạy cộng dồn lên $100–300/tháng + tiền proxy riêng. Quá đắt cho nhu cầu crawl liên tục nhưng mỗi lần chỉ cần lấy vài chục bài mới nhất |
| Manual copy-paste | Không scale, không thể cron |
| **eSuit + Automa** | **Chạy trên Chrome thật với account đã login — Facebook không phân biệt được** |

Nhu cầu cụ thể của mình là: **crawl liên tục theo cron, mỗi lần chỉ cần lấy những bài mới nhất** — không cần volume lớn một lúc. Approach SaaS hay tự code với proxy đều overkill và tốn kém không tương xứng.

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

**eSuit** ([Chrome Web Store](https://chromewebstore.google.com/detail/esuit-posts-exporter-for/lefjomichhananfjdmmnghjpcjeggdag) · [Docs](https://esuit.dev/product/export-posts-for-facebook)) là Chrome extension cho phép bulk-export posts từ Facebook Groups, Pages, và profiles — mà không cần API. Chạy trên chính Chrome đã đăng nhập Facebook, nên Facebook coi đó là hoạt động browse bình thường.

Freemium: 50 credits miễn phí, $10/tháng cho unlimited. Các tính năng như lấy comments, attachments, translate đều tốn credit. Với usecase của mình — chỉ cần nội dung text bài đăng — free tier là đủ, hoặc tốn rất ít credit mỗi lần chạy.

### Cách eSuit hoạt động

1. Mở trang Facebook Group
2. Click extension icon để mở eSuit panel

![eSuit panel trên Facebook Group](/images/blogs/facebook-data-crawl-esuit-automa/esuit_start.png)
*eSuit panel sau khi click extension icon — chọn filter, format, rồi bắt đầu*

3. eSuit tự scroll và load thêm posts, parse DOM extract từng bài
4. Chọn format export: JSON, CSV, HTML, hoặc **Clipboard** (paste thẳng vào Google Sheets theo cột)
5. Click export → dữ liệu ready

![eSuit sau khi export xong](/images/blogs/facebook-data-crawl-esuit-automa/esuit_export.png)
*Kết quả sau khi export — số bài đã capture, sẵn sàng copy vào clipboard*

Với Clipboard format, mỗi bài được export dưới dạng bảng có sẵn cột — paste thẳng vào sheet mà không cần parse thêm.

**Các field trong mỗi post (JSON):**

```json
{
  "post_id": "...",
  "creation_time": "...",
  "url": "...",
  "message": "...",
  "post_title": "...",
  "post_type": "...",
  "comment_count": 0,
  "reaction_count": 0,
  "shared_count": 0,
  "author": {
    "id": "...",
    "name": "...",
    "url": "...",
    "avatar": "...",
    "gender": "..."
  }
}
```

Vấn đề: eSuit chỉ có UI manual — cần click button để export. Để tự động hóa, cần Automa.

## Automa là gì?

**Automa** ([Chrome Web Store](https://chromewebstore.google.com/detail/automa/infppggnoaenmfagbfknfkancpbljcca) · [Docs](https://automa-docs-old.vercel.app/)) là Chrome extension cho phép tạo browser automation workflows bằng giao diện kéo-thả (no-code RPA). Mỗi workflow gồm các blocks:

- **New Tab** — mở URL
- **Click Element** — click vào element trên trang
- **JavaScript Code** — chạy logic tùy ý
- **Loop** — lặp qua data array
- **Delay** — chờ

![Automa workflow editor](/images/blogs/facebook-data-crawl-esuit-automa/automa.png)
*Giao diện kéo-thả của Automa — mỗi block là một bước trong workflow*

> Automa bản thân có thể dùng để scrape Facebook trực tiếp mà không cần eSuit — dùng block **Get Text** hoặc **JavaScript Code** để extract DOM. Nhưng phải tự setup selector cho từng element, và Facebook thay đổi class name liên tục nên flow dễ break. eSuit lo phần này tốt hơn nhiều vì được maintain riêng cho Facebook.

Automa có một số API quan trọng cho JavaScript blocks:
- **automaRefData** — đọc dữ liệu từ workflow context (biến, loop data, global config)
- **automaFetch** — gọi HTTP request bypass CORS (chạy từ extension background, không bị giới hạn bởi trang web hiện tại)

Ngoài ra Automa có **Global Config** — một key-value store dùng chung cho tất cả workflows. Đây là nơi lưu các giá trị env như API key để call về server, base URL, hay bất kỳ config nào không muốn hardcode trong workflow. Đọc trong JavaScript block qua:

```js
const apiKey = automaRefData("global", "API_KEY");
```

Nhờ đó workflow không chứa secret — ai share workflow cũng không lộ key, và muốn đổi key chỉ cần sửa một chỗ trong Global Config.

## Kết hợp eSuit + Automa

### Ý tưởng chính

Automa không thể trực tiếp gọi eSuit. Nhưng eSuit export ra clipboard, và JavaScript có thể **hook clipboard API** để capture dữ liệu. Flow:

1. Automa mở Facebook Group
2. JavaScript block **hook clipboard** — override hàm ghi clipboard để capture data
3. Automa **click eSuit export button**
4. eSuit ghi dữ liệu vào clipboard → JavaScript capture được
5. JavaScript **parse + normalize** dữ liệu
6. JavaScript **gửi về backend** qua automaFetch
7. Automa tắt tab → loop qua group tiếp theo

### Clipboard hooking — kỹ thuật cốt lõi

Ý tưởng đơn giản: override hàm ghi clipboard của browser, lưu data vào một biến global trước khi ghi clipboard thật.

Sau khi hook, workflow polling chờ biến global có data hợp lệ. Khi eSuit click export → data tự động được capture mà không cần user interaction.

### Parse và normalize

Mình dùng Clipboard format thay vì JSON để đơn giản hóa flow (không cần đọc file download). eSuit paste dữ liệu dạng TSV — parser cần xử lý:
- Quoted fields (field `message` có thể chứa tab, newline, dấu nháy)
- Escaped quotes
- Map cột sang fields: `post_id`, `creation_time`, `url`, `message`, `reaction_count`, `comment_count`, `shared_count`, `author.name`, `author.url`

Sau khi parse, mỗi post được normalize: convert `creation_time` sang timestamp chuẩn, đính kèm metadata (region, source group info).

### Loop qua nhiều groups

Automa hỗ trợ **Loop Data** — lặp qua một mảng config. Mình cấu hình danh sách groups với thông tin: tên nhóm, URL, vùng (Hà Nội, HCM...).

Có hai cách quản lý config này:

**Hardcode trong workflow** — đơn giản, nhưng mỗi lần thêm/bớt group phải mở Automa editor để sửa.

**Fetch từ Google Sheets qua node Google Sheets của Automa** — cách mình đang dùng. Automa có node tích hợp sẵn để đọc sheet, nên toàn bộ danh sách groups được quản lý tập trung tại một sheet: thêm group mới, đổi URL, bật/tắt từng group — chỉ cần sửa sheet, không cần đụng vào workflow. Workflow đọc sheet mỗi lần chạy và loop qua danh sách đó.

Automa loop qua từng group: mở tab → chờ eSuit load → click export → capture → parse → gửi. Mỗi iteration khoảng 30-60 giây tùy số posts.

![Automa execution logs](/images/blogs/facebook-data-crawl-esuit-automa/automa_logs.png)
*Log sau mỗi lần chạy — từng block được ghi lại, dễ debug khi có lỗi*

### Trigger theo lịch với Automa Scheduler

Automa có tính năng **Schedule** tích hợp sẵn trong mỗi workflow — cấu hình cron expression để workflow tự chạy theo lịch mà không cần trigger thủ công hay crontab bên ngoài. Mình set mỗi 30 phút crawl một lần, Chrome đang chạy trên VM sẽ tự kick off đúng giờ.

Kết hợp với Loop qua Google Sheets, toàn bộ pipeline hoàn toàn hands-off: thêm group mới vào sheet → tự động được crawl theo lịch từ lần chạy tiếp theo.

### Monitoring qua Telegram

Mỗi workflow run gửi Telegram notify để biết trạng thái: bắt đầu chạy, đang xử lý nhóm nào, gửi thành công bao nhiêu bài, hoặc lỗi gì. Monitor từ điện thoại mà không cần mở server.

![Telegram notifications từ workflow](/images/blogs/facebook-data-crawl-esuit-automa/telegram_monitor.jpg)
*Notify realtime trên Telegram — biết ngay khi có lỗi hay khi Chrome crash*

## Chạy 24/7 trên Cloud VM

### Tại sao cần VM?

Automa + eSuit chạy trên Chrome extension — cần Chrome browser thật đang chạy. Không thể dùng headless Puppeteer vì eSuit cần DOM rendering thật.

Hoàn toàn có thể chạy trên máy cá nhân, chỉ cần treo máy với một tab Chrome mở. Nhưng vấn đề thực tế: vì hai extension giao tiếp qua clipboard, mỗi lần workflow chạy sẽ spam clipboard liên tục — copy-paste bình thường trong lúc làm việc bị mất sạch. Không thể dùng máy bình thường được.

Giải pháp: chạy Chrome trên cloud VM với virtual display — clipboard bị spam cũng không ảnh hưởng ai.

### Setup

Các bước chính:

1. **Tạo swap** — VM nhỏ thường ít RAM, swap giúp tránh OOM kill
2. **Cài Chrome + Xvfb** — Xvfb là virtual display, cho phép Chrome chạy mà không cần màn hình vật lý
3. **Cài window manager nhẹ** — Fluxbox đủ để Chrome render đúng
4. **Chạy Chrome trong screen session** — giữ Chrome chạy sau khi disconnect SSH
5. **Cài extensions qua VNC** — kết nối VNC Viewer một lần để cài eSuit + Automa + import workflow, sau đó đóng VNC

![Kết nối VNC vào cloud VM](/images/blogs/facebook-data-crawl-esuit-automa/vnc_connect.jpg)
*Kết nối VNC lần đầu để setup extensions — sau bước này không cần mở VNC nữa*

![Chrome đang chạy workflow trên VM qua VNC](/images/blogs/facebook-data-crawl-esuit-automa/vnc_view_execution.jpg)
*Chrome chạy ngầm trên VM với Xvfb — nhìn qua VNC để verify mọi thứ hoạt động đúng*

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

Hoàn toàn có thể về $0 nếu tận dụng free tier của cloud providers (AWS free tier, Google Cloud free credits) và tối ưu resource (tắt VM khi không cần thiết).

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

## Kết quả thực tế

Pipeline đã chạy ổn định cho SmashMate, thu thập bài đăng mỗi 30 phút từ 10+ nhóm Facebook cầu lông ở Việt Nam.

![Dashboard dữ liệu thu thập được](/images/blogs/facebook-data-crawl-esuit-automa/dashboard.jpg)
*Dashboard theo dõi dữ liệu sau khi qua pipeline — bài đăng được phân loại, extract fields và lưu vào database*

Chi phí ~$0/tháng nhờ tận dụng free tier. Watchdog restart Chrome trung bình 0 lần/tuần. Toàn bộ hands-off sau khi setup.

## Kết

Điểm mấu chốt: **dùng Chrome thật thay vì headless browser**. eSuit lo scrape DOM, Automa lo automation, clipboard hooking là cầu nối giữa hai extension. Đơn giản, rẻ, và chạy được.

---

> **Lưu ý:** Bài viết này chia sẻ kỹ thuật cho mục đích nghiên cứu và xây dựng sản phẩm cá nhân. Việc thu thập dữ liệu từ Facebook cần tuân thủ [Terms of Service của Facebook](https://www.facebook.com/terms.php) và các quy định pháp luật hiện hành về bảo vệ dữ liệu cá nhân. Tài khoản Facebook có thể bị hạn chế hoặc khóa nếu hoạt động scraping bị phát hiện — rủi ro này thuộc về người dùng. Tác giả không chịu trách nhiệm về bất kỳ hậu quả nào phát sinh từ việc áp dụng các kỹ thuật được mô tả.
