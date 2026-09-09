import {
  createCloseDevToolsHandler,
  createToggleDevToolsHandler,
} from './handlers'

describe('[ features / common / components / DevTools / handlers ]', () => {
  describe('#createToggleDevToolsHandler', () => {
    describe('when `createToggleDevToolsHandler` is called', () => {
      it('should return a function', () => {
        // Arrange
        const params = { showDialog: false, setShowDialog: jest.fn() }

        // Act
        const result = typeof createToggleDevToolsHandler(params)
        const expected = 'function'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when the returned function is called and the dialog is closed', () => {
      it('should open the dialog', () => {
        // Arrange
        const setShowDialog = jest.fn()

        // Act
        createToggleDevToolsHandler({ showDialog: false, setShowDialog })()
        const expected = true

        // Assert
        expect(setShowDialog).toHaveBeenCalledWith(expected)
      })
    })

    describe('when the returned function is called and the dialog is open', () => {
      it('should close the dialog', () => {
        // Arrange
        const setShowDialog = jest.fn()

        // Act
        createToggleDevToolsHandler({ showDialog: true, setShowDialog })()
        const expected = false

        // Assert
        expect(setShowDialog).toHaveBeenCalledWith(expected)
      })
    })
  })

  describe('#createCloseDevToolsHandler', () => {
    describe('when the returned function is called', () => {
      it('should close the dialog', () => {
        // Arrange
        const setShowDialog = jest.fn()

        // Act
        createCloseDevToolsHandler({ setShowDialog })()
        const expected = false

        // Assert
        expect(setShowDialog).toHaveBeenCalledWith(expected)
      })
    })
  })
})
