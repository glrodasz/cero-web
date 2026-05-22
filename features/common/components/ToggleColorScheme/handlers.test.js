import { createClickHandler } from './handlers'

import { persistColorScheme } from './helpers'
jest.mock('./helpers', () => ({
  persistColorScheme: jest.fn(),
}))

describe('[ features / common / ToggleColorSheme / handlers ]', () => {
  describe('#createClickHandler', () => {
    describe('when `createClickHandler` is called', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof createClickHandler(params)
        const expected = 'function'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `createClickHandler` returned function is called', () => {
      it('should called `persistColorScheme` with parameters', () => {
        // Arrange
        const setIsDarkModeMock = () => {}
        const params = {
          isDarkMode: true,
          setIsDarkMode: setIsDarkModeMock,
        }

        // Act
        createClickHandler(params)()

        // Assert
        expect(persistColorScheme).toHaveBeenCalledWith({
          isDarkMode: false,
          setIsDarkMode: setIsDarkModeMock,
        })
      })
    })
  })
})
