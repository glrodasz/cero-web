import fetchResource from '../datasources'
import {
  finishFocusSession,
  pauseFocusSession,
  resumeFocusSession,
  startFocusSession,
} from '../features/focusSession/commands'
import { readActiveFocusSession } from '../features/focusSession/queries'
import { completeTask, createTask, resetTask } from '../features/tasks/commands'
import { readTasks } from '../features/tasks/queries'

// When the data lives in the browser (`local-storage`) there is no server to
// call, so the HTTP client hands its requests to this instead of `fetch`.
//
// Each entry mirrors a file under `pages/api/[source]/**`, written the same way
// (`[id]` is one segment, `[...entity]` any number), and calls the same
// command, query or pass-through that route does. From there down the path is
// identical to the server's. `browserTransport.test.js` walks the route files
// and fails if one is added, removed or given a method without this table
// following.

export const ANY_METHOD = '*'

const ok = (body) => ({ status: 200, body })

const passThrough =
  (resource) =>
  async ({ url, options, params }) =>
    ok(
      await fetchResource({
        resource: resource ?? params.entity[0],
        url,
        options,
      })
    )

export const ROUTES = [
  {
    path: 'tasks',
    methods: {
      GET: async ({ options }) =>
        ok(await readTasks({ sessionId: options.sessionId })),
      POST: createTask,
    },
  },
  {
    path: 'tasks/[id]/complete',
    methods: {
      PATCH: ({ params, options }) => completeTask({ ...params, options }),
    },
  },
  {
    path: 'tasks/[id]/reset',
    methods: {
      PATCH: ({ params, options }) => resetTask({ ...params, options }),
    },
  },
  { path: 'tasks/[id]', methods: { [ANY_METHOD]: passThrough('task') } },
  {
    path: 'focus-sessions',
    methods: {
      GET: passThrough('focus-sessions'),
      POST: startFocusSession,
    },
  },
  {
    path: 'focus-sessions/active',
    methods: {
      GET: async ({ options }) =>
        ok(await readActiveFocusSession({ sessionId: options.sessionId })),
    },
  },
  { path: 'focus-sessions/finish', methods: { PATCH: finishFocusSession } },
  { path: 'focus-sessions/pause', methods: { PATCH: pauseFocusSession } },
  { path: 'focus-sessions/resume', methods: { PATCH: resumeFocusSession } },
  { path: '[...entity]', methods: { [ANY_METHOD]: passThrough() } },
]

const CATCH_ALL = /^\[\.\.\.(\w+)\]$/
const DYNAMIC = /^\[(\w+)\]$/

const matchPath = (path, segments) => {
  const patterns = path.split('/')
  const params = {}

  for (const [index, pattern] of patterns.entries()) {
    const catchAll = pattern.match(CATCH_ALL)

    if (catchAll) {
      if (index >= segments.length) return null
      params[catchAll[1]] = segments.slice(index)

      return params
    }

    const segment = segments[index]

    if (segment === undefined) return null

    const dynamic = pattern.match(DYNAMIC)

    if (dynamic) {
      params[dynamic[1]] = decodeURIComponent(segment)
    } else if (pattern !== segment) {
      return null
    }
  }

  return patterns.length === segments.length ? params : null
}

// First match wins. Next.js resolves static and dynamic files ahead of a
// catch-all, which is why `[...entity]` stays last in the table.
export const matchRoute = (pathname) => {
  const segments = pathname.split('/').filter(Boolean)

  for (const route of ROUTES) {
    const params = matchPath(route.path, segments)

    if (params) return { route, params }
  }

  return undefined
}

const respond = ({ status, body }) => ({
  ok: status >= 200 && status < 300,
  status,
  // Round tripped through JSON like a real response, so nothing the caller
  // does to it can reach back into the store, and `undefined` fields drop out
  // the same way.
  json: async () => JSON.parse(JSON.stringify(body)),
})

// Answers the way `datasources/withApiRoute` and `utils/withApiHandler` do:
// 404 with no route, 405 when the route has no such method, 500 with the
// message when the handler throws.
const browserTransport = async (path, { method = 'GET', body } = {}) => {
  const [pathname] = path.split('?')
  const match = matchRoute(pathname)

  if (!match) {
    return respond({ status: 404, body: { error: `No route for "${path}".` } })
  }

  const normalizedMethod = method.toUpperCase()
  const { methods } = match.route
  const handler = methods[normalizedMethod] ?? methods[ANY_METHOD]

  if (!handler) {
    return respond({
      status: 405,
      body: { error: `Method "${normalizedMethod}" is not allowed here.` },
    })
  }

  // The same shape `datasources/buildApiUrl` builds from a request. There is
  // no session: the browser already scopes this data to one visitor.
  const options = {
    method: normalizedMethod,
    body: normalizedMethod !== 'GET' && body ? JSON.parse(body) : undefined,
  }

  try {
    return respond(await handler({ url: path, params: match.params, options }))
  } catch (error) {
    console.error('[api/browserTransport]', normalizedMethod, path, error)

    return respond({ status: 500, body: { error: error.message } })
  }
}

export default browserTransport
