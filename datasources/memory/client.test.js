jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation((config) => ({ config })),
}))

describe('[ datasources / memory / client ]', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...ORIGINAL_ENV }
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
    delete process.env.KV_REST_API_URL
    delete process.env.KV_REST_API_TOKEN
  })

  afterAll(() => {
    process.env = ORIGINAL_ENV
  })

  describe('when no credentials are configured', () => {
    it('should throw a clear, actionable error', () => {
      const getRedisClient = require('./client').default

      expect(getRedisClient).toThrow('Missing Upstash Redis credentials')
    })
  })

  describe('when only the Vercel KV naming is present', () => {
    it('should still construct a client', () => {
      process.env.KV_REST_API_URL = 'https://example.upstash.io'
      process.env.KV_REST_API_TOKEN = 'fake-token'

      const getRedisClient = require('./client').default

      expect(() => getRedisClient()).not.toThrow()
    })
  })

  describe('when credentials are present', () => {
    it('should reuse the same client on subsequent calls', () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io'
      process.env.UPSTASH_REDIS_REST_TOKEN = 'fake-token'

      const getRedisClient = require('./client').default

      expect(getRedisClient()).toBe(getRedisClient())
    })
  })
})
