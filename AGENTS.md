# AGENTS.md

Guidance for AI agents and LLMs working in this repository. Human-oriented
setup lives in `README.md`; this file captures the conventions you need to
make changes that match the existing code.

## What this is

**Cero a Producción — Web** (app codename **RETO**) is a productivity /
task-management app built live on stream. Stack:

- **Next.js 12** (pages router) + **React 18**
- **@tanstack/react-query v4** for server state
- **@auth0/nextjs-auth0** for auth
- **react-beautiful-dnd** for the drag-and-drop board
- **@glrodasz/components** as the shared UI component library
- **json-server** as the local mock backend (`db.json`, port 3001)

Package manager is **Yarn 4** (`yarn@4.12.0`, Berry). Node **>= 24** (see
`.nvmrc`). Do not introduce `npm install` lockfile churn — use `yarn`.

## Commands

```bash
yarn dev            # json-server (:3001) + next dev (:3000) concurrently
yarn build          # next build
yarn test           # jest (jsdom)
yarn test:watch     # jest --watch
yarn lint:js        # eslint over **/*.js  ← use this to check code
yarn lint           # lint:js + lint:json + lint:css (also scans non-code files)
yarn lint:fix       # autofix js/json/css
yarn commit         # commitizen prompt (conventional commits)
```

Notes for agents:

- Prefer **`yarn lint:js`** when checking your code changes. `yarn lint` also
  runs Prettier over JSON/CSS across the whole tree and can flag unrelated
  files (e.g. under `.claude/`).
- There are ~16 pre-existing lint **warnings** (`react-hooks/exhaustive-deps`,
  `react/forbid-prop-types`). They are tolerated; don't treat them as your
  regressions, but don't add new ones.
