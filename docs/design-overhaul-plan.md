# Design overhaul plan

## Baseline and current findings

This work is isolated on the `design-overhaul` branch. The site is a static HTML/CSS/vanilla-JavaScript portfolio whose shared data lives in `js/portfolio-data.js`, whose cards are rendered by `js/portfolio-components.js`, and whose role pages reuse the template in `js/role-page.js`.

The audit found a long legacy stylesheet with repeated selectors and media-query overrides, a blocking Google Fonts `@import`, duplicated role-page document shells, broad use of the same premium-card treatment, and copy that describes a generic AI portfolio rather than a verifiable delivery practice. The loader also duplicated work before the first useful content. These are the non-frozen surfaces being cleaned up.

The protected Activity implementation remains frozen: ECPC, DEPI, Soft Skills, their flip/carousel JavaScript, their classes and data attributes, their premium-card wrappers, and every CSS rule containing `.flip-card`, `.ecpc-`, `.depi-visual-flip`, or `.soft-skills`. The theme custom properties and audio architecture are also treated as compatibility contracts.

The browser baseline covers the main and AI pages at 1440, 768, and 390px in both themes. Each combination includes 169 computed root properties, home/full-page captures, the four ECPC chapters and their flipped states, and front/back DEPI and Soft Skills captures. These files stay in the ignored `.baseline/` folder. Captures include live idle motion; pixel-perfect image equality is not a substitute for the frozen source contract.

## USP

> I build machine-learning models and the web apps that serve them, and I only claim what held-out evaluation and passing tests support.

This is the portfolio's single value proposition: useful ML delivery with honest evidence. It speaks to startups, research teams, and growing businesses that have a dataset, a prediction problem, or a manual workflow. The general identity is **Machine Learning Engineer**; each profession page adds its own technical emphasis without changing that promise.

## Section-by-section plan

1. **Document shell and typography** — remove the obsolete loader, replace the render-blocking font import with preconnected stylesheet links, align titles and social metadata around the USP, and keep all relative asset paths working under `/portfolio/`.
2. **Hero** — keep the typewriter hook and primary interaction, but make the headline and short description specific. Use one primary CTA and one secondary CTA, with a restrained technical signature (`model → evidence → delivery`) instead of decorative badges.
3. **Introduction / work** — give the project index stronger editorial rhythm and let evidence, evaluation, and serving details carry the hierarchy. The data source remains the only content source.
4. **About** — replace generic slogans with plain first-person prose about the delivery standard and the kinds of teams helped. Reduce repetitive value-card treatment while preserving the existing section hook.
5. **Services / toolkit** — retain the existing skills and project facts, but present them as a quieter index with clear hover/focus feedback and fewer competing containers.
6. **Activity** — no visual or interaction rewrite. ECPC, DEPI, Soft Skills, flip timing, sounds, and responsive carousel behavior stay byte-for-byte compatible at the protected selector/function level.
7. **Accomplishments / contact** — keep the data-driven cards and certificate dialog, improve spacing and CTA hierarchy, and repeat the USP where it helps a recruiter understand the evidence.
8. **Motion and accessibility** — use the existing reveal, pointer, idle-card, and audio systems; add only small transform/opacity transitions on non-frozen editorial surfaces. New motion respects reduced motion. The pre-existing forced-full-motion behavior is reported, not changed, per the requested scope.

## Scope decisions and findings left unchanged

- Follow-up exception: the user requested matching front/back sizes, then explicitly rejected scrolling or cramped contact backs. Profile frames now use intrinsic grid sizing: the back contributes its natural height before any flip, and the front fills the same frame. Contact IDs use a compact horizontal header on phones. There is no internal scrollbar or flip-triggered resizing. No flip timing, carousel, swipe, cue, or audio function changes accompany this fix. This exception necessarily allows the initial photo frame to grow when its contact content needs more room.

- No custom cursor: it is optional and would compete with the existing pointer-responsive glow.
- `motion-preference.js` unconditionally sets `data-motion="full"`. No source handles `prefers-reduced-motion`; the legacy `html[data-motion="reduced"]` rules are unreachable through current controls. This behavior is unchanged. Only new editorial movement has a reduced-motion media query.
- The current static and generated markup has no `[data-count]`, `.skill-bar-fill`, or `#ctaButton` target. The counter, skill-bar, and contact-modal injection sections in `script.js` are therefore unused by these pages. They are documented here without implementation changes.

## Verification gates

- No loader markup, loader JavaScript, or loader CSS remains.
- Ambience labels, tooltip, icon, slider label, `aria-pressed`, and cookie keys remain synchronized; cue playback does not depend on ambience state.
- `python -m unittest discover -s tests`, `python scripts/validate_site.py`, and `node --check` pass for every JavaScript file.
- Frozen Activity selectors/functions and theme custom-property values are unchanged from the saved baseline.
- The local preview is checked at 1440, 768, and 390px in both themes before any deployment is considered.

