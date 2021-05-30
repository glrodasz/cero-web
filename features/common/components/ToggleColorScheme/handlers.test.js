import { handleClick } from './handlers'

import { persistColorScheme } from './helpers'
jest.mock('./helpers', () => ({
  persistColorScheme: jest.fn(),
}))

describe('[ features / common / ToggleColorSheme / handlers ]', () => {
  describe('#handleClick', () => {
    describe('when `handleClick` is called', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof handleClick(params)
        const expected = 'function'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `handleClick` returned function is called', () => {
      it('should called `persistColorScheme` with parameters', () => {
        // Arrange
        const setIsDarkModeMock = () => {}
        const params = {
          isDarkMode: true,
          setIsDarkMode: setIsDarkModeMock,
        }

        // Act
        handleClick(params)()

        // Assert
        expect(persistColorScheme).toHaveBeenCalledWith({
          isDarkMode: false,
          setIsDarkMode: setIsDarkModeMock,
        })
      })
    })
  })
})
