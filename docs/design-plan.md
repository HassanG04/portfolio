# Design Plan (U-D Stage A)

## Color
The core palette consists of six named hex values tailored for each theme:
- **Dark Mode**: 
  - Base: `#0d0714`
  - Raised: `#140b1e`
  - Elevated: `#1b1027`
  - Accent: `#9b6dff`
  - Accent-Light: `#b79aff`
  - Text: `#f7f2ff`
  - Secondary Text: `#b9abc8`
- **Light Mode**:
  - Base: `#f8f6fc`
  - Raised: `#f0ebf8`
  - Elevated: `#ffffff`
  - Accent: `#6d28d9`
  - Accent-Light: `#8b5cf6`
  - Text: `#21162f`
  - Secondary Text: `#645873`

## Type
- **Display Font Candidate 1**: `Bricolage Grotesque` (Weights 600, 800)
- **Display Font Candidate 2**: `Unbounded` (Weights 600, 800)
- **Body Font**: `Instrument Sans` (Weights 400, 600)

*(Loaded via `<link>` and preconnect to Google Fonts, no `@import`, strict line length under 80ch).*

## Layout
The portfolio follows an asymmetric hero and a disciplined section structure, heavily emphasizing actionable elements and reducing visual clutter.

- **Desktop (1440px)**
  ```text
  [ Navbar ]
  [ Hero: Oversized Name (Left) | Portrait in Organic Mask (Right) ]
  [ About: Prose (Left) | Timeline Path (Right) ]
  [ Services: Title & Desc (Left) | Staggered Tool Pills (Right) ]
  [ Projects: Alternating Offset Rows (Large Covers) ]
  [ Credentials: Fanned Stack of Certificates ]
  [ Activity: Heroic ECPC Deck Slider ]
  [ Contact: Large Centered Sentence & Magnetic Buttons ]
  ```
- **Mobile (390px)**
  ```text
  [ Navbar ]
  [ Hero: Portrait | Oversized Name | Buttons ]
  [ About: Prose | Vertical Timeline Path ]
  [ Services: Title | Tool Pills ]
  [ Projects: Single Column Large Covers ]
  [ Credentials: Stacked Certificates ]
  [ Activity: ECPC Deck Slider ]
  [ Contact: Centered Sentence & Buttons ]
  ```

## Principles
1. **The Deck is the Star**: The ECPC photo deck takes center stage with expansive spacing and corner-grab mechanics; everything else is quiet.
2. **Action-Driven Motion**: Outside the orchestrated hero load and scroll-drawn timeline, animation only responds to user interaction.
3. **Shape Restraint**: No arbitrary boxes; rounded shapes rely purely on 3 radius tokens (`8px`, `16px`, `32px`), one organic mask, and 3 specific SVG dividers.
4. **Typographic Clarity**: High-contrast pairings between a distinct display face and legible body face, using strict line length limits (under 80 characters).
5. **Direct Language**: Active voice, sentence case, no filler copy, and consistent naming for actions across the site.

## Review Log (Banned Items Replaced)
- **Banned:** Fade-and-slide-up on every section (`.reveal`). **Changed:** Removed `.reveal` globally. Implemented single orchestrated hero load sequence and clip-path unmasking for large images.
- **Banned:** SaaS card kit (bordered box around every section, identical rounded cards). **Changed:** Removed `.premium-card` everywhere except flip cards, certs, and ID badges. Content sits directly on the page background.
- **Banned:** "Chapter one" style labels and middle-dot strings. **Changed:** Replaced with single plain noun titles and first-person sub-sentences.
- **Banned:** Monospace/Generic faces (e.g. Sora, Source Sans). **Changed:** Transitioned strictly to distinct faces (`Bricolage Grotesque`/`Unbounded` and `Instrument Sans`).
- **Banned:** Hover transitions on non-actionable elements. **Changed:** Limited tilt and glow to actionable cards and buttons only.
