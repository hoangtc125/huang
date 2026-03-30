#!/usr/bin/env node
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.join(__dirname, "..");
const collectionsRoot = path.join(appRoot, "content", "collections");
const outputFile = path.join(appRoot, "lib", "content", "generated-content.json");

const collections = ["blogs", "projects", "videos", "topics", "qa"];

function readCollection(name) {
  const dir = path.join(collectionsRoot, name);
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .sort((a, b) => a.localeCompare(b));

  return files.map((file) => {
    const full = path.join(dir, file);
    const raw = fs.readFileSync(full, "utf-8");
    const parsed = matter(raw);
    return {
      file,
      data: parsed.data ?? {},
      content: (parsed.content ?? "").trim(),
    };
  });
}

const payload = Object.fromEntries(collections.map((name) => [name, readCollection(name)]));
fs.writeFileSync(outputFile, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");

const summary = collections
  .map((name) => `${name}:${payload[name].length}`)
  .join(" ");
console.log(`Generated ${path.relative(appRoot, outputFile)} (${summary})`);
