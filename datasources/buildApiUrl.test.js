import buildApiUrl from './buildApiUrl'
import { SESSION_COOKIE_NAME } from './session'

const buildRes = () => {
  const headers = {}

  return {
    headers,
    getHeader: (name) => headers[name],
    setHeader: (name, value) => {
      headers[name] = value
    },
  }
}

describe('[ datasources / buildApiUrl ]', () => {
  describe("when `req.method` is `'get'`", () => {
    it('should return `{ url, options } with an `undefined` `body``', () => {
      // Arrange
      const req = {
        url: '/api/local/myurl',
        method: 'get',
        body: 'body',
        cookies: { [SESSION_COOKIE_NAME]: 'my-session' },
      }

      // Act
      const result = buildApiUrl(req, buildRes())
      const expected = {
        url: 'myurl',
        options: {
          method: 'GET',
          body: undefined,
          sessionId: 'my-session',
        },
      }

      // Assert
      expect(result).toEqual(expected)
    })
  })

  describe("when `req.method` is `'patch'`", () => {
    it('should return `{ url, options }` with an valid `body`', () => {
      // Arrange
      const req = {
        url: '/api/local/myurl',
        method: 'patch',
        body: 'body',
        cookies: { [SESSION_COOKIE_NAME]: 'my-session' },
      }

      // Act
      const result = buildApiUrl(req, buildRes())
      const expected = {
        url: 'myurl',
        options: {
          method: 'PATCH',
          body: 'body',
          sessionId: 'my-session',
        },
      }

      // Assert
      expect(result).toEqual(expected)
    })
  })

  describe('when the request has no session cookie', () => {
    it('should create a session and set it on the response', () => {
      // Arrange
      const req = { url: '/api/local/myurl', method: 'get', cookies: {} }
      const res = buildRes()

      // Act
      const { options } = buildApiUrl(req, res)

      // Assert
      expect(options.sessionId).toEqual(expect.any(String))
      expect(res.getHeader('Set-Cookie')).toEqual([
        expect.stringContaining(`${SESSION_COOKIE_NAME}=${options.sessionId}`),
      ])
    })
  })

  describe('when the request arrives on a different `[source]` namespace', () => {
    it('should strip whichever namespace served it', () => {
      // Arrange
      const req = {
        url: '/api/demo/tasks?status=pending',
        method: 'get',
        cookies: { [SESSION_COOKIE_NAME]: 'my-session' },
      }

      // Act
      const { url } = buildApiUrl(req, buildRes())

      // Assert
      expect(url).toBe('tasks?status=pending')
    })

    it('should only strip the leading namespace', () => {
      // Arrange
      const req = {
        url: '/api/local/tasks/api/local',
        method: 'get',
        cookies: { [SESSION_COOKIE_NAME]: 'my-session' },
      }

      // Act
      const { url } = buildApiUrl(req, buildRes())

      // Assert
      expect(url).toBe('tasks/api/local')
    })
  })

  describe('when `fetchOptions` are provided', () => {
    it('should override the inferred options', () => {
      // Arrange
      const req = {
        url: '/api/local/myurl',
        method: 'patch',
        body: 'body',
        cookies: { [SESSION_COOKIE_NAME]: 'my-session' },
      }

      // Act
      const { options } = buildApiUrl(req, buildRes(), { method: 'GET' })

      // Assert
      expect(options.method).toBe('GET')
    })
  })
})
