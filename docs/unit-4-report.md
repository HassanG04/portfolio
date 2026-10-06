# Unit 4: shared structure and stylesheet ownership

Branch: `design-overhaul-2`. Local only; nothing published.

## Changes

The main page and five role pages now use the same section builders in
`js/portfolio-components.js`. Their entry scripts only select the role and
relative asset path. Role-shell parity, required IDs and person references are
covered by tests. The USP, About introduction and people registry live in
`js/portfolio-data.js`; no profile data is fetched from other sites.

The override chain has been replaced by four directly linked stylesheets:

- `tokens-base.css`: existing tokens, reset, base typography and container widths.
- `components.css`: navigation, controls, dialog, tags and shared feedback.
- `pages.css`: hero, About, services, projects and page composition.
- `activity.css`: activity media, badge faces, flip cards and carousel.

Every selector has one owning file. Repeated rules were consolidated by media
condition, rather than covered with another override sheet. Activity photos
share one `object-fit: contain` declaration. Five documented priority overrides
remain for Bootstrap. Production fonts and all interaction controllers are
unchanged.

## Structure gate

Counts use the same balanced-block audit before and after (HEAD `5690501`
versus this unit), excluding keyframe steps and CSS comments.

| Metric | Before | After |
| --- | ---: | ---: |
| CSS lines | 6,566 | 4,444 |
| CSS files | 4 | 4 |
| Duplicate selector/condition pairs | 230 | 0 |
| Cross-file selector duplicates | 64 | 0 |
| `!important` declarations | 114 | 5 |
| Unreferenced classes outside the dynamic allowlist | 92 | 0 |
| JavaScript source lines | 2,270 | 2,339 |
| JavaScript source files | 8 | 8 |

The allowlist covers generated tag tones, delay classes and runtime state
classes; it is not a CSS-coverage exclusion list. All source is still vanilla
HTML/CSS/JavaScript with no build step or added dependency.

## Verification

Artifacts are ignored under `.baseline/round-2/structure-4/`. The original
baseline was not regenerated.

- Python: 14 tests passed. Node: 30 tests passed. Syntax: 20 JavaScript files passed.
- Site validator: seven pages, local files/anchors, IDs and generated image paths passed.
- CSS audit: 0 duplicate pairs, 0 cross-file duplicates, 5 documented priorities,
  0 unreferenced classes outside the allowlist.
- Computed baseline comparison: 8 views, 1,352 root-property values and 144
  protected flip states; **zero differences**. Carousel transition properties
  also match across the recorded live-resize widths.
- Geometry: 108 route/theme/viewport combinations passed, including live resize
  from 320 through 2560 px. Natural photo ratios, equal flip faces, readable ID
  cards, unclipped tags and the inset DEPI return control passed.
- Interactions: 39 checks passed across all six pages and both themes, plus
  touch certificate gestures and reduced-motion portrait behavior.
- Carousel: 48 mouse/touch groups passed across all six pages, both themes and
  motion preferences. The report's 49th entry is the audio-isolation summary.
- Audio: 16 cases recorded actual browser playback starts for hover, click,
  theme, flip, chapter and certificate cues with ambience muted or at zero.
  This confirms browser playback, not physical speaker output.
- Main and AI screenshots cover 390/1440 px in both themes, including every
  ECPC chapter, flipped cards and the open certificate viewer.

Chrome CSS coverage across those states was 86.4% for activity, 86.7% for
tokens/base, 85.0% for pages and 70.2% for components. Coverage is a record of
executed styles, not proof that every unexecuted responsive/state rule is dead.
No JavaScript errors or missing local images were reported. The existing
`ambience.mp3 ERR_ABORTED` preload cancellation occurs when playback restarts.

## Review images

- Main: `main-1440-dark-hero.png`, `main-390-light-hero.png`.
- Role: `AI-1440-light-hero.png`, `AI-390-dark-hero.png`.
- Activity: `main-390-light-depi-flipped.png`,
  `AI-1440-dark-ecpc-1-flipped.png`, `main-390-dark-soft-skills-front.png`.

All paths above are relative to the artifact directory. New features are the
next unit; production styling/fonts remain pending a separate style-tile review.
The obsolete first-overhaul source-rule comparison helper will be retired when
U6 consolidates QA; the current computed-style comparison replaces that check.
