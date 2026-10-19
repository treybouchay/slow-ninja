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

Catalog views (Starlane, Shelf, Diagonal case, File case) can be switched in the sticky bar above the games section.

## Production build

```bash
npm ci
npm run build
npm start
```

Listens on `PORT` (default `3000`).

## Deploy on DigitalOcean (no Docker)

Use **App Platform** with the Node buildpack.

1. Push this repo to **GitHub** or **GitLab** on branch `main`.
2. DigitalOcean → **Apps** → **Create App** → connect that repo → select `main`.
3. Resource settings:
   - Type: **Web Service**
   - Environment: **Node.js** (not Docker — if Autodetect picks Docker, switch to Node)
   - Build command: `npm ci && npm run build`
   - Run command: `npm start`
   - HTTP port: `3000`
4. (Optional) Health check path: `/api/health`
5. Instance size: `basic-xxs` is enough to start.
6. **Create Resources** / **Deploy**. Wait for the build to finish.
7. Open the `*.ondigitalocean.app` URL and confirm the site loads.
8. **Settings → Domains** → add `slow.ninja` (and `www` if you use it).
9. At your DNS provider, add the records DigitalOcean shows.
10. After SSL is active, smoke-test `/`, `/games`, catalog views, and `/journal`.

No environment secrets are required. App Platform sets `PORT` for you.

A `Dockerfile` may exist in the repo for optional container deploys — ignore it for this path.
