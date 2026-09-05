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
  }
})

process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io'
process.env.UPSTASH_REDIS_REST_TOKEN = 'fake-token'

import handleMemoryRequest from './index'
import { __mockStore } from '@upstash/redis'
import seed from '../../db.seed.json'

const SESSION_ID = 'session-a'

const request = ({ url, options, sessionId = SESSION_ID }) =>
  handleMemoryRequest({ sessionId, url, options })

const get = (url, sessionId) =>
  request({ url, options: { method: 'get' }, sessionId })

describe('[ datasources / memory ]', () => {
  beforeEach(() => {
    __mockStore.clear()
  })

  describe('GET', () => {
    it('should list a collection', async () => {
      await expect(get('tasks')).resolves.toHaveLength(seed.tasks.length)
    })

    it('should find a single item by id', async () => {
      await expect(get('tasks/3')).resolves.toMatchObject({ id: 3 })
    })

    it('should return an empty object for a missing id', async () => {
      await expect(get('tasks/9999')).resolves.toEqual({})
    })
  })

  describe('POST', () => {
    it('should assign an auto incremented id and persist it', async () => {
      const created = await request({
        url: 'tasks',
        options: { method: 'post', body: { description: 'New task' } },
      })

      expect(created).toMatchObject({ id: 6, description: 'New task' })
      await expect(get('tasks')).resolves.toHaveLength(seed.tasks.length + 1)
    })

    it('should start at 1 on an unknown collection', async () => {
      const created = await request({
        url: 'notes',
        options: { method: 'post', body: { text: 'hello' } },
      })

      expect(created).toEqual({ text: 'hello', id: 1 })
    })
  })

  describe('PATCH / PUT', () => {
    it('should shallow merge on PATCH', async () => {
      const updated = await request({
        url: 'tasks/1',
        options: { method: 'patch', body: { status: 'completed' } },
      })

      expect(updated).toMatchObject({ id: 1, status: 'completed' })
    })

    it('should throw when the item does not exist', async () => {
      await expect(
        request({
          url: 'tasks/9999',
          options: { method: 'patch', body: { status: 'completed' } },
        })
      ).rejects.toThrow('No "tasks" found with the id "9999"')
    })
  })

  describe('DELETE', () => {
    it('should remove the item from the collection', async () => {
      const result = await request({
        url: 'tasks/1',
        options: { method: 'delete' },
      })

      expect(result).toEqual({})
      await expect(get('tasks')).resolves.toHaveLength(seed.tasks.length - 1)
    })
  })

  describe('when the method is not supported', () => {
    it('should throw', async () => {
      await expect(
        request({ url: 'tasks', options: { method: 'options' } })
      ).rejects.toThrow('Unsupported method "OPTIONS"')
    })
  })

  describe('when several sessions are used', () => {
    it('should keep their data isolated', async () => {
      await request({
        url: 'tasks',
        options: { method: 'post', body: { description: 'Only for a' } },
        sessionId: 'session-a',
      })

      await expect(get('tasks', 'session-a')).resolves.toHaveLength(
        seed.tasks.length + 1
      )
      await expect(get('tasks', 'session-b')).resolves.toHaveLength(
        seed.tasks.length
      )
    })
  })

  describe('when mutations for the same session run concurrently', () => {
    it('should not lose an update to a race', async () => {
      // Each is a read-modify-write of the whole session document; without
      // `withSessionLock` serializing them, whichever write lands last wins
      // and the other task's status change is silently dropped.
      await Promise.all([
        request({
          url: 'tasks/1',
          options: { method: 'patch', body: { status: 'completed' } },
        }),
        request({
          url: 'tasks/2',
          options: { method: 'patch', body: { status: 'completed' } },
        }),
      ])

      const tasks = await get('tasks')
      const statusById = Object.fromEntries(
        tasks.map((task) => [task.id, task.status])
      )

      expect(statusById[1]).toBe('completed')
      expect(statusById[2]).toBe('completed')
    })
  })
})
