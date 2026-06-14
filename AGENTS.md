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
- Jest coverage threshold is **60%** (branches/functions/lines/statements).
- Integration tests use TestCafe (`*.integration.test.js`) and are excluded
  from the default `jest` run.

## Project structure

```
api/                      Class-based HTTP client (talks to NEXT_PUBLIC_API_URL)
config/                   Env-var reads + webpack/redirects config
features/<feature>/       Feature modules (see layout below)
pages/                    Next.js routes
pages/api/local/**        Local API routes backed by json-server
utils/                    Cross-cutting helpers (incl. jsonServerQueries.js)
styles/  public/  tests/
```

Features: `common`, `tasks`, `planning`, `focusSession`, `retrospective`.

### Feature module layout

```
features/<feature>/
  components/      Presentational components
  containers/      Stateful components that wire hooks + handlers to components
  hooks/           use* hooks (data fetching, dialog state, timers)
  handlers.js      Event-handler factories (see below)
  helpers.js       Pure helpers
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

Shared json-server queries live in `utils/jsonServerQueries.js` — reuse
`getActiveFocusSession` / `getInProgressAndPendingTasks` rather than
re-implementing them in route handlers.

### Local API routes

`pages/api/local/**` are Next API routes that proxy to json-server via
`buildLocalApiUrl` + `fetchJsonServer`. Use the status constants above in URLs
and bodies. `pages/api/test/*` are stub fixtures (FIXME) — leave them alone
unless the task targets them.

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
- `master` is the release branch. CI (`.github/workflows/`) runs lint, tests,
  build, and coverage on push to `master` and on PRs.
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
- Dev defaults live in `.env.development`; secrets (Auth0) go in `.env.local`
  (see `.env.local.example`).
- `NEXT_PUBLIC_MAXIMUM_IN_PRIORITY_TASKS` is the canonical key; a temporary
  `??` fallback to the misspelled legacy `NEXT_PUBLIC_MAXIMUN_IN_PRIORITY_TASKS`
  exists for rollout and will be removed once deployments are migrated.
