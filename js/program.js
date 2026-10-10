const PROGRAM_DATA_URL = "/content/program.json";

function renderProgramRichText(value) {
  if (!value) {
    return "";
  }

  if (window.CJSBlog?.markdownToHtml) {
    return window.CJSBlog.markdownToHtml(value);
  }

  return `<p>${window.CJSBlog.escapeHtml(value)}</p>`;
}

async function loadProgram() {
  const response = await fetch(PROGRAM_DATA_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load program content (${response.status})`);
  }

  const raw = await response.text();
  return raw.trim() ? JSON.parse(raw) : {};
}

function renderProgram(program) {
  const hasContent =
    program &&
    typeof program === "object" &&
    (program.title || program.subtitle || program.intro);

  if (!hasContent) {
    window.location.replace("/");
    return;
  }

  document.title = `${program.title || "Program"} | CJS Coach Jules`;

  const hero = document.querySelector(".program-hero");
  if (hero && program.heroImage) {
    hero.style.setProperty("--program-hero-image", `url("${program.heroImage}")`);
  }

  document.querySelector("[data-program-eyebrow]").textContent = program.eyebrow || "";
  document.querySelector("[data-program-title]").textContent = program.title || "";
  document.querySelector("[data-program-subtitle]").textContent = program.subtitle || "";
  document.querySelector("[data-program-intro]").innerHTML = renderProgramRichText(program.intro);

  const highlights = document.querySelector("[data-program-highlights]");
  highlights.innerHTML = (Array.isArray(program.highlights) ? program.highlights : [])
    .map(
      (item) => `
        <article class="program-highlight">
          <h2>${window.CJSBlog.escapeHtml(item.title)}</h2>
          <p>${window.CJSBlog.escapeHtml(item.description)}</p>
        </article>`,
    )
    .join("");

  const sections = document.querySelector("[data-program-sections]");
  sections.innerHTML = (Array.isArray(program.sections) ? program.sections : [])
    .map(
      (section) => `
        <article class="program-content__section">
          <h2>${window.CJSBlog.escapeHtml(section.title)}</h2>
          <div class="program-rich-text">${renderProgramRichText(section.content)}</div>
        </article>`,
    )
    .join("");

  const download = program.download || {};
  const downloadSection = document.querySelector(".program-download");
  if (downloadSection && download.backgroundImage) {
    downloadSection.style.setProperty(
      "--program-download-image",
      `url("${download.backgroundImage}")`,
    );
  }

  document.querySelector("[data-program-download-description]").textContent =
    download.description || "";
  const downloadLinks = document.querySelectorAll(
    "[data-program-download], [data-program-download-secondary]",
  );
  downloadLinks.forEach((downloadLink) => {
    downloadLink.textContent = download.label || "Download the program";
    downloadLink.href = download.file || "#";
    downloadLink.hidden = !download.file;
  });

  const cta = program.cta || {};
  document.querySelector("[data-program-cta-title]").textContent =
    cta.title || "";
  document.querySelector("[data-program-cta-text]").textContent =
    cta.text || "";
  const ctaLink = document.querySelector("[data-program-cta-link]");
  ctaLink.textContent = cta.buttonLabel || "Contact Coach Jules";
  ctaLink.href = cta.buttonHref || "/#contact";
}

loadProgram()
  .then(renderProgram)
  .catch((error) => {
    document.querySelector("main").innerHTML =
      '<section class="program-section"><div class="container"><p>Program content is currently unavailable.</p></div></section>';
    console.error(error);
  });
