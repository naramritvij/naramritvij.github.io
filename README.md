# Ritvij Naram — Portfolio

Personal engineering portfolio for **Ritvij Naram**, published through GitHub Pages.

## Portfolio direction

The site uses a developer-systems visual language rather than a generic template: terminal cues, repository-style project metadata, an animated network background, filtered project discovery, and subtle scroll/pointer transitions.

The content is structured for recruiters first:
- flagship projects appear at the top;
- public repositories are grouped by engineering theme;
- case studies remain available for deeper technical context;
- coursework/lab repositories are discoverable without competing with production-style projects.

## Featured projects

- **Local Eco-Scanner** — Kotlin, Jetpack Compose, CameraX, Gemini; municipality-aware recycling guidance from a photo.\n- **Pitch Predictor — FIFA World Cup 2026** *(private source, public live deployment)* — JavaScript, Firebase Firestore, GitHub Actions, Netlify and API-Football; realtime campus prediction game with automated result ingestion and leaderboard updates.
- **CivicFlow AI** — FastAPI, Oracle, React, Gemini; AI-assisted transit incident intelligence.
- **RNA — Ritvij Naram Assistant** — Node.js, Express, Ollama; private local AI assistant with tools and persistent memory.
- **NeuralVerse** — React, TypeScript, Framer Motion; 20 interactive deep-learning visualizations.
- **TTC Service Disruption System** — React, Node.js, Oracle; role-based disruption management and passenger notifications.
- **Image Whisperer** — React, TypeScript, TensorFlow.js, MobileNet; fully client-side image recognition.
- **AI Flashcard Generator** — Python, Streamlit, spaCy, T5; automatic study flashcard generation.
- **Anomaly Detection for Video Surveillance** — Python, Keras, OpenCV, SQLite; desktop video anomaly detection.
- **NOra University Chatbot** — Python, FAISS, Streamlit; PDF retrieval and local-generation chatbot scaffold.

`INFO5100_Lab` is represented as coursework rather than a flagship project. The `expired-product-alert` repository currently contains no implementation beyond its license and is not presented as completed work.

Private projects can be added to the portfolio from user-approved README/project descriptions without exposing private source code.

## Tech

- Plain HTML, CSS and vanilla JavaScript.
- three.js loaded progressively from a CDN for the hero network.
- No build step.
- Responsive, keyboard-friendly, and reduced-motion aware.
- Hosted on GitHub Pages.

## Structure

```
index.html                     main portfolio
assets/style.css               visual system and responsive layout
assets/script.js               filters, transitions, navigation and hero animation
assets/RitvijNaram_Resume.pdf  résumé
work/                          detailed case studies
```

## Run locally

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

This repository is the root user-site repository, so GitHub Pages publishes it at:

`https://naramritvij.github.io`

## Contact

- GitHub: https://github.com/naramritvij
- LinkedIn: https://www.linkedin.com/in/ritvij-naram/
- Email: ritvijcan@gmail.com
