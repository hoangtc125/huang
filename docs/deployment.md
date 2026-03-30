# Deployment

Deploy mục tiêu: Cloudflare Workers (OpenNext) + Supabase.

## 1) Chuẩn bị local

```bash
cd apps
npm install
npm run magic validate
npm run magic compile
npm run build
```

Nếu `build` pass local thì mới deploy.

## 2) Biến môi trường

Cần có:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (dùng cho increment views server-side)

Local dùng `.env.local` trong `apps/`.
Cloudflare set trong Worker Variables/Secrets.

## 3) Build và deploy Cloudflare

```bash
cd apps
pnpm opennextjs-cloudflare build
pnpm opennextjs-cloudflare deploy
```

## 4) Kiểm tra sau deploy

- Trang `/`, `/blog`, `/project/...`, `/videos/...` không lỗi 500.
- API `/api/views` hoạt động.
- API `/api/contact` insert được vào bảng `huang_contacts`.

## 5) Lỗi thường gặp

### Missing content directory

Nguyên nhân: runtime còn đọc `fs` từ Markdown.

Cách đúng hiện tại:

1. Markdown nằm ở `content/` (repo root).
2. Chạy compile sang `apps/lib/content/generated/`.
3. Runtime chỉ dùng generated TSX/modules.

### Service binding WORKER_SELF_REFERENCE not found

Kiểm tra `wrangler.jsonc`:

- `name` phải khớp Worker thực tế trên Cloudflare.
- Service binding tham chiếu đúng tên Worker đang deploy.

### Mismatch config local/remote

Cloudflare có thể cảnh báo khác biệt giữa config local và Dashboard. Nên thống nhất một nguồn cấu hình (ưu tiên `wrangler.jsonc` trong repo).

## 6) CI khuyến nghị

Thứ tự trong pipeline:

```bash
cd apps
npm ci
npm run magic validate
npm run magic compile
pnpm opennextjs-cloudflare build
pnpm opennextjs-cloudflare deploy
```

Bắt buộc có bước compile trước build để tránh lệch nội dung.
