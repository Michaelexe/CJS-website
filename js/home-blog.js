document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#recent-blog-posts");

  if (!container || !window.CJSBlog) {
    return;
  }

  try {
    const posts = await window.CJSBlog.loadBlogPosts();
    const recentPosts = posts.slice(0, 3);

    if (!recentPosts.length) {
      const blogSection = container.closest(".home__blog");
      if (blogSection) {
        blogSection.style.display = "none";
      }
      return;
    }

    // Hide blog section if fewer than 3 posts
    if (posts.length < 3) {
      const blogSection = container.closest(".home__blog");
      if (blogSection) {
        blogSection.style.display = "none";
      }
      return;
    }
    container.innerHTML = recentPosts
      .map((post) => {
        const excerpt =
          post.excerpt ||
          window.CJSBlog.stripHtml(post.content).slice(0, 140) + "...";

        return `
          <a class="blog-card" href="${window.CJSBlog.getPostUrl(post.slug)}">
            <img src="${window.CJSBlog.escapeHtml(post.coverImage || "/images/home-image.jpg")}" alt="${window.CJSBlog.escapeHtml(post.title)}" />
            <div class="blog-card__body">
              <p class="blog-card__date">${window.CJSBlog.formatDate(post.publishedAt)}</p>
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
