---
title: "Markdown Showcase: Tổng hợp mọi element trong blog"
slug: "markdown-showcase"
description: "Bài viết mẫu tổng hợp tất cả các thể loại markdown element — headings, code blocks, tables, images, blockquotes, lists, inline styles — để kiểm tra UI rendering."
cover: "https://picsum.photos/seed/md-showcase/1200/630"
topic: "web-development"
tags:
  - "Markdown"
  - "UI Testing"
  - "Design System"
related_projects:
  - "huang-workspace"
related_blogs:
  - "tailwind-css-v4-guide"
published: true
featured: false
date: "2026-03-29"
reading_time: 8
seo_title: "Markdown Showcase — Tất cả element types"
seo_description: "Sample blog post hiển thị mọi loại markdown element: code blocks, tables, images, blockquotes, lists, media embeds."
---

# Markdown Showcase

Đây là bài viết mẫu để kiểm tra UI rendering cho tất cả các element trong markdown. Mỗi section dưới đây demo một loại element khác nhau.

## Headings

Các level heading từ H2 đến H3 (H1 dùng cho tiêu đề bài viết):

### Heading cấp 3

Nội dung dưới heading cấp 3. Đây là paragraph bình thường với **bold text**, *italic text*, và ***bold italic***.

## Inline Styles

Đây là paragraph chứa nhiều inline styles:

