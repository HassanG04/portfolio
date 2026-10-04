# Design-overhaul review

Local preview only. Branch: `design-overhaul`. Baseline commit: `658dea7941962c1321fb2837b1ca3bbec2ad58df`. Nothing has been deployed or pushed.

## Positioning and composition

The general identity is **Machine Learning Engineer**.

> I build machine-learning models and the web apps that serve them. I only claim what held-out evaluation and passing tests support.

The promise appears in the main hero and About introduction, the shared data, all six pages' description/OG/Twitter metadata, and the footer's shorter formulation. The titles pair the identity with “Models to software” or a role-specific focus. Each profession's headline, description, and promise adds its own application of the same evidence-led delivery standard.

| Surface | Change |
| --- | --- |
| Hero | Asymmetric text/photo layout, one primary CTA and one résumé CTA, quiet availability note, existing social links. A single data → model → evaluation → application signature includes the linear-model equation. |
| Portrait | Original float, breathing, and smooth hover enlargement restored on request. Large 442 × 509px desktop/tablet frame; approximately 316 × 365px at 390px viewport. No small mobile thumbnail. |
| Selected work | One lead project and two compact entries on wide screens; stacked readable stories on phones. Existing project evidence and images retained. |
| About | Shared prose/education/experience builder replaces duplicated value-card markup. No invented achievements. |
| Services/toolkit | Deliverable index and a lighter toolkit strip. Existing skill hover glow and sound remain. |
| Activity | Renderers, carousel, flip timing, and cues retained. Only the separately requested contact-card sizing exception changes geometry. |
| Accomplishments | Clear qualification grid and project implementation notes. Certificate inspection retained. |
| Contact/footer | A direct project question and consistent identity/USP; redundant trust/“who I help” panels removed. |
| Typography | Sora and Source Sans 3 loaded through preconnected links instead of a blocking CSS import. |

## Contact-card correction

The user superseded the initial frozen-size restriction by requesting equal front/back sizes, no cramped details, and no internal scrolling.

The frame now uses a shared grid. A ratio placeholder preserves the photograph's preferred proportions, while the contact back contributes its intrinsic height before flipping. Both faces therefore occupy the same frame in both states. Long content enlarges the **whole frame**, not just its back. Mobile identity cards use a compact avatar/name header; descriptions and links retain their own lines.

No contact content is hidden or truncated. Photos use their existing contain treatment. A taller frame on phones can leave space around a landscape photograph; that is the deliberate tradeoff for showing complete contacts with neither cropping nor nested scrolling.

Representative measured sizes, front and back identical:

| Viewport | ECPC chapter 1 | DEPI instructor | Soft Skills instructor |
| --- | --- | --- | --- |
| 390px | 318 × 479 | 320 × 370 | 310 × 387 |
| 768px | 613 × 397 | 440 × 447 | 617 × 445 |
| 1440px | 717 × 422 | 340 × 470 | 693 × 445 |

All measured contact backs have `scrollHeight === clientHeight`. A 2px border explains the difference between the DEPI outer frame and face dimensions.

## Architecture and cleanup

- No new framework, dependency, or build step.
- `portfolio-data.js` owns identity, USP, About facts, role copy, and existing project data.
- `portfolio-components.js` adds shared About and technical-signature builders. Existing Activity render functions remain unchanged.
- `main-page.js` fills the shared slots; `role-page.js` consumes those same builders. Outer document/template layout changes were applied in parallel.
- `editorial.css` owns non-Activity composition, with explicit tablet and phone layouts. Obsolete legacy rules were removed rather than adding an override chain.
- Removed 454 obsolete non-Activity CSS rules during consolidation, then removed unused animation definitions. Restored the two original portrait keyframes at the user's request.
- Removed loading-screen markup from all six pages and its CSS/JS. The inline theme initialization and boot cue remain.
- `script.js` changes are limited to loader removal and explicit ambience labels. Audio, carousel, pointer, reveal, and flip implementations are otherwise unchanged.

## Verification evidence

The ignored `.baseline/` folder contains the original captures and final captures. `final-results.json` records 12 combinations: main/AI × 390/768/1440 × light/dark.

- **169 computed root custom properties compared per combination: zero differences.**
- **72 front/back pairs measured: zero size changes on flipping; zero internally scrolling backs.**
- No horizontal page overflow or broken sourced images in those combinations. The initially empty certificate-dialog image is excluded until a certificate is opened.
- All four ECPC chapters and their flipped states, plus both DEPI and Soft Skills faces, have saved screenshots.
- Portrait animations are `profile-float` and `profile-portrait-breathe` in every final combination.
- Source contract comparison passes, explicitly accounting for the authorized contact-frame exception and ambience-label changes.

