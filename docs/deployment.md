# Deployment Guide

HÆ°á»›ng dáº«n deploy portfolio lÃªn Cloudflare Workers + káº¿t ná»‘i Supabase.

---

## Prerequisites

- Node.js 18+
- TÃ i khoáº£n [Cloudflare](https://dash.cloudflare.com/) (free plan OK)
- TÃ i khoáº£n [Supabase](https://supabase.com/) (free plan OK)
- Wrangler CLI Ä‘Ã£ login: `npx wrangler login`

---

## 1. Setup Supabase

### 1.1. Táº¡o project

1. VÃ o [Supabase Dashboard](https://supabase.com/dashboard) â†’ **New Project**
2. Chá»n region gáº§n nháº¥t (vÃ­ dá»¥: Singapore cho Viá»‡t Nam)
3. Äáº·t tÃªn project vÃ  database password
4. Äá»£i project khá»Ÿi táº¡o xong

### 1.2. Cháº¡y migration

1. VÃ o **SQL Editor** trong Supabase Dashboard
2. Copy toÃ n bá»™ ná»™i dung file `apps/supabase/migration.sql`
3. Paste vÃ o SQL Editor vÃ  click **Run**
4. Kiá»ƒm tra: vÃ o **Table Editor** sáº½ tháº¥y 2 báº£ng `contacts` vÃ  `page_views`

### 1.3. Láº¥y credentials

1. VÃ o **Settings > API** trong Dashboard
2. Copy:
   - **Project URL** â†’ `SUPABASE_URL` (dáº¡ng `https://xxx.supabase.co`)
   - **anon / public key** â†’ `SUPABASE_ANON_KEY`

### 1.4. Verify RLS

VÃ o **Authentication > Policies** kiá»ƒm tra:
- `contacts`: cÃ³ policy `anon_insert_contacts` (INSERT only)
- `page_views`: cÃ³ 3 policies (SELECT, INSERT, UPDATE cho anon)

> RLS Ä‘áº£m báº£o client khÃ´ng thá»ƒ Ä‘á»c danh sÃ¡ch contacts hay xÃ³a dá»¯ liá»‡u.

---

## 2. Setup Local Development

### 2.1. Táº¡o file `.env.local`

```bash
cd apps
cp .env.example .env.local
```

Sá»­a `.env.local`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 2.2. CÃ i dependencies

```bash
cd apps
npm install
```

### 2.3. Cháº¡y dev server

```bash
npm run dev
```

Má»Ÿ `http://localhost:3043` â€” contact form vÃ  view counter sáº½ hoáº¡t Ä‘á»™ng vá»›i Supabase.

---

## 3. Deploy lÃªn Cloudflare

### 3.1. Login Wrangler

```bash
npx wrangler login
```

TrÃ¬nh duyá»‡t má»Ÿ ra, authorize Wrangler truy cáº­p Cloudflare account.

### 3.2. Set environment variables

CÃ³ 2 cÃ¡ch:

**CÃ¡ch 1: Qua Cloudflare Dashboard (khuyÃªn dÃ¹ng)**
1. VÃ o [Cloudflare Dashboard](https://dash.cloudflare.com/) â†’ Workers & Pages
2. TÃ¬m worker `huang` (sáº½ táº¡o sau láº§n deploy Ä‘áº§u)
3. Settings â†’ Variables and Secrets
4. ThÃªm:
   - `SUPABASE_URL` = `https://xxx.supabase.co`
   - `SUPABASE_ANON_KEY` = `your-anon-key` (Ä‘Ã¡nh dáº¥u **Encrypt**)

**CÃ¡ch 2: Qua Wrangler CLI**
```bash
npx wrangler secret put SUPABASE_URL
# Nháº­p giÃ¡ trá»‹ khi Ä‘Æ°á»£c há»i

npx wrangler secret put SUPABASE_ANON_KEY
# Nháº­p giÃ¡ trá»‹ khi Ä‘Æ°á»£c há»i
```

### 3.3. Deploy

```bash
npm run deploy
```

Lá»‡nh nÃ y sáº½:
1. `next build` â†’ build Next.js app
2. `opennextjs-cloudflare build` â†’ chuyá»ƒn thÃ nh Cloudflare Worker
3. `opennextjs-cloudflare deploy` â†’ upload lÃªn Cloudflare

Output sáº½ hiá»ƒn thá»‹ URL, vÃ­ dá»¥: `https://huang.your-subdomain.workers.dev`

### 3.4. Custom domain (tÃ¹y chá»n)

1. VÃ o Cloudflare Dashboard â†’ worker â†’ Settings â†’ Triggers
2. ThÃªm **Custom Domain**: `huangwork.space` (hoáº·c domain cá»§a báº¡n)
3. DNS sáº½ tá»± cáº¥u hÃ¬nh náº¿u domain Ä‘Ã£ trÃªn Cloudflare

---

## 4. Preview trÆ°á»›c khi deploy

```bash
npm run preview
```

Cháº¡y Cloudflare Worker locally â€” gáº§n giá»‘ng production nháº¥t. DÃ¹ng Ä‘á»ƒ test trÆ°á»›c khi deploy tháº­t.

---

## 5. Xem dá»¯ liá»‡u

### Contacts (tin nháº¯n liÃªn há»‡)

VÃ o Supabase Dashboard â†’ **Table Editor** â†’ `contacts`:
- Xem táº¥t cáº£ tin nháº¯n nháº­n Ä‘Æ°á»£c
- CÃ³ thá»ƒ filter theo `created_at`, export CSV

### Page Views (lÆ°á»£t xem)

VÃ o Supabase Dashboard â†’ **Table Editor** â†’ `page_views`:
- Cá»™t `resource_type`: `blog`, `project`, hoáº·c `video`
- Cá»™t `slug`: slug cá»§a content
- Cá»™t `view_count`: tá»•ng lÆ°á»£t xem

Hoáº·c query trong SQL Editor:
```sql
-- Top 10 bÃ i viáº¿t nhiá»u view nháº¥t
SELECT slug, view_count
FROM page_views
WHERE resource_type = 'blog'
ORDER BY view_count DESC
LIMIT 10;

-- Tá»•ng views theo loáº¡i
SELECT resource_type, SUM(view_count) as total
FROM page_views
GROUP BY resource_type;
```

---

## 6. Troubleshooting

### Build fails

```bash
# Kiá»ƒm tra build thÃ´ng thÆ°á»ng trÆ°á»›c
npm run build

# Náº¿u OK, thá»­ preview
npm run preview
```

### API tráº£ vá» "Missing required server env"

ChÆ°a set env vars. Kiá»ƒm tra:
- **Local**: file `.env.local` tá»“n táº¡i vÃ  cÃ³ Ä‘Ãºng values
- **Cloudflare**: env vars Ä‘Ã£ set qua Dashboard hoáº·c `wrangler secret`

### Contact form tráº£ "Lá»—i há»‡ thá»‘ng"

1. Kiá»ƒm tra Supabase Dashboard â†’ SQL Editor: báº£ng `contacts` cÃ³ tá»“n táº¡i khÃ´ng?
2. Kiá»ƒm tra RLS policy `anon_insert_contacts` cÃ³ enable khÃ´ng
3. Xem server logs: Cloudflare Dashboard â†’ worker â†’ Logs

### View counter khÃ´ng hiá»ƒn thá»‹

1. Kiá»ƒm tra báº£ng `page_views` tá»“n táº¡i
2. Kiá»ƒm tra function `increment_page_view` tá»“n táº¡i (Database â†’ Functions)
3. Kiá»ƒm tra RLS policies cho `page_views`

---

## 7. CI/CD (tÃ¹y chá»n)

ThÃªm GitHub Action cho auto deploy khi push:

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
      - run: cd apps && npm ci
      - run: cd apps && npm run deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

Cáº§n thÃªm secrets trong GitHub repo settings:
- `CLOUDFLARE_API_TOKEN` â€” táº¡o á»Ÿ Cloudflare Dashboard â†’ API Tokens
- `CLOUDFLARE_ACCOUNT_ID` â€” tÃ¬m á»Ÿ Cloudflare Dashboard â†’ Overview (sidebar pháº£i)

