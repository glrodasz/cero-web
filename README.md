# Cero a Producción — Web
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/glrodasz/cero-web/release.yml?branch=main)](https://github.com/glrodasz/cero-web/actions/workflows/release.yml) [![Codecov](https://img.shields.io/codecov/c/github/glrodasz/cero-web)](https://app.codecov.io/gh/glrodasz/cero-web)

0️⃣ 🚀 **Cero a Producción** is a series of live coding sessions where we build
**RETO**, a productivity app, from scratch to production — real decisions,
failing tests, refactors and all.

📺 [YouTube](https://glrz.me/youtube-cero) · 🟣 [Twitch](https://glrz.me/stream)
(live in 🇪🇸 Spanish, Tuesdays to Fridays)

Part of the [Cero a Producción project](https://github.com/glrodasz/cero).

## What this is

The **web frontend** of RETO: a planning board where you keep a backlog, promote
a limited number of tasks to in-progress, run a focus session and close it with a
retrospective.

**Stack:** Next.js 12 (pages router) · React 18 · `@tanstack/react-query` v4 ·
`@auth0/nextjs-auth0` · `react-beautiful-dnd` · Yarn 4 · Node ≥ 24 (see `.nvmrc`).

## Related projects

- **[`cero-components`](https://github.com/glrodasz/cero-components)** — the UI
  kit this app is built with, consumed as the `@glrodasz/components` npm
  dependency. [npm](https://www.npmjs.com/package/@glrodasz/components) ·
  [Storybook](https://cero-components.vercel.app)
- **[`cero-api`](https://github.com/glrodasz/cero-api)** — the backend, being
  explored across several stacks. **Not wired to this app yet**: locally the app
  persists through `json-server` and a `db.json` file.

## Running the project locally

1. Clone the repository: `git clone https://github.com/glrodasz/cero-web.git`
2. Install dependencies in the project folder: `yarn`
3. Copy `.env.local.example` to `.env.local` and fill the env variables.
4. Seed the local database: `cp db.seed.json db.json` (this file is gitignored,
   so `json-server` can freely read and write it).
5. Start everything with `yarn dev`:

- The web project at `http://localhost:3000`
- The local API at `http://localhost:3000/api/local`
- The JSON server at `http://localhost:3001`

## Running the tests

- `yarn test` — unit and component tests (Jest).
- `yarn test:watch` — same, in watch mode.
- `yarn test:integration` — TestCafe end-to-end run against the committed
  fixtures in `datasources/fixtures/`, so it needs no `json-server` and leaves
  your `db.json` alone.

## Deployment

The app has no database service. Demo and preview deployments swap
`json-server` for a Redis-backed store selected by `NEXT_PUBLIC_DATA_SOURCE` —
see [`docs/deployment.md`](docs/deployment.md) for the full setup.

## Contributing

Conventions, project structure and the rules behind the data layer live in
[`AGENTS.md`](AGENTS.md). Commits follow
[Conventional Commits](https://www.conventionalcommits.org) — use `yarn commit`
for a guided prompt.

## Troubleshooting

### M1 (Apple Silicon) Macs: `npm ERR! sharp Prebuilt libvips 8.10.5 binaries are not yet available for darwin-arm64v8`

Update libvips by running:

```
brew install vips
```

More info: https://sharp.pixelplumbing.com/install#apple-m1
