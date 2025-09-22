// === CRÍTICO: Header, Hero Swap y Traducción ===

import { heroSwap } from './modules/hero-swap.js';
heroSwap();

import {
  handleHeaderOnScroll,
  setupMobileHeaderMenu,
} from './modules/header.js';

import {
  setupLanguageSwitcher,
  applyTranslations,
  translateElement,
  currentLanguage,
} from './modules/i18n.js';

window.addEventListener('scroll', handleHeaderOnScroll);

setupMobileHeaderMenu();
setupLanguageSwitcher();
applyTranslations(currentLanguage);

// === DIFERIR: resto al terminar de cargar ===
window.addEventListener('load', () => {
  // Mapa de experiencias
  // import('./modules/experiences-map.js')
  //   .then(({ setupExperiencesMap }) => setupExperiencesMap())
  //   .catch(console.error);

  // Swipers
  import('./modules/swiper-sliders.js')
    .then(({ initSlidersAndLightbox }) => initSlidersAndLightbox())
    .catch(console.error);

  // Parallax

  import('./modules/parallax.js')
  .then(( { initParallaxDivider}) => initParallaxDivider())
  .catch(console.error);

  // Video modal
  // import('./modules/video-modal.js')
  //   .then(({ setupVideoModal }) => setupVideoModal())
  //   .catch(console.error);

  // FAQs (ahora depende del módulo de traducción ya cargado)
  import('./modules/faqs.js')
    .then(({ setupFaqs }) =>
      setupFaqs({
        translateElement,
        applyTranslations,
        currentLanguage,
      })
    )
    .catch(console.error);

  // Mapa interactivo SVG
  // import('./modules/interactive-map.js')
  //   .then(({ setupInteractiveMap }) => setupInteractiveMap())
  //   .catch(console.error);

  //Glightboxes

  import('./modules/global-lightbox.js')
    .then(({ setupGlobalLightboxes }) => setupGlobalLightboxes())
    .catch(console.error);
});
