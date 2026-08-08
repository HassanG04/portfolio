document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const header = document.querySelector('[data-header]');
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);

  const updateScrollState = () => {
    const scrollTop = window.scrollY;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(scrollTop / scrollable, 1) : 0;
    header?.classList.toggle('scrolled', scrollTop > 24);
    progress.style.transform = `scaleX(${ratio})`;
  };

  let scrollFrame = 0;
  const requestScrollUpdate = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      updateScrollState();
      scrollFrame = 0;
    });
  };
  updateScrollState();
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate, { passive: true });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  const revealTargets = document.querySelectorAll(
    '.section-header, .project-card, .experience-card, .education-card, .capability-grid article, .learning-panel'
  );

  if (!reducedMotion && 'IntersectionObserver' in window) {
    revealTargets.forEach((element, index) => {
      element.setAttribute('data-reveal', '');
      element.style.setProperty('--reveal-order', index % 4);
    });
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -55px' });
    revealTargets.forEach((element) => revealObserver.observe(element));
  }

  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const navSections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${visible.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, .1, .35] });
    navSections.forEach((section) => navObserver.observe(section));
  }

  const metricElements = document.querySelectorAll('.signal-strip strong');
  const animateMetric = (element) => {
    const label = element.textContent.trim();
    const match = label.match(/^([\d.]+)(.*)$/);
    if (!match) return;
    const target = Number(match[1]);
    const suffix = match[2];
    const decimals = (match[1].split('.')[1] || '').length;
    const duration = 1050;
    const start = performance.now();
    const tick = (now) => {
      const progressValue = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      element.textContent = `${(target * eased).toFixed(decimals)}${suffix}`;
      if (progressValue < 1) requestAnimationFrame(tick);
      else element.classList.add('metric-pop');
    };
    requestAnimationFrame(tick);
  };

  if (!reducedMotion && 'IntersectionObserver' in window) {
    const metrics = document.querySelector('.signal-strip');
    const metricObserver = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      metricElements.forEach((element, index) => {
        window.setTimeout(() => animateMetric(element), index * 110);
      });
      metricObserver.disconnect();
    }, { threshold: .45 });
    if (metrics) metricObserver.observe(metrics);
  }

  if (!reducedMotion && finePointer) {
    let pointerFrame = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 3;
    window.addEventListener('pointermove', (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        document.body.style.setProperty('--pointer-x', `${pointerX}px`);
        document.body.style.setProperty('--pointer-y', `${pointerY}px`);
        pointerFrame = 0;
      });
    }, { passive: true });

    const hero = document.querySelector('.hero');
    const portrait = document.querySelector('.portrait-frame');
    hero?.addEventListener('pointermove', (event) => {
      if (!portrait) return;
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      portrait.style.transform = `perspective(900px) rotateY(${x * 3.2}deg) rotateX(${-y * 3.2}deg) translate3d(${x * 5}px, ${y * 5}px, 0)`;
    });
    hero?.addEventListener('pointerleave', () => {
      if (portrait) portrait.style.transform = '';
    });

    document.querySelectorAll('.project-card:not(.project-featured):not(.compact-card)').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = `perspective(1100px) rotateY(${x * 2.2}deg) rotateX(${-y * 2.2}deg) translateY(-5px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }
});
