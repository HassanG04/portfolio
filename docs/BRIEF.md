# PORTFOLIO BRIEF: HassanG04/portfolio
Save this file as docs/BRIEF.md and do not edit it. Read it and docs/PROGRESS.md at the start of every session, then continue with the first unfinished unit. You are taking over from another agent (Codex), whose work is verified up to commit 67051e6.

## Working rules
1. Resume: read docs/PROGRESS.md, run `git status` and `git log --oneline -15`. Work on branch design-overhaul-2 (create it from the current HEAD if it is missing). Never touch main. Never push or publish. One unit per commit ("unit X: ..."); after each commit update PROGRESS.md with the unit, its status and one line of evidence.
2. Your quota is limited. Never print whole files (use grep -n, sed -n 'A,Bp', head, tail); read only the ranges you edit; keep reasoning short; run the full gate and take screenshots only at the end of a unit (390 and 1440 px, both themes). If you hit a rate limit or estimate under 25% left: finish the unit, commit, update PROGRESS.md, and stop with a 5-line summary.
3. Do not guess. If something is not specified, take the most conservative option, log it under "Assumptions" in PROGRESS.md and continue. Never invent facts, metrics, links or claims; use only what is in js/portfolio-data.js.
4. If a unit fails its gate twice, stop and tell me what blocks it. Do not loop.
5. Static site, no build step, no new dependencies. Preview with `python -m http.server`. For browser checks use your browser tool or Playwright through npx (never added as a dependency). Keep CRLF line endings in files that use them. Bump the ?v= query on every edited asset.
6. Before changing anything run: python -m unittest discover -s tests; python scripts/validate_site.py; python scripts/css-audit.py; the node tests in tests/*.cjs; node --check on each JS file. Confirm they pass. The computed-style baseline is commit 67051e6; if .baseline/ is missing, regenerate it from that commit in a temporary worktree.

## State of the project (verified)
- Static GitHub Pages portfolio. index.html and AI/ML/DS/DA/DE/index.html are thin shells (the role pages differ only in role key, title and meta); home.html redirects. Every section is built by one shared renderPage() in js/portfolio-components.js from js/portfolio-data.js, including a people registry referenced by id. js/main-page.js and js/role-page.js are thin callers.
- CSS is four layered files: css/tokens-base.css, components.css, activity.css, pages.css. scripts/css-audit.py reports 0 duplicate pairs, 0 cross-file duplicates, 5 documented !important, 0 unreferenced classes (allowlist in scripts/css-allowlist.json). Keep that: add no override files, at most 15 !important.
- Behavior lives in js/script.js (one large closure: flip cards via setActivityFlipState and markActivityFlipAnimating, the ECPC carousel with pointer drag, audio with a separate ambience loop and interface cues, magnetic buttons, particles, typewriter, reveal), js/interactive-motion.js (hero tilt), js/certificate-inspector.js and js/motion-preference.js.
- NOT done: the motion bug (U-A), the certificate sizing (U-B), the Discord button, my Codeforces ID card, the corner-grab flip (U-C), and the visual redesign (fonts are still Sora and Source Sans 3; "Chapter one" labels and middle-dot strings are still in the data).

## Locked (do not change)
Palette values in both themes; the click-flip look and timing (perspective, transform-style, backface-visibility, duration, easing, transitionend/950 ms logic); magnetic buttons, glow and pointer glow, particle canvas, hero tilt, typewriter, ECPC chapter drag, certificate inspector, theme toggle, boot sound, interface sound cues; the ambience control mutes ONLY the background loop (separate audio paths, cookie keys portfolio_ambience_enabled_v2 and portfolio_ambience_volume); every existing ID card design; hooks (#home #about #services #activity #accomplishments #contact, data-portfolio-render, .interactable, #ambienceToggle, #ambienceVolume, #darkModeToggle, #ecpcDeck, #ecpcPrev, #ecpcNext, the five role routes). No LinkedIn data fetching or syncing, and no new photos of other people (images/hadeer-makhlouf.jpeg stays; everyone else shows initials).

## Vision (read before any design work)
- Subject: the portfolio of Hassan Gebril, an AI engineer and AI student. Audience: internship leads, recruiters and small teams deciding whether to message him. The site's job: show verifiable work fast and make contacting him (LinkedIn, Discord, résumé) easy.
- His differentiator, which the copy follows: he builds AI models and the web apps that serve them, and claims only what held-out evaluation and passing tests support.
- Mood: warm, confident, a little playful; clearly made by a person. Not a corporate dashboard, not a document, not a template.
- Palette (pinned by me): dark mode is dark purple and black; light mode is light purple and white. Effective tokens (verify computed values in a browser): dark #0d0714 base, #140b1e raised, #1b1027 elevated, #9b6dff accent, #b79aff accent-light, #f7f2ff text, #b9abc8 secondary text; light #f8f6fc base, #f0ebf8 raised, #ffffff elevated, #6d28d9 accent, #8b5cf6 accent-light, #21162f text, #645873 secondary text. No new hues; energy comes from layout, type and motion. The LinkedIn blue stays on LinkedIn-linked ID cards only.
- The ONE memorable thing: the ECPC photo cards you pick up by the corner and turn over. Give that deck the stage (more space; on desktop it may break out of the container width). Everything else stays quiet and disciplined.

## Units, in this order

### U-A: Motion regression (do first)
Problem: js/motion-preference.js sets data-motion="reduced" whenever the OS or browser reports prefers-reduced-motion, and the rule `html[data-motion="reduced"] *` in tokens-base.css then kills every animation (measured: about 70 looping animations on index.html at 1440 px with motion allowed, 0 when reduced). My preview reports reduce, so the site looks frozen.
1. Reproduce first: count document.getAnimations() on index.html with reduced motion on and off.
2. Replace it with two tiers. data-motion="full" is the default. data-motion="calm" removes: the particle canvas, every looping or idle animation (premium-card-idle, premium-idle-float, premium-card-shine, hero ring and breathe loops, DEPI and ECPC pulses), tilt, magnetic pull, parallax and large transforms, and makes flips snap. Calm KEEPS colour, opacity and shadow hover and focus transitions (200 ms or less) and one-time fades. Do not use !important for this beyond the documented budget; use selector structure or :where().
3. Resolution order: URL parameter ?motion=full|calm (also saved) > saved choice (cookie portfolio_motion_v1) > OS reduce means calm > otherwise full.
4. Add a small footer control "Motion: full" / "Motion: calm" (a real button, aria-pressed, visible focus, plain text, no icon) that sets and saves the choice, through the shared footer builder so it appears on all six pages.
5. Update tests/motion-preference.test.cjs and add tier tests. Gate: with motion allowed, index.html has at least 50 running animations at 1440 px; in calm there are zero looping animations and zero particle canvas; the toggle survives a reload; audio is unaffected.

### U-B: Certificates fill their frames
Problem: .credential-card-image in pages.css is width:100%, height:208px, padding:8px, object-fit:contain, so the certificate fills only 52 to 66% of its frame at desktop and tablet widths.
1. Read each credential image's real dimensions and add imageWidth/imageHeight to the credentials in portfolio-data.js; emit the ratio as a CSS custom property from the renderer (no inline height).
2. The frame uses aspect-ratio from that data, height:auto, no padding, object-fit:contain (never crop), and the card padding shrinks so the certificate takes at least 92% of the card's inner width.
3. In the two-column tablet layout the third card spans both columns; cap its width to match the other cards and centre it.
4. Keep the certificate inspector as it is (it fills its dialog).
Gate: at 320, 390, 768, 1024, 1440, 1920 and 2560 px, both themes, on index.html and AI/index.html, each certificate's rendered box has the natural ratio within 1% and the image fills at least 97% of its frame, with no cropping.

### U-C: Features
a. DISCORD. Add discordHandle 'GRZ_Hassan' and discordUserId '753929399291609130' to the shared data. Add a button with the fab fa-discord icon before the text, labelled "Add me on Discord", to the hero socials, the contact section and the footer, through the shared builders. Behavior: copy the handle (navigator.clipboard with a textarea fallback), show an accessible toast "Copied GRZ_Hassan", then try the app link discord://-/users/753929399291609130; if the page still has focus after about 1.2 s, open https://discord.com/users/753929399291609130 in a new tab. If the ID were empty: only copy and open https://discord.com/channels/@me. Discord cannot add friends automatically, so never claim that. Tooltip: "Opens Discord and copies GRZ_Hassan". No network calls to Discord.
b. CODEFORCES ID CARD. Replace the text-only .ecpc-progress-back on the last ECPC slide with my ID card in the existing .profile-id-card design: images/profile.jpg in the badge photo window (whole portrait), "Hassan Gebril", "AI Engineer", handle "Hassan_G04". The card links to data.activity.ecpc[3].progressUrl (target _blank, rel noopener) with the same glow, hover and pointer-follow as linked cards, but in the site's purple (LinkedIn blue is for LinkedIn only). Use a plain three-bar chart glyph, not the Codeforces logo.
c. CORNER-GRAB FLIP (ECPC cards only, data-flip-grab; DEPI and Soft Skills are unchanged). No touch-and-hold anywhere.
- Four corner grab zones on the front face and on the back face, each at least 48 px, stacked above the card's hit area.
- A click or tap ANYWHERE on the card, corners included, flips it instantly exactly as today. Only a drag that starts on a corner and moves more than 5 px becomes a grab.
- Affordance: when a corner zone is hovered, focused or touched, that corner dog-ears (a small CSS peel fold in existing purple tokens, about 160 ms). Cursor grab, grabbing while pressed. Reduced or calm motion: no peel animation.
- While grabbed, the card follows the pointer live in 3D. After a 12 px lock, the dominant axis picks the rotation: horizontal pull rotates Y, vertical pull rotates X. Angle = distance along that axis divided by the card's width or height, times 180 degrees, clamped to 0 to 180, sign following the pull direction like turning a page. Transitions off during the drag, with a lift shadow.
- On release: commit if the angle is past 90 degrees or the release velocity is high, else spring back, using the existing flip duration and easing. In calm motion there is no live follow: a drag past the lock flips on release.
- One source of truth: --flip-x and --flip-y CSS variables on the card. .is-flipped only sets the resting values and the drag writes the variables, so an interrupted drag cannot desync. Set data-flip-axis when the axis locks and give the back face a matching base rotation so it is upright after X and Y flips in both directions.
- Keep setActivityFlipState, markActivityFlipAnimating, aria-expanded, inert, the transitionend logic and the left/right flip sounds (chosen by drag direction). Click-flip timing must equal the baseline (compare resolved transform matrices at rest, front and flipped, plus transition duration and easing).
- A pointerdown on a corner zone never starts a chapter drag, for any pointer type. A mouse press on the photo (not a corner) starts nothing; chapter drag starts only from empty slide areas. On touch, swipes over the photo still change chapter; touch-action:none applies only to the corner zones. Keyboard flip (Enter or Space on the hit area) is unchanged. Corner zones are aria-hidden and not focusable.
Gate: mouse and touch emulation on both axes (back face upright afterwards), click-flip unchanged, carousel drag unchanged, Discord flow, audio isolation.

### U-D: Stage A: plan, review, style tile, then STOP
1. Write docs/design-plan.md: Color (the six named hex values above), Type (roles), Layout (one sentence plus an ASCII wireframe per section at 1440 and 390; section titles centered, prose left-aligned, hero asymmetric), Principles (at most 5), and a Review log listing every part of the plan that matches a banned item or a common template default and what you changed.
2. Fonts: ONE display family and ONE body family, clearly distinct, no monospace. Display candidates: Bricolage Grotesque, Familjen Grotesk, Unbounded, Gabarito. Body: Instrument Sans, Hanken Grotesk, Onest, Schibsted Grotesk. Banned: Inter, Poppins, Sora, Space Grotesk, Source Sans, DM Sans, Manrope, Outfit, Plus Jakarta Sans, Montserrat, Roboto, Open Sans. Verify family and weights on Google Fonts, load with <link> and preconnect (no @import), at most 2 weights per family, fonts defined once as tokens, real fallback stacks, line length under 80 characters.
3. Radius tokens only: --r-s 8px, --r-m 16px, --r-l 32px (plus 50%). Shape kit (the ONLY decorative shapes): one organic portrait mask (SVG clipPath) for the hero and About portraits; curved or angled SVG dividers in exactly three places (hero to about, services to activity, accomplishments to contact), coloured from existing tokens; at most 4 elements on the whole page tilted +/-1 to 2 degrees.
4. Build docs/style-tile.html (self-contained, not linked from the site): the hero name in your top TWO display candidates side by side; the type scale on real copy at 360, 768 and 1440 px; buttons; radii; the portrait mask; one divider; the ECPC card with the corner peel; the hero load sequence. Screenshot it at 1440 and 390 in both themes. Then STOP and wait for my approval.

### U-E: Stage B: apply (only after approval; through the shared builders)
- Hero: oversized name on the left in the display font, portrait overlapping the heading by about 12% in the organic mask (tilt stays), "AI Engineer" as a large lockup, one primary and one secondary button with plain verb labels ("See my work", "Download résumé"), round magnetic social buttons (LinkedIn, GitHub, Discord). Typewriter stays. No figcaption.
- About: prose column plus the animated portrait; education and experience as an open timeline along one drawn path with nodes (no numbering, no boxes).
- Services: open rows with a large title, one line of description and the tool pills; hover or focus moves the title.
- Tools: loose staggered pills, never clipped, never scrolling away.
- Projects: large covers in alternating offset rows; glow and tilt on hover.
- Credentials: a fanned stack that spreads on hover; click opens the inspector (frames stay at the U-B sizes).
- Activity: the ECPC deck is the star; DEPI and Soft Skills stay as built; no outer box around Activity.
- Contact: one large centred sentence, a magnetic primary button, and LinkedIn, GitHub and Discord buttons.
- Section titles: ONE .section-anchor-heading definition: a plain noun title (About, Services, Activity, Accomplishments, Contact), centred, with a one-sentence centred sub line in first-person plain voice containing a concrete noun from my real work. Prose stays left-aligned. Copy: active voice, sentence case, no filler, no "not X but Y", no tricolons, no em dashes; buttons say what happens; the same action keeps the same name everywhere.
- Content sits directly on the page background. A bordered, filled surface is allowed only for flip cards, certificate and project covers, and ID cards and badges. Remove .premium-card everywhere else.
- Remove from the data and the markup: the "Chapter one" style labels and every middle-dot string ("A · B"); write real sentences or separate elements.

### U-F: Stage C: motion
1. ONE orchestrated hero load sequence, once, about 900 ms: the name's letters rise in sequence and the portrait unmasks (clip-path). No loader.
2. The About timeline path draws as the visitor scrolls (animation-timeline: view() inside @supports only; without support the path is simply drawn).
3. Large images (project covers, About portrait) unmask once with clip-path.
4. Everything else moves only in answer to an action: magnetic buttons, hero tilt, glow on actionable cards, the corner peel and grab-flip, the ECPC drag, the certificate inspector, press feedback.
Rules: remove fade-and-slide-up .reveal from text blocks and cards; transform, opacity and clip-path only; the two motion tiers from U-A keep working; ONE ticker (single rAF scheduler) for pointer lerp, parallax and particles, with no direct requestAnimationFrame calls in new code; loops pause when the tab is hidden; particle count scales with the viewport and pauses off-screen; content-visibility:auto with contain-intrinsic-size on below-the-fold sections.

### U-G: Hygiene and report
Consolidate scripts/round-2-*.cjs and qa-server.cjs into scripts/qa/ behind one scripts/qa.cjs entry; add .gitignore (__pycache__/, .baseline/, node_modules/) and untrack __pycache__; list images referenced nowhere (delete nothing); write docs/ARCHITECTURE.md under one page; final report with before and after screenshots per section (390 and 1440, both themes), gate outputs, and anything you could not verify.

## Banned (these read as generated; remove existing instances)
A single accented word in a headline (for example a grad-text span); gradient text; ALL-CAPS or tracked-out labels (at most 2 on the whole site); labels above content that add no information; "WORD — fragment" and leading-dash labels; monospace faces; middle-dot strings; trailing arrows or icons on button and link text; numbered markers unless the content is a real sequence; the SaaS card kit (identical rounded cards, one radius everywhere, the same soft shadow under every card, gradient wash decoration, a bordered box around every section); fade-and-slide-up on every section or card; hover transitions on non-actionable elements; marquees; a pill label above every title; a command palette; a custom cursor unless I ask for it.

## Gates for U-D to U-G (scripts/qa/ai-tells; all must pass before you report done)
- Zero em dashes, middle-dot strings and trailing arrow glyphs or icons on buttons and links in rendered text; zero gradient text; zero single-accent spans in headings; zero numbered labels; at most 2 uppercase or tracked-out labels site-wide; no monospace and no banned font in any computed font-family.
- Blockiness: at 1440x900 each section has at most 3 elements that have a border or shadow AND a visible fill AND an area of at least 140x140 px.
- No horizontal overflow and no clipped text, border or glow from 320 to 2560 px, both themes; computed palette values identical to the palette above.
- Computed-style diff for the locked set against the baseline shows only intended changes.
- With 4x CPU throttle: no long task over 100 ms during a scripted scroll; own JS at most 160 KB.
- Mouse and touch emulation: corner-grab on both axes, click-flip unchanged, carousel drag unchanged, Discord flow, audio isolation, both motion tiers. Main page and all five role pages.