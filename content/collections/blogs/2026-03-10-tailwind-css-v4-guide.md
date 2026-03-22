---
title: "Tailwind CSS v4: Những thay đổi quan trọng bạn cần biết"
slug: "tailwind-css-v4-guide"
description: "Tailwind CSS v4 đã thay đổi rất nhiều thứ — từ cú pháp config, cách import, đến performance. Đây là những gì thực sự quan trọng và cách migrate project từ v3."
cover: "/images/blog/tailwind-v4.jpg"
topic: "web-development"
tags:
  - "CSS"
  - "Tailwind"
  - "Frontend"
related_projects:
  - "huang-workspace"
  - "dev-tools-pro"
related_blogs:
  - "react-server-components-seo"
published: true
featured: false
date: "2026-03-10"
reading_time: 6
---

# Tailwind CSS v4: Những thay đổi quan trọng bạn cần biết

Tailwind CSS v4 là một rewrite khá triệt để — không chỉ là thêm features, mà là thay đổi cơ bản cách Tailwind hoạt động. Nếu bạn đang dùng v3 và muốn upgrade, hoặc bắt đầu project mới với v4, đây là những điểm quan trọng nhất.

## Thay đổi lớn nhất: Không còn `tailwind.config.js`

Đây là thay đổi gây ngạc nhiên nhất. Trong v4, config được viết trực tiếp trong CSS file bằng `@theme` directive:

**Cách cũ (v3):**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#6366f1',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
};
```

**Cách mới (v4):**
```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-brand: #6366f1;
  --font-family-sans: 'Inter', sans-serif;
}
```

Custom values trở thành CSS custom properties — và bạn có thể dùng chúng trực tiếp trong CSS hoặc qua Tailwind utilities.

## Import thay đổi hoàn toàn

**v3:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**v4:**
```css
@import "tailwindcss";
```

Đơn giản hơn nhiều. v4 cũng tự động detect và include các utilities cần thiết — không còn purge configuration.

## PostCSS Plugin mới

v4 dùng `@tailwindcss/postcss` thay vì `tailwindcss` trực tiếp:

```javascript
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

**Lưu ý**: Nếu bạn dùng Vite, có `@tailwindcss/vite` riêng. Với Next.js, dùng `@tailwindcss/postcss`.

## Performance: Nhanh hơn đáng kể

v4 được viết lại bằng Rust (thông qua Lightning CSS). Kết quả:

| Operation | v3 | v4 |
|-----------|----|----|
| Full build | ~500ms | ~80ms |
| Incremental | ~100ms | ~5ms |

Đây là lý do chính đáng để upgrade nếu project của bạn lớn và build time đang là vấn đề.

## Arbitrary Values vẫn hoạt động tốt

Một lo ngại khi upgrade là các arbitrary values có hoạt động không. Câu trả lời: có, và còn mạnh hơn:

```html
<!-- Vẫn hoạt động như cũ -->
<div class="w-[327px] bg-[#1a1a2e] text-[clamp(1rem,2vw,1.5rem)]">

<!-- Mới trong v4: CSS variables làm arbitrary value -->
<div class="bg-[var(--color-brand)] p-[var(--spacing-section)]">
```

## Dark mode thay đổi

v3 dùng `darkMode: 'class'` trong config. v4 dùng `@variant`:

```css
@import "tailwindcss";

/* Nếu muốn dark mode dựa trên class .dark */
@custom-variant dark (&:is(.dark *));
```

Hoặc đơn giản hơn, dark mode based on media query hoạt động mặc định không cần config.

## Migration từ v3

Có official upgrade tool:

```bash
npx @tailwindcss/upgrade@next
```

Tool này sẽ:
1. Update `postcss.config.js`
2. Convert `tailwind.config.js` → `@theme` trong CSS
3. Update `@tailwind` directives → `@import "tailwindcss"`

Không phải lúc nào cũng perfect, nhưng xử lý được 90% cases. Phần còn lại cần kiểm tra thủ công.

## Những thứ tôi thích ở v4

1. **Đơn giản hơn**: Ít files config hơn, một nơi để configure (CSS file)
2. **Performance**: Build nhanh hơn rõ rệt trong dev mode
3. **Native CSS variables**: Custom values là CSS variables thật — có thể dùng ở bất cứ đâu

## Những thứ tôi không thích

1. **Breaking changes nhiều**: Nếu project dùng nhiều custom config, migrate khá tốn thời gian
2. **Ecosystem lag**: Một số packages (shadcn/ui, v.v.) chưa fully support v4 ngay
3. **Docs chưa đầy đủ**: Một số edge cases chưa được document rõ

## Có nên upgrade ngay không?

- **Project mới**: Dùng v4 ngay — không có lý do gì để bắt đầu với v3
- **Project cũ nhỏ**: Upgrade — migration tool xử lý được hầu hết
- **Project lớn, production**: Chờ thêm vài tháng cho ecosystem ổn định hơn

Portfolio này đang dùng Tailwind v4 và tôi khá hài lòng với trải nghiệm. Build time nhanh hơn, config đơn giản hơn — worth it.
