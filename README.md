# Ritvij Naram — Portfolio

Personal portfolio site. Deploy at `https://<your-username>.github.io` via GitHub Pages.

Full-stack + data engineer working across Oracle SQL pipelines, FastAPI/React apps, and AI-assisted
analytics tooling. The site is framed as a terminal/git session: the hero is a `whoami` prompt, each
project is a "commit," and the career path is a literal `git log --graph`.

## Case studies

- **CivicFlow AI** — FastAPI + Oracle DB + Gemini + React incident intelligence system.
- **TTC Service Disruption & Passenger Impact DB** — a normalized Oracle schema with views, triggers, and a crow's-foot ERD.
- **NeuralVerse** — a 20-chapter interactive deep learning visualizer.
- **Anomaly Detection for Video Surveillance** — Keras CNN + OpenCV + Tkinter + SQLite.

## Tech

- Plain HTML, CSS, and vanilla JavaScript. No build step.
- [three.js](https://threejs.org/) (loaded from a CDN) for the hero particle-network animation.
- Hosted on GitHub Pages.

Everything is progressive: content renders instantly as HTML, and the three.js layer loads lazily and
degrades gracefully under reduced-motion, no-WebGL, or low-power mobile.

## Structure

```
index.html      landing page
assets/         style.css, script.js, resume PDF
work/           case-study pages
```

## Run locally

It's a static site, so any local server works:

```
python -m http.server 8000
# then open http://localhost:8000
```

## Deploy to GitHub Pages

1. Push this repo to GitHub (e.g. `naramritvij/naramritvij.github.io` for a root-level user site, or any
   repo name + enable Pages from the `main` branch in Settings → Pages).
2. Wait for the `github-pages` deployment to go green under the repo's Deployments tab.
3. Visit the URL GitHub gives you.

## Contact

- Email: naram.r@northeastern.edu
- Phone: 437-604-7804
- GitHub: https://github.com/naramritvij
