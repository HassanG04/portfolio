(function () {
  'use strict';

  const data = window.PORTFOLIO_DATA;
  if (!data) throw new Error('portfolio-data.js must load before portfolio-components.js');

  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);

  const asset = (root, file) => `${root || ''}images/${file}`;
  const repoUrl = repo => `https://github.com/HassanG04/${repo}`;
  const delayClass = index => `delay-${(index % 3) + 1}`;
  const techTone = value => {
    const tag = String(value).toLowerCase();
    if (/sql|database|schema|pipeline|integration/.test(tag)) return 'cyan';
    if (/pytorch|keras|xgboost|optuna|javascript|html|css/.test(tag)) return 'amber';
    if (/opencv|vision|validation|quality|metric|statistic/.test(tag)) return 'green';
    if (/transform|bert|nlp|faiss|shap|explain|language/.test(tag)) return 'pink';
    if (/python|pandas|flask|django|scikit|api/.test(tag)) return 'blue';
    return 'purple';
  };
  const renderTechTag = (tag, extraClass = '') => `<span class="${extraClass ? `${extraClass} ` : ''}tech-tag tech-tag--${techTone(tag)} interactable">${escapeHtml(tag)}</span>`;
  const formatMonth = value => {
    const [year, month] = String(value).split('-').map(Number);
    if (!Number.isFinite(year) || !Number.isFinite(month)) return '';
    return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1));
  };

  function projectMedia(project, assetRoot, context) {
    if (project.image) {
      return `<img src="${asset(assetRoot, project.image)}" alt="${escapeHtml(project.title)} project preview" loading="lazy" decoding="async" />`;
    }
    const tone = project.artTone || context.toLowerCase();
    return `<div class="result-card-art project-visual project-visual--${escapeHtml(tone)}" aria-hidden="true"><span class="project-visual-icon"><i class="fas ${escapeHtml(project.icon || 'fa-code')}"></i></span><span class="project-visual-label"><small>${escapeHtml(project.artLabel || `${context} portfolio`)}</small>${escapeHtml(project.title)}</span></div>`;
  }

  function renderServiceCards(roleKey) {
    return data.forRole(data.services, roleKey).map((service, index) => `
      <div class="col-md-6 col-xl-4 reveal ${delayClass(index)}">
        <article class="skill-card premium-card" data-card-kind="service">
          <span class="service-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
          <div class="skill-icon${service.tone ? ` skill-icon--${escapeHtml(service.tone)}` : ''}"><i class="fas ${escapeHtml(service.icon)}" aria-hidden="true"></i></div>
          <h5>${escapeHtml(service.title)}</h5>
          <p>${escapeHtml(service.copy)}</p>
          <div class="tag-row">${service.tags.map(tag => renderTechTag(tag, 'stag')).join('')}</div>
        </article>
      </div>`).join('');
  }

  function renderProjectCards(roleKey, options = {}) {
    const context = roleKey || 'MAIN';
    const projects = data.forRole(data.projects, context)
      .map(project => data.projectView(project, context))
      .filter(project => !options.featuredOnly || project.featured)
      .slice(0, options.limit || Number.POSITIVE_INFINITY);

    return projects.map((project, index) => {
      const media = projectMedia(project, options.assetRoot || '', context);
      if (options.variant === 'intro') {
        return `
          <div class="col-md-6 col-xl-4 reveal ${delayClass(index)}">
            <a class="intro-project-link interactable" href="${repoUrl(project.repo)}" target="_blank" rel="noopener" aria-label="View ${escapeHtml(project.title)} on GitHub">
              <article class="intro-project-card premium-card"><div class="intro-project-media">${media}</div><div class="intro-project-body"><span class="intro-project-type">${escapeHtml(project.type)}</span><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.copy)}</p><span class="intro-project-cta"><i class="fab fa-github" aria-hidden="true"></i> View public repository</span></div></article>
            </a>
          </div>`;
      }

      const study = context === 'MAIN'
        ? `<p><span>Challenge</span>${escapeHtml(project.challenge || project.copy)}</p><p><span>Approach</span>${escapeHtml(project.approach || 'Review the public implementation and documented workflow.')}</p><p class="case-outcome"><span>Outcome</span>${escapeHtml(project.outcome || 'Public implementation and documentation available for review.')}</p>`
        : `<p><span>Focus</span>${escapeHtml(project.copy)}</p><p class="case-outcome"><span>Evidence</span>Public implementation and project documentation available for review.</p>`;
      return `
        <div class="col-md-6 col-xl-4 reveal ${delayClass(index)}">
          <a class="portfolio-case-link interactable" href="${repoUrl(project.repo)}" target="_blank" rel="noopener" aria-label="View ${escapeHtml(project.title)} on GitHub">
            <article class="result-card portfolio-case-card premium-card">${media}<div class="result-card-body"><span class="result-metric">${escapeHtml(project.type)}</span><h3>${escapeHtml(project.title)}</h3><div class="case-study-copy">${study}</div><span class="case-link"><i class="fab fa-github" aria-hidden="true"></i> Open repository</span></div></article>
          </a>
        </div>`;
    }).join('');
  }

  function renderCredentialCards(roleKey, assetRoot = '', limit = 3) {
    return data.forRole(data.credentials, roleKey).slice(0, limit).map((credential, index) => {
      const imageClass = credential.imageClass ? ` ${credential.imageClass}` : '';
      const src = asset(assetRoot, credential.image);
      return `
        <div class="col-md-6 col-xl-4 reveal ${delayClass(index)}">
          <article class="credential-card premium-card">
            <button class="certificate-preview-trigger interactable" type="button" data-certificate-preview data-certificate-src="${src}" data-certificate-title="${escapeHtml(credential.title)}" data-certificate-alt="${escapeHtml(credential.title)} certificate" aria-label="Inspect the ${escapeHtml(credential.title)} certificate">
              <img class="credential-card-image${imageClass}" src="${src}" alt="${escapeHtml(credential.title)} certificate" loading="lazy" decoding="async" />
              <span class="certificate-preview-cue"><i class="fas fa-magnifying-glass-plus" aria-hidden="true"></i> Inspect certificate</span>
            </button>
            <div><span>${escapeHtml(credential.type)}</span><h3>${escapeHtml(credential.title)}</h3><p>${escapeHtml(credential.copy)}</p></div>
          </article>
        </div>`;
    }).join('');
  }

  function renderExperienceCards(roleKey) {
    const profession = data.professions[roleKey];
    return data.forRole(data.experiences, roleKey).map(experience => {
      const title = experience.id === 'independent' && profession ? `Independent ${profession.fullLabel || profession.label} Projects` : experience.title;
      return `<article class="experience-card premium-card"><div class="experience-icon"><i class="fas ${escapeHtml(experience.icon)}" aria-hidden="true"></i></div><div><span class="experience-type">${escapeHtml(experience.type)}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(experience.copy)}</p></div></article>`;
    }).join('');
  }

  function renderProfileId(person) {
    const linked = Boolean(person.linkedin);
    const content = `<span class="profile-id-avatar" aria-hidden="true"><i class="${linked ? 'fab fa-linkedin-in' : 'fas fa-user'}"></i></span><strong class="profile-id-name">${escapeHtml(person.name)}</strong>${person.role ? `<span class="profile-id-role">${escapeHtml(person.role)}</span>` : ''}<span class="profile-id-description">${escapeHtml(person.description || 'No description')}</span><span class="profile-id-action">${linked ? 'View LinkedIn profile <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>' : 'Profile not shared'}</span>`;
    return linked
      ? `<a class="profile-id-card interactable is-linked" href="${escapeHtml(person.linkedin)}" target="_blank" rel="noopener" aria-label="Open ${escapeHtml(person.name)}'s LinkedIn profile">${content}</a>`
      : `<div class="profile-id-card">${content}</div>`;
  }

  function renderTeammates(teammates) {
    if (!teammates.length) return '<div class="ecpc-construction-note"><i class="fas fa-sparkles" aria-hidden="true"></i><strong>The next team story is still ahead.</strong><span>This card will be updated after the next contest.</span></div>';
    return teammates.map(teammate => renderProfileId({ ...teammate, name: `Eng. ${teammate.name}`, role: 'ECPC teammate' })).join('');
  }

  function renderEcpc(assetRoot) {
    const slides = data.activity.ecpc.map((slide, index) => {
      const active = index === 0;
      const future = !slide.teammates.length;
      const photoWidth = Number(slide.imageWidth) || 3;
      const photoHeight = Number(slide.imageHeight) || 2;
      const front = future
        ? `<div class="flip-card ecpc-deck-card" data-flip-card><div class="flip-card-inner"><div class="flip-card-face flip-card-front ecpc-future-card"><div class="ecpc-future-aura" aria-hidden="true"></div><img class="ecpc-future-logo" src="${asset(assetRoot, slide.image)}" alt="${escapeHtml(slide.alt)}" loading="lazy" decoding="async" /><span class="ecpc-photo-number">${String(index + 1).padStart(2, '0')} / ${String(data.activity.ecpc.length).padStart(2, '0')}</span><span class="ecpc-future-label">Next contest</span><button class="flip-card-hit-area interactable" type="button" data-flip-toggle aria-expanded="false" aria-label="Track progress for the next ECPC contest"></button></div><div class="flip-card-face flip-card-back ecpc-progress-back" aria-hidden="true" inert><span class="ecpc-progress-kicker">THE NEXT CHAPTER</span><h3>Track Progress?</h3><p>Follow my practice, contests, and rating on Codeforces.</p><a class="ecpc-progress-link interactable" href="${escapeHtml(slide.progressUrl)}" target="_blank" rel="noopener">Hassan_G04 <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i></a><small>Tap the card to return</small></div></div></div>`
        : `<div class="flip-card ecpc-deck-card profile-flip" data-flip-card><div class="flip-card-inner"><div class="flip-card-face flip-card-front flip-card-media ecpc-card-front"><img class="flip-card-image" src="${asset(assetRoot, slide.image)}" width="${photoWidth}" height="${photoHeight}" alt="${escapeHtml(slide.alt)}" loading="lazy" decoding="async" /><button class="flip-card-hit-area interactable" type="button" data-flip-toggle aria-expanded="false" aria-label="Meet the team from ${escapeHtml(slide.title)}"></button><span class="ecpc-photo-number">${String(index + 1).padStart(2, '0')} / ${String(data.activity.ecpc.length).padStart(2, '0')}</span><span class="flip-card-prompt" aria-hidden="true"><i class="fas fa-users"></i><span>Meet the team</span></span></div><div class="flip-card-face flip-card-back ecpc-card-back profile-id-back" aria-hidden="true" inert><span class="profile-back-label"><i class="fab fa-linkedin-in" aria-hidden="true"></i> Meet the Team!</span><div class="profile-id-grid">${renderTeammates(slide.teammates)}</div><button class="profile-return interactable" type="button"><i class="fas fa-rotate-left" aria-hidden="true"></i> Back to photo</button></div></div></div>`;
      return `<article class="ecpc-slide${active ? ' is-active' : ''}${index % 2 ? ' ecpc-slide--reverse' : ''}${future ? ' ecpc-future-slide' : ''}" style="--ecpc-photo-ratio:${photoWidth} / ${photoHeight}" data-ecpc-slide="${index}" aria-label="${escapeHtml(slide.title)}" aria-hidden="${String(!active)}"${active ? '' : ' inert'}>${front}<div class="ecpc-slide-caption"><span class="ecpc-chapter">${escapeHtml(slide.chapter)}</span><h3>${escapeHtml(slide.title)}</h3><p>${escapeHtml(slide.description)}</p></div></article>`;
    }).join('');
    const indicators = data.activity.ecpc.map((_, index) => `<button type="button"${index === 0 ? ' class="is-active" aria-current="true"' : ''} data-ecpc-index="${index}" aria-label="Show ECPC chapter ${index + 1}">${index + 1}</button>`).join('');
    return `
      <section class="ecpc-showcase activity-feature-card premium-card reveal" aria-labelledby="activity-ecpc-heading">
        <div class="ecpc-cover"><div><span class="ecpc-kicker"><i class="fas fa-code" aria-hidden="true"></i> ECPC journey</span><h3>Built by teamwork.</h3></div><div class="ecpc-brand-emblem"><img class="ecpc-brand-mark" src="${asset(assetRoot, 'ecpc_logo.png')}" alt="Egyptian Collegiate Programming Contest" loading="lazy" decoding="async" /></div></div>
        <div class="ecpc-body"><div id="ecpcDeck" class="ecpc-deck" role="region" aria-roledescription="carousel" aria-label="Hassan's ECPC experiences" tabindex="0"><div class="ecpc-deck-stage"><div class="ecpc-slider-track" aria-live="polite">${slides}</div></div><div class="ecpc-navigation"><button class="ecpc-deck-arrow" id="ecpcPrev" type="button" aria-label="Previous ECPC story"><i class="fas fa-arrow-left" aria-hidden="true"></i></button><div class="ecpc-deck-indicators" aria-label="Choose an ECPC chapter">${indicators}</div><button class="ecpc-deck-arrow" id="ecpcNext" type="button" aria-label="Next ECPC story"><i class="fas fa-arrow-right" aria-hidden="true"></i></button></div></div></div>
      </section>`;
  }

  function renderDepiCard(assetRoot) {
    const depi = data.activity.depi;
    return `
      <section class="depi-learning-section reveal" aria-labelledby="depi-learning-heading">
        <article class="depi-progress-card activity-feature-card premium-card">
          <div class="depi-visual-flip flip-card profile-flip" data-flip-card>
            <div class="flip-card-inner">
              <div class="depi-progress-visual flip-card-face flip-card-front">
                <span class="depi-progress-icon"><img src="${asset(assetRoot, depi.image)}" alt="" loading="eager" decoding="async" /></span><strong>DEPI</strong><small>Learning journey</small>
                <button class="flip-card-hit-area interactable" type="button" data-flip-toggle aria-expanded="false" aria-label="Show special thanks for the DEPI Data Engineering journey"></button>
                <span class="flip-card-prompt depi-flip-prompt" aria-hidden="true"><i class="fas fa-rotate" aria-hidden="true"></i><span>Special thanks</span></span>
              </div>
              <div class="depi-visual-back profile-id-back flip-card-face flip-card-back" aria-hidden="true" inert>
                <span class="profile-back-label">Special Thanks</span>
                ${renderProfileId({ ...depi.instructor, role: 'DEPI · Data Engineering Instructor', description: depi.instructor.message })}
                <button class="profile-return interactable" type="button"><i class="fas fa-rotate-left" aria-hidden="true"></i> Back to DEPI</button>
              </div>
            </div>
          </div>
          <div class="depi-progress-content"><span class="depi-progress-eyebrow">Digital Egypt Pioneers Initiative</span><span class="depi-progress-title-row"><span class="depi-progress-title" id="depi-learning-heading">${escapeHtml(depi.title)}</span></span><span class="depi-progress-description">${escapeHtml(depi.description)}</span><span class="depi-progress-skills" aria-label="Learning areas">${depi.skills.map(skill => renderTechTag(skill)).join('')}</span><span class="depi-learning-progress" data-learning-progress data-learning-start="${depi.start}" data-learning-end="${depi.end}"><span class="depi-learning-meta"><strong data-learning-label>Learning</strong><span data-learning-value>0%</span></span><span class="depi-learning-track" role="progressbar" aria-label="DEPI learning progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span data-learning-fill></span></span><span class="depi-learning-dates"><span>${formatMonth(depi.start)}</span><span>${formatMonth(depi.end)}</span></span></span><a class="depi-website-link interactable" href="${depi.website}" target="_blank" rel="noopener" aria-label="Visit Hassan's DEPI progress website"><i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i><span>Visit progress site</span></a></div>
        </article>
      </section>`;
  }

  function renderSoftSkills(assetRoot) {
    const soft = data.activity.softSkills;
    return `
      <section class="soft-skills-section activity-feature-card premium-card reveal" aria-labelledby="soft-skills-heading">
        <div class="soft-skills-flip flip-card profile-flip" id="softSkillsFlip" data-flip-card><div class="soft-skills-flip-inner flip-card-inner"><div class="soft-skills-photo soft-skills-face flip-card-face flip-card-front flip-card-media"><img class="flip-card-image" src="${asset(assetRoot, soft.image)}" alt="Hassan with his DEPI soft skills class" loading="lazy" decoding="async" /><button class="flip-card-hit-area interactable" type="button" data-flip-toggle aria-expanded="false" aria-label="Meet Hassan's soft skills instructor"></button><span class="flip-card-prompt" aria-hidden="true"><i class="fas fa-chalkboard-user"></i><span>Meet the instructor</span></span><a class="soft-skills-book-tag interactable" href="${soft.website}" target="_blank" rel="noopener" aria-label="Visit the DEPI website"><span>DEPI Community</span><i class="fas fa-people-group" aria-hidden="true"></i></a></div><div class="soft-skills-back profile-id-back soft-skills-face flip-card-face flip-card-back" aria-hidden="true" inert><span class="profile-back-label"><i class="fab fa-linkedin-in" aria-hidden="true"></i> Meet the instructor</span>${renderProfileId(soft.instructor)}<button class="profile-return interactable" type="button"><i class="fas fa-rotate-left" aria-hidden="true"></i> Back to photo</button></div></div></div>
        <div class="soft-skills-copy"><span class="section-tag">Beyond technical skills</span><h2 id="soft-skills-heading">Soft Skills</h2><p>${escapeHtml(soft.copy)}</p></div>
      </section>`;
  }

  function renderActivity(assetRoot = '') {
    return `
      <header class="activity-section-heading section-anchor-heading reveal"><span class="section-tag">Teamwork &amp; growth</span><h1 class="section-heading">Activity</h1><p>Competition, continued learning, and the people who shaped how I solve problems and work with a team.</p></header>
      <section class="activity-journey-group activity-journey-group--ecpc" aria-labelledby="activity-ecpc-heading">
        <div class="activity-subsection-heading reveal"><span class="activity-subsection-number">01</span><div><span class="section-tag">Competitive programming</span><h2 id="activity-ecpc-heading">ECPC</h2><p>Four chapters from my collegiate problem-solving journey.</p></div></div>
        ${renderEcpc(assetRoot)}
      </section>
      <section class="activity-journey-group activity-journey-group--depi" aria-labelledby="activity-depi-heading">
        <div class="activity-subsection-heading reveal"><span class="activity-subsection-number">02</span><div><span class="section-tag">Learning journey</span><h2 id="activity-depi-heading">DEPI</h2><p>Technical growth and professional development from one connected program.</p></div></div>
        ${renderDepiCard(assetRoot)}
        ${renderSoftSkills(assetRoot)}
      </section>`;
  }

  window.PORTFOLIO_COMPONENTS = Object.freeze({
    escapeHtml,
    renderServiceCards,
    renderProjectCards,
    renderCredentialCards,
    renderExperienceCards,
    renderTechTag,
    renderActivity
  });
}());
