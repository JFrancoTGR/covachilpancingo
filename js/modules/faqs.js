// modules/faqs.js

export function setupFaqs({ translateElement, applyTranslations, currentLanguage }) {
  const faqs = [
    { q: 'faqs.q1', a: 'faqs.a1' }, { q: 'faqs.q2', a: 'faqs.a2' },
    { q: 'faqs.q3', a: 'faqs.a3' }, { q: 'faqs.q4', a: 'faqs.a4' },
    { q: 'faqs.q5', a: 'faqs.a5' }, { q: 'faqs.q6', a: 'faqs.a6' },
    { q: 'faqs.q7', a: 'faqs.a7' }, { q: 'faqs.q8', a: 'faqs.a8' },
    { q: 'faqs.q9', a: 'faqs.a9' }, 
  ];

  const container = document.querySelector('.faqs-container');
  const btnMore = document.querySelector('.faqs-view-more');
  let visibleCount = 4;
  const blockSize = 4;
  let isExpanding = true;

  function createFaqItem({ q, a }) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('faq-item');

    const question = document.createElement('div');
    question.classList.add('faq-question');
    question.innerHTML = `<span data-i18n="${q}"></span><span>+</span>`;

    const answer = document.createElement('div');
    answer.classList.add('faq-answer');
    answer.setAttribute('data-i18n', a);

    wrapper.appendChild(question);
    wrapper.appendChild(answer);

    question.addEventListener('click', () => {
      answer.classList.toggle('open');
      const symbol = question.querySelector('span:last-child');
      symbol.textContent = answer.classList.contains('open') ? '−' : '+';
    });

    return wrapper;
  }

  function renderFaqs() {
    container.innerHTML = '';
    faqs.slice(0, visibleCount).forEach((faq) => {
      const item = createFaqItem(faq);
      container.appendChild(item);
    });

    const labelKey = isExpanding ? 'faqs.viewMore' : 'faqs.viewLess';
    btnMore.setAttribute('data-i18n', labelKey);
    translateElement(btnMore, currentLanguage);
    applyTranslations(currentLanguage);
  }

  btnMore.addEventListener('click', () => {
    if (isExpanding) {
      visibleCount += blockSize;
      if (visibleCount >= faqs.length) {
        visibleCount = faqs.length;
        isExpanding = false;
      }
    } else {
      visibleCount -= blockSize;
      if (visibleCount <= blockSize) {
        visibleCount = blockSize;
        isExpanding = true;
      }
    }
    renderFaqs();
  });

  renderFaqs();
}
