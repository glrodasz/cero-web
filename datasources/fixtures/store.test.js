import tasks from './tasks'
import { getCollections, saveCollections, resetCollections } from './store'

describe('[ datasources / fixtures / store ]', () => {
  beforeEach(() => {
    resetCollections()
  })

  it('should seed a new session from the committed fixtures', async () => {
    // Act
    const result = await getCollections('a')

    // Assert
    expect(result.tasks).toEqual(tasks)
    expect(result['focus-sessions']).toEqual([])
  })

  it('should hand out a copy, so a mutation cannot edit the fixtures', async () => {
    // Arrange
    const collections = await getCollections('a')

    // Act
    collections.tasks.push({ id: 999, description: 'added' })
    resetCollections()
    const result = await getCollections('a')

    // Assert
    expect(result.tasks).toEqual(tasks)
  })

  it('should read back what was saved for the same session', async () => {
    // Arrange
    await saveCollections('a', { tasks: [{ id: 1 }], 'focus-sessions': [] })

    // Act
    const result = await getCollections('a')

    // Assert
    expect(result.tasks).toEqual([{ id: 1 }])
  })

  it('should keep sessions independent', async () => {
    // Arrange
    await saveCollections('a', { tasks: [], 'focus-sessions': [] })

    // Act
    const result = await getCollections('b')

    // Assert
    expect(result.tasks).toEqual(tasks)
  })

  it('should default to the same session id when reading and writing', async () => {
    // Arrange
    await saveCollections(undefined, {
      tasks: [{ id: 7 }],
      'focus-sessions': [],
    })

    // Act
    const result = await getCollections(undefined)

    // Assert
    expect(result.tasks).toEqual([{ id: 7 }])
  })
})
