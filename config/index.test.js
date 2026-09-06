// `API_URL` is resolved once at module load, so each case needs a fresh import.
const loadApiUrl = () => require('./index').API_URL

// The browser gets a relative path; any other server-side caller needs an
// absolute one. Jest runs jsdom, so the server branch has to be asked for.
const onTheServer = (act) => {
  const { window } = global
  delete global.window

  try {
    return act()
  } finally {
    global.window = window
  }
}

describe('[ config / API_URL ]', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...ORIGINAL_ENV }
    delete process.env.NEXT_PUBLIC_DATA_SOURCE
    delete process.env.NEXT_PUBLIC_API_URL
    delete process.env.VERCEL_URL
  })

  afterAll(() => {
    process.env = ORIGINAL_ENV
  })

  describe('when the data source is self hosted', () => {
    it('should derive the namespace from the source, not from configuration', () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'json-server'

      // Act & Assert
      expect(loadApiUrl()).toBe('/api/local')
    })

    it('should point the demo store at its own namespace', () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'memory'

      // Act & Assert
      expect(loadApiUrl()).toBe('/api/demo')
    })

    it('should point the fixtures store at its own namespace', () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'fixtures'

      // Act & Assert
      expect(loadApiUrl()).toBe('/api/test')
    })

    it('should ignore `NEXT_PUBLIC_API_URL` — it is not a general override', () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'json-server'
      process.env.NEXT_PUBLIC_API_URL = 'https://somewhere.else/api'

      // Act & Assert
      expect(loadApiUrl()).toBe('/api/local')
    })

    describe('server side', () => {
      it('should resolve against the deployment host when there is one', () => {
        // Arrange
        process.env.NEXT_PUBLIC_DATA_SOURCE = 'memory'
        process.env.VERCEL_URL = 'preview-abc.vercel.app'

        // Act
        const result = onTheServer(loadApiUrl)

        // Assert
        expect(result).toBe('https://preview-abc.vercel.app/api/demo')
      })

      it('should fall back to localhost without one', () => {
        // Arrange
        process.env.NEXT_PUBLIC_DATA_SOURCE = 'json-server'

        // Act
        const result = onTheServer(loadApiUrl)

        // Assert
        expect(result).toBe('http://localhost:3000/api/local')
      })
    })
  })

  describe('when the data source is the external backend', () => {
    it('should use the configured URL', () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'api'
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'

      // Act & Assert
      expect(loadApiUrl()).toBe('https://api.example.com')
    })

    it('should throw when no URL was configured for it', () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'api'

      // Act & Assert
      expect(loadApiUrl).toThrow('NEXT_PUBLIC_API_URL')
    })
  })
})
