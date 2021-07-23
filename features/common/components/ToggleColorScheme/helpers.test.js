import { persistColorScheme, loadAndListenColorScheme } from './helpers'

describe('[ features / common / ToggleColorS≈heme / helpers ]', () => {
  describe('#persistColorScheme', () => {
    describe('when `persistColorScheme` is called with `isDarkMode` as `true`', () => {
      it('should set `html.dataset.colorScheme` with `dark` value', () => {
        // Arrange
        const params = {
          isDarkMode: true,
          setIsDarkMode: () => {},
        }

        // Act
        persistColorScheme(params)
        const result = document.querySelector('html').dataset.colorScheme
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
      it('should set `html.dataset.colorScheme` with `light` value', () => {
        // Arrange
        const params = {
          isDarkMode: false,
          setIsDarkMode: () => {},
        }

        // Act
        persistColorScheme(params)
        const result = document.querySelector('html').dataset.colorScheme
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

  describe('#loadAndListenColorScheme', () => {
    describe('when `loadAndListenColorScheme` is called', () => {
      it('should call `darkModeMediaQuery.addListener`', () => {
        // Arrange
        const darkModeMediaQuery = { addListener: jest.fn() }
        global.matchMedia = () => darkModeMediaQuery
        const params = { setIsDarkMode: () => {} }

        // Act
        loadAndListenColorScheme(params)

        // Assert
        expect(darkModeMediaQuery.addListener).toHaveBeenCalled()
      })

      describe('and `localStorageColorScheme` is `dark`', () => {
        it('should call `persistColorScheme` with `isDarkMode` as `true`', () => {
          // Arrange
          const persistColorSchemeMock = jest.fn()
          const params = {
            setIsDarkMode: 'setIsDarkMode',
            __persistColorScheme: persistColorSchemeMock,
          }
          localStorage.setItem('prefers-color-scheme', 'dark')

          // Act
          loadAndListenColorScheme(params)

          // Assert
          expect(persistColorSchemeMock).toHaveBeenCalledWith({
            isDarkMode: true,
            setIsDarkMode: 'setIsDarkMode',
          })
        })
      })
    })

    describe('and `localStorageColorScheme` is empty', () => {
      it('should call `persistColorScheme` with `isDarkMode` as `darkModeMediaQuery.events`', () => {
        // Arrange
        const darkModeMediaQuery = {
          addListener: () => {},
          matches: 'isDarkMode',
        }
        global.matchMedia = () => darkModeMediaQuery
        const persistColorSchemeMock = jest.fn()
        const params = {
          setIsDarkMode: 'setIsDarkMode',
          __persistColorScheme: persistColorSchemeMock,
        }
        localStorage.setItem('prefers-color-scheme', '')

        // Act
        loadAndListenColorScheme(params)

        // Assert
        expect(persistColorSchemeMock).toHaveBeenCalledWith({
          isDarkMode: 'isDarkMode',
          setIsDarkMode: 'setIsDarkMode',
        })
      })
    })
  })
})
