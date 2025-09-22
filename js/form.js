// form.js

import { currentLanguage } from '../js/modules/i18n.js';
import { translations } from '../js/modules/translations.js';
import { countryCodes } from '../js/modules/country-codes.js';

document.addEventListener('DOMContentLoaded', function () {
  const formSection = document.querySelector('.contact-form');
  if (!formSection) return;

  const countrySelect = document.getElementById('country_code');

  // Poblar códigos de país
  Object.entries(countryCodes).forEach(([iso, data]) => {
    const option = document.createElement('option');
    option.value = data.code;
    option.textContent = `${data.code} (${data.name})`;
    countrySelect.appendChild(option);
  });

  // Carga diferida de SweetAlert2
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
          script.async = true;
          document.head.appendChild(script);
          observer.disconnect();
        }
      });
    },
    { rootMargin: '80px' }
  );
  observer.observe(formSection);

  const submitButton = document.querySelector('.submit-form');
  let isSending = false;

  // Texto del botón según idioma
  const originalButtonHTML = translations[currentLanguage]['form.send.button'];
  submitButton.innerHTML = originalButtonHTML;

  // UTM params
  const params = new URLSearchParams(window.location.search);
  const utm_source = params.get('utm_source') || '';
  const utm_medium = params.get('utm_medium') || '';
  const utm_campaign = params.get('utm_campaign') || '';
  const utm_content = params.get('utm_content') || '';
  const utm_adset = params.get('utm_adset') || '';
  const utm_adname = params.get('utm_adname') || '';
  const utm_term = params.get('utm_term') || '';

  // === CONFIGURABLE: endpoint actual y futuro ===
  const API_ENDPOINT = '/covachilpancingo/sender/send_registration.php';
  // Para API de terceros: const API_ENDPOINT = 'https://api.tercero.com/v1/endpoint';

  submitButton.addEventListener('click', async function (e) {
    e.preventDefault();
    if (isSending) return;

    submitButton.disabled = true;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phoneRaw = document.getElementById('phone').value.trim();
    const countrySelected = document.getElementById('country_code').value.trim();
    const contact_method = document.querySelector('input[name="contact"]:checked');
    const type_of_client = document.querySelector('input[name="client"]:checked');

    // Validaciones
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const completePhone = countrySelected + phoneRaw.replace(/\D/g, '');

    if (!name || !email || !phoneRaw || !countrySelected) {
      Swal.fire({
        icon: 'warning',
        title: translations[currentLanguage].swal.warningTitle,
        text: translations[currentLanguage].swal.missingFields,
      });
      submitButton.disabled = false;
      isSending = false;
      return;
    }

    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: 'warning',
        title: translations[currentLanguage].swal.errorTitle,
        text: translations[currentLanguage].swal.wrongEmail,
      });
      submitButton.disabled = false;
      isSending = false;
      return;
    }

    if (!/^\+\d{7,15}$/.test(completePhone)) {
      Swal.fire({
        icon: 'warning',
        title: translations[currentLanguage].swal.errorTitle,
        text: translations[currentLanguage].swal.wrongPhone,
      });
      submitButton.disabled = false;
      isSending = false;
      return;
    }

    if (!contact_method) {
      Swal.fire({
        icon: 'warning',
        title: translations[currentLanguage].swal.errorTitle,
        text: translations[currentLanguage].swal.missingContact,
      });
      submitButton.disabled = false;
      isSending = false;
      return;
    }

    if (!type_of_client) {
      Swal.fire({
        icon: 'warning',
        title: translations[currentLanguage].swal.errorTitle,
        text: translations[currentLanguage].swal.missingTypeOfClient,
      });
      submitButton.disabled = false;
      isSending = false;
      return;
    }

    // 🔄 Iniciar envío
    isSending = true;
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="spinner" aria-hidden="true"></span> ${translations[currentLanguage]['form.sending.button']}`;

    // Payload único para tu backend o API de terceros
    const payload = {
      name,
      email,
      phone: completePhone,
      contact_method: contact_method.value,
      type_of_client: type_of_client.value,
      current_language: currentLanguage,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_adset,
      utm_adname,
      utm_term,
    };

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Si tu endpoint externo requiere auth, aquí agregas el header:
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      // Si es PHP que devuelve JSON con {status:'success'|'error'}
      const data = await res.json().catch(() => ({}));

      if (res.ok && (data.status === 'success' || data.ok === true)) {
        Swal.fire({
          icon: 'success',
          title: translations[currentLanguage].swal.successTitle,
          text: translations[currentLanguage].swal.successText,
        });
        document.querySelector('.contact-form').reset();
      } else {
        Swal.fire({
          icon: 'error',
          title: translations[currentLanguage].swal.errorTitle,
          text: translations[currentLanguage].swal.sendingError,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: translations[currentLanguage].swal.errorTitle,
        text: translations[currentLanguage].swal.sendingError,
      });
    } finally {
      isSending = false;
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonHTML;
    }
  });
});
