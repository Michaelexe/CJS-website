document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#blog-list");

  if (!container || !window.CJSBlog) {
    return;
  }

  try {
    const posts = await window.CJSBlog.loadBlogPosts();

    if (!posts.length) {
      container.innerHTML = "<p>No blog posts published yet.</p>";
      return;
    }

    container.innerHTML = posts
      .map((post) => {
        const excerpt =
          post.excerpt ||
          window.CJSBlog.stripHtml(post.content).slice(0, 180) + "...";

        return `
          <a class="blog-card" href="${window.CJSBlog.getPostUrl(post.slug)}">
            <img src="${window.CJSBlog.escapeHtml(post.coverImage || "/images/home-image.jpg")}" alt="${window.CJSBlog.escapeHtml(post.title)}" />
            <div class="blog-card__body">
              <p class="blog-card__date">${window.CJSBlog.formatDate(post.publishedAt)} | ${window.CJSBlog.escapeHtml(post.author || "Coach Jules")}</p>
              <h2 class="blog-card__title">${window.CJSBlog.escapeHtml(post.title)}</h2>
              <p class="blog-card__excerpt">${window.CJSBlog.escapeHtml(excerpt)}</p>
            </div>
          </a>
        `;
      })
      .join("");
  } catch (error) {
    container.innerHTML = "<p>Unable to load blog posts right now.</p>";
    console.error(error);
  }
});
