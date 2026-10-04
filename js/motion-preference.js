/* Resolve the OS preference before styles load, and follow changes live. */
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const applyPreference = () => {
    document.documentElement.dataset.motion = preference.matches ? 'reduced' : 'full';
  };
  applyPreference();
  preference.addEventListener('change', applyPreference);
})();
