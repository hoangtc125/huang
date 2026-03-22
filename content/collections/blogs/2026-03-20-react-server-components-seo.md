---
title: "React Server Components và SEO: Hết thời client-side rendering"
slug: "react-server-components-seo"
description: "Tại sao RSC là câu trả lời đúng cho SEO, cách chuyển đổi từ 'use client' sang Server Components trong Next.js App Router, và những pattern thực tế để tối ưu Core Web Vitals."
cover: "/images/blog/rsc-seo.jpg"
topic: "web-development"
tags:
  - "React"
  - "Next.js"
  - "SEO"
  - "Server Components"
related_projects:
  - "huang-workspace"
related_blogs:
  - "tailwind-css-v4-guide"
published: true
featured: true
date: "2026-03-20"
reading_time: 8
---

# React Server Components và SEO: Hết thời client-side rendering

Nếu bạn đang xây dựng một portfolio, blog, hay bất kỳ trang web nào cần được Google index tốt — và bạn vẫn đang dùng `"use client"` cho mọi page — thì bài viết này dành cho bạn.

## Vấn đề với Client-Side Rendering và SEO

Trước khi có React Server Components, cách phổ biến nhất để làm React app là Client-Side Rendering (CSR):

```javascript
// Cách cũ — render hoàn toàn ở client
export default function BlogPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts').then(r => r.json()).then(setPosts);
  }, []);

  return <div>{posts.map(p => <PostCard key={p.id} post={p} />)}</div>;
}
```

Khi Googlebot crawl trang này, nó nhận được một HTML rỗng. Bot phải chạy JavaScript, chờ fetch API xong, rồi mới thấy nội dung. Nhiều bots không làm được điều này — và ngay cả Googlebot cũng delay việc index nội dung JavaScript.

**Kết quả**: SEO kém, Core Web Vitals tệ (LCP cao), ranking thấp.

## React Server Components giải quyết vấn đề này như thế nào?

RSC render trên server và gửi HTML đầy đủ về browser. Không cần JavaScript để hiển thị nội dung. Googlebot nhận được HTML hoàn chỉnh ngay lập tức.

```typescript
// Server Component — không cần "use client"
export default async function BlogPage() {
  // Đây chạy trên SERVER, không phải browser
  const posts = await getBlogPosts();

  return (
    <div>
      {posts.map(post => (
        <article key={post.slug}>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
        </article>
      ))}
    </div>
  );
}
```

HTML trả về đã có nội dung đầy đủ. Googlebot happy.

## Static Site Generation với generateStaticParams

Đối với blog posts — nơi nội dung không thay đổi thường xuyên — SSG là lựa chọn tốt nhất:

```typescript
// app/blog/[slug]/page.tsx
import { getBlogPosts, getBlogBySlug } from "@/lib/content/blogs";

// Báo Next.js: pre-render tất cả blog posts lúc build time
export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map(post => ({ slug: post.slug }));
}

// Metadata riêng cho từng bài viết
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogBySlug(params.slug);
  if (!post) notFound();

  return <article>...</article>;
}
```

Với cách này:
- Mỗi blog post được pre-render thành file HTML tĩnh lúc `next build`
- Không cần server để serve — có thể deploy lên CDN
- Response time gần như instant (file tĩnh)
- Googlebot nhận HTML hoàn chỉnh ngay lập tức

## JSON-LD Structured Data

Ngoài HTML, Google còn đọc structured data để hiểu nội dung tốt hơn. Với blog posts, dùng schema `BlogPosting`:

```typescript
export default function BlogPostPage({ post }: { post: BlogPost }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Person",
      name: "Tran Cong Hoang",
      url: "https://huangwork.space",
    },
    publisher: {
      "@type": "Person",
      name: "Tran Cong Hoang",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>{/* content */}</article>
    </>
  );
}
```

## Pattern: RSC + Client Component

Nhiều pages cần cả hai: data fetching (server) và interactivity (client). Pattern chuẩn:

```
app/blog/page.tsx          ← Server Component (data fetching, metadata)
app/blog/BlogList.tsx      ← Client Component (filtering, search UI)
```

```typescript
// page.tsx — Server Component
import BlogList from "./BlogList";

export const metadata = { title: "Blog | Huang Workspace" };

export default function BlogPage() {
  const posts = getBlogPosts();   // FS read, không cần fetch
  const topics = getTopics();

  return <BlogList posts={posts} topics={topics} />;
}
```

```typescript
// BlogList.tsx — Client Component
"use client";

export default function BlogList({ posts, topics }) {
  const [selectedTopic, setSelectedTopic] = useState("all");
  const filtered = posts.filter(p =>
    selectedTopic === "all" || p.topic === selectedTopic
  );

  return (
    <div>
      <TopicFilter topics={topics} onChange={setSelectedTopic} />
      {filtered.map(post => <PostCard key={post.slug} post={post} />)}
    </div>
  );
}
```

Data được load trên server (SEO-friendly), UI interaction được handle ở client.

## Kết quả thực tế

Sau khi migrate portfolio này từ `"use client"` sang RSC pattern:

- **LCP giảm từ ~2.8s xuống ~0.4s** — nội dung render ngay khi HTML đến
- **Không còn content shift** — không có skeleton loading, nội dung có ngay
- **Google index nhanh hơn** — các bài viết được crawl và index trong vài giờ thay vì vài ngày

Nếu bạn đang làm portfolio hay blog với Next.js — chuyển sang RSC là một trong những việc có impact lớn nhất bạn có thể làm.