- Jest coverage threshold is **branches 40 / functions 25 / lines 30 /
  statements 30** (see the comment in `jest.config.js` — it was lowered from
  an aspirational 60% to match actual repo coverage; ratchet it up as
  coverage improves, don't lower it to unblock a change).
- Integration tests use TestCafe (`*.integration.test.js`) and are excluded
  from the default `jest` run.

## Project structure

```
api/                      Class-based HTTP client (talks to config's API_URL)
config/                   Env-var reads incl. dataSource.js, the one selector
datasources/              How server-side code reaches storage (see below)
features/<feature>/       Feature modules (see layout below)
pages/                    Next.js routes
pages/api/[source]/**     API routes, one set serving every namespace below
utils/                    Generic, project-independent helpers (see below)
styles/  public/  tests/
```

Features: `common`, `tasks`, `planning`, `focusSession`, `retrospective`.

### `utils/` vs `helpers.js` vs `datasources/`

Three places hold non-component logic, and they're not interchangeable — pick
by *how reusable* and *how data-related* the code is:

- **`utils/`** — generic and project-independent. It should read like it
  could be copy-pasted into any other JS project (`isEmpty`, `isObject`,
  `time`, `formatMilliseconds`, `timeAgo`, `httpCodes`, `withApiHandler`).
  If a function mentions a task, a focus session, a route, or a status
  string, it does not belong here.
- **`helpers.js`** (per feature) — pure functions that *are* specific to this
  project/feature, but don't touch storage. Domain logic, formatting for a
  specific screen, derived values from feature state.
- **`datasources/`** — project-specific, but cross-cutting infrastructure for
  *talking to storage*. Not tied to one feature; every feature's
  `queries.js` goes through it.

Promotion rule: React-shared code (hooks, components) that more than one
feature needs goes to `features/common/`. Non-React generic code goes to
`utils/`. **`utils/` must never import from `features/`** — that dependency
only ever points the other way.

### One selector: `NEXT_PUBLIC_DATA_SOURCE`

**There is exactly one switch for "which backend is this deployment talking
to", and everything derives from it.** `config/dataSource.js` owns it:

| `NEXT_PUBLIC_DATA_SOURCE` | serves the data | `API_URL` (browser) | storage |
| --- | --- | --- | --- |
| `api` | external backend (separate repo) | `NEXT_PUBLIC_API_URL` (**required**) | — **not wired through this app yet**, see below |
| `json-server` | this app, `/api/local` | `/api/local` | `json-server` at `JSON_SERVER_URL` |
| `memory` | this app, `/api/demo` | `/api/demo` | Upstash Redis, per session cookie |
| `fixtures` | this app, `/api/test` | `/api/test` | committed arrays, per process |

Rules that keep it a single source of truth — don't reintroduce a second one:

- `config/index.js` derives `API_URL` from it, and `datasources/index.js`
  derives the storage from it. Never add a separate variable that decides
  either half independently.
- `NEXT_PUBLIC_API_URL` is read **only** when the source is `api`. It is not a
  general override — for the self-hosted sources it is ignored entirely.
- `JSON_SERVER_URL` means *"where json-server listens"* and nothing more. It
  selects nothing. (It used to: the mere presence of it picked the backend,
  which is how `/api/local` came to mean json-server locally and Redis in a
  preview, with nothing connecting the two.)
- An unrecognized value throws. `NEXT_PUBLIC_*` bakes at build time, so a typo
  fails the build instead of becoming a confusing 500 later.
- Unset defaults to `memory` — a plain preview deploy with no dashboard config.

`NEXT_PUBLIC_DEMO_MODE` is a **separate** axis: it stubs Auth0
(`features/common/auth.js`). Demo deployments happen to set both; they are not
the same switch.

### How a read actually reaches a store

```
  BROWSER (React Query)                    SERVER RENDER (getServerSideProps)
  ─────────────────────                    ─────────────────────────────────
  useTasks / useFocusSession               pages/planning.js
          │                                pages/focus-session.js
  features/common/api                              │
          │                                        │
  api/request.js ──── base = API_URL               │   no HTTP at all:
          │                                        │   already on the server,
   HTTP  /api/<namespace>/tasks?status=…           │   next to the data
          │                                        │
  pages/api/[source]/**                            │
     ├ withApiRoute   → 400 if the namespace in    │
     │                  the path ≠ configured one  │
     └ withApiHandler → 405 if no method matched   │
          │                                        │
  datasources/buildApiUrl                  features/*/queries.js
          │                                        │
          └──────────► datasources/index.js ◄──────┘
                              │
        ┌───────────┬─────────┴─────────┬──────────────┐
        ▼           ▼                   ▼              ▼
  jsonServer.js  memory/            fixtures/      api → throw
  HTTP :3001     Redis              in-process     (external backend)
        └───────────┴─── collections/ ───┘
                    (shared CRUD + query engine)
```

Two things to preserve when changing any of this. **Server rendering skips the
HTTP column on purpose** — routing it back through the app's own API routes is
what produced the `401: Protected deployment` failure, so `getServerSideProps`
calls `features/*/queries.js` directly. And **`collections/` is the only place
CRUD semantics are defined**, which is what stops the demo store and the test
fixtures from drifting apart; a new store supplies `getCollections` /
`saveCollections` and nothing else.

### `datasources/` — the data layer, explicit

`pages/api/[source]/**` and `getServerSideProps` never talk to storage
directly; they go through `datasources/`:

```
datasources/
  index.js            Routes to a backend per the table above; default export
                       `fetchResource({ resource, url, options, res, singular })`
  jsonServer.js        HTTP to json-server
  memory/              Upstash Redis
    index.js            collections handler over the Redis store
    client.js            Redis client + credential handling
    store.js             get/save the per-session collections blob
  collections/         the json-server-shaped CRUD, over any store
    index.js            createCollectionsHandler({ getCollections, saveCollections })
    query.js             pure filter/sort/parse engine, no I/O
    lock.js              per-session mutation queue
  fixtures/            deterministic per-process store + its committed arrays
  session.js           the `cero_demo_session` cookie (scopes preview data per visitor)
  buildApiUrl.js       builds the resource/url/options tuple the routes pass in
  withApiRoute.js      withApiHandler + the `[source]` namespace guard
```

Splitting the CRUD (`collections/`) from the stores (`memory/`, `fixtures/`)
is deliberate twice over: each piece — credential handling, locking, the query
engine — is independently unit-testable, which is the whole point of keeping
files small here; and the demo store and the test fixtures get *identical*
semantics instead of two implementations that drift.

**`api` is not served by `datasources/`.** That backend lives in its own
repository and nothing here talks to it yet, so `datasources/index.js` throws
rather than falling through to a local store — otherwise a deployment
configured for production would quietly render demo seed data. Wiring it up
means giving `features/*/queries.js` an HTTP path, since `getServerSideProps`
reads storage directly.

**The mutation lock is per process.** `collections/lock.js` serializes writes
for a session so a parallel fan-out (reordering tasks) doesn't lose one. On a
serverless host each instance has its own queue, so two writes landing on
different instances can still drop one. Accepted for a per-visitor demo store,
where the next write corrects it; anything that had to be correct under real
concurrency needs a lock in the backing store, or a key per record instead of
one document per session.

### `pages/api/[source]/**` — the namespace names the backend

The routes live under a dynamic `[source]` segment, so one set of files serves
`/api/local` and `/api/demo` and the **path itself says which store is behind
it**. `API_URL` is derived from the same config, so the two agree by
construction.

`datasources/withApiRoute.js` wraps every handler and returns **400** if
`req.query.source` doesn't match the configured source's namespace — a stale
bundle calling a namespace this build no longer serves fails loudly instead of
silently reading the wrong store. It wraps `utils/withApiHandler`, which stays
in `utils/` precisely because it knows none of this: it is generic Next.js
plumbing, and `utils/` must not learn about this project's data layer.

Static route segments win over dynamic ones in Next, so `pages/api/auth/**`
keeps resolving to its own files. Nothing else may sit at `pages/api/<name>/`
where `<name>` is one of the namespaces above — a static file there would
shadow the real routes.

### `queries.js` — per-feature server-side reads

Each feature that's read from `getServerSideProps` *and* an API route (so
far `tasks`, `focusSession`) has a `queries.js` alongside `handlers.js` /
`helpers.js` / `constants.js`. It wraps `datasources/` calls into named
domain reads (`readTasks`, `readActiveFocusSession`, …) so both call sites
share one implementation and can't drift apart. See the "no self-fetch" rule
below for why this exists.

