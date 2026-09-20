(function () {
  'use strict';

  const data = window.PORTFOLIO_DATA;
  const components = window.PORTFOLIO_COMPONENTS;
  const roleKey = document.body.dataset.role;
  const role = data?.professions?.[roleKey];
  const root = document.getElementById('rolePageRoot');
  if (!data || !components || !role || !root) return;

  const fullLabel = role.fullLabel || role.label;
  const roleDescriptor = roleKey === 'AI' ? 'AI engineer' : fullLabel.toLowerCase();
  const article = /^[aeiou]/i.test(role.label) ? 'an' : 'a';
  const resumeUrl = data.shared.resumes[roleKey];
  const assetRoot = '../';
  const esc = components.escapeHtml;

  /* On a specialist portfolio, Home means the main portfolio rather than the
     top of the current role page. Section links remain local anchors. */
  document.querySelectorAll('.navbar-brand, .loader-logo, .footer-brand, .navbar-nav .nav-link[href="#home"], .portfolio-menu-mobile-nav .nav-link[href="#home"]').forEach(link => {
    link.setAttribute('href', assetRoot);
    link.setAttribute('aria-label', 'Open the main portfolio home page');
  });

  root.innerHTML = `
    <header class="hero-section role-hero" id="home" data-scroll-label="Cover">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-6 order-2 order-lg-1">
            <div class="hero-badge"><span class="pulse-dot"></span>Available for freelance &amp; internship opportunities</div>
            <h1 class="hero-title"><span class="greeting">Hello, I'm</span><span class="name">${esc(data.shared.name)}</span></h1>
            <div class="profession-statement" aria-label="I am ${article} ${esc(role.label)}"><span>I am ${article}</span><strong>${esc(role.label)}</strong></div>
            <p class="hero-desc">${esc(role.description)}</p>
            <div class="hero-actions">
              <a href="#accomplishments" class="btn btn-primary interactable">View Selected Work <i class="fas fa-arrow-right ms-2" aria-hidden="true"></i></a>
              <a href="${resumeUrl}" target="_blank" rel="noopener" class="btn btn-cv interactable"><i class="fas fa-file-alt" aria-hidden="true"></i> View ${esc(role.short)} Résumé</a>
              <a href="#about" class="btn btn-glass interactable">About Me</a>
            </div>
            <div class="hero-socials"><a href="${data.shared.linkedin}" target="_blank" rel="noopener" class="social-btn linkedin interactable" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a><a href="${data.shared.github}" target="_blank" rel="noopener" class="social-btn github interactable" aria-label="GitHub"><i class="fab fa-github"></i></a></div>
          </div>
          <div class="col-lg-6 order-1 order-lg-2 d-flex justify-content-center"><div class="hero-img-wrap"><a class="hero-contact-bubble interactable" href="#contact" aria-label="Go to contact section"><i class="fas fa-paper-plane" aria-hidden="true"></i><span>Contact me</span></a><div class="hero-img-ring"><div class="hero-img-inner"><img src="../images/profile.jpg" alt="${esc(data.shared.name)} — ${esc(fullLabel)}" fetchpriority="high" decoding="async" /></div></div><div class="float-badge b1"><div class="badge-ico p"><i class="fas fa-brain"></i></div><div><div class="badge-label">Focus</div><div>${esc(role.label)}</div></div></div><div class="float-badge b2"><div class="badge-ico c"><i class="fas fa-code"></i></div><div><div class="badge-label">Delivery</div><div>Evidence + Usable Result</div></div></div></div></div>
        </div>
      </div>
    </header>

    <main>
      <section class="role-signature-strip" aria-label="${esc(fullLabel)} portfolio focus"><div class="container role-signature-inner"><div><span class="role-signature-code">${esc(role.short)}</span><span class="section-tag">Portfolio focus</span><h2>${esc(role.headline)}</h2></div><div class="role-signature-points" aria-label="Core ${esc(fullLabel)} services">${data.forRole(data.services, roleKey).map(service => `<span><i class="fas fa-check" aria-hidden="true"></i>${esc(service.title)}</span>`).join('')}</div></div></section>

      <section id="introduction" class="section-wrap one-page-section" data-scroll-label="Introduction"><div class="container"><div class="section-anchor-heading reveal"><span class="section-tag">Start here</span><h2 class="section-heading">Introduction</h2><p>Public projects selected for ${esc(roleDescriptor)} opportunities.</p></div><div class="row g-4 intro-project-grid">${components.renderProjectCards(roleKey, { variant: 'intro', limit: 3, assetRoot })}</div></div></section>

      <section class="section-wrap pt-0"><div class="container"><div class="intro-card premium-card reveal"><span class="section-tag">Who I help</span><h2>${esc(role.headline)}</h2><p>${esc(role.promise)}</p></div></div></section>

      <section id="about" class="section-wrap one-page-section" data-scroll-label="About">
        <div class="container">
          <div class="section-anchor-heading reveal"><span class="section-tag">Story, education &amp; experience</span><h2 class="section-heading">About <span class="grad-text">Me</span></h2><p>A developer from Alexandria who enjoys turning difficult ${esc(roleDescriptor)} ideas into clear, usable results.</p></div>
          <div class="row g-5 align-items-stretch"><div class="col-lg-5 reveal-left"><div class="about-profile-panel premium-card"><div class="profile-image-wrapper"><img src="../images/profile.jpg" alt="${esc(data.shared.name)}" class="profile-image" loading="lazy" decoding="async" /></div><div class="about-profile-copy"><span>${esc(data.shared.location)}</span><h3>Curious by nature. Practical by choice.</h3><p>Competitive programming keeps my thinking disciplined, while design and storytelling help me explain technical work clearly.</p></div></div></div><div class="col-lg-7 reveal-right"><div class="about-story-card premium-card"><span class="section-tag">My story</span><h3>Code became my canvas for solving real problems.</h3><p>I was born and raised in Alexandria and studied at Sidi Gaber Language School, where close friends introduced me to coding and problem-solving.</p><p>That spark led me to Artificial Intelligence. Today, I bring that foundation to ${esc(roleDescriptor)} work: ${esc(role.description)}</p></div></div></div>
          <div class="row g-4 mt-2"><div class="col-lg-6 reveal-left"><span class="section-tag">Education</span><div class="timeline-card education-summary-card premium-card"><div class="d-flex align-items-center gap-3 mb-3"><img src="../images/AASTMT_Logo.png" alt="AASTMT" class="education-logo" loading="lazy" decoding="async" /><div><div class="timeline-title">Arab Academy for Science &amp; Technology</div></div></div><div class="timeline-sub">B.Sc. Artificial Intelligence · Data Science Track</div><p>Focused on machine learning, computer vision, NLP, data science, and the engineering foundations required to turn models into applications.</p><div class="toolkit-tags">${role.skills.slice(0, 4).map(skill => components.renderTechTag(skill)).join('')}</div></div></div><div class="col-lg-6 reveal-right"><span class="section-tag">Experience</span><div class="experience-stack">${components.renderExperienceCards(roleKey)}</div></div></div>
          <div class="about-value-grid mt-4 reveal"><article class="premium-card"><span>01</span><h3>Understand before building</h3><p>I start with the decision or workflow the solution needs to improve.</p></article><article class="premium-card"><span>02</span><h3>Measure what matters</h3><p>I compare approaches and explain outcomes with meaningful evaluation.</p></article><article class="premium-card"><span>03</span><h3>Make it usable</h3><p>I care about the interface, explanation, and handoff as much as the technical work.</p></article></div>
        </div>
      </section>

      <section id="services" class="section-wrap one-page-section" data-scroll-label="Services"><div class="container"><div class="section-anchor-heading service-section-heading reveal"><span class="section-tag">Offered services</span><h2 class="section-heading">Services</h2><p class="section-sub">Role-specific support for ${esc(roleDescriptor)} projects.</p></div><div class="row g-4 service-card-grid">${components.renderServiceCards(roleKey)}</div></div></section>

      <section class="section-wrap pt-0"><div class="container"><div class="toolkit-panel premium-card reveal"><div><span class="section-tag">Core competencies</span><h2 class="section-heading mb-2">A practical ${esc(roleDescriptor)} toolkit.</h2><p>Tools selected around the work this page is designed to support.</p></div><div class="toolkit-tags" aria-label="Core technical skills">${role.skills.map(skill => components.renderTechTag(skill)).join('')}</div></div></div></section>

      <section id="activity" class="section-wrap one-page-section" data-scroll-label="Activity"><div class="container activity-main">${components.renderActivity(assetRoot)}</div></section>

      <section id="accomplishments" class="section-wrap one-page-section" data-scroll-label="Accomplishments"><div class="container"><div class="section-anchor-heading reveal"><span class="section-tag">Credentials, achievements &amp; previous work</span><h2 class="section-heading">Accomplishments</h2><p>Verified learning milestones and public case studies selected for ${esc(roleDescriptor)} work.</p></div><div class="row g-4 mb-5 credential-card-grid">${components.renderCredentialCards(roleKey, assetRoot, 3)}</div><div class="section-subheading reveal"><span class="section-tag">Project case studies</span><h3>Previous Work</h3><p>Public GitHub repositories that support this professional focus.</p></div><div class="row g-4 portfolio-case-grid">${components.renderProjectCards(roleKey, { assetRoot })}</div></div></section>

      <section class="section-wrap pt-0"><div class="container"><div class="trust-panel premium-card reveal"><div><span class="section-tag">Credibility</span><h2>Trust the work, not anonymous praise.</h2><p>Every claim on this page is backed by public code, inspectable credentials, or documented teamwork.</p></div><div class="trust-points"><a class="interactable" href="${data.shared.github}" target="_blank" rel="noopener"><i class="fab fa-github" aria-hidden="true"></i><span><strong>Public source code</strong>Review implementation details</span></a><a class="interactable" href="#activity"><i class="fas fa-people-group" aria-hidden="true"></i><span><strong>Named collaborators</strong>See the ECPC journey</span></a><a class="interactable" href="#accomplishments"><i class="fas fa-certificate" aria-hidden="true"></i><span><strong>Inspectable credentials</strong>Open the certificates</span></a></div></div></div></section>

      <section id="contact" class="section-wrap pt-0 one-page-section" data-scroll-label="Contact"><div class="container"><div class="cta-card premium-card reveal"><h2>Need ${article} ${esc(roleDescriptor)} for your next project?</h2><p>Share the problem, available data, and outcome you need. I’ll help define a practical next step.</p><div class="d-flex justify-content-center flex-wrap gap-3 mt-4"><a href="${data.shared.linkedin}" target="_blank" rel="noopener" class="btn btn-light interactable"><i class="fab fa-linkedin-in me-2"></i>Discuss a Project</a><a href="${data.shared.github}" target="_blank" rel="noopener" class="btn btn-glass interactable"><i class="fab fa-github me-2"></i>Review My GitHub</a></div></div></div></section>
    </main>

    <dialog class="certificate-viewer" id="certificateViewer" aria-labelledby="certificateViewerTitle"><div class="certificate-viewer-panel"><div class="certificate-viewer-head"><div><span>Certificate preview</span><h2 id="certificateViewerTitle">Certificate</h2></div><button class="certificate-viewer-close interactable" id="certificateViewerClose" type="button" aria-label="Close certificate preview"><i class="fas fa-xmark" aria-hidden="true"></i></button></div><div class="certificate-viewer-media"><img id="certificateViewerImage" alt="" /></div></div></dialog>`;

  document.querySelectorAll('[data-role-label]').forEach(node => { node.textContent = fullLabel; });
}());
