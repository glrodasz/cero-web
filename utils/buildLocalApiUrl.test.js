import buildLocalApiUrl from './buildLocalApiUrl'

describe('[ utils / buildLocalApiUrl ]', () => {
  describe("when `req.method` is `'get'`", () => {
    it('should return `{ url, options } with an `undefined` `body``', () => {
      // Arrange
      const req = {
        url: '/api/local/myurl',
        method: 'get',
        body: 'body',
      }
      const fetchOptions = {}

      // Act
      const result = buildLocalApiUrl(req, fetchOptions)
      const expected = {
        url: 'myurl',
        options: {
          method: 'GET',
          body: undefined,
        },
      }

      // Assert
      expect(result).toEqual(expected)
    })
  })

  describe("when `req.method` is `'patch'`", () => {
    it('should return `{ url, options }` with an valid `body`', () => {
      // Arrange
      const req = {
        url: '/api/local/myurl',
        method: 'patch',
        body: 'body',
      }
      const fetchOptions = {}

      // Act
      const result = buildLocalApiUrl(req, fetchOptions)
      const expected = {
        url: 'myurl',
        options: {
          method: 'PATCH',
          body: 'body',
        },
      }

      // Assert
      expect(result).toEqual(expected)
    })
  })
})
