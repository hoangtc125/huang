---
slug: "dev-tools-pro"
title: "DevTools Pro"
description: "Browser extension gộp các công cụ thiết yếu cho web developer vào một chỗ — JSON formatter, JWT decoder, Base64 encoder, color picker."
short_desc: "A suite of essential developer tools right in your browser — JSON, JWT, Base64, color picker."
thumbnail: "https://picsum.photos/seed/devtools/800/450"
icon_url: "https://picsum.photos/seed/devtools-icon/128/128"
images:
  - "https://picsum.photos/seed/dt-sc1/800/600"
  - "https://picsum.photos/seed/dt-sc2/800/600"
type: "extension"
tags:
  - "TypeScript"
  - "Preact"
  - "Tailwind CSS"
  - "Manifest V3"
tech_stack:
  - "TypeScript"
  - "Preact"
  - "Tailwind CSS"
  - "Manifest V3"
demo_url: "https://chrome.google.com/webstore/detail/devtools-pro"
source_url: ""
features:
  - title: "Instant JSON Formatting"
    desc: "Paste raw JSON and get it beautifully formatted and syntax-highlighted."
  - title: "JWT Decoder"
    desc: "Quickly inspect the payload of any JWT without sending it to a third-party server."
  - title: "Color Picker"
    desc: "Grab colors from any webpage with a built-in eyedropper tool."
architecture: "Developed using the Manifest V3 API. The UI is built with Preact for a tiny footprint and fast load times. Uses a background service worker to handle state across tabs."
related_blogs:
  - "tailwind-css-v4-guide"
status: "live"
published: true
featured: true
order: 2
date: "2025-11-15"
---

# DevTools Pro

## Tổng quan

DevTools Pro là browser extension bundle các tool phổ biến nhất mà web developer cần hàng ngày. Thay vì mở nhiều website hoặc viết code tạm để decode JWT, format JSON — tất cả có thể làm trong vài giây qua browser popup.

## Vấn đề cần giải quyết

Làm việc với APIs hàng ngày, tôi thường xuyên cần:
- Format JSON để đọc cho dễ
- Decode JWT token để debug auth issues
- Convert Base64 sang text
- Lấy màu từ design screenshot

Mỗi thứ lại vào một website khác nhau — không chỉ mất thời gian mà còn có rủi ro security khi paste JWT token lên third-party site.

## Giải pháp

Extension chạy hoàn toàn local — không có API calls, không có data collection. Tất cả processing xảy ra trong browser.

- **Preact thay vì React**: Bundle size chỉ 3KB gzip, extension load gần như instant
- **Manifest V3**: Sử dụng standard mới nhất của Chrome extension API
- **Service Worker**: State persist khi user đóng/mở popup

## Kết quả

Published trên Chrome Web Store, hiện có 2000+ active users và rating 4.8/5.
