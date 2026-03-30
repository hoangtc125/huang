# Planning

## Mục tiêu

Ổn định pipeline content mới:

- Viết nội dung bằng Markdown trong `content/`.
- Compile sang TSX/module trong `apps/lib/content/generated/`.
- Build/deploy không đọc filesystem runtime.

## Trạng thái

- [x] Tách `content/` ra ngoài `apps/`.
- [x] Có script `apps/scripts/compile-content.mjs`.
- [x] Có lệnh `npm run content:compile` và `npm run magic compile`.
- [x] Loader content đọc từ generated modules.
- [ ] Rà soát và chuẩn hóa docs theo kiến trúc mới.
- [ ] Chốt CI pipeline có bước compile trước build.

## Việc cần làm tiếp

1. Kiểm tra toàn bộ slug và cross-links trong `content/collections/*`.
2. Đảm bảo tất cả item publish có route detail tương ứng.
3. Thêm test/check nhỏ cho compile script (ít nhất kiểm tra output index files).
4. Thêm bước validate + compile bắt buộc trong CI.

## Definition of Done

- `npm run magic validate` pass.
- `npm run magic compile` pass.
- `npm run build` pass.
- Deploy Cloudflare không còn lỗi "Missing content directory".
- Các route động (`/blog/[id]`, `/project/[id]`, `/videos/[slug]`, `/topics/[slug]`) render đúng.