### Feature module layout

```
features/<feature>/
  components/      Presentational components
  containers/      Stateful components that wire hooks + handlers to components
  hooks/           use* hooks (data fetching, dialog state, timers)
  handlers.js      Event-handler factories (see below)
  helpers.js       Pure helpers
  queries.js       Server-side domain reads (getServerSideProps + API routes), via datasources/
  constants.js     Feature constants
```

Not every feature has every folder. `features/common/` holds shared hooks
(`useDialog`, `useDialogWithState`, `useLocalData`, …), the shared
`api.js` re-export, and shared layout/components.

## Conventions

### Imports & data access

- The HTTP client lives in `api/` as classes extending `api/request.js`,
  instantiated in `api/index.js` (`tasks`, `focusSessions`).
- **Consume the API through the shared re-export**, not the root directly:
  ```js
  import { tasksApi, focusSessionsApi } from '../../common/api'
  ```
  `features/common/api.js` re-exports `tasks as tasksApi` /
  `focusSessions as focusSessionsApi`. Do **not** create per-feature `api.js`
  re-export files — that pattern was removed.

### Hooks

- One hook per file, named `use<Thing>`, **default export**.
- Dialog + a piece of state ⇒ build on `useDialogWithState(initialValue)`,
  which returns `{ ...useDialog(), value, setValue }`. Specialized hooks adapt
  `value`/`setValue` to domain names, e.g.:
  ```js
  const { value: taskId, setValue: setTaskId, ...dialog } = useDialogWithState()
  return { ...dialog, taskId, setTaskId }
  ```
