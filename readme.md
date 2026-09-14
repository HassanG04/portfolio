# Hassan Gebril — Portfolio

A responsive portfolio for Hassan Gebril, with a complete general homepage and focused variants for AI, machine learning, data science, data analysis, and data engineering opportunities.

[View the live portfolio](https://hassang04.github.io/portfolio/) · [View the GitHub repository](https://github.com/HassanG04/portfolio)

## Highlights

- Client-focused machine-learning value proposition and clear calls to action.
- About, education, experience, and offered services.
- Interactive ECPC carousel and DEPI instructor card.
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
│   ├── style.css
│   └── role-page.css   # Shared role-page layout
├── js/
│   ├── script.js
│   └── role-page.js    # Shared role-specific content and rendering
├── images/             # Portfolio images used by index.html
└── sounds/             # Interface sound cues
```

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
