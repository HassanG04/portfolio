/* Portrait feedback consumes the shared, frame-throttled pointer stream.
   Idle, tilt and image parallax each own a separate element. */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const frame = document.querySelector('.hero-pointer-frame');
    if (!frame) return;
    const parallax = frame.querySelector('.hero-img-parallax');
    const reduced = matchMedia('(prefers-reduced-motion:reduce)');
    const fine = matchMedia('(hover:hover) and (pointer:fine)');
    const value = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
    let visible = true;
    let raf = 0;
    let lastTime = 0;

    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
      lastTime = 0;
      for (const key of Object.keys(value)) value[key] = 0;
      frame.style.removeProperty('transform');
      parallax.style.removeProperty('transform');
      frame.classList.remove('is-tilting', 'is-tap-pulsing');
    }

    function draw(time) {
      raf = 0;
      if (!visible || document.hidden || reduced.matches) return stop();
      const step = Math.min(2, (time - (lastTime || time - 16.67)) / 16.67);
      lastTime = time;
      for (const axis of ['x', 'y']) {
        value[`v${axis}`] = (value[`v${axis}`] + (value[`t${axis}`] - value[axis]) * .095 * step) * Math.pow(.7, step);
        value[axis] += value[`v${axis}`] * step;
      }
      frame.style.transform = `rotateX(${-value.y * 8}deg) rotateY(${value.x * 8}deg)`;
      parallax.style.transform = `translate3d(${-value.x * 6}px,${-value.y * 6}px,0) scale(1.04)`;
      if (Math.abs(value.tx - value.x) + Math.abs(value.ty - value.y) + Math.abs(value.vx) + Math.abs(value.vy) > .002) {
        raf = requestAnimationFrame(draw);
      } else {
        lastTime = 0;
        if (!frame.classList.contains('is-tilting')) stop();
      }
    }

    function schedule() { if (!raf) raf = requestAnimationFrame(draw); }
    document.addEventListener('portfolio:pointer', ({ detail }) => {
      if (reduced.matches || !fine.matches || !visible || !frame.contains(detail.target)) return;
      const box = frame.parentElement.getBoundingClientRect();
      value.tx = Math.max(-1, Math.min(1, (detail.clientX - box.left) / box.width * 2 - 1));
      value.ty = Math.max(-1, Math.min(1, (detail.clientY - box.top) / box.height * 2 - 1));
      frame.style.setProperty('--portrait-light-x', `${(value.tx + 1) * 50}%`);
      frame.style.setProperty('--portrait-light-y', `${(value.ty + 1) * 50}%`);
      frame.classList.add('is-tilting');
      schedule();
    });
    frame.addEventListener('pointerleave', event => {
      if (event.pointerType === 'touch') return;
      value.tx = value.ty = 0;
      frame.classList.remove('is-tilting');
      schedule();
    });
    frame.addEventListener('pointerup', event => {
      if (event.pointerType === 'touch' && !reduced.matches) frame.classList.add('is-tap-pulsing');
    });
    frame.addEventListener('animationend', event => {
      if (event.animationName === 'portrait-tap') frame.classList.remove('is-tap-pulsing');
    });
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) stop();
    }).observe(frame);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
    reduced.addEventListener('change', stop);
  });
}());
