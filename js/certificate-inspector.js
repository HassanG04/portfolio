/* Full-resolution inspection inside the existing native dialog. Pointer motion
   is supplied by script.js; there is no second document pointermove listener. */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.getElementById('certificateViewer');
    if (!dialog) return;
    const stage = dialog.querySelector('.certificate-viewer-media');
    const image = document.getElementById('certificateViewerImage');
    const indicator = document.getElementById('certificateZoomLevel');
    const reduced = matchMedia('(prefers-reduced-motion:reduce)');
    const points = new Map();
    const view = { zoom: 1, x: 0, y: 0, tx: 0, ty: 0, scale: 1 };
    let fitted = { width: 0, height: 0 };
    let raf = 0;
    let gesture = null;
    let lastTap = 0;
    let ignoreClickUntil = 0;

    function bounds() {
      return { x: Math.max(0, (fitted.width * view.zoom - stage.clientWidth) / 2), y: Math.max(0, (fitted.height * view.zoom - stage.clientHeight) / 2) };
    }

    function clampPan() {
      const limit = bounds();
      view.tx = Math.max(-limit.x, Math.min(limit.x, view.tx));
      view.ty = Math.max(-limit.y, Math.min(limit.y, view.ty));
    }

    function draw() {
      raf = 0;
      if (!dialog.open || document.hidden) return;
      const amount = reduced.matches ? 1 : .24;
      view.x += (view.tx - view.x) * amount;
      view.y += (view.ty - view.y) * amount;
      view.scale += (view.zoom - view.scale) * amount;
      image.style.transform = `translate3d(${view.x}px,${view.y}px,0) scale(${view.scale})`;
      if (Math.abs(view.tx - view.x) + Math.abs(view.ty - view.y) + Math.abs(view.zoom - view.scale) > .025) raf = requestAnimationFrame(draw);
    }

    function schedule() { if (!raf && dialog.open && !document.hidden) raf = requestAnimationFrame(draw); }
    function measure() {
      if (!image.naturalWidth || !stage.clientWidth) return;
      const fit = Math.min(stage.clientWidth / image.naturalWidth, stage.clientHeight / image.naturalHeight);
      fitted = { width: image.naturalWidth * fit, height: image.naturalHeight * fit };
      clampPan();
      schedule();
    }

    function setZoom(zoom) {
      view.zoom = Math.max(1, Math.min(5, zoom));
      if (view.zoom === 1) view.tx = view.ty = 0;
      clampPan();
      indicator.textContent = `${Math.round(view.zoom * 100)}%${view.zoom === 1 ? ' · Fit' : ''}`;
      stage.dataset.zoomed = String(view.zoom > 1);
      stage.dataset.maximumZoom = String(view.zoom === 5);
      schedule();
    }

    function stepZoom(direction = 1) {
      const steps = [1, 2.5, 5];
      const next = direction > 0 ? steps.find(step => step > view.zoom + .01) : [...steps].reverse().find(step => step < view.zoom - .01);
      setZoom(next ?? (direction > 0 ? 1 : 1));
    }

    function reset() {
      points.clear();
      gesture = null;
      stage.classList.remove('is-panning');
      lastTap = 0;
      setZoom(1);
      measure();
    }

    function position(point) { return { x: point.clientX, y: point.clientY }; }
    function span() {
      const [a, b] = [...points.values()];
      return { distance: Math.hypot(b.x - a.x, b.y - a.y), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    }

    stage.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      points.set(event.pointerId, position(event));
      stage.setPointerCapture(event.pointerId);
      if (points.size === 1) gesture = { start: position(event), x: view.tx, y: view.ty, moved: false, touch: event.pointerType === 'touch' };
      else if (points.size === 2) gesture = { ...gesture, pinch: span(), zoom: view.zoom, x: view.tx, y: view.ty, moved: true };
    });

    document.addEventListener('portfolio:pointer', ({ detail }) => {
      if (!dialog.open) return;
      for (const sample of detail.samples) if (points.has(sample.pointerId)) points.set(sample.pointerId, position(sample));
      if (points.size === 2 && gesture?.pinch) {
        const current = span();
        const box = stage.getBoundingClientRect();
        const scale = Math.max(1, Math.min(5, gesture.zoom * current.distance / Math.max(1, gesture.pinch.distance)));
        const ratio = scale / gesture.zoom;
        view.tx = current.x - box.left - box.width / 2 - (gesture.pinch.x - box.left - box.width / 2 - gesture.x) * ratio;
        view.ty = current.y - box.top - box.height / 2 - (gesture.pinch.y - box.top - box.height / 2 - gesture.y) * ratio;
        setZoom(scale);
        stage.classList.add('is-panning');
      } else if (points.size === 1 && gesture) {
        const point = [...points.values()][0];
        const dx = point.x - gesture.start.x, dy = point.y - gesture.start.y;
        if (Math.hypot(dx, dy) > 5) gesture.moved = true;
        if (gesture.moved && view.zoom > 1) {
          view.tx = gesture.x + dx;
          view.ty = gesture.y + dy;
          clampPan();
          stage.classList.add('is-panning');
          schedule();
        }
      } else if (detail.pointerType !== 'touch' && stage.contains(detail.target) && view.zoom > 1) {
        const box = stage.getBoundingClientRect(), limit = bounds();
        view.tx = (1 - 2 * (detail.clientX - box.left) / box.width) * limit.x;
        view.ty = (1 - 2 * (detail.clientY - box.top) / box.height) * limit.y;
        clampPan();
        schedule();
      }
    });

    function endPointer(event) {
      if (!points.has(event.pointerId)) return;
      points.delete(event.pointerId);
      if (gesture?.moved || event.type === 'pointercancel') ignoreClickUntil = performance.now() + 500;
      if (gesture?.touch && !gesture.moved && event.type === 'pointerup') {
        const now = performance.now();
        // A double tap counts as one step, not two steps through the cycle.
        if (now - lastTap > 300) stepZoom();
        lastTap = now;
        ignoreClickUntil = now + 500;
      }
      if (points.size === 1) gesture = { start: [...points.values()][0], x: view.tx, y: view.ty, moved: true, touch: true };
      else { gesture = null; stage.classList.remove('is-panning'); }
    }
    stage.addEventListener('pointerup', endPointer);
    stage.addEventListener('pointercancel', endPointer);
    stage.addEventListener('lostpointercapture', endPointer);
    stage.addEventListener('click', () => { if (performance.now() >= ignoreClickUntil) stepZoom(); });
    dialog.querySelectorAll('[data-certificate-zoom]').forEach(button => button.addEventListener('click', () => {
      if (button.dataset.certificateZoom === 'reset') setZoom(1);
      else stepZoom(button.dataset.certificateZoom === 'in' ? 1 : -1);
    }));
    dialog.addEventListener('keydown', event => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === '+' || event.key === '=') stepZoom();
      else if (event.key === '-') stepZoom(-1);
      else if (event.key === '0') setZoom(1);
      else if (view.zoom > 1 && /^Arrow(Left|Right|Up|Down)$/.test(event.key)) {
        if (event.key === 'ArrowLeft') view.tx += 60;
        if (event.key === 'ArrowRight') view.tx -= 60;
        if (event.key === 'ArrowUp') view.ty += 60;
        if (event.key === 'ArrowDown') view.ty -= 60;
        clampPan(); schedule();
      } else return;
      event.preventDefault();
    });
    dialog.addEventListener('certificate:open', reset);
    dialog.addEventListener('close', () => { cancelAnimationFrame(raf); raf = 0; reset(); });
    image.addEventListener('load', measure);
    new ResizeObserver(measure).observe(stage);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else schedule();
    });
    reduced.addEventListener('change', schedule);
  });
}());
