jest.mock('@upstash/redis', () => {
  const store = new Map()
  const set = jest.fn((key, value) => {
    store.set(key, value)

    return Promise.resolve('OK')
  })
  const get = jest.fn((key) =>
    Promise.resolve(store.has(key) ? store.get(key) : null)
  )

  return {
    Redis: jest.fn().mockImplementation(() => ({ get, set })),
    __mockStore: store,
    __mockSet: set,
  }
})

process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io'
process.env.UPSTASH_REDIS_REST_TOKEN = 'fake-token'

import { getCollections, saveCollections, SESSION_TTL_SECONDS } from './store'
import { __mockStore, __mockSet } from '@upstash/redis'
import seed from '../../db.seed.json'

const SESSION_ID = 'session-a'

describe('[ datasources / memory / store ]', () => {
  beforeEach(() => {
    __mockStore.clear()
    __mockSet.mockClear()
  })

  describe('getCollections', () => {
    it('should return a fresh clone of the seed for a new session', async () => {
      const collections = await getCollections(SESSION_ID)

      expect(collections).toEqual(seed)
      expect(collections).not.toBe(seed)
    })

    it('should return the value a previous mutation stored', async () => {
      await saveCollections(SESSION_ID, {
        tasks: [{ id: 99 }],
        'focus-sessions': [],
      })

      const collections = await getCollections(SESSION_ID)

      expect(collections.tasks).toEqual([{ id: 99 }])
    })

    it('should discard a stored value that is not a plain object', async () => {
      __mockStore.set(`cero-demo:${SESSION_ID}`, 'not-an-object')

      await expect(getCollections(SESSION_ID)).resolves.toEqual(seed)
    })

    it('should discard a stored array', async () => {
      __mockStore.set(`cero-demo:${SESSION_ID}`, [1, 2, 3])

      await expect(getCollections(SESSION_ID)).resolves.toEqual(seed)
    })
  })

  describe('saveCollections', () => {
    it('should default to the same session id `getCollections` does', async () => {
      // Arrange
      // Without a matching default the read hits `cero-demo:default` and the
      // write lands on `cero-demo:undefined`, which nothing reads back.
      const collections = { tasks: [{ id: 7 }], 'focus-sessions': [] }

      // Act
      await saveCollections(undefined, collections)
      const result = await getCollections(undefined)

      // Assert
      expect(result).toEqual(collections)
    })

    it('should write the session key with a TTL', async () => {
      await saveCollections(SESSION_ID, { tasks: [] })

      expect(__mockSet).toHaveBeenLastCalledWith(
        `cero-demo:${SESSION_ID}`,
        { tasks: [] },
        { ex: SESSION_TTL_SECONDS }
      )
    })
  })
})
