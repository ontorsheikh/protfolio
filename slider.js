/* global Swiper */

new Swiper("#imageSlider", {
  modules: [
    Swiper.Autoplay,
    Swiper.Pagination,
    Swiper.Navigation,
    Swiper.EffectFade,
  ],
  effect: "fade",
  speed: 700,
  loop: true,
  autoplay: {
    delay: 2800,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  watchSlidesProgress: true,
});
