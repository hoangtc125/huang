#!/usr/bin/env node
/**
 * magic.mjs — Content management CLI for Huang Workspace
 *
 * Usage:
 *   npm run magic                    → Show help + content stats
 *   npm run magic new blog "Title"   → Create new blog post from template
 *   npm run magic new video "Title"  → Create new video entry from template
 *   npm run magic validate           → Validate all content files
 *   npm run magic list               → List all content
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_ROOT = path.join(__dirname, "..", "..", "..", "content");

// ─── Colors ─────────────────────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

const bold = (s) => `${c.bold}${s}${c.reset}`;
const dim = (s) => `${c.dim}${s}${c.reset}`;
const green = (s) => `${c.green}${s}${c.reset}`;
const red = (s) => `${c.red}${s}${c.reset}`;
const yellow = (s) => `${c.yellow}${s}${c.reset}`;
const cyan = (s) => `${c.cyan}${s}${c.reset}`;
const magenta = (s) => `${c.magenta}${s}${c.reset}`;

// ─── Frontmatter parser (no deps) ────────────────────────────────────────────
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { data: {}, body: content };

  const yamlStr = match[1];
  const data = {};

  for (const rawLine of yamlStr.split("\n")) {
    const line = rawLine.replace(/\r$/, ""); // strip CRLF
    const kv = line.match(/^(\w[\w_]*)\s*:\s*(.*)/);
    if (kv) {
      let val = kv[2].trim();
      // Handle quoted strings
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      data[kv[1]] = val;
    }
  }

  return { data, body: content.slice(match[0].length).trim() };
}

function getCollectionFiles(collection) {
  const dir = path.join(CONTENT_ROOT, "collections", collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => ({ file: f, full: path.join(dir, f) }));
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
    .replace(/[èéẹẻẽêềếệểễ]/g, "e")
    .replace(/[ìíịỉĩ]/g, "i")
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
    .replace(/[ùúụủũưừứựửữ]/g, "u")
    .replace(/[ỳýỵỷỹ]/g, "y")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function today() {
  return new Date().toISOString().split("T")[0];
}

// ─── Commands ─────────────────────────────────────────────────────────────────

function showHelp() {
  console.log(`
${bold("✨ magic")} — Content management CLI for Huang Workspace
${dim("─────────────────────────────────────────────────")}

${bold("Commands:")}
  ${cyan("npm run magic")}                      Show this help + content stats
  ${cyan("npm run magic list")}                 List all content files
  ${cyan("npm run magic validate")}             Validate all content files
  ${cyan('npm run magic new blog "Title"')}     Create new blog post
  ${cyan('npm run magic new video "Title"')}    Create new video entry

${bold("Content structure:")}
  content/
  ├── collections/
  │   ├── blogs/        ${dim("← MD files → /blog/[slug]")}
  │   ├── projects/     ${dim("← MD files → /project/[slug]")}
  │   ├── videos/       ${dim("← MD files → /videos/[slug]")}
  │   ├── topics/       ${dim("← Topics with descriptions")}
  │   └── qa/           ${dim("← Q&A for About page")}
  └── static/           ${dim("← Profile, skills, experience")}

${bold("Workflow for new blog post:")}
  1. ${cyan('npm run magic new blog "My Great Post"')}
  2. Edit the generated MD file in content/collections/blogs/
  3. ${cyan("npm run build")} — Next.js pre-renders all pages
`);

  showStats();
}

function showStats() {
  const collections = ["blogs", "projects", "videos", "topics", "qa"];
  console.log(`${bold("Content stats:")}
${dim("─────────────────────────")}`);

  for (const col of collections) {
    const files = getCollectionFiles(col);
    const published = files.filter((f) => {
      const content = fs.readFileSync(f.full, "utf-8");
      const { data } = parseFrontmatter(content);
      return data.published !== "false";
    });

    console.log(
      `  ${magenta(col.padEnd(12))} ${green(String(published.length).padStart(2))} published / ${dim(String(files.length))} total`
    );
  }
  console.log();
}

function listContent() {
  const collections = ["blogs", "projects", "videos", "topics"];
  for (const col of collections) {
    const files = getCollectionFiles(col);
    if (!files.length) continue;

    console.log(`\n${bold(col.toUpperCase())}`);
    console.log(dim("─".repeat(60)));

    for (const { file, full } of files) {
      const content = fs.readFileSync(full, "utf-8");
      const { data } = parseFrontmatter(content);
      const isPublished = data.published !== "false";
      const status = isPublished ? green("●") : yellow("○");
      const date = data.date ? dim(` ${data.date}`) : "";
      const slug = data.slug ? cyan(` [${data.slug}]`) : "";
      console.log(`  ${status} ${data.title ?? file}${slug}${date}`);
    }
  }
  console.log();
}

function validateContent() {
  let errors = 0;
  let warnings = 0;
  let ok = 0;

  const checks = {
    blogs: ["slug", "title", "description", "topic", "date"],
    projects: ["slug", "title", "description", "type"],
    videos: ["slug", "title", "youtube_id", "date"],
    topics: ["slug", "title", "description"],
    qa: ["slug", "question"],
  };

  console.log(`\n${bold("Validating content...")}
${dim("─────────────────────────────────────────")}`);

  for (const [col, required] of Object.entries(checks)) {
    const files = getCollectionFiles(col);
    for (const { file, full } of files) {
      const content = fs.readFileSync(full, "utf-8");
      const { data } = parseFrontmatter(content);

      // Skip drafts (published: false)
      if (data.published === "false" || data.published === false) {
        console.log(`  ${dim("○")} ${col}/${file} ${dim("(draft — skipped)")}`);
        continue;
      }

      const missing = required.filter((f) => !data[f]);

      if (missing.length) {
        console.log(`  ${red("✗")} ${col}/${file}`);
        console.log(`    ${dim("Missing fields:")} ${red(missing.join(", "))}`);
        errors++;
      } else {
        console.log(`  ${green("✓")} ${col}/${file}`);
        ok++;
      }

      // Warning: no body content for blogs
      if (col === "blogs") {
        const body = content.replace(/^---[\s\S]*?---\r?\n/, "").trim();
        if (body.length < 100) {
          console.log(`    ${yellow("⚠")} Short content (${body.length} chars) — may need more writing`);
          warnings++;
        }
      }
    }
  }

  console.log(`
${dim("─────────────────────────────────────────")}
${green(`✓ ${ok} files OK`)}  ${errors ? red(`✗ ${errors} errors`) : ""}  ${warnings ? yellow(`⚠ ${warnings} warnings`) : ""}
`);

  if (errors > 0) process.exit(1);
}

function newBlog(title) {
  if (!title) {
    console.error(red("Error: title is required\n") + dim('  Usage: npm run magic new blog "My Blog Title"'));
    process.exit(1);
  }

  const slug = slugify(title);
  const date = today();
  const filename = `${date}-${slug}.md`;
  const filepath = path.join(CONTENT_ROOT, "collections", "blogs", filename);

  if (fs.existsSync(filepath)) {
    console.error(red(`Error: file already exists: ${filename}`));
    process.exit(1);
  }

  const content = `---
title: "${title}"
slug: "${slug}"
description: "Mô tả ngắn gọn bài viết (dùng cho SEO và listing, ~150 ký tự)"
cover: ""

# Topic: web-development | system-design | career
topic: "web-development"

tags:
  - ""

related_projects: []
related_blogs: []

published: false
featured: false
date: "${date}"
reading_time: 5
seo_title: ""
seo_description: ""
---

# ${title}

Nội dung bài viết bắt đầu từ đây...

## Phần 1

...

## Phần 2

...

\`\`\`javascript
// Code example
console.log("Hello!");
\`\`\`

> Blockquote highlight ý quan trọng

## Kết luận

...
`;

  fs.writeFileSync(filepath, content, "utf-8");

  console.log(`
${green("✓")} Created: ${bold(filename)}
${dim("  Path:")} content/collections/blogs/${filename}
${dim("  Slug:")} ${cyan(slug)}
${dim("  URL:")}  /blog/${slug}

${bold("Next steps:")}
  1. Edit the file and write your content
  2. Set ${cyan("published: true")} when ready
  3. Run ${cyan("npm run build")} to pre-render
`);
}

function newVideo(title) {
  if (!title) {
    console.error(red("Error: title is required\n") + dim('  Usage: npm run magic new video "My Video Title"'));
    process.exit(1);
  }

  const slug = slugify(title);
  const date = today();
  const filename = `${slug}.md`;
  const filepath = path.join(CONTENT_ROOT, "collections", "videos", filename);

  if (fs.existsSync(filepath)) {
    console.error(red(`Error: file already exists: ${filename}`));
    process.exit(1);
  }

  const content = `---
slug: "${slug}"
title: "${title}"
description: ""
youtube_id: ""
tags:
  - ""
related_blogs: []
published: false
featured: false
date: "${date}"
duration: ""
views: ""
---
`;

  fs.writeFileSync(filepath, content, "utf-8");

  console.log(`
${green("✓")} Created: ${bold(filename)}
${dim("  Path:")} content/collections/videos/${filename}
${dim("  Slug:")} ${cyan(slug)}
${dim("  URL:")}  /videos/${slug}

${bold("Next steps:")}
  1. Add the YouTube video ID to ${cyan("youtube_id:")}
  2. Add description and tags
  3. Set ${cyan("published: true")} when ready
`);
}

// ─── Router ───────────────────────────────────────────────────────────────────
const [, , cmd, subcmd, ...rest] = process.argv;

if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") {
  showHelp();
} else if (cmd === "list") {
  listContent();
} else if (cmd === "validate") {
  validateContent();
} else if (cmd === "new") {
  const title = rest.join(" ");
  if (subcmd === "blog") {
    newBlog(title);
  } else if (subcmd === "video") {
    newVideo(title);
  } else {
    console.error(red(`Unknown type: ${subcmd}`));
    console.log(dim("  Available types: blog, video"));
    process.exit(1);
  }
} else {
  console.error(red(`Unknown command: ${cmd}`));
  console.log(dim("  Run npm run magic --help for usage"));
  process.exit(1);
}
