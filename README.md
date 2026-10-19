# Slow Ninja

Studio site for [Slow Ninja](https://slow.ninja/)—a game studio defining skill-based blockchain gaming since 2014.

This build centers the brand concept **Readable Machines**: games as systems players can inspect (SQL arenas, transaction-as-action combat, on-chain strategy), plus a technical journal from the craft of making them.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Static content for games and journal posts in `src/lib/content.ts`

## Run locally

```bash
npm install
npm run dev -- --port 43127
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start the development server |
| `npm run build`| Production build         |
| `npm run start`| Serve the production build |
| `npm run lint` | Run ESLint               |

## Site map

- `/` — Brand hero, thesis, games, journal teaser
- `/games` — Structs, Coindroids, Schemaverse
- `/journal` — Technical writing archive
- `/journal/[slug]` — Individual posts
- `/studio` — Studio story and pillars

## Brand direction shipped

**Readable Machines** pairs the “Slow” craft metaphor with the studio’s real history: Schemaverse (PostgreSQL as game engine), Coindroids (actions as transactions), and Structs (decentralized 5X strategy). Visual language: ink/phosphor ops-room atmosphere, Syne + Source Sans 3 + IBM Plex Mono, measured motion.
