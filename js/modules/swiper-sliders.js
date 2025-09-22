// swiper-sliders.js

export function initSlidersAndLightbox() {
  const experiencesSwiper = new Swiper('.exteriores-swiper', {
    slidesPerView: 1,
    spaceBetween: 15,
    loop: true,
    grabCursor: true,
    navigation: {
      nextEl: '.exteriores-next',
      prevEl: '.exteriores-prev',
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });

  const residencesSwiper = new Swiper('.vistas-swiper', {
    slidesPerView: 1,
    spaceBetween: 15,
    loop: true,
    grabCursor: true,
    navigation: {
      nextEl: '.vistas-next',
      prevEl: '.vistas-prev',
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });

  const tipologiasSwiper = new Swiper('.tipologias-swiper', {
    slidesPerView: 1,
    loop: true,
    grabCursor: true,
    navigation: {
      nextEl: '.tipologias-next',
      prevEl: '.tipologias-prev',
    },
    breakpoints: {
      768: { slidesPerView: 1 },
      1024: { slidesPerView: 1 },
    },
  });

  const viewsSwiper = new Swiper('.views-swiper', {
    slidesPerView: 1,
    loop: true,
    grabCursor: true,
    navigation: {
      nextEl: '.views-next',
      prevEl: '.views-prev',
    },
  });

  const creativesSwiper = new Swiper('.creatives-swiper', {
    slidesPerView: 3,
    spaceBetween: 20,
    loop: true,
    grabCursor: true,
    navigation: {
      nextEl: '.creatives-next',
      prevEl: '.creatives-prev',
    },
    breakpoints: {
      1024: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      0: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
    },
  });

  const caption3 = document.getElementById('caption3');

  // función para actualizar
  function updateCaption() {
    const activeSlide = viewsSwiper.slides[viewsSwiper.activeIndex];
    if (activeSlide && activeSlide.dataset.title) {
      caption3.textContent = activeSlide.dataset.title;
    } else {
      caption3.textContent = ''; // fallback
    }
  }

  // inicializar caption al cargar
  viewsSwiper.on('init', updateCaption);

  // actualizar caption en cambios
  viewsSwiper.on('slideChange', updateCaption);

  // forzar init para primer caption
  viewsSwiper.init();
}
