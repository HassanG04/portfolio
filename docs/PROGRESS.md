# Portfolio completion checklist

Work branch: `design-overhaul-2`. Never change `main` or publish.
Existing Round 2 baseline: `.baseline/round-2/baseline/`; do not regenerate.
Preserve unrelated dirty files and CRLF. Each unit ends with its gate and commit.

| Unit | Status | Evidence / next action |
| --- | --- | --- |
| U1 Verify existing fixes | done | Geometry and tag states: 108 views each; 38 interaction checks; 16 audio cases; zero protected-style differences. Initials badges and refreshed 390/1440 main/AI screenshots verified in both themes. |
| U2 ECPC drag / reduced motion | todo | Existing navigation still uses touchstart/touchend; no changes yet. |
| U3 CSS cleanup | todo | Legacy three-file override chain remains; audit, remove dead selectors, consolidate Activity, then merge files in separate commits. |
| U4 Shared section builders / data | todo | Portrait, About, cards and inspector are shared; full page templates and people registry still need consolidation. |
| U5 Repo hygiene | todo | Existing QA scripts remain in scripts/; no image deletion approved. |
| U6 JS modules (lowest priority) | todo | Main behavior still in script.js; defer if session budget reaches its stopping threshold. |
| U7 Final report | todo | Report only verified evidence and explicitly list unfinished units. |

## Current evidence

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

Read this file, `git status`, and `git log --oneline -15` only; continue the first unfinished unit. Do not re-audit completed units. Update this file after every commit. No new style/personality features belong to these units.
