import fs from 'fs'
import path from 'path'

import seed from '../db.seed.json'
import browserTransport, {
  ANY_METHOD,
  ROUTES,
  matchRoute,
} from './browserTransport'
import Request from './request'

const API_ROUTES_DIR = path.join(__dirname, '../pages/api/[source]')

const send = async (url, { method = 'GET', body } = {}) => {
  const response = await browserTransport(url, {
    method,
    body: body && JSON.stringify(body),
  })

  return {
    ok: response.ok,
    status: response.status,
    body: await response.json(),
  }
}

const listRouteFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)

    return entry.isDirectory() ? listRouteFiles(fullPath) : [fullPath]
  })

// `tasks/[id]/index.js` → `tasks/[id]`, with the methods its handler guards on
// — none means it answers any method.
const describeRouteFile = (file) => {
  const route = path
    .relative(API_ROUTES_DIR, file)
    .replace(/\.js$/, '')
    .replace(/\/?index$/, '')
  const methods = [
    ...fs.readFileSync(file, 'utf8').matchAll(/req\.method === '(\w+)'/g),
  ].map(([, method]) => method)

  return { path: route, methods: methods.length ? methods : [ANY_METHOD] }
}

describe('[ api / browserTransport ]', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, NEXT_PUBLIC_DATA_SOURCE: 'local-storage' }
    window.localStorage.clear()
  })

  afterAll(() => {
    process.env = ORIGINAL_ENV
  })

  describe('the route table', () => {
    // The guard against the two drifting apart: a route file added, removed or
    // given another method without this table following fails here.
    it('should mirror every file under `pages/api/[source]`', () => {
      // Arrange
      const expected = listRouteFiles(API_ROUTES_DIR)
        .map(describeRouteFile)
        .sort((a, b) => a.path.localeCompare(b.path))

      // Act
      const result = ROUTES.map((route) => ({
        path: route.path,
        methods: Object.keys(route.methods),
      })).sort((a, b) => a.path.localeCompare(b.path))

      // Assert
      expect(result).toEqual(expected)
    })

    it.each([
      ['focus-sessions/active', 'focus-sessions/active', {}],
      ['tasks/7', 'tasks/[id]', { id: '7' }],
      ['tasks/7/complete', 'tasks/[id]/complete', { id: '7' }],
      ['focus-sessions/7', '[...entity]', { entity: ['focus-sessions', '7'] }],
    ])('should resolve "%s" the way Next.js does', (url, expected, params) => {
      // Act
      const result = matchRoute(url)

      // Assert
      expect(result.route.path).toBe(expected)
      expect(result.params).toEqual(params)
    })
  })

  describe('when the data lives in the browser', () => {
    it('should list the open tasks, by priority', async () => {
      // Act
      const result = await send('tasks')

      // Assert
      expect(result.status).toBe(200)
      expect(result.body.map((task) => task.id)).toEqual([1, 3, 2, 4])
    })

    it('should create a task and read it back through the pass-through', async () => {
      // Arrange
      const { body: created } = await send('tasks', {
        method: 'POST',
        body: { description: 'New task' },
      })

      // Act
      const result = await send(`tasks/${created.id}`)

      // Assert
      expect(result.body).toEqual(created)
      expect(result.body.description).toBe('New task')
    })

    it('should run the same commands the API routes do', async () => {
      // Act
      const started = await send('focus-sessions', { method: 'POST' })
      const active = await send('focus-sessions/active')
      const finished = await send('focus-sessions/finish', { method: 'PATCH' })
      const finishedAgain = await send('focus-sessions/finish', {
        method: 'PATCH',
      })

      // Assert
      expect(started.status).toBe(201)
      expect(active.body.id).toBe(started.body.id)
      expect(finished.body.status).toBe('finished')
      expect(finishedAgain).toEqual({
        ok: false,
        status: 404,
        body: { error: 'There is no active focus session' },
      })
    })

    it('should keep what it writes in localStorage', async () => {
      // Act
      await send('tasks/1/complete', { method: 'PATCH' })
      const stored = JSON.parse(window.localStorage.getItem('cero:collections'))

      // Assert
      expect(stored.tasks.find((task) => task.id === 1).status).toBe(
        'completed'
      )
      expect(stored.tasks).toHaveLength(seed.tasks.length)
    })
  })

  describe('when the route has no such method', () => {
    it('should answer 405, as `withApiHandler` would', async () => {
      // Act
      const result = await send('focus-sessions/finish', { method: 'DELETE' })

      // Assert
      expect(result).toEqual({
        ok: false,
        status: 405,
        body: { error: 'Method "DELETE" is not allowed here.' },
      })
    })
  })

  describe('when there is no route at all', () => {
    it('should answer 404', async () => {
      // Act
      const result = await send('')

      // Assert
      expect(result.status).toBe(404)
    })
  })

  describe('when the handler throws', () => {
    it('should answer 500 with the message', async () => {
      // Arrange
      jest.spyOn(console, 'error').mockImplementation(() => {})

      // Act
      const result = await send('tasks/999', {
        method: 'PATCH',
        body: { description: 'Nope' },
      })

      // Assert
      expect(result).toEqual({
        ok: false,
        status: 500,
        body: { error: 'No "tasks" found with the id "999"' },
      })

      console.error.mockRestore()
    })
  })

  describe('when used as the transport of the HTTP client', () => {
    it('should surface a failure the way a failed request does', async () => {
      // Arrange
      const client = new Request('focus-sessions', {
        transport: browserTransport,
      })

      // Act & Assert
      await expect(
        client.fetch('focus-sessions/finish', { method: 'patch' })
      ).rejects.toThrow('There is no active focus session')
    })
  })
})
