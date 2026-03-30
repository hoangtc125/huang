# Deployment Guide

Hướng dẫn deploy portfolio lên Cloudflare Workers + kết nối Supabase.

---

## Prerequisites

- Node.js 18+
- Tài khoản [Cloudflare](https://dash.cloudflare.com/) (free plan OK)
- Tài khoản [Supabase](https://supabase.com/) (free plan OK)
- Wrangler CLI đã login: `npx wrangler login`

---

## 1. Setup Supabase

### 1.1. Tạo project

1. Vào [Supabase Dashboard](https://supabase.com/dashboard) → **New Project**
2. Chọn region gần nhất (ví dụ: Singapore cho Việt Nam)
3. Đặt tên project và database password
4. Đợi project khởi tạo xong

### 1.2. Chạy migration

1. Vào **SQL Editor** trong Supabase Dashboard
2. Copy toàn bộ nội dung file `apps/portfolio/supabase/migration.sql`
3. Paste vào SQL Editor và click **Run**
4. Kiểm tra: vào **Table Editor** sẽ thấy 2 bảng `contacts` và `page_views`

### 1.3. Lấy credentials

1. Vào **Settings > API** trong Dashboard
2. Copy:
   - **Project URL** → `SUPABASE_URL` (dạng `https://xxx.supabase.co`)
   - **anon / public key** → `SUPABASE_ANON_KEY`

### 1.4. Verify RLS

Vào **Authentication > Policies** kiểm tra:
- `contacts`: có policy `anon_insert_contacts` (INSERT only)
- `page_views`: có 3 policies (SELECT, INSERT, UPDATE cho anon)

> RLS đảm bảo client không thể đọc danh sách contacts hay xóa dữ liệu.

---

## 2. Setup Local Development

### 2.1. Tạo file `.env.local`

```bash
cd apps/portfolio
cp .env.example .env.local
```

Sửa `.env.local`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 2.2. Cài dependencies

```bash
cd apps/portfolio
npm install
```

### 2.3. Chạy dev server

```bash
npm run dev
```

Mở `http://localhost:3043` — contact form và view counter sẽ hoạt động với Supabase.

---

## 3. Deploy lên Cloudflare

### 3.1. Login Wrangler

```bash
npx wrangler login
```

Trình duyệt mở ra, authorize Wrangler truy cập Cloudflare account.

### 3.2. Set environment variables

Có 2 cách:

**Cách 1: Qua Cloudflare Dashboard (khuyên dùng)**
1. Vào [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages
2. Tìm worker `huang-portfolio` (sẽ tạo sau lần deploy đầu)
3. Settings → Variables and Secrets
4. Thêm:
   - `SUPABASE_URL` = `https://xxx.supabase.co`
   - `SUPABASE_ANON_KEY` = `your-anon-key` (đánh dấu **Encrypt**)

**Cách 2: Qua Wrangler CLI**
```bash
npx wrangler secret put SUPABASE_URL
# Nhập giá trị khi được hỏi

npx wrangler secret put SUPABASE_ANON_KEY
# Nhập giá trị khi được hỏi
```

### 3.3. Deploy

```bash
npm run deploy
```

Lệnh này sẽ:
1. `next build` → build Next.js app
2. `opennextjs-cloudflare build` → chuyển thành Cloudflare Worker
3. `opennextjs-cloudflare deploy` → upload lên Cloudflare

Output sẽ hiển thị URL, ví dụ: `https://huang-portfolio.your-subdomain.workers.dev`

### 3.4. Custom domain (tùy chọn)

1. Vào Cloudflare Dashboard → worker → Settings → Triggers
2. Thêm **Custom Domain**: `huangwork.space` (hoặc domain của bạn)
3. DNS sẽ tự cấu hình nếu domain đã trên Cloudflare

---

## 4. Preview trước khi deploy

```bash
npm run preview
```

Chạy Cloudflare Worker locally — gần giống production nhất. Dùng để test trước khi deploy thật.

---

## 5. Xem dữ liệu

### Contacts (tin nhắn liên hệ)

Vào Supabase Dashboard → **Table Editor** → `contacts`:
- Xem tất cả tin nhắn nhận được
- Có thể filter theo `created_at`, export CSV

### Page Views (lượt xem)

Vào Supabase Dashboard → **Table Editor** → `page_views`:
- Cột `resource_type`: `blog`, `project`, hoặc `video`
- Cột `slug`: slug của content
- Cột `view_count`: tổng lượt xem

Hoặc query trong SQL Editor:
```sql
-- Top 10 bài viết nhiều view nhất
SELECT slug, view_count
FROM page_views
WHERE resource_type = 'blog'
ORDER BY view_count DESC
LIMIT 10;

-- Tổng views theo loại
SELECT resource_type, SUM(view_count) as total
FROM page_views
GROUP BY resource_type;
```

---

## 6. Troubleshooting

### Build fails

```bash
# Kiểm tra build thông thường trước
npm run build

# Nếu OK, thử preview
npm run preview
```

### API trả về "Missing required server env"

Chưa set env vars. Kiểm tra:
- **Local**: file `.env.local` tồn tại và có đúng values
- **Cloudflare**: env vars đã set qua Dashboard hoặc `wrangler secret`

### Contact form trả "Lỗi hệ thống"

1. Kiểm tra Supabase Dashboard → SQL Editor: bảng `contacts` có tồn tại không?
2. Kiểm tra RLS policy `anon_insert_contacts` có enable không
3. Xem server logs: Cloudflare Dashboard → worker → Logs

### View counter không hiển thị

1. Kiểm tra bảng `page_views` tồn tại
2. Kiểm tra function `increment_page_view` tồn tại (Database → Functions)
3. Kiểm tra RLS policies cho `page_views`

---

## 7. CI/CD (tùy chọn)

Thêm GitHub Action cho auto deploy khi push:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare
on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: cd apps/portfolio && npm ci
      - run: cd apps/portfolio && npm run deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

Cần thêm secrets trong GitHub repo settings:
- `CLOUDFLARE_API_TOKEN` — tạo ở Cloudflare Dashboard → API Tokens
- `CLOUDFLARE_ACCOUNT_ID` — tìm ở Cloudflare Dashboard → Overview (sidebar phải)
