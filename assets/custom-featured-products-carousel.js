class ProductCarouselComponent extends HTMLElement {
  constructor() {
    super();
//    this.init();
  }
  connectedCallback() {
    document.addEventListener("DOMContentLoaded", () => this.init());
  }
  init() {
    const $carousel = $(this.querySelector(".carousel"));
    if ($carousel.length) {
      $carousel.slick({
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '0px',
        arrows:true,
        prevArrow:'<button type="button" class="slick-prev"><i class="fa-solid fa-chevron-left"></i></button>',
        nextArrow:'<button type="button" class="slick-next"><i class="fa-solid fa-chevron-right"></i></button>',
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              centerPadding: '80px',
              infinite: true
            }
          }
        ]
      });
    }
  }
}
customElements.define('product-carousel', ProductCarouselComponent);