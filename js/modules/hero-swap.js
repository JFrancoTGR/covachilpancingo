export function heroSwap() {
  const hero = document.querySelector('.hero-bg');

  if (hero) {
    // console.log('[DEBUG] Hero element found');

    function swapToHighRes() {
      const highRes = hero.dataset.highres;
      // console.log('[DEBUG] Will load high-res:', highRes);

      const imgHigh = new Image();
      imgHigh.src = highRes;
      imgHigh.decoding = 'async';

      imgHigh.onload = function () {
        // console.log('[DEBUG] High-res loaded, swapping...');
        hero.src = highRes;
        hero.classList.add('loaded');
      };

      imgHigh.onerror = function () {
        // console.error('[ERROR] High-res failed to load');
      };
    }

    if (hero.complete) {
      // console.log('[DEBUG] Placeholder already complete');
      swapToHighRes();
    } else {
      hero.addEventListener('load', function () {
        // console.log('[DEBUG] Placeholder loaded');
        swapToHighRes();
      });
    }
  }
}
