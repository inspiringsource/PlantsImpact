# PlantsImpact

PlantsImpact is a mobile-first MVP prototype developed for Requirements Engineering (RE) and User-Centered Design (UCD).

The prototype helps users explore the estimated long-term positive impact of plants through a simple and motivating experience.

Users can:

- Add plants through search or a prototype camera scan
- Store plants locally in a personal plant list
- View estimated impact over 1, 2, 5, and 10 years
- Explore lightweight social motivation through Friends and Leaderboard views
- Provide structured MVP feedback through an integrated feedback form

The prototype intentionally focuses on a minimal and realistic MVP scope for validation purposes.

## MVP Focus

PlantsImpact focuses on four core interactions:

1. Add a plant
2. View personal plants
3. Explore long-term impact
4. Stay motivated through visible progress and social comparison

The application intentionally avoids complex systems such as:

- Authentication
- Real backend infrastructure
- Real AR or AI plant recognition
- Advanced gamification systems
- Group systems
- Video tutorials
- Care reminder systems

This allows the project to remain focused on validating the core Requirements Engineering assumptions and user interactions.

## Technology

- Astro
- TypeScript
- PWA support
- Local storage persistence
- Netlify deployment

## Run locally

```sh
npm install
npm run dev
```

Open:

```text
http://localhost:4321
```

## Build

```sh
npm run build
npm run preview
```

Production output is generated in:

```text
dist/
```

## PWA Setup

- Manifest: `public/manifest.webmanifest`
- Service worker generated with `vite-plugin-pwa`
- Offline support through cached assets and local storage

## Deploy to Netlify

- Build command: `npm run build`
- Publish directory: `dist`

No backend is required.

## Feedback

The prototype includes a lightweight integrated feedback flow using Google Forms to support ucdRE validation and usability testing.

## Sustainable Development Goals

PlantsImpact relates to the United Nations Sustainable Development Goals (SDGs), especially:

- SDG 13 – Climate Action
- SDG 3 – Good Health and Well-being
