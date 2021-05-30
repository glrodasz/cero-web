import { persistColorScheme } from './helpers'

describe('[ features / common / ToggleColorS≈heme / helpers ]', () => {
  describe('#persistColorScheme', () => {
    describe('when `persistColorScheme` is called with `isDarkMode` as `true`', () => {
      it('should set `body.dataset.colorScheme` with `dark` value', () => {
        // Arrange
        const params = {
          isDarkMode: true,
          setIsDarkMode: () => {},
        }

        // Act
        persistColorScheme(params)
        const result = document.querySelector('body').dataset.colorScheme
        const expected = 'dark'

        // Assert
        expect(result).toBe(expected)
      })

      it('should call `localStorage.setItem` with `dark` value', () => {
        // Arrange
        const params = {
          isDarkMode: true,
          setIsDarkMode: () => {},
        }

        // Act
        persistColorScheme(params)
        const result = localStorage.getItem('prefers-color-scheme')
        const expected = 'dark'

        // Assert
        expect(result).toBe(expected)
      })

      it('should call `setIsDarkMode` with `isDarkMode` as `true`', () => {
        // Arrange
        const setIsDarkModeMock = jest.fn()
        const params = {
          isDarkMode: true,
          setIsDarkMode: setIsDarkModeMock,
        }

        // Act
        persistColorScheme(params)

        // Assert
        expect(setIsDarkModeMock).toHaveBeenCalledWith(true)
      })
    })

    describe('when `persistColorScheme` is called with `isDarkMode` as `false`', () => {
      it('should set `body.dataset.colorScheme` with `light` value', () => {
        // Arrange
        const params = {
          isDarkMode: false,
          setIsDarkMode: () => {},
        }

        // Act
        persistColorScheme(params)
        const result = document.querySelector('body').dataset.colorScheme
        const expected = 'light'

        // Assert
        expect(result).toBe(expected)
      })

      it('should call `localStorage.setItem` with `light` value', () => {
        // Arrange
        const params = {
          isDarkMode: false,
          setIsDarkMode: () => {},
        }

        // Act
        persistColorScheme(params)
        const result = localStorage.getItem('prefers-color-scheme')
        const expected = 'light'

        // Assert
        expect(result).toBe(expected)
      })

      it('should call `setIsDarkMode` with `isDarkMode` as `false`', () => {
        // Arrange
        const setIsDarkModeMock = jest.fn()
        const params = {
          isDarkMode: false,
          setIsDarkMode: setIsDarkModeMock,
        }

        // Act
        persistColorScheme(params)

        // Assert
        expect(setIsDarkModeMock).toHaveBeenCalledWith(false)
      })
    })
  })
})
