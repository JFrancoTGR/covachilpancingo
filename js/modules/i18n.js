// modules/i18n.js

import { translations } from './translations.js';

export const supportedLanguages = ['en', 'es'];
export let currentLanguage = detectUserLanguage();

function detectUserLanguage() {
  const storedLang = localStorage.getItem('preferredLanguage');
  if (storedLang && supportedLanguages.includes(storedLang)) return storedLang;

  const browserLang = navigator.language || navigator.userLanguage;
  const lang = browserLang.slice(0, 2);
  return supportedLanguages.includes(lang) ? lang : 'en';
}

const htmlKeys = ['faqs.a3', 'faqs.a8', 'faqs.a9', 'faqs.a16'];

export function applyTranslations(lang) {
  currentLanguage = lang;
  localStorage.setItem('preferredLanguage', lang);

  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach((el) => (el.style.opacity = 0));

  setTimeout(() => {
    elements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const translation = translations[lang]?.[key];

      if (translation) {
        if (htmlKeys.includes(key)) {
          el.innerHTML = translation;
        } else if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
          el.placeholder = translation;
        } else {
          el.textContent = translation;
        }
      }
      el.style.opacity = 1;
    });

    document.querySelectorAll('.lang-option').forEach((btn) => {
      const text = btn.textContent.trim().toLowerCase();
      btn.classList.toggle('active', text === lang);
    });
  }, 250);
}

export function translateElement(el, lang) {
  const key = el.getAttribute('data-i18n');
  const translation = translations[lang]?.[key];

  if (translation) {
    if (htmlKeys.includes(key)) {
      el.innerHTML = translation;
    } else if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
      el.placeholder = translation;
    } else {
      el.textContent = translation;
    }
  }
}

export function setupLanguageSwitcher() {
  document.querySelectorAll('.lang-option').forEach((el) => {
    el.addEventListener('click', () => {
      const lang = el.textContent.trim().toLowerCase();
      applyTranslations(lang);
    });
  });
}

// Aplicar traducción inicial al cargar el módulo
applyTranslations(currentLanguage);
