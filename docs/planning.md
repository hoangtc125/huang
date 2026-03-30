# Planning - HoÃ n thiá»‡n ná»™i dung Portfolio

## Tráº¡ng thÃ¡i hiá»‡n táº¡i

- [x] Chuyá»ƒn Ä‘á»•i tá»« Vite + React Router â†’ Next.js App Router
- [x] Build thÃ nh cÃ´ng, UI giá»¯ nguyÃªn
- [ ] **Káº¿t ná»‘i app vá»›i content markdown files** (hiá»‡n app Ä‘ang dÃ¹ng `data.ts` hardcoded)
- [ ] Äiá»n thÃ´ng tin tháº­t vÃ o content files
- [ ] Build content-loader Ä‘á»ƒ parse markdown â†’ inject vÃ o components

---

## Váº¥n Ä‘á» cáº§n giáº£i quyáº¿t

> App hiá»‡n Ä‘ang Ä‘á»c data tá»« `apps/data.ts` (hardcoded).
> Theo kiáº¿n trÃºc, data pháº£i Ä‘Æ°á»£c Ä‘á»c tá»« `content/` markdown files.
> Cáº§n build content-loader (`packages/content-loader/`) Ä‘á»ƒ parse MD â†’ data cho app.

---

## Danh sÃ¡ch file content cáº§n Ä‘iá»n

### 1. Static Content â€” `apps/content/static/`

ThÃ´ng tin cá»‘ Ä‘á»‹nh, compile lÃºc build. **Sá»­a file â†’ rebuild â†’ cáº­p nháº­t.**

#### `content/static/profile.md`
- [ ] `name` â€” Há» tÃªn Ä‘áº§y Ä‘á»§ (hiá»‡n: "Nguyen Van A")
- [ ] `nickname` â€” Nickname (hiá»‡n: "Huang")
- [ ] `title` â€” Chá»©c danh (hiá»‡n: "Full-stack Developer")
- [ ] `email` â€” Email liÃªn há»‡ (hiá»‡n: "your@email.com")
- [ ] `phone` â€” Sá»‘ Ä‘iá»‡n thoáº¡i
- [ ] `location` â€” Äá»‹a Ä‘iá»ƒm
- [ ] `website` â€” URL website
- [ ] `socials.github` â€” GitHub URL
- [ ] `socials.linkedin` â€” LinkedIn URL
- [ ] `socials.twitter` â€” Twitter URL (hoáº·c bá» náº¿u khÃ´ng dÃ¹ng)
- [ ] `avatar` â€” áº¢nh Ä‘áº¡i diá»‡n (Ä‘áº·t vÃ o `apps/public/images/`)
- [ ] `og_image` â€” áº¢nh Open Graph cho SEO

#### `content/static/about.md`
- [ ] `headline` â€” Tagline ngáº¯n (hiá»‡n: "Crafting digital experiences with passion")
- [ ] `years_of_experience` â€” Sá»‘ nÄƒm kinh nghiá»‡m (hiá»‡n: 3)
- [ ] `available_for_hire` â€” CÃ³ nháº­n viá»‡c khÃ´ng (true/false)
- [ ] `resume_url` â€” Link CV/Resume PDF
- [ ] **Body content** â€” Viáº¿t giá»›i thiá»‡u báº£n thÃ¢n báº±ng Markdown (pháº§n sau `---`)

#### `content/static/skills.md`
- [ ] Cáº­p nháº­t danh sÃ¡ch skills theo thá»±c táº¿
- [ ] Má»—i skill cÃ³ `name` vÃ  `level` (0-100)
- [ ] ThÃªm/bá»›t categories náº¿u cáº§n (hiá»‡n cÃ³: Frontend, Backend, DevOps & Tools)

#### `content/static/experience.md`
- [ ] `timeline[]` â€” Danh sÃ¡ch kinh nghiá»‡m lÃ m viá»‡c
  - Má»—i má»¥c cáº§n: `company`, `role`, `period`, `description`, `highlights[]`
  - Logo cÃ´ng ty (tÃ¹y chá»n): Ä‘áº·t vÃ o `apps/public/images/companies/`
- [ ] `education[]` â€” Há»c váº¥n
  - Má»—i má»¥c cáº§n: `school`, `degree`, `period`

