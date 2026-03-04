import "/style.css";

window.addEventListener("load", () => {
  const loader = document.getElementById("page-loader");
  setTimeout(() => {
    loader.style.display = "none";
  }, 1000);
});
