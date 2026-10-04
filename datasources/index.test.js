jest.mock('./jsonServer', () => jest.fn())
jest.mock('./localStorage', () => jest.fn())
jest.mock('./fixtures', () => jest.fn())

import fetchFromJsonServer from './jsonServer'
import handleLocalStorageRequest from './localStorage'
import handleFixturesRequest from './fixtures'
import fetchResource from './index'

describe('[ datasources ]', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    fetchFromJsonServer.mockReset()
    handleLocalStorageRequest.mockReset()
    handleFixturesRequest.mockReset()
  })

  afterAll(() => {
    process.env = ORIGINAL_ENV
  })

  describe('when the data source is `json-server`', () => {
    it('should read through json-server', async () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'json-server'
      fetchFromJsonServer.mockResolvedValue([{ id: 1 }])

      // Act
      const result = await fetchResource({ resource: 'task', url: 'tasks' })

      // Assert
      expect(result).toEqual([{ id: 1 }])
      expect(handleLocalStorageRequest).not.toHaveBeenCalled()
    })
  })

  describe('when the data source is `local-storage`', () => {
    it('should read through the browser store', async () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'local-storage'
      handleLocalStorageRequest.mockResolvedValue([{ id: 1 }])

      // Act
      const result = await fetchResource({
        resource: 'task',
        url: 'tasks',
        options: { sessionId: 'session-a' },
      })

      // Assert
      expect(result).toEqual([{ id: 1 }])
      expect(fetchFromJsonServer).not.toHaveBeenCalled()
      expect(handleLocalStorageRequest).toHaveBeenCalledWith(
        expect.objectContaining({ sessionId: 'session-a' })
      )
    })
  })

  describe('when the data source is `fixtures`', () => {
    it('should read through the fixtures data source', async () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'fixtures'
      handleFixturesRequest.mockResolvedValue([{ id: 1 }])

      // Act
      const result = await fetchResource({ resource: 'task', url: 'tasks' })

      // Assert
      expect(result).toEqual([{ id: 1 }])
      expect(handleLocalStorageRequest).not.toHaveBeenCalled()
      expect(fetchFromJsonServer).not.toHaveBeenCalled()
    })
  })

  describe('when the data source is `api`', () => {
    it('should refuse rather than quietly reading a local store', async () => {
      // Arrange
      // The external backend is not wired through this app. Falling through to
      // the demo store here would render seed data as if it were production.
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'api'
      jest.spyOn(console, 'error').mockImplementation(() => {})

      // Act & Assert
      await expect(
        fetchResource({ resource: 'task', url: 'tasks' })
      ).rejects.toThrow('not wired through this app')
      expect(handleLocalStorageRequest).not.toHaveBeenCalled()
      expect(handleFixturesRequest).not.toHaveBeenCalled()
      expect(fetchFromJsonServer).not.toHaveBeenCalled()

      console.error.mockRestore()
    })
  })

  describe('when `singular` is set and the result is an array', () => {
    it('should unwrap the first item', async () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'local-storage'
      handleLocalStorageRequest.mockResolvedValue([{ id: 1 }, { id: 2 }])

      // Act
      const result = await fetchResource({
        resource: 'focus-sessions',
        url: 'focus-sessions',
        singular: true,
      })

      // Assert
      expect(result).toEqual({ id: 1 })
    })

    it('should fall back to an empty object when the array is empty', async () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'local-storage'
      handleLocalStorageRequest.mockResolvedValue([])

      // Act
      const result = await fetchResource({
        resource: 'focus-sessions',
        url: 'focus-sessions',
        singular: true,
      })

      // Assert
      expect(result).toEqual({})
    })
  })

  describe('when a `res` object is provided', () => {
    const buildRes = () => {
      const res = {}
      res.status = jest.fn().mockReturnValue(res)
      res.json = jest.fn().mockReturnValue(res)
      return res
    }

    it('should send a 200 with the result on success', async () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'local-storage'
      handleLocalStorageRequest.mockResolvedValue({ id: 1 })
      const res = buildRes()

      // Act
      await fetchResource({ resource: 'task', url: 'tasks/1', res })

      // Assert
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ id: 1 })
    })

    it('should send a 500 with the error message on failure', async () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'local-storage'
      handleLocalStorageRequest.mockRejectedValue(new Error('boom'))
      const res = buildRes()

      // Act
      await fetchResource({ resource: 'task', url: 'tasks/1', res })

      // Assert
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'boom' })
    })
  })

  describe('when no `res` object is provided and the source rejects', () => {
    it('should reject instead of throwing synchronously', async () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'local-storage'
      handleLocalStorageRequest.mockRejectedValue(new Error('boom'))

      // Act & Assert
      await expect(
        fetchResource({ resource: 'task', url: 'tasks/1' })
      ).rejects.toThrow('boom')
    })
  })
})
