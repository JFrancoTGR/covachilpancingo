export function initParallaxDivider({
  selector = '.parallax-divider',
  factor = 0.25, // intensidad del parallax (0.1–0.35 recomendado)
} = {}) {
  const sections = Array.from(document.querySelectorAll(selector));
  if (!sections.length) return;

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  if (reduceMotion) return; // respeta accesibilidad

  let ticking = false;

  function updateSection(section) {
    const rect = section.getBoundingClientRect();
    const offset = rect.top * factor;
    section.style.setProperty('--parallax-offset', `${offset}px`);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      for (const s of sections) updateSection(s);
      ticking = false;
    });
  }

  // Inicialización perezosa con IntersectionObserver (mejor rendimiento)
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          updateSection(entry.target);
        }
      }
    },
    { root: null, rootMargin: '0px', threshold: 0 }
  );

  sections.forEach((s) => io.observe(s));

  // Listeners globales
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  // Primer cálculo
  onScroll();

  // API de limpieza opcional (por si desmontas vistas SPA)
  return () => {
    io.disconnect();
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  };
}

export default initParallaxDivider;
