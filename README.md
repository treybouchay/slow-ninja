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

The app listens on `PORT` (default `3000`) and binds to `0.0.0.0` in Docker.

## Deploy on DigitalOcean

This repo is ready for **App Platform** (Dockerfile) or a **Droplet** running the same image.

### What is already prepared

- `output: "standalone"` in `next.config.ts`
- `Dockerfile` (multi-stage Node 22 Alpine)
- `.dockerignore`
- `.do/app.yaml` — optional App Spec template
- `GET /api/health` for health checks

No env secrets are required for the current site.

### Your steps (DigitalOcean)

1. **Push this repo** to GitHub or GitLab (permanent remote).
2. In DigitalOcean → **Apps** → **Create App** → choose that repo + `main`.
3. Resource type: **Dockerfile** (Autodetect should find `/Dockerfile`).
4. HTTP port: **3000** (or leave default if DO detects `EXPOSE`).
5. Health check path: **`/api/health`** (optional but recommended).
6. Size: `basic-xxs` is enough to start; scale later.
7. **Deploy**. Confirm the `*.ondigitalocean.app` URL loads.
8. **Domains** → add `slow.ninja` (and `www` if you use it).
9. At your DNS provider, add the records DigitalOcean shows (usually CNAME or ALIAS to the app).
10. Wait for SSL; smoke-test `/`, `/games`, catalog views, `/journal`.

Optional CLI (after editing `.do/app.yaml` with your real `github.repo`):

```bash
doctl apps create --spec .do/app.yaml
```

### Droplet alternative

```bash
docker build -t slow-ninja .
docker run -d -p 80:3000 --name slow-ninja --restart unless-stopped slow-ninja
```

Put Caddy or nginx in front for HTTPS if you are not using App Platform’s managed TLS.

## License

Private studio site unless otherwise noted.
