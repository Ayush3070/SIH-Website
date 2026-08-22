# SIH Website — Internal Hackathon Portal

A dark-themed, single-page portal for the **Internal Hackathon** conducted for **SIH Team Selection** at **Thakur Shree DPS College of Engineering and Management**. It features a liquid-glass hero with a neon scan-text effect, an interactive 3D portal background, and a browsable grid of problem statements with detailed views.

## Features

- **Loading Screen** — minimal progress-ring animation on first load.
- **3D Portal Background** — real-time WebGL scene rendered with [Three.js](https://threejs.org/), enhanced with simplex noise.
- **Liquid Glass Hero** — glassmorphism card using an SVG displacement-map filter (`feDisplacementMap`) for a refractive glass look.
- **Neon Scan Text Effect** — "Internal Hackathon" heading illuminated by a glowing scanner bar sweeping left → right; fully responsive and respects `prefers-reduced-motion`.
- **Problem Statements Grid** — animated, accessible cards (keyboard operable) with difficulty badges and a modal dialog showing full problem details.
- **Scroll Interactions** — hero parallax/fade on scroll, college logo fade-out.

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| 3D / Graphics | Three.js, simplex-noise |
| Styling | Hand-written CSS (custom utilities + component styles) |

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
# install dependencies
npm install

# start dev server
npm run dev

# production build (outputs to dist/)
npm run build
```

## Project Structure

```
├── index.html                  # App entry point
├── public/
│   └── tsdcem.png              # College logo
└── src/
    ├── main.tsx                # React root
    ├── App.tsx                 # Layout: background, logo, hero, grid
    ├── index.css               # Global styles & utility classes
    ├── data/
    │   └── problemStatements.ts
    └── components/
        ├── LoadingScreen.tsx           # Initial progress-ring loader
        ├── ThreePortalBackground.tsx   # Three.js WebGL backdrop
        ├── LiquidGlass.tsx             # Reusable SVG-displacement glass card
        ├── IntroHero.tsx               # Hero banner + scan text effect
        └── ProblemStatementsGrid.tsx   # Cards grid + detail dialog
```

## Component Overview

| Component | Purpose |
| --- | --- |
| `LoadingScreen` | Full-screen loader with thin progress ring shown for the first ~2.7 s. |
| `ThreePortalBackground` | Fixed WebGL canvas behind all content. |
| `LiquidGlass` | Generic wrapper providing refraction/backdrop-blur glass styling via CSS variables and SVG filters. |
| `IntroHero` | College name, "Internal Hackathon" headline with scan effect, scroll-linked fade. |
| `ProblemStatementsGrid` | Filterable list of problem statements; click/Enter opens a dialog with description, expected prototype, and evaluation focus. |

## Accessibility

- Problem-statement cards are focusable with `role="button"` and Enter/Space support.
- Dialog closes on `Escape` and locks body scroll while open.
- Scan-text animation is disabled under `prefers-reduced-motion`.

## License

ISC © TSDCEM
