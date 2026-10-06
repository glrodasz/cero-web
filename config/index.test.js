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

  describe("when it names one of this app's own APIs", () => {
    it('should call it on this deployment, relative in the browser', () => {
      // Arrange
      process.env.NEXT_PUBLIC_API_URL = '/api/local'

      // Act & Assert
      expect(loadApiUrl()).toBe('/api/local')
    })

    it('should normalize a trailing slash away', () => {
      // Arrange
      process.env.NEXT_PUBLIC_API_URL = '/api/test/'

      // Act & Assert
      expect(loadApiUrl()).toBe('/api/test')
    })

    describe('server side', () => {
      it('should resolve against the deployment host when there is one', () => {
        // Arrange
        process.env.NEXT_PUBLIC_API_URL = '/api/test'
        process.env.VERCEL_URL = 'preview-abc.vercel.app'

        // Act
        const result = onTheServer(loadApiUrl)

        // Assert
        expect(result).toBe('https://preview-abc.vercel.app/api/test')
      })

      it('should fall back to localhost without one', () => {
        // Arrange
        process.env.NEXT_PUBLIC_API_URL = '/api/local'

        // Act
        const result = onTheServer(loadApiUrl)

        // Assert
        expect(result).toBe('http://localhost:3000/api/local')
      })
    })
  })

  describe('when no API URL is configured', () => {
    it('should have no URL — the browser answers its own requests', () => {
      // Act & Assert
      expect(loadApiUrl()).toBeNull()
    })
  })

  describe('when it points at a backend elsewhere', () => {
    it('should use the configured URL as is', () => {
      // Arrange
      process.env.NEXT_PUBLIC_API_URL = '  https://api.example.com  '

      // Act & Assert
      expect(loadApiUrl()).toBe('https://api.example.com')
    })
  })
})
