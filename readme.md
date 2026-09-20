# Hassan Gebril — Portfolio

A responsive portfolio for Hassan Gebril, with a complete general homepage and focused variants for AI, machine learning, data science, data analysis, and data engineering opportunities.

[View the live portfolio](https://hassang04.github.io/portfolio/) · [View the GitHub repository](https://github.com/HassanG04/portfolio)

## Highlights

The repository overhaul is documented in [the implementation report](docs/portfolio-overhaul-report.md),
[the repository scan](docs/repository-scan.json), and [the skills evidence matrix](docs/skills-matrix.md).
Review links and exact tested commits are listed in [publication evidence](docs/publication-status.md)
and [remote CI results](docs/remote-ci-results.json). Default branches are unchanged.
Those records distinguish local verification, configured infrastructure, and unavailable artifacts.
The site deliberately avoids unsupported accuracy or deployment claims.

- Client-focused machine-learning value proposition and clear calls to action.
- About, education, experience, and offered services.
- Interactive ECPC carousel and shared DEPI/Soft Skills flip-card system.
- Data-driven projects, services, credentials, experience, and activity content.
- Project case studies with challenge, approach, and outcome details.
- System-aware dark and light themes saved on the visitor's device.
- Scroll-aware navigation, smooth motion, and interface sound cues.
- A three-second activity-card hint triggered only when Activity enters view.
- Responsive layouts for desktop, tablet, and mobile.
- Clean role-focused routes with tailored positioning, services, skills, and public GitHub work:
  - `/AI/` — AI Engineer
  - `/ML/` — Machine Learning Engineer
  - `/DS/` — Data Scientist
  - `/DA/` — Data Analyst
  - `/DE/` — Data Engineer

## Technology

- HTML5
- CSS3 and custom animations
- Vanilla JavaScript
- Bootstrap 5
- Font Awesome 6

## Project structure

```text
portfolio/
├── index.html          # Complete portfolio and GitHub Pages entry point
├── home.html           # Lightweight redirect for old shared links
├── AI/index.html       # AI Engineer portfolio route
├── ML/index.html       # Machine Learning Engineer portfolio route
├── DS/index.html       # Data Scientist portfolio route
├── DA/index.html       # Data Analyst portfolio route
├── DE/index.html       # Data Engineer portfolio route
├── favicon.ico
├── css/
│   ├── style.css             # Existing identity, layout, and animation foundation
│   └── design-system.css     # Shared premium cards, interaction states, and spacing
├── js/
│   ├── portfolio-data.js       # Single content source for every route
│   ├── portfolio-components.js # Reusable card and activity renderers
│   ├── main-page.js            # Main-page data bindings
│   ├── role-page.js            # Profession-page composition
│   └── script.js               # Navigation, motion, audio, theme, and behavior
├── images/             # Portfolio images used by index.html
└── sounds/             # Interface sound cues
```

## Updating portfolio content

Edit `js/portfolio-data.js` to add or update projects, credentials, services,
experience, profession copy, or activity content. Each data item declares the
routes where it belongs through its `roles` array. For example, a credential with
`roles: ['MAIN', 'AI', 'ML']` automatically appears on the homepage, AI page, and
machine-learning page without editing any HTML.

Reusable markup lives in `js/portfolio-components.js`. New interactive controls
should use the `.interactable` class, although semantic links and buttons are also
detected automatically by the delegated interaction system in `js/script.js`.

GitHub Pages serves `index.html` automatically, keeping the public address clean:

```text
https://hassang04.github.io/portfolio/
```

Role pages use directory indexes, so their public addresses stay clean as well:

```text
https://hassang04.github.io/portfolio/AI/
https://hassang04.github.io/portfolio/ML/
https://hassang04.github.io/portfolio/DS/
https://hassang04.github.io/portfolio/DA/
https://hassang04.github.io/portfolio/DE/
```

## Verification

```bash
python -m unittest discover -s tests
python scripts/validate_site.py
node --check js/script.js
node --check js/portfolio-data.js
node --check js/portfolio-components.js
node --check js/main-page.js
node --check js/role-page.js
```

Six real tests check local references, directory routes, anchor parsing, the actual seven
HTML pages and rejection of stale/failed/unfinished CI evidence. The validator accounts for role-page anchors/images inserted by JavaScript,
rejects paths leaving the site root, missing assets and duplicate IDs. External links are not
claimed healthy by offline tests. CI checks the site; the existing Pages workflow validates
before uploading its explicit static artifact. No database, backend or Docker is needed for
this static site. Local `.portfolio-repos/` clones, runtimes and generated development files
are ignored and are never copied into the Pages artifact.

For the local multi-repository check, run `scripts/validate_portfolio.py` using the explicit
test Python environment and cloned repositories. It records actual results in
`docs/validation-results.json`; optional native firmware and Node build checks are documented
separately in the implementation report.

`scripts/check_remote_ci.py` reads public review-branch checks and compares their commits
with local reviewed heads. An optional `GITHUB_TOKEN` can avoid public API rate limits;
use a token authorized to read those repositories' Actions results, never commit it.
The script records no token, triggers no builds and changes no remote repository.
