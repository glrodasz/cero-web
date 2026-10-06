import {
  API_NAMESPACE,
  DATA_SOURCES,
  getDataSource,
  isBrowserDataSource,
  isServerDataSource,
} from './dataSource'

describe('[ config / dataSource ]', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    delete process.env.NEXT_PUBLIC_API_URL
    delete process.env.NEXT_PUBLIC_DATA_SOURCE
  })

  afterAll(() => {
    process.env = ORIGINAL_ENV
  })

  describe('when `NEXT_PUBLIC_API_URL` is not set', () => {
    it.each([[undefined], [''], ['   ']])(
      'should fall back to the browser store for %p',
      (apiUrl) => {
        // Arrange
        if (apiUrl !== undefined) process.env.NEXT_PUBLIC_API_URL = apiUrl

        // Act
        const result = getDataSource()

        // Assert
        expect(result).toBe(DATA_SOURCES.LOCAL_STORAGE)
      }
    )
  })

  describe("when it names one of this app's own APIs", () => {
    it.each([
      ['/api/local', DATA_SOURCES.JSON_SERVER],
      ['/api/local/', DATA_SOURCES.JSON_SERVER],
      ['  /api/local  ', DATA_SOURCES.JSON_SERVER],
      ['/api/test', DATA_SOURCES.FIXTURES],
    ])('should read "%s" as %s', (apiUrl, expected) => {
      // Arrange
      process.env.NEXT_PUBLIC_API_URL = apiUrl

      // Act
      const result = getDataSource()

      // Assert
      expect(result).toBe(expected)
    })

    it('should throw for a namespace it does not serve, naming the ones it does', () => {
      // Arrange
      process.env.NEXT_PUBLIC_API_URL = '/api/demo'

      // Act & Assert
      expect(getDataSource).toThrow('names no API this app serves')
      expect(getDataSource).toThrow('/api/local, /api/test')
    })
  })

  describe('when it points anywhere else', () => {
    it.each(['https://api.example.com', 'http://localhost:4000', '/backend'])(
      'should read "%s" as an external backend',
      (apiUrl) => {
        // Arrange
        process.env.NEXT_PUBLIC_API_URL = apiUrl

        // Act
        const result = getDataSource()

        // Assert
        expect(result).toBe(DATA_SOURCES.API)
      }
    )
  })

  // Left in place, a `json-server` here would quietly turn into the browser
  // store. Failing the build is what tells a deployment to move to the URL.
  describe('when the retired `NEXT_PUBLIC_DATA_SOURCE` is still set', () => {
    it('should throw pointing at `NEXT_PUBLIC_API_URL`', () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'json-server'

      // Act & Assert
      expect(getDataSource).toThrow('NEXT_PUBLIC_API_URL')
    })
  })

  describe('the URL namespaces', () => {
    it("should give each of this app's stores exactly one namespace", () => {
      // Act
      const result = Object.keys(API_NAMESPACE).sort()

      // Assert
      expect(result).toEqual(
        [DATA_SOURCES.JSON_SERVER, DATA_SOURCES.FIXTURES].sort()
      )
      expect(new Set(Object.values(API_NAMESPACE)).size).toBe(2)
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
      process.env.NEXT_PUBLIC_API_URL = '/api/local'

      // Act & Assert
      expect(isBrowserDataSource()).toBe(false)
    })
  })

  describe('isServerDataSource', () => {
    it("should be true only for the stores behind this app's own routes", () => {
      // Act
      const result = Object.values(DATA_SOURCES).filter((source) =>
        isServerDataSource(source)
      )

      // Assert
      expect(result.sort()).toEqual(
        [DATA_SOURCES.JSON_SERVER, DATA_SOURCES.FIXTURES].sort()
      )
    })

    it('should read the configured source when given none', () => {
      // Arrange
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'

      // Act & Assert
      expect(isServerDataSource()).toBe(false)
    })
  })
})
