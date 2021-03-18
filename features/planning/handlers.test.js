import { handleDeleteTask, handleDragEnd } from './handlers'

import { reorderTasks } from './helpers'
jest.mock('./helpers', () => ({
  reorderTasks: jest.fn().mockReturnValue(['a', 'b', 'c']),
}))

describe('[ features / plannning / handlers ]', () => {
  describe('#handleDragEnd', () => {
    describe('when the handler is call', () => {
      it('should return a function', () => {
        // Arrange
        // TODO:
        // Act
        // TODO:
        // Assert
        // TODO:
      })
    })

    describe('When the function returned is called and `result.destination` is true ', () => {
      it('should not call `reorderTasks` with the correct params', () => {
        // Arrange
        const noop = () => {}
        const event = { destination: { index: 1 }, source: { index: 0 } }
        const params = {
          tasks: {
            data: [1, 2, 3],
            api: { updatePriorities: noop },
            setLocalData: noop,
          },
        }

        // Act
        handleDragEnd(params)(event)

        // Assert
        expect(reorderTasks).toHaveBeenCalledWith(/* TODO: */)
      })

      it('should call `setLocalData` with `orderedTasks`', () => {
        // Arrange
        const noop = () => {}
        const setLocalDataMock = jest.fn()
        const event = { destination: { index: 1 }, source: { index: 0 } }
        const params = {
          tasks: {
            data: [1, 2, 3],
            api: { updatePriorities: noop },
            setLocalData: setLocalDataMock,
          },
        }

        // Act
        handleDragEnd(params)(event)

        // Assert
        // TODO:
      })

      it('should call `api.updatePriorities` with `{ tasks: orderedTasks }`', () => {
        // Arrange
        const noop = () => {}
        const updatePrioritiesMock = jest.fn()
        const event = { destination: { index: 1 }, source: { index: 0 } }
        const params = {
          tasks: {
            data: [1, 2, 3],
            api: { updatePriorities: updatePrioritiesMock },
            setLocalData: noop,
          },
        }
        reorderTasks.mockReturnValue(['a', 'b', 'c'])

        // Act
        handleDragEnd(params)(event)

        // Assert
        // TODO:
      })
    })

    describe('When the function returned is called and `result.destination` is false ', () => {
      it('should not call `reorderTasks`', () => {
        // Arrange
        const result = {}
        const params = {}

        // Act
        handleDragEnd(params)(result)

        // Assert
        expect(reorderTasks).not.toHaveBeenCalledWith()
      })

      it('should not call `setLocalData`', () => {
        // Arrange
        const noop = () => {}
        const setLocalDataMock = jest.fn()
        const event = {}
        const params = {
          tasks: {
            data: [1, 2, 3],
            api: { updatePriorities: noop },
            setLocalData: setLocalDataMock,
          },
        }

        // Act
        handleDragEnd(params)(event)

        // Assert
        // TODO:
      })

      it('should not call `api.updatePriorities`', () => {
        // Arrange
        const noop = () => {}
        const updatePrioritiesMock = jest.fn()
        const event = { destination: { index: 1 }, source: { index: 0 } }
        const params = {
          tasks: {
            data: [1, 2, 3],
            api: { updatePriorities: updatePrioritiesMock },
            setLocalData: noop,
          },
        }
        reorderTasks.mockReturnValue(['a', 'b', 'c'])

        // Act
        handleDragEnd(params)(event)

        // Assert
        // TODO:
      })
    })
  })

  describe('#handleDeleteTask', () => {
    describe('when the handler is call', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof handleDeleteTask(params)
        const expected = 'function'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('When the function returned is called', () => {
      it('should call `setShowDialog` with true', () => {
        // Arrange
        const setShowDialog = jest.fn() // Stub/Spie
        const setTaskId = () => {}
        const id = 'foo'
        const params = { deleteConfirmation: { setShowDialog, setTaskId } }

        // Act
        handleDeleteTask(params)({ id })

        // Assert
        expect(setShowDialog).toHaveBeenCalledWith(true)
      })

      it('should call `setTaskId` with the correct `id`', () => {
        // Arrange
        const setShowDialog = () => {}
        const setTaskId = jest.fn()
        const id = 'foo'
        const params = { deleteConfirmation: { setShowDialog, setTaskId } }

        // Act
        handleDeleteTask(params)({ id })

        // Assert
        expect(setTaskId).toHaveBeenCalledWith('foo')
      })
    })
  })
})
