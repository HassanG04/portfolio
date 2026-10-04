# Portfolio design, features and refactor checklist

Work branch: `design-overhaul-2`. Never change `main` or publish.
Existing Round 2 baseline: `.baseline/round-2/baseline/`; do not regenerate.
Preserve unrelated dirty files and CRLF. Each unit ends with its gate and commit.

| Unit | Status | Evidence / next action |
| --- | --- | --- |
| U1 Reconcile existing fixes | done | 48 mouse/touch groups pass across six routes, both themes/motion preferences; 16 audio cases; unchanged 1,352 tokens/144 protected flip states. Prior geometry/ID/tag evidence remains valid. |
| U2 Focused visual fixes | done | Removed hero caption/line and all leading-dash labels, removed DEPI eyebrow dash, and scoped a 36px/inset return control. Fonts unchanged. 108 measurements, 39 interaction checks, 1,352 tokens/144 flip states unchanged. |
| U3 Features | todo | Existing-design Hassan progress badge, Discord ID 753929399291609130, ECPC corner-only grab flip; no ribbons or touch hold. |
| U4 Shared structure / CSS cleanup | todo | Shared section builders, people registry and canonical layered CSS; current override chain remains. |
| U5 Redesign / motion | skipped | Canceled by latest user request; no icon-text reveal, cursor, command palette or video-reference work. |
| U6 Hygiene / report | todo | Consolidate QA, document architecture, list unused images without deleting, report verified results. |
| U7 JS modules | skipped | Canceled by latest user request. |

## Current evidence

- Revised U1: `.baseline/round-2/phase-1/carousel-checks.json` has 49 passing groups (48 navigation groups plus 16-case audio-isolation summary). `.baseline/round-2/unit-2-contract-diff.json` has no differences; the `unit-2` folder name predates the revised numbering.
- Revised U1 code gate: 11 Python tests, 26 Node tests, every JS syntax check, seven-page validator and git diff whitespace checks pass. Seven protected flip/navigation/audio functions match the prior commit exactly. Preview server verified at port 4185 with no JavaScript errors.
- Revised U2: `visual-2` screenshots and live tag layouts pass at 390/1440 in both themes; `visual-2/measurements.json` passes all 108 views from 320 to 2560; `compare-round-2 visual-2` reports zero protected differences. 39 interaction checks pass after one timing-only retry. The existing `ambience.mp3 ERR_ABORTED` preload warning remains harmless and is unchanged.
- Phase 0 passed before edits: 32 views, 576 screenshots, 576 flip states and 169 root properties per view.
- Prior committed fixes: `4bfd19f` identity, `192b94d` formula removal, `9052656` old About treatment.
- `.baseline/round-2/phase-1/measurements.json`: 108 views, no failures (all six routes, both themes, 320–2560 px live resizing).
- `.baseline/round-2/phase-1/interaction-checks.json`: 38 checks passed across all six routes/both themes, plus touch pinch/drag, portrait pulse and reduced motion.
- Twelve `*-live-layout.json` reports: 108 viewport states, all tool tags unclipped at rest, hover and keyboard focus.
- `.baseline/round-2/phase-1-contract-diff.json`: zero differences across 5,408 root-token values and 576 flip states; carousel transition properties also identical.
- `.baseline/round-2/phase-1/audio-checks.json`: 16 browser cases confirmed cue playback starts while ambience is off or at zero. This verifies browser audio playback, not physical speaker output.
- Code gate: 11 Python tests and 24 Node tests passed; all source/test/script JS syntax checks passed; seven-page site validation passed.
- The capture reports a canceled background-audio preload (`ambience.mp3 ERR_ABORTED`) when playback restarts; no missing local image or JavaScript error was reported.
- Current preview: http://127.0.0.1:4185/?preview=round2-fixes-1#home (restart local server if needed).
- No LinkedIn access, scraping, fetching or syncing. Only normal outbound profile links.
- No new person images. Existing `images/hadeer-makhlouf.jpeg` is a silhouette placeholder and stays unchanged.

## Resume rule

Read this file, `git status`, and `git log --oneline -15` only; continue the first unfinished unit. Do not re-audit completed units. Update this file after every commit. One commit per revised unit; stop after the current unit when about 25% of the session budget remains. Latest user scope overrides the earlier completion plan.
