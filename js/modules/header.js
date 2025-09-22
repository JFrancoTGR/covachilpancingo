// modules/header-scroll.js

export function handleHeaderOnScroll() {
  const header = document.querySelector('.main-header');
  if (window.scrollY >= 150) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

export function setupMobileHeaderMenu() {
  document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const overlay = document.getElementById('mobileMenuOverlay');
    const closeBtn = document.querySelector('.close-menu');

    burger?.addEventListener('click', () => {
      overlay?.classList.add('active');
    });

    closeBtn?.addEventListener('click', () => {
      overlay?.classList.remove('active');
    });

    document.querySelectorAll('.mobile-nav a').forEach((link) => {
      link.addEventListener('click', () => {
        overlay?.classList.remove('active');
      });
    });
  });
}