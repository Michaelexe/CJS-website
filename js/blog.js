const BLOG_DATA_URL = "/content/blog/posts.json";

function stripHtml(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html || "";
  return (temp.textContent || temp.innerText || "").trim();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getPostUrl(slug) {
  return `/blog/${encodeURIComponent(slug)}/`;
}

async function loadBlogPosts() {
  const response = await fetch(BLOG_DATA_URL);

  if (!response.ok) {
    throw new Error(`Failed to load blog data (${response.status})`);
  }

  const data = await response.json();
  const posts = Array.isArray(data.posts) ? data.posts : [];

  return posts
    .filter((post) => post && post.slug && post.title && post.publishedAt)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

window.CJSBlog = {
  escapeHtml,
  formatDate,
  getPostUrl,
  loadBlogPosts,
  stripHtml,
};

function markdownToHtml(markdown) {
  if (!markdown || typeof markdown !== "string") {
    return "";
  }

  if (typeof marked === "undefined") {
    console.warn("marked.js not loaded");
    return escapeHtml(markdown);
  }

  try {
    return marked.parse(markdown);
  } catch (error) {
    console.error("Markdown parsing error:", error);
    return escapeHtml(markdown);
  }
}

window.CJSBlog.markdownToHtml = markdownToHtml;