- Data hooks use React Query; define a `QUERY_KEY` const and
  `invalidateQueries` in mutation `onSuccess`.

### Handlers

Event handlers are **curried factories** named `create<Name>Handler`, living
in `handlers.js`. They take dependencies and return the event handler:

```js
export const createAddTaskHandler =
  ({ tasks }) =>
  ({ value }) => {
    const { api } = tasks
    !isEmpty(value) && api.create({ description: value })
  }
```

Containers instantiate these and pass them to components as `on*` props.

### Components

- Co-locate as a folder with a barrel: `Board/Board.js` +
  `Board/index.js` (`export { default } from './Board'`). Some older feature
  components are still flat files — follow the folder+barrel form for new ones
  in `common`/`tasks`.
- Always declare `propTypes`. `react/forbid-prop-types` is a warning: prefer
  `PropTypes.shape({...})` over bare `PropTypes.object` / `PropTypes.array`
  for new code.
- React import is not required for JSX (`react/react-in-jsx-scope` is off).

### Constants over magic strings

Status values are constants, not inline strings:

- Task statuses (which are also column IDs) in `features/tasks/constants.js`:
  `IN_PROGRESS_COLUMN_ID`, `PENDING_COLUMN_ID`, `COMPLETED_COLUMN_ID`.
- Focus-session statuses in `features/focusSession/constants.js`:
  `ACTIVE_FOCUS_SESSION_STATUS`, `FINISHED_FOCUS_SESSION_STATUS`.

Shared server-side reads live in each feature's `queries.js` — reuse
`getActiveFocusSession` / `getInProgressAndPendingTasks` (and the
session-aware `readActiveFocusSession` / `readTasks`) rather than
re-implementing them in route handlers or in `getServerSideProps`.

### API routes

`pages/api/[source]/**` are Next API routes that read/write through
`datasources/` (via `buildApiUrl` + `fetchResource`, or a feature's
`queries.js` for shared reads) — see the data layer sections above. Wrap every
handler in `withApiRoute`, and use the status constants above in URLs and
bodies.

The integration suite runs against these same routes: `.env.test` selects
`fixtures`, so `/api/test` is served by `pages/api/[source]/**` too, backed by
the committed arrays in `datasources/fixtures/`. It needs no `json-server` and
no `db.json`.

## Code style

- **Prettier**: no semicolons, single quotes (`.prettierrc.json`).
- **EditorConfig**: 2-space indent, LF, UTF-8, final newline, trim trailing
  whitespace.
- ESLint extends `next` + `plugin:prettier/recommended`; Prettier issues
  surface as ESLint errors.
- Husky pre-commit runs `lint-staged`, which autofixes staged `*.js`/`*.json`/
  `*.css`. Expect formatting to be applied on commit.

## Commits

- **Conventional Commits** enforced by commitlint
  (`@commitlint/config-conventional`). Use types like `feat:`, `fix:`,
  `refactor:`, `chore:`, `test:`, `docs:`.
- Use `yarn commit` for a guided prompt, or write the message directly in the
  conventional format.
- `main` is the release branch. CI (`.github/workflows/`) runs lint, tests,
  build, and coverage on push to `main` and on PRs.
- Add `skip ci` to a commit message to bypass the release workflow.

## Testing conventions

- Tests are co-located: `Thing.js` ⇒ `Thing.test.js`.
- Stack: Jest + `@testing-library/react` + `@testing-library/react-hooks`.
- `describe` labels use the path form: `[ features / tasks / hooks / useTasks ]`.
- Follow **Arrange / Act / Assert** with those comment markers; name the
  result `result` and the expectation `expected` where practical.
