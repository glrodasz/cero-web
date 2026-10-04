# Deployment

How this app is deployed and how the demo/preview deployments work. For the
design rationale behind the data-source selector and the serverless rules that
shaped it, see [`AGENTS.md`](../AGENTS.md). Local setup lives in the
[README](../README.md).

## Deploying a preview without a database

The app has no database service: it persists through `json-server` and a local
`db.json`. To run a preview deployment (Vercel or any other host) where no
`json-server` process exists, two fallbacks kick in automatically: the data
moves into each visitor's browser, and Auth0 is stubbed.

**One switch picks the backend.** `NEXT_PUBLIC_DATA_SOURCE` (see
`config/dataSource.js`) is the only thing that decides which backend a
deployment talks to, and both halves derive from it — where the browser's
requests go (`config/index.js`, `api/index.js`) and the storage behind them
(`datasources/index.js`), so the two can never disagree:

```mermaid
flowchart TD
  ENV["NEXT_PUBLIC_DATA_SOURCE<br/><i>baked in at build time</i>"]
  ENV --> URL["config/index.js + api/index.js<br/>→ API_URL or the browser transport<br/><i>where the browser's requests go</i>"]
  ENV --> STORE["datasources/index.js<br/>→ the store<br/><i>what answers the read</i>"]

  URL --> LOCAL["/api/local"]
  URL --> INBROWSER["no request at all<br/>api/browserTransport.js"]
  URL --> TEST["/api/test"]
  URL --> EXT["NEXT_PUBLIC_API_URL"]

  LOCAL --> JS["json-server :3001<br/>db.json"]
  INBROWSER --> LS["localStorage<br/>this browser only"]
  TEST --> FIX["fixtures<br/>in-process, fixed data"]
  EXT --> BACKEND["external backend<br/>not wired through this app yet"]

  STORE -.-> JS
  STORE -.-> LS
  STORE -.-> FIX
  STORE -.-> BACKEND
```

| `NEXT_PUBLIC_DATA_SOURCE` | browser calls | storage |
| --- | --- | --- |
| `api` | `NEXT_PUBLIC_API_URL` (required) | the real backend — **not wired through this app yet** |
| `json-server` | `/api/local` | `json-server` at `JSON_SERVER_URL` |
| `local-storage` | nothing — answered in the browser | `localStorage`, per browser |
| `fixtures` | `/api/test` | committed arrays, per process (integration tests) |

**Switching between them:**

- Already wired per environment — `yarn dev` uses `json-server`,
  `yarn test:integration` uses `fixtures`, and a deployment uses
  `local-storage`.
- One-off, locally: `NEXT_PUBLIC_DATA_SOURCE=local-storage yarn build && yarn start`.
- On Vercel: set it in the dashboard, **then redeploy**.

That last step is not optional. `NEXT_PUBLIC_*` values are compiled into the
bundle, so changing one without rebuilding does nothing — and a bundle built
for one namespace calling another is exactly what the 400 above catches.

The `api` row is the one gap: that backend lives in its own repository and
nothing here talks to it yet, so selecting it fails with a clear error rather
than quietly serving demo data.

The API routes live under a dynamic `pages/api/[source]/` segment, so one set
of files serves every namespace and the path itself names the backend. A
request to the wrong namespace gets a 400 rather than silently reading the
wrong store, and a deployment whose source the routes don't serve
(`local-storage`, `api`) answers 404 on all of them.

**Browser-backed demo.** With `NEXT_PUBLIC_DATA_SOURCE=local-storage`, no
request leaves the browser. `api/index.js` hands the HTTP client
`api/browserTransport.js` instead of `fetch`, which routes each request to the
same `features/*/commands.js` the API routes run, and those reach
`datasources/localStorage/` through `datasources/index.js`. The data is one JSON
document under the `cero:collections` key, seeded from `db.seed.json` on first
use. So the demo behaves exactly like the routes do, with nothing to provision:
no database, no credentials, no quota.

What that means in practice:

- **Per browser.** Each visitor — each browser profile — has their own data,
  and it never reaches the server.
- **No expiry.** Data stays until the site's data is cleared. DevTools (the cog,
  enabled on demo deployments) has **Reset demo data**, which restores the seed
  and reloads `/planning`.
- **No server-rendered data.** `getServerSideProps` has nothing to read, so it
  returns empty props; the page loads its data once it is in the browser, and
  the planning ↔ focus-session redirect happens there too
  (`useFocusSessionRedirect`).
- **Two tabs, last write wins.** Writes are queued per tab, so two tabs writing
  at the same moment can lose one. The next write corrects it.

**Migrating from the Redis store.** This source replaced `memory`, which kept
the demo in Upstash Redis. `memory` is no longer a valid value: a deployment
that still sets it on the dashboard fails its build with
`Unknown NEXT_PUBLIC_DATA_SOURCE "memory"`. Change it to `local-storage` (or
delete it — `.env.production` already says `local-storage`), redeploy, and the
Upstash integration and its `UPSTASH_REDIS_REST_*` / `KV_REST_API_*` variables
can be removed.

**Demo authentication.** When `NEXT_PUBLIC_DEMO_MODE` is `true`,
`features/common/auth.js` replaces the Auth0 `withPageAuthRequired` and `useUser`
with stubs, so no Auth0 secret or per deployment callback URL is needed. Anyone
with the URL gets in, so keep the deployment private if that matters.

Environment variables to configure on the project:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_DEMO_MODE` | `true` |
| `NEXT_PUBLIC_DATA_SOURCE` | `local-storage` (already the value in `.env.production`) |
| `NEXT_PUBLIC_MAXIMUM_IN_PRIORITY_TASKS` | `2` |
| `NEXT_PUBLIC_MAXIMUM_BACKLOG_QUANTITY` | `4` |
| `NEXT_PUBLIC_API_URL` | leave unset, it is only read when the source is `api` |
| `JSON_SERVER_URL` | leave unset, it is only read when the source is `json-server` |

Vercel deployment protection can stay enabled. With `local-storage` the server
reads nothing at all; for the sources it does read, `getServerSideProps` goes
directly through `features/*/queries.js` rather than making an HTTP request to
this same deployment's API routes, so there is no internal request for
protection to reject. (It used to make that round trip, and because the
request carried no auth it came back as `401: Protected deployment`, failing
every server rendered page.) The API routes reuse the same functions, so the
two paths cannot drift apart.

To reproduce a preview locally — exactly, since everything happens in the
browser:

```
NEXT_PUBLIC_DEMO_MODE=true yarn build
NEXT_PUBLIC_DEMO_MODE=true yarn start
```

Local development is unaffected: `.env.development` selects `json-server`, so
`yarn dev` keeps using `json-server` and `db.json`, and never touches
`localStorage`.

The integration suite (`yarn test:integration`) selects `fixtures`, so it runs
against the same routes with the committed arrays in `datasources/fixtures/`
behind them — no `json-server`, and your local `db.json` is left alone. It waits for the server to be listening and exits when TestCafe does.

