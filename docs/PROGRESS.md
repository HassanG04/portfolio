# Portfolio design, features and refactor checklist

Current fix branch: `codex/activity-sizing-fixes`, created from the user's current checkout. Keep `main` unchanged. The latest user request authorizes publishing these mobile fixes before returning to freelance accounts.
Existing Round 2 baseline: `.baseline/round-2/baseline/`; do not regenerate.
Preserve unrelated dirty files and CRLF. Each unit ends with its gate and commit.

## Units

| Unit | Status | Evidence / next action |
| --- | --- | --- |
| U1 Reconcile existing fixes | done | commit 67051e6 |
| U2 Focused visual fixes | done | commit 67051e6 |
| U4 Shared structure / CSS cleanup | done | commit 67051e6 |
| U-A Motion regression | done | Fix motion-preference.js two-tier system (full/calm), footer toggle, tests pass. |
| U-B Certificates fill their frames | done | Image dimensions added to portfolio-data.js, component emits --cert-ratio, pages.css uses aspect-ratio and 4% padding. |
| U-C Features | done | Added Discord buttons, Codeforces ID card and corner-grab flip physics. |
| U-D Stage A: plan + style tile | done | Design plan, font selection, shape kit, style-tile.html. Stopped for approval. |
| U-E Stage B: apply | todo | Hero, About, Services, Projects, Credentials, Activity, Contact redesign. |
| U-F Stage C: motion | todo | Hero load sequence, timeline draw, image unmask, single rAF scheduler. |
| U-G Hygiene and report | todo | Consolidate QA scripts, .gitignore, ARCHITECTURE.md, final report. |
| Requested activity sizing fixes | source checks passed; deploy approval needed | Removed a stray CSS brace restoring phone breakpoints, capped DEPI at 340px, separated the ECPC 4 logo and caption; 19 Python + 34 Node tests, 7-page validation, 8 JS syntax checks and zero CSS duplicate pairs pass. Browser visual verification remains blocked. Pages permits only main: ask before overriding the earlier never-touch-main restriction. |
| Requested freelance account follow-up | todo | Review saved Upwork/Fiverr/Khamsat/Mostaql work after the card fixes; keep service drafts unpublished. |

## Resume rule

Read this file, `git status`, and `git log --oneline -15` only; continue the first unfinished unit. Do not re-audit completed units. Update this file after every commit. One commit per unit; stop after the current unit when about 25% of the session budget remains. Latest user scope overrides the earlier completion plan.

## Assumptions

- Codex's U1, U2 and U4 are verified done at commit 67051e6. Old U3/U5/U6/U7 are superseded by U-A through U-G.
- Stage A (U-D) is a standalone plan/style tile only. Stop for approval before applying Stage B/C.
