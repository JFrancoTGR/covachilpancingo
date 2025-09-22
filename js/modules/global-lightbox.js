export function setupGlobalLightboxes() {
  // Experiences
  const experiencesLightbox = GLightbox({
    selector: '[data-glightbox="gallery-exteriores"]',
  });

  // Residences
  const residencesLightbox = GLightbox({
    selector: '[data-glightbox="gallery-vistas"]',
  });

  // Views
  // const viewsLightbox = GLightbox({
  //   selector: '[data-glightbox="gallery-views"]',
  // });

  // Tipologies
  const tipologiesLightbox = GLightbox({
    selector: '[data-glightbox="gallery-tipologies"]',
  });

  //Privacy
  const privacyLightbox = GLightbox({
    selector: 'a[href="#privacy-content"]',
  })
  //Terms
  const termsLightbox = GLightbox({
    selector: 'a[href="#terms-content"]',
  });
}
