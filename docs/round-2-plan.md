# Round 2 implementation and verification plan

## Scope and gates

Work stays on `design-overhaul`. Do not modify `main`, publish, or deploy.
Start point: `05ca297fd21c8de54cce738b20ac4c6f04b21dea`.
Unrelated existing work, including workflow edits, validation results, freelance
documents and `images/portfolio.png`, is excluded from this round's commits.
Preserve the CRLF format of existing source files. Change asset version queries
whenever an asset changes. No site dependencies or build step are introduced.

Each phase must pass its gate before the next starts. A failing capture or test
is not evidence of a passing baseline. Phase status is recorded below.

## Phase 0: establish evidence

- Use `scripts/round-2-browser.cjs` through `npx`, with the bundled Playwright
  runtime and Chrome, against the local server. Save artifacts exclusively in
  the ignored `.baseline/round-2/` directory.
- Capture main and AI at 360, 390, 768, 1024, 1280, 1440, 1920 and 2560 pixels
  in dark and light themes. Capture hero, About, Services/tools, each ECPC
  chapter front/back, DEPI front/back, Soft Skills front/back, accomplishments
  and the open certificate dialog. Do not disable animation to take screenshots.
- Record every computed root property and flip transition, transform,
  perspective, transform-style, backface-visibility and animation at rest,
  hover and flipped. Retain every requested width, not only the three required
  computed-style widths. Save initial geometry and Chrome CSS coverage.
- Find the old About implementation. `27f4fb1` introduced `editorial.css`;
  `658dea7` is the complete pre-overhaul version, before the markup refactor.
  Its About wrapper is 220px square (180px at its small-screen breakpoint),
  with `rotate-ring` and `pulse-glow`. Later rules in that commit change its
  corners, border and alignment; recover their effective values, not just the
  first declarations.
- Historical finding: `renderProfileId` in `658dea7` already ignores
  `person.image`. Showing Hadeer's supplied portrait is a new bug fix.
- The old portrait was also rendered in an isolated browser from Git sources,
  without checking out files. Effective image dimensions are 180px at 390px
  and 220px at 1440px, with 32px corners, top-centered cover fit, 1px theme
  border, `--shadow-card`, a 5s linear ring and a 3.5s glow pulse.
- Source image dimensions: ECPC1 2048x1207, ECPC2 1600x1066, ECPC3 1200x800,
  DEPI logo 225x224, Soft Skills 1280x720, instructor portrait 554x554.
- Initial live tag audit (main/AI, both themes, nine widths from 320 to 2560):
  no clipped text or borders reproduced at rest/hover/focus. The light
  pseudo-element is nevertheless cut by its own `overflow:hidden` ancestor
  (`inset:-2px`). The toolkit also has no inline breathing room. Do not label
  a non-reproduced text-clipping failure as verified.
- Initial tests: 11 Python tests, 17 Node tests, all six JS syntax checks and
  the seven-page static validator pass. Raw outputs remain in the task log.

Gate: all 32 route/width/theme combinations captured, all 18 flip states per
combination present, fonts/icons loaded, no missing local image, baseline
manifest complete. Existing product defects are recorded, not treated as
capture failures.

## Phase 1: correctness before style

1. Make AI Engineer the shared identity and update all metadata, primary/AI
   USP and footer copy. Preserve specialist labels, especially ML Engineer.
   Enlarge the hero identity without competing with the heading. Check 360px.
2. Separate portrait tilt, counter-parallax and idle transforms across wrappers.
   Use a shared pointer controller that Phase 3 can extend. Stop on reduced
   motion, coarse-pointer tap pulse only, and pause work when hidden/offscreen.
3. Delete the formula renderer, render slot, styles, animation and references.
4. Restore the effective pre-overhaul About portrait markup and animated
   treatment once, keeping the current factual prose and shared renderer.
5. Reproduce tag clipping in baseline metrics/screenshots. Consolidate tag
   geometry at its actual source, allow glow space, and remove shrinking or
   overflow causes. Test all main and role tags at rest, hover and focus.
6. Read real image dimensions and store them in activity data. Give photos
   intrinsic-ratio, contain-fit frames. Remove phantom sizing boxes. Use a
   minimum 60% desktop media column and a full-width media row below 992px.
   Check fixed sizes and a continuous resize sweep.
