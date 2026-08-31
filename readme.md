# Hassan Gebril – Personal Portfolio

A responsive personal portfolio website built with HTML, CSS, and JavaScript to showcase my background as an AI / Data Science student, my projects, certifications, and contact links.

The site is intentionally simple (no heavy frameworks) but has a few dynamic touches: dark mode, hover effects, and a draggable “Hassan-bot” chat bubble.

---

## Live Demo

> https://hassang04.github.io/

---

## Features

### Current Pages

- **Home (`index.html`)**
  - Hero section with:
    - Profile picture.
    - Intro text.
    - “About Me” button.
    - **Green CV button** linking to my Google Drive CV.
  - Social icons: LinkedIn, YouTube, GitHub.
  - “View Accomplishments” button.
  - “Quick Introduction” and “My Skills” cards.
  - CTA button with randomized responses.

- **About (`about.html`)**
  - Personal story and background.
  - Education card (AAST – Artificial Intelligence, Data Science).
  - Profile image with hover effect (pop + purple spark aura).

- **Hobbies (`hobbies.html`)**
  - Cards describing hobbies (problem solving, gaming, video editing, etc.).
  - Links to Codeforces, Steam, YouTube (where relevant).

- **Accomplishments (`accomplishments.html`)**
  - **Certifications** (cards with hover expansion):
    - CCNA – Cisco Certified Network Associate.
    - Cellula – NLP Internship.
    - ICPC – Competitive Programming achievement.
  - **Projects** (cards fully clickable; hover blur + overlay text):
    - River Flood Protection – U-Net Mini segmentation + Flask UI.  
      Links to: `River-Flood-Prediction` GitHub repo.
    - Shoplifting Detection – GRU action recognition + Django deployment.  
      Links to: `ShopLifting_Detection` GitHub repo.
    - This Portfolio Website – responsive static site.  
      Links to: `HassanG04.github.io` repo.

---

## UI / UX Features

- **Dark Mode**
  - Toggle button in navbar.
  - Preference stored in `localStorage` (`dark-mode: enabled/disabled`).
  - Works across all pages.

- **Draggable Chat Bubble**
  - Floating chat bubble (`Hassan-bot`) fixed to the viewport.
  - User can drag it anywhere on the screen.
  - Clicking toggles a small chat window with a placeholder message:
    > “I am still learning Hassan's behavior since he's kinda quiet atm… (I didn't make a chatbot yet but I will make it… \<eventually\>)”

- **Electric Accomplishments Title**
  - “Accomplishments” page title with yellow electric glow + spark animation on hover.

- **Hover Interactions**
  - Certifications: card + image expansion on hover.
  - Projects: card lift + blurred thumbnail + “Show me the project on Github” overlay on hover.
  - About page profile: circular image pop with purple aura and sparkles on hover.

---

## Tech Stack

- **Frontend**
  - HTML5
  - CSS3 + custom animations
  - Vanilla JavaScript (no frameworks)
  - [Bootstrap 5](https://getbootstrap.com/) – grid and basic components
  - [Font Awesome 6](https://fontawesome.com/) – icons

- **No backend yet**
  - Currently a static site.  
  - All data (projects, certifications, text) is hard-coded in HTML.

---

## Project Structure

```text
root/
├── home.html               # Home
├── about.html               # About Me
├── hobbies.html             # Hobbies
├── accomplishments.html     # Certifications & Projects
├── css/
│   └── style.css            # Main stylesheet (layout, dark mode, effects)
├── js/
│   └── script.js            # Dark mode, CTA, chatbot, translations scaffold
└── images/
    ├── profile.jpg
    ├── profile2.jpg
    ├── cert_ccna.jpg
    ├── cellula_nlp.jpg
    ├── icpc.jpg
    ├── river_flood.jpg
    ├── shoplifting.jpg
    ├── portfolio_site.jpg
    └── AASTMT_Logo.png
