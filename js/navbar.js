const menuButton = document.querySelector(".menu");
const menu = document.querySelector(".menu-dropdown");

if (menuButton && menu) {
  menuButton.addEventListener("click", () => {
    menuButton.classList.toggle("active");
    if (menu.style.maxHeight) {
      menu.style.maxHeight = null;
    } else {
      menu.style.maxHeight = menu.scrollHeight + "px";
    }
  });
}

async function updateProgramLinks() {
  const links = document.querySelectorAll("[data-program-link]");

  if (!links.length) {
    return;
  }

  try {
    const response = await fetch("/content/program.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load program content (${response.status})`);
    }

    const raw = await response.text();
    const program = raw.trim() ? JSON.parse(raw) : {};
    const hasContent =
      program &&
      typeof program === "object" &&
      (program.title || program.subtitle || program.intro);

    if (!hasContent) {
      links.forEach((link) => {
        link.hidden = true;
      });
    }
  } catch (error) {
    links.forEach((link) => {
      link.hidden = true;
    });
    console.error(error);
  }
}

updateProgramLinks();
