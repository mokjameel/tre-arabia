document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => observer.observe(el));

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---------- Language toggle ----------
const langToggle = document.getElementById('lang-toggle');
const htmlRoot = document.getElementById('html-root');
let currentLang = localStorage.getItem('tre-lang') || 'en';

function applyLang(lang) {
  const nodes = document.querySelectorAll('[data-en]');
  nodes.forEach(node => {
    const text = lang === 'ar' ? node.getAttribute('data-ar') : node.getAttribute('data-en');
    if (text) node.textContent = text;
  });
  htmlRoot.setAttribute('lang', lang);
  htmlRoot.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.body.classList.toggle('lang-ar', lang === 'ar');
  localStorage.setItem('tre-lang', lang);
  currentLang = lang;
}

langToggle.addEventListener('click', () => {
  applyLang(currentLang === 'en' ? 'ar' : 'en');
});

applyLang(currentLang);
