(function () {
  'use strict';

  const data = window.PORTFOLIO_DATA;
  const components = window.PORTFOLIO_COMPONENTS;
  const roleKey = document.body.dataset.role;
  const role = data?.professions?.[roleKey];
  const root = document.getElementById('rolePageRoot');
  if (!data || !components || !role || !root) return;

  const fullLabel = role.fullLabel || role.label;
  const resumeUrl = data.shared.resumes[roleKey];
  const assetRoot = '../';
  const esc = components.escapeHtml;

  // A specialist page's Home link returns to the general portfolio.
  document.querySelectorAll('.navbar-brand, .footer-brand, .navbar-nav .nav-link[href="#home"], .portfolio-menu-mobile-nav .nav-link[href="#home"]').forEach(link => {
    link.setAttribute('href', assetRoot);
    link.setAttribute('aria-label', 'Open the main portfolio home page');
  });

  root.innerHTML = `
    <header class="hero-section editorial-hero role-hero" id="home" data-scroll-label="Cover">
      <div class="container hero-composition">
        <div class="hero-copy">
          <p class="hero-byline">Hassan Gebril <span>${esc(roleKey === 'ML' ? role.label : data.shared.identity)}</span></p>
          <h1 class="hero-title">${esc(role.headline)}</h1>
          <div class="profession-statement"><span>Portfolio focus</span><strong>${esc(fullLabel)}</strong></div>
          <p class="hero-desc">${esc(role.description)}</p>
          <div class="hero-actions">
            <a href="#introduction" class="btn btn-primary interactable">Explore the work <i class="fas fa-arrow-right ms-2" aria-hidden="true"></i></a>
            <a href="${resumeUrl}" target="_blank" rel="noopener" class="btn btn-cv interactable"><i class="fas fa-file-alt" aria-hidden="true"></i> View ${esc(role.short)} Résumé</a>
          </div>
          <p class="hero-availability">Available for freelance &amp; internship opportunities</p>
          <div class="hero-socials"><a href="${data.shared.linkedin}" target="_blank" rel="noopener" class="social-btn linkedin interactable" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>${components.renderFreelanceLinks({ variant: 'social', assetRoot })}<a href="${data.shared.github}" target="_blank" rel="noopener" class="social-btn github interactable" aria-label="GitHub"><i class="fab fa-github"></i></a></div>
        </div>
        <figure class="hero-portrait"><div class="hero-img-wrap"><div class="hero-img-ring"><div class="hero-img-inner"><img src="../images/profile.jpg" alt="${esc(data.shared.name)}" fetchpriority="high" decoding="async" /></div></div></div><figcaption>Based in ${esc(data.shared.location)}<br><a href="#about" class="interactable">A little about me <span aria-hidden="true">↗</span></a></figcaption></figure>
        <div class="hero-signature-slot">${components.renderTechnicalSignature()}</div>
      </div>
    </header>

    <main>
      <section id="introduction" class="section-wrap one-page-section editorial-section" data-scroll-label="Introduction">
        <div class="container"><div class="section-anchor-heading reveal"><span class="section-tag">Selected work / ${esc(role.eyebrow)}</span><h2 class="section-heading">The implementation is open.</h2><p>${esc(role.promise)}</p></div><div class="row g-4 intro-project-grid">${components.renderProjectCards(roleKey, { variant: 'intro', limit: 3, assetRoot })}</div></div>
      </section>
      <section id="about" class="section-wrap one-page-section editorial-section" data-scroll-label="About"><div class="container">${components.renderAbout(roleKey, assetRoot)}</div></section>
      <section id="services" class="section-wrap one-page-section editorial-section" data-scroll-label="Services">
        <div class="container"><div class="section-anchor-heading service-section-heading reveal"><span class="section-tag">Offered services</span><h2 class="section-heading">Where I can help.</h2><p>${esc(role.promise)}</p></div><div class="row g-4 service-card-grid">${components.renderServiceCards(roleKey)}</div></div>
      </section>
      <section class="section-wrap pt-0 editorial-section"><div class="container"><div class="toolkit-panel reveal"><div><span class="section-tag">Tools in the repositories</span><h2 class="section-heading mb-2">What I work with.</h2><p>Tools selected for ${esc(fullLabel.toLowerCase())} work, with the implementation available to inspect.</p></div><div class="toolkit-tags" aria-label="Core technical skills">${role.skills.map(skill => components.renderTechTag(skill)).join('')}</div></div></div></section>

      <section id="activity" class="section-wrap one-page-section" data-scroll-label="Activity"><div class="container activity-main">${components.renderActivity(assetRoot)}</div></section>

      <section id="accomplishments" class="section-wrap one-page-section editorial-section" data-scroll-label="Accomplishments">
        <div class="container"><div class="section-anchor-heading reveal"><span class="section-tag">Evidence / Qualifications &amp; case studies</span><h2 class="section-heading">Accomplishments</h2><p>Open the certificates, then review the implementation behind each project.</p></div><div class="row g-4 mb-5 credential-card-grid">${components.renderCredentialCards(roleKey, assetRoot, 3)}</div><div class="section-subheading reveal"><span class="section-tag">Project case studies</span><h3>Implementation notes.</h3><p>The problem, the approach, and the result. Limitations stay in view.</p></div><div class="row g-4 portfolio-case-grid">${components.renderProjectCards(roleKey, { assetRoot })}</div></div>
      </section>
      <section id="contact" class="section-wrap pt-0 one-page-section editorial-section" data-scroll-label="Contact">
        <div class="container"><div class="cta-card reveal"><span class="section-tag">Start with the problem</span><h2>What do you need<br>the model to do?</h2><p>Send me the available data and the decision you need to make. We can define a testable first version and an honest scope.</p><div class="contact-actions"><a href="${data.shared.linkedin}" target="_blank" rel="noopener" class="btn btn-primary interactable"><i class="fab fa-linkedin-in me-2"></i>Discuss a Project</a><a href="${data.shared.github}" target="_blank" rel="noopener" class="btn btn-cv interactable"><i class="fab fa-github me-2"></i>Review My GitHub</a></div></div></div>
      </section>
    </main>

    <dialog class="certificate-viewer" id="certificateViewer" aria-labelledby="certificateViewerTitle"><div class="certificate-viewer-panel"><div class="certificate-viewer-head"><div><span>Certificate preview</span><h2 id="certificateViewerTitle">Certificate</h2></div><button class="certificate-viewer-close interactable" id="certificateViewerClose" type="button" aria-label="Close certificate preview"><i class="fas fa-xmark" aria-hidden="true"></i></button></div><div class="certificate-viewer-media"><img id="certificateViewerImage" alt="" /></div></div></dialog>`;

  document.querySelectorAll('[data-role-label]').forEach(node => { node.textContent = data.shared.identity; });
}());
