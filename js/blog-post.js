document.addEventListener("DOMContentLoaded", async () => {
  const bodySlug = document.body.dataset.postSlug;
  const titleEl = document.querySelector("#blog-post-title");
  const metaEl = document.querySelector("#blog-post-meta");
  const imageEl = document.querySelector("#blog-post-image");
  const contentEl = document.querySelector("#blog-post-content");

  if (!titleEl || !metaEl || !imageEl || !contentEl || !window.CJSBlog) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const pathSlug = pathParts.length >= 2 ? pathParts[pathParts.length - 1] : "";
  const slug = bodySlug || params.get("slug") || pathSlug;

  if (!slug) {
    titleEl.textContent = "Blog post not found";
    metaEl.textContent = "Missing post slug.";
    imageEl.remove();
    contentEl.innerHTML =
      "<p>Please return to the blog page and choose a post.</p>";
    return;
  }

  try {
    const posts = await window.CJSBlog.loadBlogPosts();
    const post = posts.find((item) => item.slug === slug);

    if (!post) {
      titleEl.textContent = "Blog post not found";
      metaEl.textContent = "This post may have been removed.";
      imageEl.remove();
      contentEl.innerHTML =
        "<p>Please return to the blog page and choose another post.</p>";
      return;
    }

    titleEl.textContent = post.title;
    metaEl.textContent = `${window.CJSBlog.formatDate(post.publishedAt)} | ${post.author || "Coach Jules"}`;
    imageEl.src = post.coverImage || "/images/home-image.jpg";
    imageEl.alt = post.title;
    // Convert markdown to HTML if content is markdown
    if (window.CJSBlog.markdownToHtml) {
      contentEl.innerHTML =
        window.CJSBlog.markdownToHtml(post.content) ||
        "<p>No content available.</p>";
    } else {
      contentEl.innerHTML = "<p>No content available.</p>";
    }
    document.title = `${post.title} | CJS Coach Jules`;
  } catch (error) {
    titleEl.textContent = "Unable to load post";
    metaEl.textContent = "Please try again later.";
    imageEl.remove();
    contentEl.innerHTML = "<p>There was an issue loading this blog post.</p>";
    console.error(error);
  }
});
