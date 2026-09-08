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

async function loadDownloadButton() {
  const buttons = document.querySelectorAll("[data-download-button]");

  if (!buttons.length) {
    return;
  }

  try {
    const response = await fetch("/content/site.json");
    if (!response.ok) {
      throw new Error(`Failed to load site settings (${response.status})`);
    }

    const settings = await response.json();
    const download = settings.navbar?.download;
    const isVisible = download?.enabled && download?.file;

    buttons.forEach((button) => {
      if (!isVisible) {
        button.hidden = true;
        return;
      }

      button.textContent = download.label || "Download";
      button.href = download.file;
      button.hidden = false;
    });
  } catch (error) {
    buttons.forEach((button) => {
      button.hidden = true;
    });
    console.error(error);
  }
}

loadDownloadButton();
