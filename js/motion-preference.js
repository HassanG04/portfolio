/* Keep motion enabled across every portfolio, without a settings button. */
(() => {
  // A stale choice from the removed toggle must not silently disable motion.
  document.documentElement.dataset.motion = 'full';
})();
