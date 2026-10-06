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
  const renderTechTag = (tag, extraClass = '') => `<span class="${extraClass ? `${extraClass} ` : ''}tech-tag tech-tag--${techTone(tag)} interactable" tabindex="0">${escapeHtml(tag)}</span>`;
  const renderFreelanceLinks = ({ variant = 'contact', assetRoot = '' } = {}) => {
    const profiles = Array.isArray(data.shared.freelanceProfiles) ? data.shared.freelanceProfiles : [];
    const classes = variant === 'social'
      ? 'social-btn freelance-profile-link freelance-profile-link--social interactable'
      : 'social-btn freelance-profile-link interactable';
    return profiles.map(profile => {
      const icon = profile.iconImage
        ? `<img src="${escapeHtml(asset(assetRoot, profile.iconImage))}" alt="" width="22" height="22" />`
        : `<i class="${escapeHtml(profile.iconClass || 'fas fa-briefcase')}" aria-hidden="true"></i>`;
      return `<a class="${classes}" href="${escapeHtml(profile.url)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(profile.label)}" aria-label="Open Hassan's ${escapeHtml(profile.label)} profile (new tab)">${icon}</a>`;
    }).join('');
  };
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

  function renderPortrait(assetRoot = '') {
    return `<div class="hero-img-wrap"><div class="hero-pointer-frame"><div class="hero-img-ring"><div class="hero-img-inner"><div class="hero-img-parallax"><img src="${asset(assetRoot, 'profile.jpg')}" alt="${escapeHtml(data.shared.name)}" fetchpriority="high" decoding="async" /></div></div></div><span class="hero-pointer-glow" aria-hidden="true"></span></div></div>`;
  }

  function renderAbout(roleKey, assetRoot = '') {
    const about = data.shared.about;
    return `<div class="section-anchor-heading reveal"><h2 class="section-heading">${escapeHtml(about.heading)}</h2><p>${escapeHtml(about.intro)}</p></div>
      <div class="about-editorial">
        <figure class="about-profile-panel premium-card reveal-left"><div class="profile-image-wrapper"><img src="${asset(assetRoot, 'profile.jpg')}" alt="Hassan Gebril" class="profile-image" loading="lazy" decoding="async" /></div><figcaption class="about-profile-copy">${escapeHtml(data.shared.name)}<span>${escapeHtml(data.shared.identity)}</span></figcaption></figure>
        <div class="about-prose reveal-right"><p>${escapeHtml(about.story)}</p><p>${escapeHtml(about.practice)}</p><div class="education-record"><img src="${asset(assetRoot, 'AASTMT_Logo.png')}" alt="AASTMT" loading="lazy" decoding="async" /><div><span class="record-label">Education</span><h3>${escapeHtml(about.education)}</h3><p>${escapeHtml(about.degree)}</p></div></div></div>
      </div><div class="experience-records reveal"><h3>Experience</h3><div class="experience-stack">${renderExperienceCards(roleKey)}</div></div>`;
  }

  function renderServiceCards(roleKey) {
    return data.forRole(data.services, roleKey).map((service, index) => `
      <div class="col-md-6 col-xl-4 reveal ${delayClass(index)}">
        <article class="skill-card premium-card" data-card-kind="service">
          <span class="service-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
          <h3>${escapeHtml(service.title)}</h3>
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

  function renderCertificateViewer() {
    return `<dialog class="certificate-viewer" id="certificateViewer" aria-labelledby="certificateViewerTitle"><div class="certificate-viewer-panel"><div class="certificate-viewer-head"><div><span>Certificate inspector</span><h2 id="certificateViewerTitle">Certificate</h2></div><button class="certificate-viewer-close interactable" id="certificateViewerClose" type="button" aria-label="Close certificate preview"><i class="fas fa-xmark" aria-hidden="true"></i></button></div><div class="certificate-inspector-tools" aria-label="Certificate zoom controls"><button type="button" class="interactable" data-certificate-zoom="out" aria-label="Zoom out">−</button><output id="certificateZoomLevel" aria-live="polite">100% · Fit</output><button type="button" class="interactable" data-certificate-zoom="in" aria-label="Zoom in">+</button><button type="button" class="interactable" data-certificate-zoom="reset" aria-label="Reset certificate to fit">Fit</button><span id="certificateZoomHelp">Tap to zoom. Drag to move.</span></div><div class="certificate-viewer-media" tabindex="0" aria-label="Certificate image inspector" aria-describedby="certificateZoomHelp"><img id="certificateViewerImage" alt="" draggable="false" /></div></div></dialog>`;
  }

  function renderCredentialCards(roleKey, assetRoot = '', limit = 3) {
    return data.forRole(data.credentials, roleKey).slice(0, limit).map((credential, index) => {
      const imageClass = credential.imageClass ? ` ${credential.imageClass}` : '';
      const src = asset(assetRoot, credential.image);
      const styleAttr = (credential.imageWidth && credential.imageHeight) ? ` style="--cert-ratio: ${credential.imageWidth} / ${credential.imageHeight};"` : '';
      return `
        <div class="col-md-6 col-xl-4 reveal ${delayClass(index)}">
          <article class="credential-card premium-card">
            <button class="certificate-preview-trigger interactable" type="button" data-certificate-preview data-certificate-src="${src}" data-certificate-title="${escapeHtml(credential.title)}" data-certificate-alt="${escapeHtml(credential.title)} certificate" aria-label="Inspect the ${escapeHtml(credential.title)} certificate">
              <img class="credential-card-image${imageClass}" src="${src}" alt="${escapeHtml(credential.title)} certificate" loading="lazy" decoding="async"${styleAttr} />
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

  function renderProfileId(person, assetRoot = '', current = false) {
    if (typeof person === 'string') person = data.people[person];
    const linked = Boolean(person.linkedin);
    const names = person.name.replace(/^(?:Eng\.?|Professor)\s+/i, '').trim().split(/\s+/);
    const initials = [names[0], names.length > 1 ? names[names.length - 1] : ''].map(name => name.charAt(0)).join('').toUpperCase();
    const portrait = person.image
      ? `<img src="${asset(assetRoot, person.image)}" alt="${escapeHtml(person.name)}" loading="lazy" decoding="async" />`
      : `<span aria-hidden="true">${escapeHtml(initials)}</span>`;
    const content = `<span class="profile-id-heading"><strong class="profile-id-name">${escapeHtml(person.name)}</strong>${person.role ? `<span class="profile-id-role">${escapeHtml(person.role)}</span>` : ''}</span><span class="profile-id-avatar">${portrait}</span><span class="profile-id-description">${escapeHtml(person.badgeDescription || person.description || '')}</span><span class="profile-id-action">${linked ? 'View LinkedIn profile <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>' : 'Profile not shared'}</span>`;
    return linked
      ? `<a class="profile-id-card interactable is-linked${current ? ' is-current-profile' : ''}" href="${escapeHtml(person.linkedin)}" target="_blank" rel="noopener" aria-label="Open ${escapeHtml(person.name)}'s LinkedIn profile">${content}</a>`
      : `<div class="profile-id-card${current ? ' is-current-profile' : ''}">${content}</div>`;
  }

  function renderTeammates(teammates, assetRoot = '') {
    if (!teammates.length) return '<div class="ecpc-construction-note"><i class="fas fa-sparkles" aria-hidden="true"></i><strong>The next team story is still ahead.</strong><span>This card will be updated after the next contest.</span></div>';
    return teammates.map((id, index) => {
      const person = data.people[id];
      return renderProfileId({ ...person, name: `Eng. ${person.name}` }, assetRoot, index === 0);
    }).join('');
  }

  function renderEcpc(assetRoot) {
    const slides = data.activity.ecpc.map((slide, index) => {
      const active = index === 0;
      const future = !slide.teammates.length;
      const photoWidth = Number(slide.imageWidth) || 3;
      const photoHeight = Number(slide.imageHeight) || 2;
      const front = future
        ? `<div class="flip-card ecpc-deck-card profile-flip" data-flip-card data-flip-grab><div class="flip-card-inner"><div class="flip-card-face flip-card-front ecpc-future-card"><div class="ecpc-future-aura" aria-hidden="true"></div><img class="ecpc-future-logo" src="${asset(assetRoot, slide.image)}" alt="${escapeHtml(slide.alt)}" loading="lazy" decoding="async" /><span class="ecpc-photo-number">${String(index + 1).padStart(2, '0')} / ${String(data.activity.ecpc.length).padStart(2, '0')}</span><span class="ecpc-future-label">Next contest</span><button class="flip-card-hit-area interactable" type="button" data-flip-toggle aria-expanded="false" aria-label="Track progress for the next ECPC contest"></button></div><div class="flip-card-face flip-card-back profile-id-back" aria-hidden="true" inert><span class="profile-back-label"><i class="fas fa-chart-bar" aria-hidden="true"></i> Codeforces Profile</span><a class="profile-id-card interactable is-linked is-current-profile" href="${escapeHtml(slide.progressUrl)}" target="_blank" rel="noopener" aria-label="Open Hassan Gebril's Codeforces profile" style="--profile-rgb: 139,92,246;"><span class="profile-id-heading"><strong class="profile-id-name">Hassan Gebril</strong><span class="profile-id-role">AI Engineer</span></span><span class="profile-id-avatar"><img src="${asset(assetRoot, 'profile.jpg')}" alt="Hassan Gebril" loading="lazy" decoding="async" /></span><span class="profile-id-description">Hassan_G04</span><span class="profile-id-action">View Codeforces profile <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i></span></a><button class="profile-return interactable" type="button"><i class="fas fa-rotate-left" aria-hidden="true"></i> Back to photo</button></div></div></div>`
        : `<div class="flip-card ecpc-deck-card profile-flip" data-flip-card data-flip-grab><div class="flip-card-inner"><div class="flip-card-face flip-card-front flip-card-media ecpc-card-front"><img class="flip-card-image" src="${asset(assetRoot, slide.image)}" width="${photoWidth}" height="${photoHeight}" alt="${escapeHtml(slide.alt)}" loading="lazy" decoding="async" /><button class="flip-card-hit-area interactable" type="button" data-flip-toggle aria-expanded="false" aria-label="Meet the team from ${escapeHtml(slide.title)}"></button><span class="ecpc-photo-number">${String(index + 1).padStart(2, '0')} / ${String(data.activity.ecpc.length).padStart(2, '0')}</span><span class="flip-card-prompt" aria-hidden="true"><i class="fas fa-users"></i><span>Meet the team</span></span></div><div class="flip-card-face flip-card-back ecpc-card-back profile-id-back" aria-hidden="true" inert><span class="profile-back-label"><i class="fab fa-linkedin-in" aria-hidden="true"></i> Meet the Team!</span><div class="profile-id-grid" data-profile-deck>${renderTeammates(slide.teammates, assetRoot)}</div><div class="profile-deck-controls" aria-label="Teammates"><button type="button" class="profile-prev interactable" aria-label="Previous teammate"><i class="fas fa-chevron-left" aria-hidden="true"></i></button><output class="profile-deck-count" aria-live="polite">1 / ${slide.teammates.length}</output><button type="button" class="profile-next interactable" aria-label="Next teammate"><i class="fas fa-chevron-right" aria-hidden="true"></i></button></div><button class="profile-return interactable" type="button"><i class="fas fa-rotate-left" aria-hidden="true"></i> Back to photo</button></div></div></div>`;
      return `<article class="ecpc-slide${active ? ' is-active' : ''}${index % 2 ? ' ecpc-slide--reverse' : ''}${future ? ' ecpc-future-slide' : ''}" style="--ecpc-photo-ratio:${photoWidth} / ${photoHeight}" data-ecpc-slide="${index}" aria-label="${escapeHtml(slide.title)}" aria-hidden="${String(!active)}"${active ? '' : ' inert'}>${front}<div class="ecpc-slide-caption"><h3>${escapeHtml(slide.title)}</h3><p>${escapeHtml(slide.description)}</p></div></article>`;
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
          <div class="depi-visual-flip flip-card profile-flip" data-flip-card style="--activity-photo-ratio:${depi.imageWidth} / ${depi.imageHeight}">
            <div class="flip-card-inner">
              <div class="depi-progress-visual flip-card-face flip-card-front">
                <span class="depi-progress-icon"><img src="${asset(assetRoot, depi.image)}" alt="Digital Egypt Pioneers Initiative" width="${depi.imageWidth}" height="${depi.imageHeight}" loading="eager" decoding="async" /></span><strong>DEPI</strong><small>Learning journey</small>
                <button class="flip-card-hit-area interactable" type="button" data-flip-toggle aria-expanded="false" aria-label="Show special thanks for the DEPI Data Engineering journey"></button>
                <span class="flip-card-prompt depi-flip-prompt" aria-hidden="true"><i class="fas fa-rotate" aria-hidden="true"></i><span>Special thanks</span></span>
              </div>
              <div class="depi-visual-back profile-id-back flip-card-face flip-card-back" aria-hidden="true" inert>
                <span class="profile-back-label">Special Thanks</span>
                ${renderProfileId(depi.instructor, assetRoot)}
                <button class="profile-return interactable" type="button"><i class="fas fa-rotate-left" aria-hidden="true"></i> Back to DEPI</button>
              </div>
            </div>
          </div>
<div class="depi-progress-content"><span class="depi-progress-title-row"><span class="depi-progress-title" id="depi-learning-heading">${escapeHtml(depi.title)}</span></span><span class="depi-progress-description">${escapeHtml(depi.description)}</span><span class="depi-progress-skills" aria-label="Learning areas">${depi.skills.map(skill => renderTechTag(skill)).join('')}</span><span class="depi-learning-progress" data-learning-progress data-learning-start="${depi.start}" data-learning-end="${depi.end}"><span class="depi-learning-meta"><strong data-learning-label>Learning</strong><span data-learning-value>0%</span></span><span class="depi-learning-track" role="progressbar" aria-label="DEPI learning progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span data-learning-fill></span></span><span class="depi-learning-dates"><span>${formatMonth(depi.start)}</span><span>${formatMonth(depi.end)}</span></span></span><a class="depi-website-link interactable" href="${depi.website}" target="_blank" rel="noopener" aria-label="Visit Hassan's DEPI progress website"><i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i><span>Visit progress site</span></a></div>
        </article>
      </section>`;
  }

  function renderSoftSkills(assetRoot) {
    const soft = data.activity.softSkills;
    return `
      <section class="soft-skills-section activity-feature-card premium-card reveal" aria-labelledby="soft-skills-heading">
        <div class="soft-skills-flip flip-card profile-flip" id="softSkillsFlip" data-flip-card style="--activity-photo-ratio:${soft.imageWidth} / ${soft.imageHeight}"><div class="soft-skills-flip-inner flip-card-inner"><div class="soft-skills-photo soft-skills-face flip-card-face flip-card-front flip-card-media"><img class="flip-card-image" src="${asset(assetRoot, soft.image)}" width="${soft.imageWidth}" height="${soft.imageHeight}" alt="Hassan with his DEPI soft skills class" loading="lazy" decoding="async" /><button class="flip-card-hit-area interactable" type="button" data-flip-toggle aria-expanded="false" aria-label="Meet Hassan's soft skills instructor"></button><span class="flip-card-prompt" aria-hidden="true"><i class="fas fa-chalkboard-user"></i><span>Meet the instructor</span></span><a class="soft-skills-book-tag interactable" href="${soft.website}" target="_blank" rel="noopener" aria-label="Visit the DEPI website"><span>DEPI Community</span><i class="fas fa-people-group" aria-hidden="true"></i></a></div><div class="soft-skills-back profile-id-back soft-skills-face flip-card-face flip-card-back" aria-hidden="true" inert><span class="profile-back-label"><i class="fab fa-linkedin-in" aria-hidden="true"></i> Meet the instructor</span>${renderProfileId(soft.instructor, assetRoot)}<button class="profile-return interactable" type="button"><i class="fas fa-rotate-left" aria-hidden="true"></i> Back to photo</button></div></div></div>
        <div class="soft-skills-copy"><h2 id="soft-skills-heading">Soft Skills</h2><p>${escapeHtml(soft.copy)}</p></div>
      </section>`;
  }

  function renderActivity(assetRoot = '') {
    return `
      <header class="activity-section-heading section-anchor-heading reveal"><h1 class="section-heading">Activity</h1><p>Competition, continued learning, and the people who shaped how I solve problems and work with a team.</p></header>
      <section class="activity-journey-group activity-journey-group--ecpc" aria-labelledby="activity-ecpc-heading">
        <div class="activity-subsection-heading reveal"><span class="activity-subsection-number">01</span><div><h2 id="activity-ecpc-heading">ECPC</h2><p>Four chapters from my collegiate problem-solving journey.</p></div></div>
        ${renderEcpc(assetRoot)}
      </section>
      <section class="activity-journey-group activity-journey-group--depi" aria-labelledby="activity-depi-heading">
        <div class="activity-subsection-heading reveal"><span class="activity-subsection-number">02</span><div><h2 id="activity-depi-heading">DEPI</h2><p>Technical growth and professional development from one connected program.</p></div></div>
        ${renderDepiCard(assetRoot)}
        ${renderSoftSkills(assetRoot)}
      </section>`;
  }

  function pageContext(roleKey = 'MAIN', assetRoot = '') {
    const role = data.professions[roleKey];
    return { roleKey, role, assetRoot, main: !role, copy: data.pageCopy };
  }

  function renderHero(context) {
    const { roleKey, role, assetRoot, main, copy } = context;
    const heading = main ? `${escapeHtml(copy.heroLines[0])}<br><span>${escapeHtml(copy.heroLines[1])}</span>` : escapeHtml(role.headline);
    const focus = main
      ? `<div class="typewriter-wrap"><span class="typewriter-prefix">My focus: </span><span class="typewriter-text" id="typewriter-text" data-words="${escapeHtml(copy.typewriter.join('|'))}">${escapeHtml(copy.typewriter[0])}</span><span class="typewriter-cursor"></span></div>`
      : `<div class="profession-statement"><span>Portfolio focus</span><strong>${escapeHtml(role.fullLabel || role.label)}</strong></div>`;
    return `<header class="hero-section editorial-hero${main ? '' : ' role-hero'}" id="home" data-scroll-label="Cover"><div class="container hero-composition"><div class="hero-copy">
      <p class="hero-byline">${escapeHtml(data.shared.name)} <span>${escapeHtml(roleKey === 'ML' ? role.label : data.shared.identity)}</span></p>
      <h1 class="hero-title">${heading}</h1>${focus}<p class="hero-desc">${escapeHtml(main ? data.shared.usp : role.description)}</p>
      <div class="hero-actions"><a href="#introduction" class="btn btn-primary${main ? '' : ' interactable'}">Explore the work <i class="fas fa-arrow-right ms-2" aria-hidden="true"></i></a><a href="${data.shared.resumes[roleKey]}" target="_blank" rel="noopener" class="btn btn-cv${main ? '' : ' interactable'}"><i class="fas fa-file-alt" aria-hidden="true"></i> View ${main ? '' : `${escapeHtml(role.short)} `}Résumé</a></div>
      <p class="hero-availability">${escapeHtml(copy.availability)}</p><div class="${main ? 'hero-social' : 'hero-socials'}">${renderSocialLinks(assetRoot, true)}</div>
      </div><figure class="hero-portrait" data-portfolio-render="portrait">${renderPortrait(assetRoot)}</figure></div></header>`;
  }

  function renderSocialLinks(assetRoot = '', freelance = false) {
    const handle = data.shared.discordHandle;
    return `<a href="${data.shared.linkedin}" target="_blank" rel="noopener" class="social-btn linkedin interactable" aria-label="LinkedIn"><i class="fab fa-linkedin-in" aria-hidden="true"></i></a>${freelance ? `<span class="freelance-links-slot" data-portfolio-render="hero-freelance-links">${renderFreelanceLinks({ variant:'social', assetRoot })}</span>` : ''}<a href="${data.shared.github}" target="_blank" rel="noopener" class="social-btn github interactable" aria-label="GitHub"><i class="fab fa-github" aria-hidden="true"></i></a><button type="button" class="social-btn discord interactable" aria-label="Opens Discord and copies ${escapeHtml(handle)}" title="Opens Discord and copies ${escapeHtml(handle)}"><i class="fab fa-discord" aria-hidden="true"></i> Add me on Discord</button>`;
  }

  function renderSectionHeading(title, copy, extra = '', paragraphClass = '') {
    return `<div class="section-anchor-heading${extra} reveal"><h2 class="section-heading">${escapeHtml(title)}</h2><p${paragraphClass ? ` class="${paragraphClass}"` : ''}>${escapeHtml(copy)}</p></div>`;
  }

  function renderIntroduction({ roleKey, role, assetRoot, main, copy }) {
    return `<section id="introduction" class="section-wrap one-page-section editorial-section" data-scroll-label="Introduction">`
      + `<div class="container">${renderSectionHeading(copy.introductionTitle, main ? copy.introduction : role.promise)}`
      + `<div class="row g-4 intro-project-grid" data-portfolio-render="intro">`
      + renderProjectCards(roleKey, { variant: 'intro', featuredOnly: main, limit: 3, assetRoot })
      + `</div></div></section>`;
  }

  function renderServices({ roleKey, role, main, copy }) {
    return `<section id="services" class="section-wrap one-page-section editorial-section" data-scroll-label="Services">`
      + `<div class="container">`
      + renderSectionHeading(copy.servicesTitle, main ? copy.services : role.promise, ' service-section-heading', main ? 'section-sub' : '')
      + `<div class="row g-4 service-card-grid" data-portfolio-render="services">${renderServiceCards(roleKey)}</div>`
      + `</div></section>`;
  }

  function renderToolkit({ role, main, copy }) {
    const description = main ? copy.toolkit : `Tools selected for ${(role.fullLabel || role.label).toLowerCase()} work, with the implementation available to inspect.`;
    const skills = main ? data.main.skills : role.skills;
    return `<section class="section-wrap pt-0 editorial-section"><div class="container"><div class="toolkit-panel reveal">`
      + `<div><h2 class="section-heading mb-2">${escapeHtml(copy.toolkitTitle)}</h2><p>${escapeHtml(description)}</p></div>`
      + `<div class="toolkit-tags" aria-label="Core technical skills" data-portfolio-render="skills">`
      + skills.map(skill => renderTechTag(skill)).join('')
      + `</div></div></div></section>`;
  }

  function renderAccomplishments({ roleKey, assetRoot, copy }) {
    return `<section id="accomplishments" class="section-wrap one-page-section editorial-section" data-scroll-label="Accomplishments">`
      + `<div class="container">${renderSectionHeading('Accomplishments', copy.accomplishments)}`
      + `<div class="row g-4 mb-5 credential-card-grid" data-portfolio-render="credentials">`
      + renderCredentialCards(roleKey, assetRoot, 3)
      + `</div><div class="section-subheading reveal">`
      + `<h3>${escapeHtml(copy.projectTitle)}</h3><p>${escapeHtml(copy.projectIntro)}</p></div>`
      + `<div class="row g-4 portfolio-case-grid" data-portfolio-render="projects">`
      + renderProjectCards(roleKey, { assetRoot })
      + `</div></div></section>`;
  }

  function renderContact({ main, copy }) {
    const secondary = main
      ? { url: data.shared.resumes.MAIN, label: 'Review My Résumé', icon: 'file-alt', style: 'btn-cta-secondary' }
      : { url: data.shared.github, label: 'Review My GitHub', icon: 'github', style: 'btn-cv interactable' };
    return `<section id="contact" class="section-wrap one-page-section pt-0 editorial-section" data-scroll-label="Contact">`
      + `<div class="container"><div class="cta-card reveal">`
      + `<h2>${copy.contactLines.map(escapeHtml).join('<br>')}</h2><p>${escapeHtml(copy.contact)}</p>`
      + `<div class="contact-actions">`
      + `<a href="${data.shared.linkedin}" target="_blank" rel="noopener" class="btn ${main ? 'btn-white' : 'btn-primary interactable'}"><i class="fab fa-linkedin${main ? '' : '-in'} me-2"></i>Discuss a Project</a>`
      + `<a href="${secondary.url}" target="_blank" rel="noopener" class="btn ${secondary.style}"><i class="${main ? 'fas' : 'fab'} fa-${secondary.icon} me-2"></i>${secondary.label}</a>`
      + `<button type="button" class="btn discord interactable" aria-label="Opens Discord and copies ${escapeHtml(data.shared.discordHandle)}" title="Opens Discord and copies ${escapeHtml(data.shared.discordHandle)}"><i class="fab fa-discord me-2" aria-hidden="true"></i>Add me on Discord</button>`
      + `</div></div></div></section>`;
  }

  function renderFooter({ main, assetRoot, copy }) {
    return `<footer><div class="container text-center">`
      + `<a class="footer-brand" href="${main ? '#home' : assetRoot}" aria-label="${main ? 'Go to home section' : 'Open the main portfolio home page'}">HG.</a>`
      + `<p class="footer-tagline">${escapeHtml(data.shared.name)} ${main ? '/' : '—'} ${escapeHtml(data.shared.identity)}</p>`
      + `<div class="footer-social justify-content-center">${renderSocialLinks(assetRoot)}</div>`
      + `<div class="footer-divider"></div>`
      + `<button type="button" id="motionToggle" class="footer-motion-toggle" aria-pressed="false">Motion: full</button>`
      + `<p class="footer-copy">${escapeHtml(copy.footer)}</p>`
      + `</div></footer>`;
  }

  function renderPage(roleKey = 'MAIN', assetRoot = '') {
    const context = pageContext(roleKey, assetRoot);
    return [
      renderHero(context),
      '<main>',
      renderIntroduction(context),
      '<section id="about" class="section-wrap one-page-section editorial-section" data-scroll-label="About">',
      `<div class="container" data-portfolio-render="about">${renderAbout(roleKey, assetRoot)}</div></section>`,
      renderServices(context),
      renderToolkit(context),
      '<section id="activity" class="section-wrap one-page-section" data-scroll-label="Activity">',
      `<div class="container activity-main" data-portfolio-render="activity">${renderActivity(assetRoot)}</div></section>`,
      renderAccomplishments(context),
      renderContact(context),
      '</main>',
      `<div data-portfolio-render="certificate-viewer">${renderCertificateViewer()}</div>`,
      renderFooter(context)
    ].join('');
  }

  window.PORTFOLIO_COMPONENTS = Object.freeze({
    renderPage,
    renderPortrait,
    renderAbout,
    escapeHtml,
    renderServiceCards,
    renderProjectCards,
    renderCredentialCards,
    renderCertificateViewer,
    renderExperienceCards,
    renderTechTag,
    renderFreelanceLinks,
    renderActivity
  });
}());
