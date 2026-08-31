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
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      W = canvas.width  = window.innerWidth;
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
     CHATBOT
     ============================================================ */
  const bubble    = document.getElementById('chatbot-bubble');
  const chatWin   = document.getElementById('chatbot-window');
  const chatClose = document.getElementById('chatbot-close');
  const chatBody  = document.querySelector('.chatbot-body');

  if (bubble && chatWin) {
    bubble.addEventListener('click', () => {
      chatWin.classList.toggle('d-none');
      if (!chatWin.classList.contains('d-none') && !chatWin.dataset.initialized) {
        initChatbot();
        chatWin.dataset.initialized = 'true';
      }
    });
    if (chatClose) chatClose.addEventListener('click', () => chatWin.classList.add('d-none'));

    // Functional Logic
    function initChatbot() {
      if (!chatBody) return;
      const headerSpan = document.querySelector('.chatbot-header span');
      if (headerSpan) headerSpan.innerHTML = '<i class="fas fa-robot me-2"></i>Hassan-bot';

      chatBody.innerHTML = `
        <div class="chatbot-message bot mb-3">
          Hi! I'm Hassan-bot 🤖. I can answer quick questions about Hassan. What would you like to know?
        </div>
        <div id="chat-options" class="d-flex flex-column gap-2 mt-2">
          <button class="btn btn-sm btn-outline-primary text-start chat-opt" data-ans="I am an AI engineering student at AASTMT with a passion for machine learning, computer vision, and creative web development.">Who is Hassan?</button>
          <button class="btn btn-sm btn-outline-primary text-start chat-opt" data-ans="I specialize in Python, PyTorch, web development (HTML/CSS/JS), and solving complex algorithmic problems (ICPC competitor).">What are your skills?</button>
          <button class="btn btn-sm btn-outline-primary text-start chat-opt" data-ans="You can reach out to me via my LinkedIn or email. Just hit the 'Click Me!' button on the home page or use the footer links!">How can I contact you?</button>
        </div>
      `;

      document.querySelectorAll('.chat-opt').forEach(btn => {
         btn.addEventListener('click', (e) => {
            const question = e.target.innerText;
            const answer = e.target.getAttribute('data-ans');
            
            // Add user message
            const userMsg = document.createElement('div');
            userMsg.className = 'chatbot-message user mt-3 text-end mb-2';
            userMsg.innerHTML = `<span style="background:var(--accent-purple);color:#fff;padding:8px 12px;border-radius:12px 12px 4px 12px;display:inline-block;font-size:0.86rem;max-width:85%;"><strong>You:</strong> ${question}</span>`;
            
            // Add bot answer
            const botMsg = document.createElement('div');
            botMsg.className = 'chatbot-message bot mb-3';
            botMsg.innerHTML = `<strong>Hassan-bot:</strong><br/>${answer}`;
            
            chatBody.insertBefore(userMsg, document.getElementById('chat-options'));
            chatBody.insertBefore(botMsg, document.getElementById('chat-options'));
            userMsg.scrollIntoView({ behavior: 'smooth', block: 'start' });
         });
      });
    }

    // Drag
    let dragging = false, ox = 0, oy = 0;
    bubble.addEventListener('mousedown', e => {
      dragging = true;
      const r = bubble.getBoundingClientRect();
      ox = e.clientX - r.left; oy = e.clientY - r.top;
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      const x = Math.max(5, Math.min(e.clientX - ox, window.innerWidth  - bubble.offsetWidth  - 5));
      const y = Math.max(5, Math.min(e.clientY - oy, window.innerHeight - bubble.offsetHeight - 5));
      bubble.style.left = x+'px'; bubble.style.top = y+'px';
      bubble.style.right = 'auto'; bubble.style.bottom = 'auto';
    });
    document.addEventListener('mouseup', () => { dragging = false; });
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
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translate(${x * .12}px,${y * .12}px) translateY(-3px) scale(1.02)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

});
