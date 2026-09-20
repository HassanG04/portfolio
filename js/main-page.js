(function () {
  'use strict';

  const data = window.PORTFOLIO_DATA;
  const components = window.PORTFOLIO_COMPONENTS;
  if (!data || !components) return;

  const renderers = {
    intro: () => components.renderProjectCards('MAIN', { variant: 'intro', featuredOnly: true, limit: 3 }),
    services: () => components.renderServiceCards('MAIN'),
    experience: () => components.renderExperienceCards('MAIN'),
    credentials: () => components.renderCredentialCards('MAIN', '', 3),
    projects: () => components.renderProjectCards('MAIN'),
    skills: () => data.main.skills.map(skill => components.renderTechTag(skill)).join(''),
    activity: () => components.renderActivity('')
  };

  Object.entries(renderers).forEach(([name, render]) => {
    const target = document.querySelector(`[data-portfolio-render="${name}"]`);
    if (target) target.innerHTML = render();
  });
}());
