/* Thin entry point: all section markup is owned by portfolio-components.js. */
(function () {
  'use strict';
  const components = window.PORTFOLIO_COMPONENTS;
  const root = document.getElementById('portfolioPageRoot');
  if (!components || !root) return;
  root.innerHTML = components.renderPage('MAIN', '');
}());
