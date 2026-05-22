import {
  createCheckCompleteTaskHandler,
  createCloseBreaktimeConfirmationHandler,
  createCloseBreaktimeTimerHandler,
  createEndSessionHandler,
} from './handlers'

import Router from 'next/router'
jest.mock('next/router', () => ({
  push: jest.fn(),
}))

describe('[ features / focusSession / handlers ]', () => {
  describe('#createCheckCompleteTaskHandler', () => {
    describe('when `createCheckCompleteTaskHandler` is called', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof createCheckCompleteTaskHandler(params)
        const expected = 'function'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `createCheckCompleteTaskHandler` returned function is called', () => {
      describe('and `isChecked` is `true`', () => {
        it('should call `setShowDialog` with `true`', () => {
          // Arrange
          const setShowDialogMock = jest.fn()
          const params = {
            breaktimeConfirmation: {
              setShowDialog: setShowDialogMock,
            },
            tasks: {
              api: {
                updateStatus: () => {},
              },
            },
          }

          // Act
          createCheckCompleteTaskHandler(params)({ id: 'id', isChecked: true })

          // Assert
          expect(setShowDialogMock).toHaveBeenCalledWith(true)
        })
      })

      describe('and `isChecked` is `false`', () => {
        it('should call `setShowDialog` with `true`', () => {
          // Arrange
          const setShowDialogMock = jest.fn()
          const params = {
            breaktimeConfirmation: {
              setShowDialog: setShowDialogMock,
            },
            tasks: {
              api: {
                updateStatus: () => {},
              },
            },
          }

          // Act
          createCheckCompleteTaskHandler(params)({ id: 'id', isChecked: false })

          // Assert
          expect(setShowDialogMock).not.toHaveBeenCalled()
        })
      })

      it('should call `tasks.api.updateStatus` with the params', () => {
        // Arrange
        const updateStatusMock = jest.fn()
        const params = {
          breaktimeConfirmation: {
            setShowDialog: () => {},
          },
          tasks: {
            api: {
              updateStatus: updateStatusMock,
            },
          },
        }

        // Act
        createCheckCompleteTaskHandler(params)({ id: 'id', isChecked: false })

        // Assert
        expect(updateStatusMock).toHaveBeenCalledWith({
          id: 'id',
          isChecked: false,
        })
      })
    })
  })

  describe('#createCloseBreaktimeTimerHandler', () => {
    // Given, when, then
    describe('when `createCloseBreaktimeTimerHandler` is called', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof createCloseBreaktimeTimerHandler(params)
        const expected = 'function'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `createCloseBreaktimeTimerHandler` returned is called', () => {
      it('should call `setShowDialog` with `false`', () => {
        // Arrange
        const setShowDialogMock = jest.fn()
        const params = {
          breaktimeTimer: {
            setShowDialog: setShowDialogMock,
          },
          focusSession: {
            api: {
              resume: () => {},
            },
          },
        }

        // Act
        createCloseBreaktimeTimerHandler(params)()

        // Assert
        expect(setShowDialogMock).toHaveBeenCalledWith(false)
      })

      it('should call `focusSession.api.resume`', () => {
        // Arrange
        const focusSessionApiResumeMock = jest.fn()
        const params = {
          breaktimeTimer: {
            setShowDialog: () => {},
          },
          focusSession: {
            api: {
              resume: focusSessionApiResumeMock,
            },
          },
        }

        // Act
        createCloseBreaktimeTimerHandler(params)()

        // Assert
        expect(focusSessionApiResumeMock).toHaveBeenCalled()
      })
    })
  })

  describe('#createCloseBreaktimeConfirmationHandler', () => {
    describe('when `createCloseBreaktimeConfirmationHandler` is called', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof createCloseBreaktimeConfirmationHandler(params)
        const expected = 'function'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `createCloseBreaktimeConfirmationHandler` returned function is called', () => {
      it('should call `setShowDialog` with `true`', () => {
        // Arrange
        const setShowDialogMock = jest.fn()
        const params = {
          breaktimeConfirmation: {
            setShowDialog: setShowDialogMock,
          },
        }

        // Act
        createCloseBreaktimeConfirmationHandler(params)()

        // Assert
        expect(setShowDialogMock).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('#createEndSessionHandler', () => {
    describe('when `createEndSessionHandler` is called', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof createEndSessionHandler(params)
        const expected = 'function'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `createEndSessionHandler` returned function is called', () => {
      it('should call `focusSessions.api.finish` with an `id`', () => {
        // Arrange
        const finishMock = jest.fn()
        const params = {
          focusSessions: {
            api: {
              finish: finishMock,
            },
          },
        }

        // Act
        createEndSessionHandler(params)()

        // Assert
        expect(finishMock).toHaveBeenCalledWith()
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
        createEndSessionHandler(params)()

        // Assert
        expect(Router.push).toHaveBeenCalledWith('/planning')
      })
    })
  })
})
