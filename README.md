# DEVS: Gaia Kernel

A production-quality Node.js browser game prototype where the player operates a futuristic Quantum OS running a simulated Earth-history life model. The stylized Latin **V** in **DEVS** foreshadows the symbolic transformation toward **DEUS**: balance, ethics, and responsibility rather than domination.

## Install and run

```bash
npm install
npm start
```

Open <http://localhost:3000>.

## Environment variables
Copy `.env.example` to `.env` if needed.

- `PORT` - Express port, default `3000`.
- `OPENAI_API_KEY` - optional server-side key for future AI Director missions.
- `OPENAI_MODEL` - optional model name.
- `AI_DIRECTOR_ENABLED` - must be `true` and have a key before AI calls run.

## Commands
`HELP`, `STATUS`, `COOL`, `QEC`, `STABILIZE`, `ALLOCATE <resource> <amount>`, `PATCH <education|grid|research|archive|ethics|biosphere|health>`, `UPGRADE <moduleId>`, `SIMULATE <turns>`, `BOOT DEUS_KERNEL`, `RESET`.

## Gameplay
Entropy rises every tick. Low coherence damages integrity; low trust damages society stability; low ethics makes powerful upgrades risky; high technology without ethics increases entropy; biosphere collapse hurts health and economy. Events teach short history, science, ecology, and technology concepts. Resource values are clamped from 0-100 except entropy, which can reach 150.

## Architecture
- `server.js` serves Express, Socket.IO, and validated server-side actions.
- `src/game/engine.js` owns ticking, era progression, resources, events, upgrades, win/loss checks, and patch scoring.
- `src/game/state.js`, `resources.js`, `events.js`, `eras.js`, `upgrades.js`, `missions.js`, and `commands.js` keep logic modular.
- `src/game/aiDirector.js` is disabled by default and never exposes keys to the frontend.
- `src/data/*.json` stores eras, events, missions, and technologies so a future database (SQLite/MySQL/PostgreSQL) can replace file loading.
- `public/*` implements the responsive Canvas quantum OS UI with no paid assets.

## Adding content
Add eras to `src/data/eras.json`, events to `src/data/events.json`, upgrades in `src/game/upgrades.js`, missions in `src/data/missions.json`, and technologies in `src/data/technologies.json`. Keep event effects small and trust the resource clamp helpers.

## Hostinger deployment notes
Use a Node.js hosting plan, upload the project, run `npm install`, set environment variables in the panel, and start with `npm start`. Ensure WebSocket proxying is enabled for Socket.IO.
