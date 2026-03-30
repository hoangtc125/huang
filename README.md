# Huang Portfolio

Portfolio cÃ¡ nhÃ¢n sá»­ dá»¥ng Markdown lÃ m nguá»“n dá»¯ liá»‡u chÃ­nh â€” khÃ´ng cáº§n backend hay CMS.

## Cáº¥u trÃºc

```
apps/              â†’ á»¨ng dá»¥ng (portfolio web app) + content markdown
  content/
    static/        â†’ ThÃ´ng tin tÄ©nh (profile, skills, experience)
    collections/   â†’ Ná»™i dung Ä‘á»™ng (projects, blogs, qa)
docs/              â†’ TÃ i liá»‡u dá»± Ã¡n
packages/          â†’ Shared utilities
```

## 2 loáº¡i Markdown

| Loáº¡i | Folder | CÃ¡ch dÃ¹ng | VÃ­ dá»¥ |
|------|--------|-----------|-------|
| **Static** | `apps/content/static/` | Sá»­a file â†’ rebuild â†’ cáº­p nháº­t | TÃªn, skills, kinh nghiá»‡m |
| **Collection** | `apps/content/collections/` | ThÃªm file .md = thÃªm record | Dá»± Ã¡n, blog, Q&A |

## Báº¯t Ä‘áº§u nhanh

### ThÃªm dá»± Ã¡n má»›i
```bash
cp apps/content/collections/projects/_template.md apps/content/collections/projects/ten-du-an.md
# Sá»­a frontmatter vÃ  ná»™i dung
```

### Viáº¿t blog má»›i
```bash
cp apps/content/collections/blogs/_template.md apps/content/collections/blogs/2026-03-18-tieu-de.md
# Sá»­a frontmatter vÃ  ná»™i dung
```

### ThÃªm Q&A
```bash
cp apps/content/collections/qa/_template.md apps/content/collections/qa/cau-hoi-moi.md
# Sá»­a frontmatter vÃ  ná»™i dung
```

### Cáº­p nháº­t thÃ´ng tin cÃ¡ nhÃ¢n
Sá»­a trá»±c tiáº¿p cÃ¡c file trong `apps/content/static/`

## TÃ i liá»‡u

- [Content Guide](docs/content-guide.md) â€” HÆ°á»›ng dáº«n quáº£n lÃ½ ná»™i dung
- [Architecture](docs/architecture.md) â€” Kiáº¿n trÃºc dá»± Ã¡n

