import withApiRoute from './withApiRoute'

const buildRes = () => {
  const res = { headersSent: false }
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn(() => {
    // Mirrors Next.js: the reply goes out here, so `withApiHandler` must not
    // then add a 405 on top of it.
    res.headersSent = true
    return res
  })
  return res
}

describe('[ datasources / withApiRoute ]', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  afterAll(() => {
    process.env = ORIGINAL_ENV
  })

  describe('when the namespace matches the configured data source', () => {
    it('should run the handler', async () => {
      // Arrange
      process.env.NEXT_PUBLIC_API_URL = '/api/local'
      const handler = jest.fn()
      const req = { query: { source: 'local' }, method: 'GET', url: '/x' }

      // Act
      await withApiRoute(handler)(req, buildRes())

      // Assert
      expect(handler).toHaveBeenCalled()
    })

    it('should map the fixtures store to its own namespace', async () => {
      // Arrange
      process.env.NEXT_PUBLIC_API_URL = '/api/test'
      const handler = jest.fn()
      const req = { query: { source: 'test' }, method: 'GET', url: '/x' }

      // Act
      await withApiRoute(handler)(req, buildRes())

      // Assert
      expect(handler).toHaveBeenCalled()
    })
  })

  describe('when the data source is not served by these routes', () => {
    it.each([
      ['local-storage', ''],
      ['api', 'https://api.example.com'],
    ])(
      'should answer 404 for "%s" without running the handler',
      async (source, apiUrl) => {
        // Arrange
        process.env.NEXT_PUBLIC_API_URL = apiUrl
        const handler = jest.fn()
        const req = { query: { source: 'demo' }, method: 'GET', url: '/x' }
        const res = buildRes()

        // Act
        await withApiRoute(handler)(req, res)

        // Assert
        expect(handler).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({
          error: expect.stringContaining(`"${source}"`),
        })
      }
    )
  })

  describe('when the namespace does not match', () => {
    it('should answer 400 without running the handler', async () => {
      // Arrange
      process.env.NEXT_PUBLIC_API_URL = '/api/local'
      const handler = jest.fn()
      const req = { query: { source: 'demo' }, method: 'GET', url: '/x' }
      const res = buildRes()

      // Act
      await withApiRoute(handler)(req, res)

      // Assert
      expect(handler).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: expect.stringContaining('/api/local'),
      })
    })
  })

  describe('when the handler throws', () => {
    it('should still report it through the shared error boundary', async () => {
      // Arrange
      process.env.NEXT_PUBLIC_API_URL = '/api/local'
      const handler = jest.fn().mockRejectedValue(new Error('boom'))
      const req = { query: { source: 'local' }, method: 'GET', url: '/x' }
      const res = buildRes()
      jest.spyOn(console, 'error').mockImplementation(() => {})

      // Act
      await withApiRoute(handler)(req, res)

      // Assert
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'boom' })

      console.error.mockRestore()
    })
  })
})
