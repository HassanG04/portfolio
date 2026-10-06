/* Resolve motion tier before styles load; follow OS changes and user overrides.
   Tiers: "full" (all animations) or "calm" (no looping/idle animation, no particles,
   no tilt, no magnetic pull; keeps hover/focus colour and opacity transitions).
   Resolution: URL ?motion=full|calm (also saved) > cookie portfolio_motion_v1
   > OS prefers-reduced-motion:reduce → calm > otherwise full. */
(() => {
  'use strict';
  const COOKIE_KEY = 'portfolio_motion_v1';
  const VALID = ['full', 'calm'];

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }
  function setCookie(name, value) {
    document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; max-age=31536000; SameSite=Lax';
  }

  /* Read URL param (highest priority) */
  function urlParam() {
    try {
      const val = new URLSearchParams(window.location.search).get('motion');
      if (val && VALID.includes(val)) {
        setCookie(COOKIE_KEY, val);
        return val;
      }
    } catch (_) { /* ignore */ }
    return null;
  }

  /* Read saved cookie */
  function saved() {
    try {
      const val = getCookie(COOKIE_KEY);
      if (val && VALID.includes(val)) return val;
    } catch (_) { /* ignore */ }
    return null;
  }

  /* OS preference */
  const osQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  function osDefault() { return osQuery.matches ? 'calm' : 'full'; }

  function resolve() {
    return urlParam() || saved() || osDefault();
  }

  function apply(tier) {
    document.documentElement.dataset.motion = tier;
  }

  /* Initial application */
  apply(resolve());

  /* Follow OS changes live (but user/URL override takes precedence) */
  osQuery.addEventListener('change', () => {
    /* Only update if the user has not made an explicit choice */
    if (!urlParam() && !saved()) {
      apply(osDefault());
    }
  });

  /* Expose setter for the toggle button */
  window.__portfolioMotion = {
    get tier() { return document.documentElement.dataset.motion; },
    set(val) {
      if (!VALID.includes(val)) return;
      setCookie(COOKIE_KEY, val);
      apply(val);
    },
    toggle() {
      const next = this.tier === 'full' ? 'calm' : 'full';
      this.set(next);
      return next;
    }
  };
})();
