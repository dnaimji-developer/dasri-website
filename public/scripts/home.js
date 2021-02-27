const header = document.querySelector(".header");

window.addEventListener("scroll", scrollHeader);

function scrollHeader() {
  if (window.scrollY > 1) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
}
