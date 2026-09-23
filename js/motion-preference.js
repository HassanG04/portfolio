/* Animate by default; keep each visitor's explicit choice across all pages. */
(() => {
  const root = document.documentElement;
  const storageKey = 'portfolio-motion';
  let preference = null;
  let toggle = null;

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'full' || saved === 'reduced') preference = saved;
  } catch (_) { /* Motion controls also work when storage is unavailable. */ }

  function applyMotion() {
    const mode = preference || 'full';
    root.dataset.motion = mode;
    if (!toggle) return;
    const enabled = mode === 'full';
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.setAttribute('aria-label', enabled ? 'Reduce animations' : 'Enable animations');
    toggle.querySelector('.motion-preference-description').textContent = enabled
      ? 'Idle motion, smooth hover & transitions'
      : 'Reduced motion — minimal movement';
    toggle.querySelector('.motion-preference-state').textContent = enabled ? 'On' : 'Off';
  }

  applyMotion();
  document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('portfolioMenu');
    if (!menu) return;
    toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.id = 'motionPreferenceToggle';
    toggle.className = 'motion-preference-toggle interactable';
    toggle.innerHTML = '<i class="fas fa-wave-square" aria-hidden="true"></i>'
      + '<span><strong>Animations</strong><small class="motion-preference-description"></small></span>'
      + '<span class="motion-preference-state" aria-hidden="true"></span>';
    toggle.addEventListener('click', () => {
      preference = root.dataset.motion === 'full' ? 'reduced' : 'full';
      try { localStorage.setItem(storageKey, preference); } catch (_) { /* Session-only choice. */ }
      applyMotion();
    });
    menu.append(toggle);
    applyMotion();
  });
})();
