(() => {
  window.addEventListener("change", () => {
    setTimeout(() => {
      window.Abra?.render();
    }, 150);
  });
})();