7. Separate readable, consistently proportioned badges from photo sizing.
   Give unlinked IDs a purple ambient/hover treatment and hover sound, without
   link semantics or pointer cursor. Keep linked IDs blue. Render the supplied
   instructor portrait in a rectangular contain-fit window with icon fallback.
   The user chose equal front/back sizes on narrow phones: show one teammate
   at a time with small previous/next controls rather than expanding the back.
   Retain the complete set of teammates and accessible names/counts.
8. Verify the Soft Skills front and instructor back separately. Preserve all
   protected flip transforms and timings while changing only face layout.
9. Extend the native certificate dialog with an isolated inspector: fitted
   full-resolution image, stepped zoom, smoothed hover pan, drag, touch pinch,
   keyboard controls, reset and zoom indicator. Keep focus return and cues.

Gate: geometry checks at all widths plus live resize; identity/metadata tests;
photo, badge and tag measurements; certificate mouse/touch/keyboard tests;
empty root-token diff and empty protected flip-property diff; audio isolation;
Python tests, site validation and syntax checks.

## Phase 2: remove the override chain

- Assign each component to one stylesheet. Fold duplicate selectors together
  within their media context without altering cascade results. Keep all root
  token values and protected transition/rotation values unchanged.
- Use accumulated Chrome CSS coverage as candidate evidence, not as automatic
  permission to delete rules. Exercise every role, breakpoint, theme, hover,
  focus, flip, menu and certificate state, then confirm unmatched selectors
  against dynamic renderers before removing them.
- Add a duplicate-selector report keyed by selector and media/support context.
  It must finish with no unexplained duplicate selectors. Document any necessary
  Bootstrap `!important` use at the declaration.
- Confirm and remove unused counters, skill bars and contact-modal injection.
  Keep the sound implementation separate and intact. Consolidate repeated
  runtime behavior and remove obsolete helpers only with test coverage.
- Check semantic HTML, ID uniqueness, shared role-page parity and fallback
  content. Record CSS/JS line counts before/after; do not optimize for line count.

Gate: duplicate report clean; coverage report reviewed; required tests pass;
protected computed-style comparison still empty. Only then add personality.

## Phase 3: personality on clean foundations

- Shared centered headings with warm factual copy, drawing underline and
  left-aligned body copy; centered contact CTA. Keep claims unchanged.
- Vary composition through curved/angled separators, restrained existing-color
  glows, offsets and staggered layouts. Avoid compromising activity media.
- Add split heading reveals, staggered entrances, project/credential tilt and
  spotlight, image reveal, magnetic social buttons, scroll progress, active-nav
  pill and back-to-top ring. Reuse one passive, frame-throttled pointer stream.
- Add a fine-pointer dot/ring cursor with Drag/Zoom cues. Preserve text/input
  cursors and selection. Pause loops when hidden and avoid offscreen work.
- Extend only ECPC navigation: horizontal threshold, live track drag, velocity
  snap, wrap, click suppression and existing cues. Preserve text selection,
  vertical touch scrolling, flip rotation, keyboard and arrow controls.
- Honor OS reduced motion through `motion-preference.js`, including changes
  while the page is open. Reduced mode shows all content without movement.
- Command palette is optional and deferred unless the required work is fully
  verified. No new dependency for optional navigation.

Gate: rerun Phase 2 checks, all six pages and both themes, mouse/touch, reduced
motion, hidden-tab behavior, audio separation, no overflow or console errors.
Review before/after 390/1440 screenshots and show the local preview. No publish.

## Initial counts (line count includes final empty line)

| File | Lines |
| --- | ---: |
| css/style.css | 5,386 |
| css/design-system.css | 998 |
| css/editorial.css | 199 |
| js/main-page.js | 26 |
| js/motion-preference.js | 6 |
| js/portfolio-components.js | 222 |
| js/portfolio-data.js | 258 |
| js/role-page.js | 66 |
| js/script.js | 1,372 |

## Progress

- Phase 0: PASS. All 32 combinations, 576 required screenshots, 576 recorded
  flip states and 36 live-resize views are saved. Every view has 169 root
  properties. Production-source hashes are unchanged. No unresolved capture
  issues remain. Four extra 320px tool screenshots and four historical About
  screenshots are also retained. See `.baseline/round-2/phase-0-gate.json`.
- Phase 1: not started.
- Phase 2: not started.
- Phase 3: not started.
