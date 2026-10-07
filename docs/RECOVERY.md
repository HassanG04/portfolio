# RECOVERY: supersedes the units U-D to U-G in docs/BRIEF.md (U-A to U-C stay as built)
Read BRIEF.md sections "Working rules", "Locked", "Vision" and "Banned", then this file. The units below replace U-D to U-G.

## What went wrong in the last run
- The brief required a STOP at the style tile. The run built the redesign anyway, and its final report claimed U-A to U-G complete while PROGRESS.md listed U-F and U-G as todo.
- Tests and css-audit were green but never check what a visitor sees. The visual gate script (scripts/qa/ai-tells) was never written, so no visual gate ran.
- Measured on the rendered page: the hero portrait is invisible (.hero-img-ring uses clip-path: path() in fixed pixels); the h1 is 40 px at 1440 and 28 px at 390; Inter is loaded; section titles are left-aligned; "01"/"02" markers, a "01 / 04" overlay and uppercase labels remain; the social icon row touches the buttons; the Codeforces slide glow reads orange.

## Extra rules
1. Evidence or it did not happen. Every claim in a report needs a command output or a screenshot path. PROGRESS.md and your final message must agree. Never mark a unit done unless its gate passed; if a gate cannot run, write "not verified".
2. STOP means stop. After a unit that ends in STOP, end the session with the screenshots listed and wait. Never start the next unit.
3. Proof is screenshots at 390 and 1440 px, dark and light, saved under docs/shots/<unit>/ (git-ignored) and listed in your message.
4. Smallest possible diffs; keep CRLF; never reformat files you are not changing.

## Acceptance criteria (my complaints, made measurable; scripts/qa/ai-tells.mjs must check every one)
- HERO TYPE: h1 font-size at least 112 px at 1440 and at least 48 px at 390; "AI Engineer" is a lockup at least 44 px at 1440 and 28 px at 390; no overflow at 320 to 2560.
- HERO PORTRAIT: visible, at least 380 px wide at 1440. Any organic mask is an SVG <clipPath clipPathUnits="objectBoundingBox"> applied with clip-path:url(#id); `clip-path: path(` is banned in the CSS. Pixel check: at least 40% of the pixels in the portrait box differ from the page background.
- SECTION TITLES: ONE .section-anchor-heading definition. The title and its one-sentence sub line are both centered at 360, 768 and 1440 px (computed text-align:center and the element's centre within 2 px of the container's centre); the sub line sits under the title, not in a side column.
- NO template tells: zero numbered section markers or "01 / 04" overlays (the 1 to 4 chapter buttons are fine); at most 2 uppercase or tracked-out labels site-wide; zero middle-dot strings; no Inter or any banned font in a <link> tag or a computed font-family.
- ICONS: every icon inside a button, pill or row has its centre within 1 px of its container's centre on the cross axis, with a consistent gap to its label; the vertical gap between the hero button row and the social row is at least 20 px; icons never overlap text.
- SLIDE 4 (the Codeforces slide) AMBIENCE: I approve ONE exception to the purple-only palette, on this slide only (front and back): blue #3B82F6, red #EF4444, yellow #EAB308. Build three spatially separate blurred lobes behind the card (blue upper-left, red upper-right, yellow bottom), each at least 0.35 alpha at its centre and fading to 0 within 60% of the card width. Never stack them as one box-shadow. In full motion the lobes orbit slowly (a 24 to 30 s rotation); in calm motion they are static. The ID card's border is a three-colour conic gradient and its inner background stays neutral (no yellow tint). Works in both themes. Gate: in a screenshot of the aura region, each of blue (hue 200 to 230), red (hue 350 to 10) and yellow (hue 40 to 55) covers at least 3% of the pixels and orange (hue 15 to 35) covers under 20%.
- Plus every gate in the BRIEF's "Gates for U-D to U-G" list.

## Units, in this order
R1 Gate script. Write scripts/qa/ai-tells.mjs (Playwright through npx, not added as a dependency) implementing every criterion above. Run it on the current state and save the failing report to docs/shots/R1/report.txt. Commit.
R2 Slide 4 ambience only (the criterion above). Commit.
R3 Stage A (BRIEF U-D): design plan, review log, style tile. STOP and wait for my approval of the display font and the layout.
R4 Hero only: type lockup, portrait with a valid mask, one primary and one secondary button, the social row. STOP with screenshots and the gate report.
R5 About, Services and Tools. Titles centered per the criterion. STOP.
R6 Projects, Credentials, Activity (the ECPC deck is the star) and Contact. STOP.
R7 Motion (BRIEF U-F) and hygiene (BRIEF U-G). Report with the evidence rule.