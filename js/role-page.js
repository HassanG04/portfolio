/* Thin entry point: all section markup is owned by portfolio-components.js. */
(function () {
  'use strict';
  const components = window.PORTFOLIO_COMPONENTS;
  const root = document.getElementById('portfolioPageRoot');
  if (!components || !root) return;
  root.innerHTML = components.renderPage(document.body.dataset.role, '../');
  document.querySelectorAll('.navbar-brand, .navbar-nav .nav-link[href="#home"], .portfolio-menu-mobile-nav .nav-link[href="#home"]').forEach(link => {
    link.setAttribute('href', '../');
    link.setAttribute('aria-label', 'Open the main portfolio home page');
  });
}());
