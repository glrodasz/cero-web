import {
  handleCheckCompleteTask,
  handleClickCloseBreaktimeConfirmation,
  handleClickCloseBreaktimeTimer,
  handleClickEndSession,
} from './handlers'

import Router from 'next/router'
jest.mock('next/router', () => ({
  push: jest.fn(),
}))

describe('[ features / focusSession / handlers ]', () => {
  describe('#handleCheckCompleteTask', () => {
    describe('when `handleCheckCompleteTask` is called', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof handleCheckCompleteTask(params)
        const expected = 'function'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `handleCheckCompleteTask` returned function is called', () => {
      it('should call `setShowDialog` with `true`', () => {
        // Arrange
        const setShowDialogMock = jest.fn()
        const params = {
          breaktimeConfirmation: {
            setShowDialog: setShowDialogMock,
          },
        }

        // Act
        handleCheckCompleteTask(params)()

        // Assert
        expect(setShowDialogMock).toHaveBeenCalledWith(true)
      })
    })
  })

  describe('#handleClickCloseBreaktimeTimer', () => {
    // Given, when, then
    describe('when `handleClickCloseBreaktimeTimer` is called', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof handleClickCloseBreaktimeTimer(params)
        const expected = 'function'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `handleClickCloseBreaktimeTimer` returned is called', () => {
      it('should call `setShowDialog` with `false`', () => {
        // Arrange
        const setShowDialogMock = jest.fn()
        const params = {
          breaktimeTimer: {
            setShowDialog: setShowDialogMock,
          },
        }

        // Act
        handleClickCloseBreaktimeTimer(params)()

        // Assert
        expect(setShowDialogMock).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('#handleClickCloseBreaktimeConfirmation', () => {
    describe('when `handleClickCloseBreaktimeConfirmation` is called', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof handleClickCloseBreaktimeConfirmation(params)
        const expected = 'function'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `handleClickCloseBreaktimeConfirmation` returned function is called', () => {
      it('should call `setShowDialog` with `true`', () => {
        // Arrange
        const setShowDialogMock = jest.fn()
        const params = {
          breaktimeConfirmation: {
            setShowDialog: setShowDialogMock,
          },
        }

        // Act
        handleClickCloseBreaktimeConfirmation(params)()

        // Assert
        expect(setShowDialogMock).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('#handleClickEndSession', () => {
    describe('when `handleClickEndSession` is called', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof handleClickEndSession(params)
        const expected = 'function'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `handleClickEndSession` returned function is called', () => {
      it('should call `focusSessions.api.finish` with an `id`', () => {
        // Arrange
        const finishMock = jest.fn()
        const params = {
          focusSessions: {
            api: {
              finish: finishMock,
            },
          },
          initialData: {
            activeFocusSession: {
              id: 'foo',
            },
          },
        }

        // Act
        handleClickEndSession(params)()

        // Assert
        expect(finishMock).toHaveBeenCalledWith({ id: 'foo' })
      })

      it('should call `Router.push` with an `/planning`', () => {
        // Arrange
        const params = {
          focusSessions: {
            api: {
              finish: () => {},
            },
          },
          initialData: {
            activeFocusSession: {
              id: 'foo',
            },
          },
        }

        // Act
        handleClickEndSession(params)()

        // Assert
        expect(Router.push).toHaveBeenCalledWith('/planning')
      })
    })
  })
})
