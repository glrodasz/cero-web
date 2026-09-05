import withApiHandler from './withApiHandler'

const buildRes = ({ headersSent = false } = {}) => {
  const res = { headersSent, statusCode: null, body: null }

  res.status = jest.fn((code) => {
    res.statusCode = code
    return res
  })
  res.json = jest.fn((body) => {
    res.body = body
    // Next.js sends the response here, so anything downstream must see that
    // the reply has already gone out.
    res.headersSent = true
    return res
  })

  return res
}

describe('[ utils / withApiHandler ]', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    console.error.mockRestore()
  })

  describe('when the handler succeeds', () => {
    it('should not interfere with the response', async () => {
      // Arrange
      const res = buildRes()
      const handler = jest.fn((req, response) => response.status(200).json({}))

      // Act
      await withApiHandler(handler)({ method: 'GET', url: '/ok' }, res)

      // Assert
      expect(handler).toHaveBeenCalled()
      expect(res.statusCode).toBe(200)
    })
  })

  describe('when the handler never answers', () => {
    it('should send 405 instead of leaving the request hanging', async () => {
      // Arrange
      // Every route answers inside a `if (req.method === ...)` guard, so an
      // unexpected method returns without touching `res`.
      const res = buildRes()
      const handler = jest.fn(() => undefined)

      // Act
      await withApiHandler(handler)({ method: 'DELETE', url: '/x' }, res)

      // Assert
      expect(res.statusCode).toBe(405)
      expect(res.body).toEqual({ error: expect.stringContaining('DELETE') })
    })
  })

  describe('when the handler throws', () => {
    it('should respond with the real error message', async () => {
      // Arrange
      const res = buildRes()
      const handler = () => {
        throw new Error('Redis is unreachable')
      }

      // Act
      await withApiHandler(handler)({ method: 'GET', url: '/boom' }, res)

      // Assert
      expect(res.statusCode).toBe(500)
      expect(res.body).toEqual({ error: 'Redis is unreachable' })
    })

    it('should handle a rejected promise', async () => {
      // Arrange
      const res = buildRes()
      const handler = async () => {
        throw new Error('Async failure')
      }

      // Act
      await withApiHandler(handler)({ method: 'GET', url: '/boom' }, res)

      // Assert
      expect(res.body).toEqual({ error: 'Async failure' })
    })

    it('should not write a second response when one was already sent', async () => {
      // Arrange
      const res = buildRes({ headersSent: true })
      const handler = () => {
        throw new Error('Too late')
      }

      // Act
      await withApiHandler(handler)({ method: 'GET', url: '/boom' }, res)

      // Assert
      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
    })
  })
})
