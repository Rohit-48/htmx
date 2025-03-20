document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("dark-mode-toggle");

  toggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
  });

  document.addEventListener("htmx:afterSwap", function (event) {
    document
      .querySelectorAll("nav a")
      .forEach((link) => link.classList.remove("font-bold", "text-blue-600"));
    event.detail.elt.classList.add("font-bold", "text-blue-600");
  });
});
