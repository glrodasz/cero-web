import seed from '../../db.seed.json'
import {
  STORAGE_KEY,
  getCollections,
  resetCollections,
  saveCollections,
} from './store'

// The browser has no server-side counterpart, so this is asked for explicitly.
const onTheServer = async (act) => {
  const { window } = global
  delete global.window

  try {
    return await act()
  } finally {
    global.window = window
  }
}

describe('[ datasources / localStorage / store ]', () => {
  beforeEach(() => {
    window.localStorage.clear()
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    console.warn.mockRestore()
  })

  it('should seed an empty browser from `db.seed.json`', async () => {
    // Act
    const result = await getCollections()

    // Assert
    expect(result).toEqual(seed)
  })

  it('should hand out a copy, so a mutation cannot edit the seed', async () => {
    // Arrange
    const collections = await getCollections()

    // Act
    collections.tasks.push({ id: 999 })
    const result = await getCollections()

    // Assert
    expect(result).toEqual(seed)
  })

  it('should read back what was saved', async () => {
    // Arrange
    const collections = { tasks: [{ id: 1 }], 'focus-sessions': [] }

    // Act
    await saveCollections('ignored-session', collections)
    const result = await getCollections()

    // Assert
    expect(result).toEqual(collections)
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY))).toEqual(
      collections
    )
  })

  it.each([
    ['is not JSON', '{"tasks": ['],
    ['is not an object', '[1, 2]'],
    ['is null', 'null'],
  ])('should reseed when the stored value %s', async (_, stored) => {
    // Arrange
    window.localStorage.setItem(STORAGE_KEY, stored)

    // Act
    const result = await getCollections()

    // Assert
    expect(result).toEqual(seed)
    expect(console.warn).toHaveBeenCalled()
  })

  it('should go back to the seed after a reset', async () => {
    // Arrange
    await saveCollections(undefined, { tasks: [], 'focus-sessions': [] })

    // Act
    resetCollections()
    const result = await getCollections()

    // Assert
    expect(result).toEqual(seed)
  })

  it('should refuse to run on the server, where there is no browser', async () => {
    // Act & Assert
    await expect(onTheServer(() => getCollections())).rejects.toThrow(
      'only exists in the browser'
    )
  })
})
