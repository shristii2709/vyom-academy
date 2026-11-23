# Vyom Academy | By DN Marketing

**Learn Today. Lead Tomorrow.**

Landing page for Vyom Academy: AI, Generative AI and Machine Learning
learning pathways, a jobs and careers board, and student / trainer sign-in.

Built with React 19, Vite, Tailwind CSS v4, Framer Motion and Lucide icons.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (the site is served under `/vyom-academy/`).

## Build

```bash
npm run build
npm run preview
```

## Deployment

Every push to `main` is built and published to GitHub Pages by
`.github/workflows/deploy.yml`.

## Where to edit things

| What | Where |
| --- | --- |
| Hero text, buttons, trust strip, floating chips | `src/App.jsx` (`trustPoints`, `heroChips`, `HERO` section) |
| Learning programs | `programs` array at the top of `src/App.jsx` |
| Animations (float, shimmer, glow) | `src/index.css` |
| Page title and SEO description | `index.html` |
| Logo | `public/vyom-logo.png` |

> The hero trust strip currently lists only facts that are true today.
> When you have real numbers (learners trained, ratings, partner companies),
> add them to `trustPoints` in `src/App.jsx`.