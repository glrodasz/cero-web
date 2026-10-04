import {
  API_NAMESPACE,
  DATA_SOURCES,
  getDataSource,
  isBrowserDataSource,
} from './dataSource'

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
    it('should fall back to the browser store the demo uses', () => {
      // Act
      const result = getDataSource()

      // Assert
      expect(result).toBe(DATA_SOURCES.LOCAL_STORAGE)
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
    // The Redis-backed demo store this replaced. Failing the build is what
    // tells a deployment still configured for it to switch.
    it('should no longer accept "memory"', () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'memory'

      // Act & Assert
      expect(getDataSource).toThrow('Unknown NEXT_PUBLIC_DATA_SOURCE')
    })

    it('should throw naming the supported values', () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'jsonserver'

      // Act & Assert
      expect(getDataSource).toThrow('Unknown NEXT_PUBLIC_DATA_SOURCE')
      expect(getDataSource).toThrow('json-server')
    })
  })

  describe('the URL namespaces', () => {
    it('should give every source served by the API routes exactly one namespace', () => {
      // Act
      const result = Object.keys(API_NAMESPACE).sort()

      // Assert
      expect(result).toEqual(
        [DATA_SOURCES.JSON_SERVER, DATA_SOURCES.FIXTURES].sort()
      )
      expect(new Set(Object.values(API_NAMESPACE)).size).toBe(2)
    })

    it('should not give the external backend one', () => {
      // Assert
      expect(API_NAMESPACE[DATA_SOURCES.API]).toBeUndefined()
    })

    it('should not give the browser store one', () => {
      // Assert
      expect(API_NAMESPACE[DATA_SOURCES.LOCAL_STORAGE]).toBeUndefined()
    })
  })

  describe('isBrowserDataSource', () => {
    it('should be true only for `local-storage`', () => {
      // Act
      const result = Object.values(DATA_SOURCES).filter((source) =>
        isBrowserDataSource(source)
      )

      // Assert
      expect(result).toEqual([DATA_SOURCES.LOCAL_STORAGE])
    })

    it('should read the configured source when given none', () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'json-server'

      // Act & Assert
      expect(isBrowserDataSource()).toBe(false)
    })
  })
})
