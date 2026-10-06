# Portfolio design, features and refactor checklist

Work branch: `design-overhaul-2`. Never change `main` or publish.
Existing Round 2 baseline: `.baseline/round-2/baseline/`; do not regenerate.
Preserve unrelated dirty files and CRLF. Each unit ends with its gate and commit.

## Units

| Unit | Status | Evidence / next action |
| --- | --- | --- |
| U1 Reconcile existing fixes | done | commit 67051e6 |
| U2 Focused visual fixes | done | commit 67051e6 |
| U4 Shared structure / CSS cleanup | done | commit 67051e6 |
| U-A Motion regression | todo | Fix motion-preference.js two-tier system (full/calm), footer toggle, tests. |
| U-B Certificates fill their frames | todo | Aspect-ratio from data, height:auto, 92%+ fill, third-card span fix. |
| U-C Features | todo | Discord button, Codeforces ID card, corner-grab flip. |
| U-D Stage A: plan + style tile | todo | Design plan, font selection, shape kit, style-tile.html. Stop for approval. |
| U-E Stage B: apply | todo | Hero, About, Services, Projects, Credentials, Activity, Contact redesign. |
| U-F Stage C: motion | todo | Hero load sequence, timeline draw, image unmask, single rAF scheduler. |
| U-G Hygiene and report | todo | Consolidate QA scripts, .gitignore, ARCHITECTURE.md, final report. |

## Resume rule

Read this file, `git status`, and `git log --oneline -15` only; continue the first unfinished unit. Do not re-audit completed units. Update this file after every commit. One commit per unit; stop after the current unit when about 25% of the session budget remains. Latest user scope overrides the earlier completion plan.

## Assumptions

- Codex's U1, U2 and U4 are verified done at commit 67051e6. Old U3/U5/U6/U7 are superseded by U-A through U-G.
- Stage A (U-D) is a standalone plan/style tile only. Stop for approval before applying Stage B/C.
