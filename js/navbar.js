let menuButton = document.querySelector(".menu");
let menu = document.querySelector(".menu-dropdown");

menuButton.addEventListener("click", () => {
  menuButton.classList.toggle("active");
  if (menu.style.maxHeight) {
    menu.style.maxHeight = null;
  } else {
    menu.style.maxHeight = menu.scrollHeight + "px";
  }
});
