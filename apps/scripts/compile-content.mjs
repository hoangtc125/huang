#!/usr/bin/env node
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.join(__dirname, "..");
const contentRoot = path.join(appRoot, "..", "content");
const collectionsRoot = path.join(contentRoot, "collections");
const outputRoot = path.join(appRoot, "lib", "content", "generated");

const collections = ["blogs", "projects", "videos", "topics", "qa"];
const staticFiles = ["experience", "profile", "skills", "about"];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function safeFileName(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "item";
}

function writeCollection(collection) {
  const srcDir = path.join(collectionsRoot, collection);
  const outDir = path.join(outputRoot, collection);
  ensureDir(outDir);

  if (!fs.existsSync(srcDir)) {
    fs.writeFileSync(path.join(outDir, "index.ts"), "export default [] as const;\n", "utf-8");
    return 0;
  }

  const files = fs
    .readdirSync(srcDir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .sort((a, b) => a.localeCompare(b));

  const imports = [];
  const entries = [];
  let i = 0;

  for (const file of files) {
    const full = path.join(srcDir, file);
    const raw = fs.readFileSync(full, "utf-8");
    const { data, content } = matter(raw);

    const slugFromData = typeof data.slug === "string" ? data.slug : "";
    const fileStem = file.replace(/\.md$/i, "");
    const moduleName = safeFileName(slugFromData || fileStem);
    const varName = `entry${i++}`;
    const payload = {
      file,
      data: data ?? {},
      content: (content ?? "").trim(),
    };

    const moduleCode = `export const entry = ${JSON.stringify(payload, null, 2)} as const;\nexport default entry;\n`;
    fs.writeFileSync(path.join(outDir, `${moduleName}.tsx`), moduleCode, "utf-8");

    imports.push(`import ${varName} from "./${moduleName}";`);
    entries.push(varName);
  }

  const indexCode = `${imports.join("\n")}\n\nconst entries = [${entries.join(", ")}] as const;\nexport default entries;\n`;
  fs.writeFileSync(path.join(outDir, "index.ts"), indexCode, "utf-8");
  return files.length;
}

function writeStatic(name) {
  const srcFile = path.join(contentRoot, "static", `${name}.md`);
  const outDir = path.join(outputRoot, "static");
  ensureDir(outDir);

  if (!fs.existsSync(srcFile)) return;

  const raw = fs.readFileSync(srcFile, "utf-8");
  const { data, content } = matter(raw);
  const payload = { data: data ?? {}, content: (content ?? "").trim() };
  const moduleCode = `export const entry = ${JSON.stringify(payload, null, 2)} as const;\nexport default entry;\n`;
  fs.writeFileSync(path.join(outDir, `${name}.ts`), moduleCode, "utf-8");
}

function main() {
  if (!fs.existsSync(collectionsRoot)) {
    throw new Error(`Missing content collections directory: ${collectionsRoot}`);
  }

  if (fs.existsSync(outputRoot)) {
    fs.rmSync(outputRoot, { recursive: true, force: true });
  }
  ensureDir(outputRoot);

  let total = 0;
  const summary = [];

  for (const c of collections) {
    const count = writeCollection(c);
    total += count;
    summary.push(`${c}:${count}`);
  }

  for (const s of staticFiles) {
    writeStatic(s);
  }

  const rootIndex = collections
    .map((c) => `export { default as ${c}Entries } from "./${c}";`)
    .join("\n");
  fs.writeFileSync(path.join(outputRoot, "index.ts"), `${rootIndex}\n`, "utf-8");

  console.log(`Compiled ${total} markdown files -> lib/content/generated (${summary.join(" ")})`);
}

main();
