// ---------- Shared nav/footer (single source of truth across all pages) ----------
function isHomepage() {
  const p = location.pathname;
  return p.endsWith('index.html') || p.endsWith('/');
}

function rewriteHomeAnchors(root) {
  if (isHomepage()) return;
  root.querySelectorAll('a[href^="#"]').forEach(a => {
    a.setAttribute('href', 'index.html' + a.getAttribute('href'));
  });
}

async function loadPartial(placeholderId, url) {
  const el = document.getElementById(placeholderId);
  if (!el) return;
  const res = await fetch(url);
  el.innerHTML = await res.text();
  rewriteHomeAnchors(el);
}

(async function init() {
  await Promise.all([
    loadPartial('site-nav', 'partials/nav.html'),
    loadPartial('site-footer', 'partials/footer.html'),
  ]);

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Nav scroll shadow ----------
  const navEl = document.querySelector('.nav');
  if (navEl) {
    const updateNavShadow = () => navEl.classList.toggle('is-scrolled', window.scrollY > 8);
    updateNavShadow();
    window.addEventListener('scroll', updateNavShadow, { passive: true });
  }

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
    const hrefNodes = document.querySelectorAll('[data-href-en]');
    hrefNodes.forEach(node => {
      const href = lang === 'ar' ? node.getAttribute('data-href-ar') : node.getAttribute('data-href-en');
      if (href) node.setAttribute('href', href);
    });
    htmlRoot.setAttribute('lang', lang);
    htmlRoot.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.body.classList.toggle('lang-ar', lang === 'ar');
    localStorage.setItem('tre-lang', lang);
    currentLang = lang;
  }

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      applyLang(currentLang === 'en' ? 'ar' : 'en');
    });
  }

  applyLang(currentLang);

  // ---------- "Is TRE right for you?" quiz ----------
  const quizCard = document.getElementById('tre-quiz');
  if (quizCard) {
    const quizSteps = Array.from(quizCard.querySelectorAll('[data-quiz-step]'));
    const quizDots = Array.from(quizCard.querySelectorAll('.quiz-dot'));
    const quizResult = quizCard.querySelector('[data-quiz-result]');

    function showQuizStep(stepNum) {
      quizSteps.forEach(step => {
        step.hidden = Number(step.dataset.quizStep) !== stepNum;
      });
      quizResult.hidden = true;
      quizDots.forEach(dot => {
        const dotStep = Number(dot.dataset.step);
        dot.classList.toggle('is-active', dotStep === stepNum);
        dot.classList.toggle('is-done', dotStep < stepNum);
      });
    }

    function showQuizResult() {
      quizSteps.forEach(step => { step.hidden = true; });
      quizResult.hidden = false;
      quizDots.forEach(dot => {
        dot.classList.add('is-done');
        dot.classList.remove('is-active');
      });
    }

    quizCard.addEventListener('click', (e) => {
      const answerBtn = e.target.closest('.quiz-answer');
      if (answerBtn) {
        const currentStep = answerBtn.closest('[data-quiz-step]');
        const stepNum = Number(currentStep.dataset.quizStep);
        if (stepNum < quizSteps.length) {
          showQuizStep(stepNum + 1);
        } else {
          showQuizResult();
        }
        return;
      }
      if (e.target.closest('.quiz-restart')) {
        showQuizStep(1);
      }
    });

    showQuizStep(1);
  }

  // ---------- Pricing mode toggle (In-Person / Online) ----------
  const priceToggle = document.getElementById('price-mode-toggle');
  if (priceToggle) {
    const modeButtons = Array.from(priceToggle.querySelectorAll('[data-mode]'));
    const modePanels = Array.from(document.querySelectorAll('[data-mode-panel]'));
    function setMode(mode) {
      modeButtons.forEach(btn => btn.classList.toggle('is-active', btn.dataset.mode === mode));
      modePanels.forEach(panel => { panel.hidden = panel.dataset.modePanel !== mode; });
    }
    priceToggle.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-mode]');
      if (btn) setMode(btn.dataset.mode);
    });
    setMode('in-person');
  }
})();
