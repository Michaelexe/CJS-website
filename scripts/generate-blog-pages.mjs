import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const blogDir = path.join(root, "blog");
const postsFile = path.join(root, "content", "blog", "posts.json");
const templateFile = path.join(blogDir, "_templates", "post.html");

const generatedMarker = "<!-- AUTO-GENERATED: do not edit directly -->";
const protectedDirs = new Set(["post", "_templates"]);

function sanitizeSlug(slug) {
  return String(slug || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  if (!raw.trim()) {
    return { posts: [] };
  }
  return JSON.parse(raw);
}

async function removeStaleGeneratedDirs(validSlugs) {
  const entries = await fs.readdir(blogDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const dirName = entry.name;

    if (protectedDirs.has(dirName)) {
      continue;
    }

    const fullDir = path.join(blogDir, dirName);
    const indexPath = path.join(fullDir, "index.html");

    if (validSlugs.has(dirName)) {
      continue;
    }

    try {
      const html = await fs.readFile(indexPath, "utf8");
      if (html.includes(generatedMarker)) {
        await fs.rm(fullDir, { recursive: true, force: true });
        console.log(`Removed stale generated page: blog/${dirName}/`);
      }
    } catch {
      // Ignore folders without index.html or read issues.
    }
  }
}

async function generate() {
  const [template, data] = await Promise.all([
    fs.readFile(templateFile, "utf8"),
    readJson(postsFile),
  ]);

  const posts = Array.isArray(data.posts) ? data.posts : [];
  const slugs = new Set();

  for (const post of posts) {
    const slug = sanitizeSlug(post?.slug);

    if (!slug) {
      continue;
    }

    if (slugs.has(slug)) {
      throw new Error(`Duplicate slug found in posts.json: ${slug}`);
    }

    slugs.add(slug);

    const targetDir = path.join(blogDir, slug);
    const targetFile = path.join(targetDir, "index.html");

    await fs.mkdir(targetDir, { recursive: true });

    const output = `${generatedMarker}\n${template.replaceAll("__POST_SLUG__", slug)}\n`;
    await fs.writeFile(targetFile, output, "utf8");

    console.log(`Generated page: blog/${slug}/`);
  }

  await removeStaleGeneratedDirs(slugs);
}

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});
