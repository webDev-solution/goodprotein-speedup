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
      if (container && variantId) {
        container.setAttribute("data-variant-id", variantId);
      }
    });
  });
})();

document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll(".swiper-slide select").forEach(function(select) {
    console.log("select", select)
        var variantId = select.value;
        var container = select.closest("[data-abra-container]");
        if (container && variantId) {
          container.setAttribute("data-variant-id", variantId);
        }
        setTimeout(() => {
      window.Abra?.render();
    }, 150);
      });
});