### Main and role previews

| Page | Dark | Light |
| --- | --- | --- |
| Main, desktop | [Screenshot](../.baseline/final-main-1440-dark-home.jpg) | [Screenshot](../.baseline/final-main-1440-light-home.jpg) |
| AI, desktop | [Screenshot](../.baseline/final-AI-1440-dark-home.jpg) | [Screenshot](../.baseline/final-AI-1440-light-home.jpg) |
| Main, mobile | [Screenshot](../.baseline/final-main-390-dark-home.jpg) | [Screenshot](../.baseline/final-main-390-light-home.jpg) |
| AI, mobile | [Screenshot](../.baseline/final-AI-390-dark-home.jpg) | [Screenshot](../.baseline/final-AI-390-light-home.jpg) |

### Activity before/after examples

| State | Baseline | Final |
| --- | --- | --- |
| ECPC desktop photo | [Before](../.baseline/main-1440-dark-ecpc-1.jpg) | [After](../.baseline/final-main-1440-dark-ecpc-1.jpg) |
| ECPC mobile contacts | [Before](../.baseline/main-390-light-ecpc-1-flipped.jpg) | [After](../.baseline/final-main-390-light-ecpc-1-flipped.jpg) |
| DEPI mobile contacts | [Before](../.baseline/main-390-light-depi-flipped.jpg) | [After](../.baseline/final-main-390-light-depi-flipped.jpg) |
| Soft Skills desktop contacts | [Before](../.baseline/main-1440-dark-soft-skills-flipped.jpg) | [After](../.baseline/final-main-1440-dark-soft-skills-flipped.jpg) |

Live idle animation and timing can differ between screenshots; the source and computed-value checks are the precise preservation checks.

### Audio

A local-only instrumented copy uses the real production scripts and browser audio implementations. Trusted browser clicks and range-key events exercised the controls. The diagnostic records successful audio-source starts with a running AudioContext; it does not claim to measure the user's speakers.

With ambience disabled, and separately with ambience enabled at 0%, the browser successfully started:

- `cursor.mp3`: pointer entry during interaction.
- `select.mp3` / `select2.mp3`: normal controls and theme changes.
- `left.mp3` / `right.mp3`: flip and return.
- `right.mp3` + `front.mp3`: increasing ECPC chapter.
- `left.mp3` + `back.mp3`: decreasing ECPC chapter.
- `select2.mp3` / `select.mp3`: opening/closing a certificate.

Records: `.baseline/audio-muted.json` and `.baseline/audio-zero.json`. Production audio was not instrumented or refactored. The local preference was restored to ambience off, volume 14%. The original cookie keys remain. Labels now explicitly refer to **background ambience**. No browser errors/warnings were returned during this test.

### Automated checks

- `python -m unittest discover -s tests`: 11 tests pass.
- `python scripts/validate_site.py`: 7 pages validated, including local assets/anchors, IDs, and dynamic project images.
- `node --check`: all six JavaScript source files pass.
- `node --test tests/*.test.cjs`: 17 tests pass.
- `python scripts/verify_design_contract.py`: all six preservation checks pass.

The extra browser smoke check of ML/DS/DA/DE was interrupted by the local preview server dropping its connection. Those four routes are covered by the source/rendering tests and validator, but not an additional final browser session. The main and AI visual matrix above was completed. This is not a full manual WCAG audit.

## Findings intentionally left unchanged

1. `motion-preference.js` forces `data-motion="full"`; legacy reduced-mode selectors cannot currently be reached. The requested original portrait motion follows that existing contract. Only the newly introduced signature transition has a direct reduced-motion alternative. Changing the global preference mechanism was explicitly out of scope.
2. Counters, skill bars, and contact-modal injection in `script.js` have no `[data-count]`, `.skill-bar-fill`, or `#ctaButton` targets in the current static/generated markup. They remain unchanged as requested.
3. Further removal of obsolete Activity selectors would require lifting the frozen CSS constraint. No claim is made that every legacy selector is now necessary.

## Scope safety

No main-branch changes or publication. Unrelated pre-existing image/document edits and freelance drafts were not included in the overhaul changes. Baselines, diagnostic pages, logs, and screenshots remain git-ignored.
