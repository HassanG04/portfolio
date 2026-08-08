document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('[data-header]');
  const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  document.querySelector('[data-year]').textContent = new Date().getFullYear();

  const revealTargets = document.querySelectorAll(
    '.section-header, .project-card, .experience-card, .education-card, .capability-grid article, .learning-panel'
  );

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealTargets.forEach((element) => element.setAttribute('data-reveal', ''));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealTargets.forEach((element) => observer.observe(element));
  }
});
