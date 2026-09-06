import createCollectionsHandler, { clone } from './index'

const buildStore = () => {
  const sessions = new Map()

  return {
    sessions,
    getCollections: jest.fn(async (sessionId) => {
      if (!sessions.has(sessionId)) sessions.set(sessionId, { tasks: [] })

      return sessions.get(sessionId)
    }),
    saveCollections: jest.fn(async (sessionId, collections) => {
      sessions.set(sessionId, collections)
    }),
  }
}

describe('[ datasources / collections ]', () => {
  describe('clone', () => {
    it('should return a deep copy, not a reference', () => {
      // Arrange
      const source = { tasks: [{ id: 1, nested: { done: false } }] }

      // Act
      const result = clone(source)
      result.tasks[0].nested.done = true

      // Assert
      expect(source.tasks[0].nested.done).toBe(false)
    })
  })

  describe('the handler it builds', () => {
    it('should create, read back, update and delete through the given store', async () => {
      // Arrange
      const store = buildStore()
      const handleRequest = createCollectionsHandler(store)
      const options = (method, body) => ({ method, body })

      // Act
      const created = await handleRequest({
        sessionId: 's',
        url: 'tasks',
        options: options('post', { description: 'one' }),
      })
      const patched = await handleRequest({
        sessionId: 's',
        url: `tasks/${created.id}`,
        options: options('patch', { status: 'completed' }),
      })
      const listed = await handleRequest({ sessionId: 's', url: 'tasks' })
      await handleRequest({
        sessionId: 's',
        url: `tasks/${created.id}`,
        options: options('delete'),
      })
      const afterDelete = await handleRequest({ sessionId: 's', url: 'tasks' })

      // Assert
      expect(created).toEqual({ description: 'one', id: 1 })
      expect(patched.status).toBe('completed')
      expect(listed).toHaveLength(1)
      expect(afterDelete).toHaveLength(0)
    })

    it('should keep sessions independent', async () => {
      // Arrange
      const handleRequest = createCollectionsHandler(buildStore())

      // Act
      await handleRequest({
        sessionId: 'a',
        url: 'tasks',
        options: { method: 'post', body: { description: 'only in a' } },
      })
      const result = await handleRequest({ sessionId: 'b', url: 'tasks' })

      // Assert
      expect(result).toEqual([])
    })

    it('should reject a method it cannot serve', async () => {
      // Arrange
      const handleRequest = createCollectionsHandler(buildStore())

      // Act & Assert
      await expect(
        handleRequest({
          sessionId: 's',
          url: 'tasks',
          options: { method: 'head' },
        })
      ).rejects.toThrow('Unsupported method')
    })

    it('should reject a url with no resource in it', async () => {
      // Arrange
      const handleRequest = createCollectionsHandler(buildStore())

      // Act & Assert
      await expect(handleRequest({ sessionId: 's', url: '' })).rejects.toThrow(
        'Unable to resolve a resource'
      )
    })
  })
})