- Component output is snapshot-tested via `toMatchSnapshot()`; update
  snapshots only when the change is intentional.
- Mock `@glrodasz/components` with `utils/testUtils/dummyRender` when a test
  would otherwise pull in real UI.

## Environment

- Public config is read in `config/index.js` from `NEXT_PUBLIC_*` env vars
  (`MAXIMUM_IN_PRIORITY_TASKS`, `MAXIMUM_BACKLOG_QUANTITY`, `API_URL`).
  `API_URL` is **derived**, not configured — see the selector section above.
- Dev defaults live in `.env.development`; secrets (Auth0) go in `.env.local`
  (see `.env.local.example`).
- Every committed env file must set `NEXT_PUBLIC_MAXIMUM_*`. Leaving them out
  makes the config `NaN`, and every `length >= NaN` check silently returns
  false — which is exactly how the in-progress cap went missing under test.
- `NEXT_PUBLIC_MAXIMUM_IN_PRIORITY_TASKS` is the canonical key; a temporary
  `??` fallback to the misspelled legacy `NEXT_PUBLIC_MAXIMUN_IN_PRIORITY_TASKS`
  exists for rollout and will be removed once deployments are migrated.

## Rules learned from production incidents

This branch shipped a Vercel preview deployment and hit several
serverless-specific failures. The fixes are in place; these are the rules
that keep them fixed — don't reintroduce the underlying mistake elsewhere:

- **No module-level memory across `pages/api/**` routes.** Each API route
  (and each page with `getServerSideProps`) deploys as its own isolated
  serverless function on Vercel — a top-level `Map`/`Set`/plain object is
  *not* shared between them. Anything that must be shared across requests
  goes through `datasources/memory/` (Redis), never a module-level variable.
- **Never let `getServerSideProps` fetch this deployment's own API routes
  over HTTP.** Vercel Deployment Protection rejects that self-fetch with a
  401, and it's slower even when protection is off. Call the `datasources/`
  functions (via a feature's `queries.js`) directly instead — that's what
  `queries.js` exists for.
- **`NEXT_PUBLIC_*` env vars bake in at build time**, not read at request
  time. Changing one on Vercel requires a fresh deployment (or an empty
  commit) to take effect, and it must be scoped to the right environment
  (Preview vs. Production).
- **Always check `response.ok`** in HTTP client code before treating a body
  as valid data — an error response's JSON body is not the same shape as a
  success body, and treating it as one produces confusing downstream errors
  (e.g. `[object Object]`) instead of the real message.
- **One selector per decision.** Two variables deciding two halves of the same
  question is how `/api/local` ended up meaning json-server in one environment
  and Redis in another, and how the `test` environment came to point the
  browser at fixtures while server rendering reached for Redis credentials
  that weren't there. If a new environment needs a backend, add a row to
  `config/dataSource.js` — never a second variable.
- **Answer on every path.** Handlers reply inside a `if (req.method === …)`
  guard, and Next leaves the connection open if none matches — the caller waits
  out a gateway timeout instead of getting an error. `utils/withApiHandler`
  sends a 405 when a handler returns without writing a response; don't add a
  route that bypasses it.
- **Wrap API route handlers** (`datasources/withApiRoute`, which builds on the
  generic `utils/withApiHandler`) so an uncaught throw
  returns a real JSON error body instead of collapsing into Next's generic
  "Internal Server Error" with no detail.
- **Never pass `res` into an intermediate step of a handler that must throw
  on failure to stop execution.** Resolving `res` on error (writing the
  response but not throwing) lets the handler keep running past a failure it
  should have stopped on.
- **Never compile a value that crossed HTTP into `new RegExp()`** — that's a
  ReDoS vector. `datasources/collections/query.js`'s `_like` filter matches by
  plain substring/alternation instead.