#### `content/static/site.md`
- [ ] `site_name` â€” TÃªn site
- [ ] `site_url` â€” URL production
- [ ] `seo.default_description` â€” MÃ´ táº£ SEO máº·c Ä‘á»‹nh
- [ ] `nav[]` â€” Menu navigation (thÃªm/bá»›t má»¥c náº¿u cáº§n)
- [ ] `footer.copyright` â€” DÃ²ng copyright

---

### 2. Collection Content â€” `apps/content/collections/`

Ná»™i dung Ä‘á»™ng, má»—i file `.md` = 1 record. **Copy `_template.md` â†’ Ä‘á»•i tÃªn â†’ Ä‘iá»n ná»™i dung.**

#### `apps/content/collections/projects/` â€” Dá»± Ã¡n
- [ ] XÃ³a `sample-portfolio-website.md` (hoáº·c cáº­p nháº­t thÃ nh project tháº­t)
- [ ] Táº¡o 1 file `.md` cho má»—i project tháº­t
  - Filename: `kebab-case.md` (vÃ­ dá»¥: `everminute.md`)
  - Frontmatter: title, slug, description, category, tags, status, featured, order...
  - Body: mÃ´ táº£ chi tiáº¿t project
  - áº¢nh: Ä‘áº·t vÃ o `apps/public/images/projects/`

#### `apps/content/collections/blogs/` â€” Blog posts
- [ ] Cáº­p nháº­t `2026-03-18-xin-chao.md` (hoáº·c xÃ³a náº¿u khÃ´ng cáº§n)
- [ ] Táº¡o thÃªm blog posts náº¿u cÃ³
  - Filename: `yyyy-mm-dd-slug.md`
  - Frontmatter: title, slug, description, category, tags, date, published...
  - Body: ná»™i dung bÃ i viáº¿t Markdown

#### `apps/content/collections/qa/` â€” Q&A
- [ ] Cáº­p nháº­t `why-hire-me.md` vá»›i cÃ¢u tráº£ lá»i tháº­t
- [ ] Táº¡o thÃªm Q&A náº¿u cáº§n
  - Filename: `slug-cau-hoi.md`
  - Frontmatter: question, slug, category, order...
  - Body: cÃ¢u tráº£ lá»i chi tiáº¿t

---

### 3. Assets â€” `apps/public/images/`

- [ ] `avatar.jpg` â€” áº¢nh Ä‘áº¡i diá»‡n
- [ ] `og-default.jpg` â€” áº¢nh SEO (1200x630px recommended)
- [ ] `projects/` â€” áº¢nh thumbnail + screenshots cho má»—i project
- [ ] `blog/` â€” áº¢nh cover cho blog posts
- [ ] `companies/` â€” Logo cÃ´ng ty (náº¿u dÃ¹ng trong experience)

---

## Thá»© tá»± triá»ƒn khai Ä‘á» xuáº¥t

| # | Viá»‡c cáº§n lÃ m | Æ¯u tiÃªn |
|---|---|---|
| 1 | Äiá»n `profile.md` + `about.md` + `site.md` | âš¡ Cao |
| 2 | Äiá»n `experience.md` + `skills.md` | âš¡ Cao |
| 3 | Táº¡o project files trong `collections/projects/` | âš¡ Cao |
| 4 | Build content-loader Ä‘á»ƒ parse MD â†’ app | âš¡ Cao |
| 5 | Táº¡o Q&A files trong `collections/qa/` | ðŸ”¶ Trung bÃ¬nh |
| 6 | Viáº¿t blog posts trong `collections/blogs/` | ðŸ”¶ Trung bÃ¬nh |
| 7 | ThÃªm áº£nh tháº­t (avatar, project screenshots...) | ðŸ”¶ Trung bÃ¬nh |
| 8 | XÃ³a data hardcoded trong `data.ts` | â¬‡ï¸ Sau khi content-loader xong |

---

## Ghi chÃº

- Hiá»‡n táº¡i app **chÆ°a Ä‘á»c** tá»« markdown files, Ä‘ang dÃ¹ng `data.ts`
- Cáº§n build `packages/content-loader/` Ä‘á»ƒ parse frontmatter + body tá»« MD files
- Sau khi cÃ³ content-loader, sáº½ thay `data.ts` báº±ng data load tá»« `content/`
- File `_template.md` trong má»—i collection lÃ  template, **khÃ´ng hiá»ƒn thá»‹** trÃªn site


