document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     PAGE LOADER
     ============================================================ */
  const loader = document.getElementById('page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 400);
    });
    // Fallback
    setTimeout(() => loader && loader.classList.add('hidden'), 2500);
  }

  /* ============================================================
     COLOR THEME — follow the OS until the visitor chooses
     ============================================================ */
  function initDarkMode() {
    const stored = localStorage.getItem('portfolio-theme');
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = stored || preferred;
    const isDark = theme === 'dark';
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.body.classList.toggle('dark-mode', isDark);
    updateToggleIcon(isDark);
  }

  function updateToggleIcon(isDark) {
    const icon = document.querySelector('#darkModeToggle i');
    const label = document.querySelector('#darkModeToggle .theme-toggle-label');
    const button = document.getElementById('darkModeToggle');
    if (icon) icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    if (label) label.textContent = isDark ? 'Dark' : 'Light';
    if (button) {
      button.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
      button.setAttribute('aria-pressed', String(isDark));
      button.title = `Switch to ${isDark ? 'light' : 'dark'} mode`;
    }
  }

  initDarkMode();

  const darkBtn = document.getElementById('darkModeToggle');
  if (darkBtn) {
    darkBtn.addEventListener('click', () => {
      const isDark = document.documentElement.dataset.theme !== 'dark';
      const theme = isDark ? 'dark' : 'light';
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
      document.body.classList.toggle('dark-mode', isDark);
      localStorage.setItem('portfolio-theme', theme);
      updateToggleIcon(isDark);
    });
  }

  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
  colorScheme.addEventListener('change', event => {
    if (localStorage.getItem('portfolio-theme')) return;
    const theme = event.matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.body.classList.toggle('dark-mode', event.matches);
    updateToggleIcon(event.matches);
  });

  /* ============================================================
     NAVBAR — scroll behaviour
     ============================================================ */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     ACTIVE NAV LINK
     ============================================================ */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active',
      href === currentPage ||
      (currentPage === '' && href === 'index.html') ||
      (currentPage === 'index.html' && href === 'index.html')
    );
  });

  /* ============================================================
     PARTICLE CANVAS
     ============================================================ */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });

    const COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd'];
    const NUM = Math.min(Math.floor(W * H / 15000), 80);

    const particles = Array.from({ length: NUM }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.8 + .6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * .5 + .15,
    }));

    let mouseX = -999, mouseY = -999;
    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        // Gentle mouse repulsion
        const dx = p.x - mouseX, dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100 * .4;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
        // Speed damping
        p.vx *= .98; p.vy *= .98;
        p.x += p.vx; p.y += p.vy;
        // Wrap
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      // Connection lines
      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = particles[i].color;
            ctx.globalAlpha = (1 - d / 120) * .12;
            ctx.lineWidth = .6;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }



  /* ============================================================
     TYPEWRITER EFFECT
     ============================================================ */
  const target = document.getElementById('typewriter-text');
  if (target) {
    const words = ['Machine Learning Developer', 'Web Builder', 'Problem Solver', 'Creative Technologist'];
    let wi = 0, ci = words[0].length, deleting = true;
    function type() {
      const word = words[wi];
      if (!deleting) {
        target.textContent = word.slice(0, ++ci);
        if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
        setTimeout(type, 90);
      } else {
        target.textContent = word.slice(0, --ci);
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(type, 400); return; }
        setTimeout(type, 45);
      }
    }
    setTimeout(type, 1800);
  }

  /* ============================================================
     SCROLL REVEAL (Intersection Observer)
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
          // Trigger any counters inside this revealed element
          e.target.querySelectorAll('[data-count]').forEach(counter => {
            if (!counter.dataset.counted) {
              counter.dataset.counted = 'true';
              setTimeout(() => {
                animateCounter(counter, parseInt(counter.dataset.count));
              }, 300);
            }
          });
          // Trigger any skill bars inside this revealed element
          e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
            bar.style.width = bar.dataset.pct + '%';
          });
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ============================================================
     ANIMATED COUNTERS
     ============================================================ */
  function animateCounter(el, target, duration = 1800) {
    let start = 0;
    const step = timestamp => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target) + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Fallback counter observer for counters NOT inside .reveal wrappers
  const counterEls = document.querySelectorAll('[data-count]');
  if (counterEls.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          if (!el.dataset.counted) {
            el.dataset.counted = 'true';
            animateCounter(el, parseInt(el.dataset.count));
          }
          counterObs.unobserve(el);
        }
      });
    }, { threshold: 0.15 });
    counterEls.forEach(el => counterObs.observe(el));
  }

  /* ============================================================
     SKILL BARS
     ============================================================ */
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (bars.length) {
    const barObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.pct + '%';
          barObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(b => barObs.observe(b));
  }

  /* ============================================================
     CONTACT MODAL INJECTION & CTA BUTTON
     ============================================================ */
  const ctaBtn = document.getElementById('ctaButton');
  if (ctaBtn) {
    const modalHtml = `
    <div class="modal fade" id="contactModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content glass-modal">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title section-heading mb-0" style="font-size:1.5rem;">Let's <span class="grad-text">Connect</span></h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="text-secondary mb-4">Feel free to drop a message. I'm always open to discussing new opportunities or interesting projects!</p>
            <form id="contactForm">
              <div class="mb-3">
                <input type="text" class="form-control glass-input" placeholder="Your Name" required>
              </div>
              <div class="mb-3">
                <input type="email" class="form-control glass-input" placeholder="Your Email" required>
              </div>
              <div class="mb-3">
                <textarea class="form-control glass-input" rows="4" placeholder="Your Message" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary w-100" style="border:none;">Send Message <i class="fas fa-paper-plane ms-2"></i></button>
            </form>
          </div>
        </div>
      </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const contactModal = new bootstrap.Modal(document.getElementById('contactModal'));

    ctaBtn.addEventListener('click', () => {
      contactModal.show();
    });

    document.getElementById('contactForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.classList.replace('btn-primary', 'btn-cv');
        setTimeout(() => {
          contactModal.hide();
          btn.innerHTML = originalText;
          btn.classList.replace('btn-cv', 'btn-primary');
          e.target.reset();
        }, 2000);
      }, 1500);
    });
  }

  /* ============================================================
     SHARED ACTIVITY FLIP CARDS — ECPC and DEPI use one component
     ============================================================ */
  const activityFlipCards = Array.from(document.querySelectorAll('[data-flip-card]'));
  const activityFlipTimers = new WeakMap();
  const activitySoundDefinitions = activityFlipCards.length ? {
    back: { url: new URL('sounds/back.mp3', document.baseURI).href, volume: 0.25 },
    front: { url: new URL('sounds/front.mp3', document.baseURI).href, volume: 0.25 },
    left: { url: new URL('sounds/left.mp3', document.baseURI).href, volume: 0.5 },
    right: { url: new URL('sounds/right.mp3', document.baseURI).href, volume: 0.5 }
  } : {};
  const activitySoundBuffers = new Map();
  const activeActivitySources = new Set();
  const activeActivityFallbacks = new Set();
  const ActivityAudioContext = window.AudioContext || window.webkitAudioContext;
  let activityAudioContext = null;
  let activitySoundRequest = 0;

  try {
    activityAudioContext = ActivityAudioContext && activityFlipCards.length
      ? new ActivityAudioContext()
      : null;
  } catch (_) {
    activityAudioContext = null;
  }

  const activitySoundBufferLoad = activityAudioContext
    ? Promise.all(Object.entries(activitySoundDefinitions).map(async ([name, definition]) => {
        const response = await fetch(definition.url, { cache: 'force-cache' });
        if (!response.ok) throw new Error(`Unable to load ${name} activity sound`);
        const buffer = await activityAudioContext.decodeAudioData(await response.arrayBuffer());
        activitySoundBuffers.set(name, buffer);
      })).then(() => true).catch(() => false)
    : Promise.resolve(false);

  function stopActivitySounds() {
    activeActivitySources.forEach(source => {
      try { source.stop(); } catch (_) {}
      source.disconnect();
    });
    activeActivitySources.clear();

    activeActivityFallbacks.forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
    activeActivityFallbacks.clear();
  }

  function playActivitySoundFallback(names) {
    stopActivitySounds();
    names.forEach(name => {
      const definition = activitySoundDefinitions[name];
      if (!definition) return;

      const sound = new Audio(definition.url);
      sound.preload = 'auto';
      sound.volume = definition.volume;
      activeActivityFallbacks.add(sound);

      const release = () => activeActivityFallbacks.delete(sound);
      sound.addEventListener('ended', release, { once: true });
      sound.addEventListener('error', release, { once: true });
      sound.play()?.catch(release);
    });
  }

  async function playActivitySounds(...requestedNames) {
    const names = requestedNames.filter(name => activitySoundDefinitions[name]);
    if (!names.length) return false;

    const request = ++activitySoundRequest;
    stopActivitySounds();

    if (!activityAudioContext || activityAudioContext.state === 'closed') {
      playActivitySoundFallback(names);
      return true;
    }

    try {
      if (activityAudioContext.state === 'suspended') await activityAudioContext.resume();
      const loaded = await activitySoundBufferLoad;
      if (!loaded || request !== activitySoundRequest) {
        if (request === activitySoundRequest) {
          playActivitySoundFallback(names);
          return true;
        }
        return false;
      }

      const startAt = activityAudioContext.currentTime + 0.018;
      names.forEach(name => {
        const definition = activitySoundDefinitions[name];
        const buffer = activitySoundBuffers.get(name);
        if (!buffer) return;

        const source = activityAudioContext.createBufferSource();
        const gain = activityAudioContext.createGain();
        source.buffer = buffer;
        gain.gain.setValueAtTime(definition.volume, startAt);
        source.connect(gain).connect(activityAudioContext.destination);
        activeActivitySources.add(source);
        source.addEventListener('ended', () => {
          if (activeActivitySources.delete(source)) {
            source.disconnect();
            gain.disconnect();
          }
        }, { once: true });
        source.start(startAt);
      });
      return true;
    } catch (_) {
      if (request === activitySoundRequest) {
        playActivitySoundFallback(names);
        return true;
      }
      return false;
    }
  }

  function playActivitySound(name) {
    void playActivitySounds(name);
  }

  function markActivityFlipAnimating(card) {
    const inner = card?.querySelector('.flip-card-inner');
    if (!card || !inner) return;

    const previous = activityFlipTimers.get(card);
    if (previous) {
      window.clearTimeout(previous.timer);
      previous.inner.removeEventListener('transitionend', previous.finish);
    }

    card.classList.add('is-flip-animating');

    const finish = event => {
      if (event && (event.target !== inner || event.propertyName !== 'transform')) return;
      window.clearTimeout(timer);
      inner.removeEventListener('transitionend', finish);
      card.classList.remove('is-flip-animating');
      activityFlipTimers.delete(card);
    };
    const timer = window.setTimeout(() => finish(), 950);

    inner.addEventListener('transitionend', finish);
    activityFlipTimers.set(card, { timer, finish, inner });
  }

  function setActivityFlipState(card, shouldFlip, moveFocus = false) {
    if (!card) return;

    const front = card.querySelector('.flip-card-front');
    const back = card.querySelector('.flip-card-back');
    const toggle = card.querySelector('[data-flip-toggle]');

    if (card.classList.contains('is-flipped') !== shouldFlip) {
      markActivityFlipAnimating(card);
    }
    card.classList.toggle('is-flipped', shouldFlip);
    if (toggle) toggle.setAttribute('aria-expanded', String(shouldFlip));

    if (front) {
      front.inert = shouldFlip;
      front.setAttribute('aria-hidden', String(shouldFlip));
    }
    if (back) {
      back.inert = !shouldFlip;
      back.setAttribute('aria-hidden', String(!shouldFlip));
      back.tabIndex = shouldFlip ? 0 : -1;
      back.scrollTop = 0;
    }

    if (moveFocus) {
      const focusTarget = shouldFlip ? back : toggle;
      window.requestAnimationFrame(() => focusTarget?.focus({ preventScroll: true }));
    }
  }

  activityFlipCards.forEach(card => {
    const toggle = card.querySelector('[data-flip-toggle]');
    const back = card.querySelector('.flip-card-back');

    setActivityFlipState(card, false);
    toggle?.addEventListener('click', event => {
      playActivitySound('left');
      setActivityFlipState(card, true, event.detail === 0);
    });
    back?.addEventListener('click', event => {
      if (event.target.closest('a')) return;
      playActivitySound('right');
      setActivityFlipState(card, false, event.detail === 0);
    });
    back?.addEventListener('keydown', event => {
      if (event.target !== back || (event.key !== 'Enter' && event.key !== ' ')) return;
      event.preventDefault();
      playActivitySound('right');
      setActivityFlipState(card, false, true);
    });
  });

  /* ============================================================
     ECPC RESPONSIVE HORIZONTAL CAROUSEL
     ============================================================ */
  const ecpcDeck = document.getElementById('ecpcDeck');
  if (ecpcDeck) {
    const slides = Array.from(ecpcDeck.querySelectorAll('[data-ecpc-slide]'));
    const indicators = Array.from(ecpcDeck.querySelectorAll('[data-ecpc-index]'));
    const track = ecpcDeck.querySelector('.ecpc-slider-track');
    const stage = ecpcDeck.querySelector('.ecpc-deck-stage');
    const prevButton = document.getElementById('ecpcPrev');
    const nextButton = document.getElementById('ecpcNext');
    let currentIndex = 0;
    let touchStartX = 0;
    let suppressFlipClick = false;

    function updateEcpcControlPosition() {
      if (!stage || !slides[currentIndex]) return;

      window.requestAnimationFrame(() => {
        const activeCard = slides[currentIndex].querySelector('.ecpc-deck-card');
        if (!activeCard) return;
        const stageRect = stage.getBoundingClientRect();
        const cardRect = activeCard.getBoundingClientRect();
        const controlY = cardRect.top - stageRect.top + (cardRect.height / 2);
        stage.style.setProperty('--ecpc-control-y', `${controlY}px`);
      });
    }

    function positionEcpcTrack(skipAnimation = false) {
      if (!track) return;
      if (skipAnimation) track.classList.add('is-positioning');

      track.style.transform = `translate3d(${-currentIndex * 100}%,0,0)`;

      if (skipAnimation) {
        void track.offsetWidth;
        window.requestAnimationFrame(() => track.classList.remove('is-positioning'));
      }
    }

    function showEcpc(index, force = false) {
      if (!slides.length) return;
      const wrappedIndex = (index + slides.length) % slides.length;
      if (!force && wrappedIndex === currentIndex) return;
      currentIndex = wrappedIndex;

      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === currentIndex;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
        slide.inert = !active;
        setActivityFlipState(slide.querySelector('[data-flip-card]'), false);
      });
      indicators.forEach((indicator, indicatorIndex) => {
        const active = indicatorIndex === currentIndex;
        indicator.classList.toggle('is-active', active);
        indicator.setAttribute('aria-current', active ? 'true' : 'false');
      });

      positionEcpcTrack(force);
      updateEcpcControlPosition();
    }

    function moveEcpc(step) {
      showEcpc(currentIndex + step);
    }

    async function moveEcpcWithSound(step) {
      if (!slides.length) return;
      const originIndex = currentIndex;
      const destinationIndex = (currentIndex + step + slides.length) % slides.length;
      const movingRight = destinationIndex > currentIndex;
      const soundStarted = movingRight
        ? await playActivitySounds('right', 'front')
        : await playActivitySounds('left', 'back');
      if (!soundStarted || currentIndex !== originIndex) return;
      showEcpc(destinationIndex);
    }

    prevButton?.addEventListener('click', () => {
      moveEcpcWithSound(-1);
    });
    nextButton?.addEventListener('click', () => {
      moveEcpcWithSound(1);
    });
    indicators.forEach(indicator => {
      indicator.addEventListener('click', () => showEcpc(Number(indicator.dataset.ecpcIndex)));
    });
    ecpcDeck.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveEcpc(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveEcpc(1);
      }
    });

    if (stage) {
      stage.addEventListener('touchstart', event => {
        touchStartX = event.changedTouches[0].clientX;
      }, { passive: true });
      stage.addEventListener('touchend', event => {
        const distance = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(distance) > 48) {
          suppressFlipClick = true;
          moveEcpc(distance < 0 ? 1 : -1);
          window.setTimeout(() => { suppressFlipClick = false; }, 350);
        }
      }, { passive: true });
      stage.addEventListener('click', event => {
        if (!suppressFlipClick) return;
        event.preventDefault();
        event.stopImmediatePropagation();
      }, true);
    }

    let ecpcResizeTimer;
    window.addEventListener('resize', () => {
      window.clearTimeout(ecpcResizeTimer);
      ecpcResizeTimer = window.setTimeout(updateEcpcControlPosition, 120);
    });

    showEcpc(0, true);
  }

  /* ============================================================
     SMOOTH SCROLL HINT
     ============================================================ */
  const scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      const next = document.querySelector('main') || document.querySelector('#stats');
      if (next) next.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ============================================================
     MAGNETIC BUTTONS (subtle)
     ============================================================ */
  document.querySelectorAll('.btn-primary,.btn-cv').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * .12}px,${y * .12}px) translateY(-3px) scale(1.02)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

});
