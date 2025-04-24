(() => {
  window.addEventListener("change", () => {
    setTimeout(() => {
      window.Abra?.render();
    }, 150);
  });

  document.querySelectorAll(".swiper-slide select").forEach(function(select) {
    select.addEventListener("change", function(e) {
      var variantId = e.target.value;
      var container = select.closest("[data-abra-container]");
      container.setAttribute("data-variant-id", variantId);
    })
  })
})();