- **Bold text** cho nhấn mạnh
- *Italic text* cho thuật ngữ
- ~~Strikethrough~~ cho nội dung đã sửa
- `inline code` cho function names hoặc variables
- [Link tới Google](https://google.com) cho external references
- Kết hợp: **`bold code`**, *`italic code`*, [**bold link**](https://example.com)

## Paragraphs và Line Breaks

Đây là paragraph đầu tiên. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

Đây là paragraph thứ hai, cách paragraph trên bằng 1 dòng trống. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

## Code Blocks

### JavaScript

```javascript
// React component với hooks
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// Usage
const searchTerm = useDebounce(input, 300);
console.log("Debounced:", searchTerm);
```

### TypeScript

```typescript
interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  publishedAt: string;
  readingTime: number;
}

type PostFilter = {
  topic?: string;
  featured?: boolean;
  publishedOnly?: boolean;
};

function getBlogPosts(options?: PostFilter): BlogPost[] {
  return posts
    .filter(p => options?.topic ? p.topic === options.topic : true)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
```

### SQL

```sql
-- Tạo bảng với RLS
CREATE TABLE friendly_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id TEXT NOT NULL REFERENCES regions(id),
  court_id UUID REFERENCES courts(id),
  match_date DATE,
  match_time TIME,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  fee INTEGER CHECK (fee >= 0),
  slots_needed INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'active'
);

-- Index cho query phổ biến
CREATE INDEX idx_fm_region_date
  ON friendly_matches(region_id, match_date DESC);

-- RLS policy
ALTER TABLE friendly_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_active" ON friendly_matches
  FOR SELECT USING (status = 'active');
```

### Bash

```bash
#!/bin/bash
# Deploy script

echo "Building..."
npm run build

echo "Running tests..."
npm test -- --coverage

if [ $? -eq 0 ]; then
  echo "Tests passed! Deploying..."
  npx wrangler deploy --env production
  curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
    -d "chat_id=${CHAT_ID}" \
    -d "text=✅ Deploy thành công!"
else
  echo "Tests failed. Aborting deploy."
  exit 1
fi
```

### JSON

```json
{
  "name": "smashmate",
  "version": "2.0.0",
  "dependencies": {
    "next": "^16.1.0",
    "@supabase/supabase-js": "^2.45.0",
    "zod": "^3.23.0",
    "leaflet": "^1.9.4"
  },
  "scripts": {
    "dev": "next dev",
    "build": "opennextjs-cloudflare build",
    "deploy": "opennextjs-cloudflare deploy"
  }
}
```

### CSS

```css
/* Custom scrollbar — rose-brown theme */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: hsl(345 20% 22% / 0.6);
  border-radius: 999px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(345 25% 30% / 0.8);
}
```

### Plain text (no language)

```
Đây là code block không có language specified.
Sẽ không có syntax highlighting.
Dùng cho log output, config files, hoặc text thuần.

ERROR 2026-03-29 14:30:00 [api] Request failed
  method=GET path=/api/posts status=500
  duration=1234ms error="connection timeout"
```

## Blockquotes

> Đây là blockquote đơn giản. Dùng để highlight ý quan trọng hoặc trích dẫn.

> **Lưu ý quan trọng**: Blockquote có thể chứa **bold**, *italic*, `code`, và [links](https://example.com).
>
> Và có thể có nhiều paragraphs bên trong.

> Nested blockquote:
> > Cấp 2 — đây là quote bên trong quote.
> > Thường dùng cho conversation hoặc email thread.

## Lists

### Unordered List

- Item đầu tiên
- Item thứ hai với **bold text**
- Item thứ ba với `inline code`
- Item có sub-items:
  - Sub-item A
  - Sub-item B
  - Sub-item C với [link](https://example.com)
    - Sub-sub-item (3 cấp)

### Ordered List

1. Bước 1: Clone repository
2. Bước 2: Install dependencies
3. Bước 3: Configure environment variables
   - Copy `.env.example` thành `.env`
   - Điền `SUPABASE_URL` và `SUPABASE_ANON_KEY`
4. Bước 4: Run development server
5. Bước 5: Open browser tại `http://localhost:3000`

### Task List (GFM)

- [x] Setup project structure
- [x] Implement content loader
- [x] Add blog page with markdown rendering
- [ ] Add image optimization
- [ ] Add search functionality
- [ ] Deploy to production

## Tables

### Bảng đơn giản

| Feature | Free | Pro | Business |
| --- | --- | --- | --- |
| Feed queries | Unlimited | Unlimited | Unlimited |
| AI Search/ngày | 50 | 100 | 200 |
| Post creation | 1/ngày | 5/ngày | 10/ngày |
| Reminders | 5 | 20 | 50 |
| Saved posts | 10 | 50 | 200 |

### Bảng với alignment

| Metric | V1 | V2 | Improvement |
| :--- | ---: | ---: | :---: |
| Query p95 | 200ms | 5ms | **40x** |
| Cold start | 500ms | 150ms | **3.3x** |
| Indexable cols | 3 | All | **∞** |
| NULL rate | 60% | <10% | **6x** |

## Images

### Ảnh đơn

![Landscape mẫu — dùng để test image rendering](https://picsum.photos/seed/blog-demo-1/1200/600)

### Ảnh nhỏ hơn

![Screenshot UI mẫu](https://picsum.photos/seed/blog-demo-2/800/450)

### Ảnh liên tiếp

![Dashboard analytics](https://picsum.photos/seed/blog-demo-3/1200/500)

![Map visualization](https://picsum.photos/seed/blog-demo-4/1200/500)

## Horizontal Rule

Nội dung trước horizontal rule.

---

Nội dung sau horizontal rule. Thường dùng để phân tách sections lớn.

## Mixed Content

Phần này demo việc kết hợp nhiều element types trong cùng một flow tự nhiên.

Khi thiết kế API, có 3 nguyên tắc quan trọng:

1. **Validate mọi input** — dùng Zod schema:

```typescript
const QuerySchema = z.object({
  category: z.enum(['friendly_matches', 'marketplace']),
  page: z.coerce.number().int().min(1).max(100).default(1),
});
```

2. **Không leak error details** — trả generic message:

> Tip: Log full error server-side, trả `{ error: "Something went wrong" }` cho client.

3. **Rate limiting** — bảng so sánh các approach:

| Approach | Pros | Cons |
| --- | --- | --- |
| Cloudflare WAF | Zero-config, global | Không custom logic |
| In-memory | Đơn giản, nhanh | Không distributed |
| Redis | Distributed, chính xác | Thêm dependency |

Kết quả sau khi áp dụng cả 3:

![Security dashboard mẫu](https://picsum.photos/seed/blog-demo-5/1000/400)

## Footnote-style Links

Đây là cách viết link kiểu reference [như thế này][ref-link] — hữu ích khi có nhiều links dài.

[ref-link]: https://example.com "Example Domain"

## Kết

Bài viết này cover hầu hết các element types trong markdown:

- ✅ Headings (H2, H3)
- ✅ Inline styles (bold, italic, strikethrough, code, links)
- ✅ Code blocks (JS, TS, SQL, Bash, JSON, CSS, plain)
- ✅ Blockquotes (đơn, nested)
- ✅ Lists (unordered, ordered, task list)
- ✅ Tables (đơn giản, aligned)
- ✅ Images (đơn, nhiều ảnh liên tiếp)
- ✅ Horizontal rules
- ✅ Mixed content (kết hợp nhiều element)

Nếu UI render đúng tất cả trên đây thì blog system đã sẵn sàng cho production! 🚀
