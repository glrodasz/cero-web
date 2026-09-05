import { API_NAMESPACE, DATA_SOURCES, getDataSource } from './dataSource'

describe('[ config / dataSource ]', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    delete process.env.NEXT_PUBLIC_DATA_SOURCE
  })

  afterAll(() => {
    process.env = ORIGINAL_ENV
  })

  describe('when `NEXT_PUBLIC_DATA_SOURCE` is not set', () => {
    it('should fall back to the demo store', () => {
      // Act
      const result = getDataSource()

      // Assert
      expect(result).toBe(DATA_SOURCES.MEMORY)
    })
  })

  describe('when a supported source is configured', () => {
    it.each(Object.values(DATA_SOURCES))('should accept "%s"', (source) => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = source

      // Act & Assert
      expect(getDataSource()).toBe(source)
    })

    it('should tolerate surrounding whitespace from a dashboard field', () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = '  json-server  '

      // Act & Assert
      expect(getDataSource()).toBe(DATA_SOURCES.JSON_SERVER)
    })
  })

  describe('when the configured source is not recognized', () => {
    it('should throw naming the supported values', () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'jsonserver'

      // Act & Assert
      expect(getDataSource).toThrow('Unknown NEXT_PUBLIC_DATA_SOURCE')
      expect(getDataSource).toThrow('json-server')
    })
  })

  describe('the URL namespaces', () => {
    it('should give every self hosted source exactly one namespace', () => {
      // Act
      const result = Object.keys(API_NAMESPACE).sort()

      // Assert
      expect(result).toEqual(
        [
          DATA_SOURCES.JSON_SERVER,
          DATA_SOURCES.MEMORY,
          DATA_SOURCES.FIXTURES,
        ].sort()
      )
      expect(new Set(Object.values(API_NAMESPACE)).size).toBe(3)
    })

    it('should not give the external backend one', () => {
      // Assert
      expect(API_NAMESPACE[DATA_SOURCES.API]).toBeUndefined()
    })
  })
})
