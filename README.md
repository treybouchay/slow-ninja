# Slow Ninja

Studio site for [Slow Ninja](https://slow.ninja/)—skill-based games, catalog experiments, and a technical journal.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

## Stack

Next.js 16 · TypeScript · Tailwind · shadcn/ui

## Pages

- `/` — hero, switchable catalog views, studio, journal
- `/games` · `/studio` · `/journal` · `/journal/[slug]`
- `/api/health` — liveness probe for hosting

Constellation is the default catalog. Optional lab views (Starlane, Diagonal lane, Shelf, cases) are under a quiet **Labs** toggle.

## Production build

```bash
npm ci
npm run build
npm start
```

`npm start` listens on `PORT` (DigitalOcean sets `3000`). Locally: `npm run dev` still uses `43127`.

## Deploy on DigitalOcean (no Docker)

Use **App Platform** with the Node buildpack.

1. Push this repo to **GitHub** on branch `main`.
2. DigitalOcean → **App Platform** → **Create App** → `treybouchay/slow-ninja` → `main`.
3. Resource settings:
   - Type: **Web Service**
   - Environment: **Node.js** (not Docker)
   - Build command: `npm ci && npm run build`
   - Run command: `npm start`
   - HTTP port: **`3000`** (must match `PORT`; do not use 43127)
4. (Optional) Health check path: `/api/health`
5. Instance size: smallest / **1 container**
6. Deploy, then open the `*.ondigitalocean.app` URL.
7. **Domains** → add `slow.ninja` → update DNS as shown.

No env secrets required. App Platform sets `PORT=3000`.

If deploy fails with “connection refused on :3000”, the run command was still binding another port — ensure GitHub has the latest `package.json` start script.
