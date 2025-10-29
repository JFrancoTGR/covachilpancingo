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

  async function ensureSwalReady() {
    if (window.Swal) return true;
    // espera activa hasta 1.5s
    for (let i = 0; i < 15; i++) {
      if (window.Swal) return true;
      await new Promise((r) => setTimeout(r, 100));
    }
    return !!window.Swal;
  }

  const submitButton = document.querySelector('.submit-form');
  let isSending = false;

  // Texto del botón según idioma
  const originalButtonHTML = translations[currentLanguage]['form.send.button'];
  submitButton.innerHTML = originalButtonHTML;

  // reCaptcha v2

  let recaptchaWidgetId = null;
  function initRecaptcha() {
    const RECAPTCHA_SITE_KEY = window.RECAPTCHA_SITE_KEY;

    // grecaptcha puede tardar en estar listo; esperamos que el script se haya cargado
    if (window.grecaptcha && typeof grecaptcha.render === 'function') {
      // render en un div que creamos dinámicamente y ocultamos
      let container = document.getElementById('recaptcha-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'recaptcha-container';
        container.style.visibility = 'hidden';
        container.style.height = '0';
        document.body.appendChild(container);
      }
      // renderiza invisible widget y guarda id para ejecutar
      recaptchaWidgetId = grecaptcha.render(container, {        
        sitekey: RECAPTCHA_SITE_KEY,
        size: 'invisible',
        // NOTA: no necesitamos callback aquí; usaremos grecaptcha.execute(widgetId)
      });
      // console.log('reCAPTCHA renderizado con ID:', recaptchaWidgetId)
    } else {
      // si grecaptcha aún no está disponible, intentamos de nuevo en 300ms
      setTimeout(initRecaptcha, 300);
    }
  }
  initRecaptcha();

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
  const API_ENDPOINT = '/../sender/send_registration.php';
  // Para API de terceros: const API_ENDPOINT = 'https://api.tercero.com/v1/endpoint';

  const formEl = document.querySelector('.contact-form');
  formEl.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (isSending) return;

    submitButton.disabled = true;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phoneRaw = document.getElementById('phone').value.trim();
    const countrySelected = document
      .getElementById('country_code')
      .value.trim();
    const contact_method = document.querySelector(
      'input[name="contact"]:checked'
    );
    const type_of_client = document.querySelector(
      'input[name="client"]:checked'
    );

    // Validaciones
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const completePhone = countrySelected + phoneRaw.replace(/\D/g, '');

    if (!name || !email || !phoneRaw || !countrySelected) {
      await ensureSwalReady();
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
      await ensureSwalReady();
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
      await ensureSwalReady();
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
      await ensureSwalReady();
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
      await ensureSwalReady();
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

    // función que envía el payload al backend (igual a tu fetch actual)
    async function sendPayload(finalPayload) {
      try {
        const res = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(finalPayload),
        });

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
    }

    // Ejecutar grecaptcha y luego enviar
    if (window.grecaptcha && recaptchaWidgetId !== null) {
      // ejecuta el widget invisible; el token cae en callback de execute (promisify)
      try {
        const token = await new Promise((resolve, reject) => {
          grecaptcha
            .execute(recaptchaWidgetId)
            .then(function (tkn) {
              resolve(tkn);
            })
            .catch(function (err) {
              reject(err);
            });
          // Fallback timeout por si algo falla: 8s
          setTimeout(() => reject(new Error('recaptcha_timeout')), 8000);
        });

        // adjuntar token al payload
        payload.g_recaptcha_token = token;
        payload.captcha_version = 'v2_invisible';

        // finalmente envía
        await sendPayload(payload);
      } catch (recapErr) {
        // si reCAPTCHA falla localmente, informamos al usuario y no enviamos datos
        Swal.fire({
          icon: 'error',
          title: translations[currentLanguage].swal.errorTitle,
          text: 'No se pudo validar el captcha. Intenta de nuevo por favor.',
        });
        isSending = false;
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHTML;
        return;
      }
    } else {
      // Si grecaptcha no está disponible (rare), no enviamos: mejor bloquear que crear perfiles basura
      Swal.fire({
        icon: 'error',
        title: translations[currentLanguage].swal.errorTitle,
        text: 'Captcha no disponible. Intenta de nuevo más tarde.',
      });
      isSending = false;
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonHTML;
      return;
    }
  });
});
