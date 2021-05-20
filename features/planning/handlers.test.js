import {
  handleClickDeleteTask,
  handleDragEndTask,
  handleClickAddTask,
  handleClickCancelRemove,
  handleClickConfirmRemove,
  handleClickStartSession,
} from './handlers'

import { reorderTasks } from './helpers'
jest.mock('./helpers', () => ({
  reorderTasks: jest.fn().mockReturnValue(['a', 'b', 'c']),
}))

import Router from 'next/router'
jest.mock('next/router', () => ({ push: jest.fn() }))

describe('[ features / plannning / handlers ]', () => {
  describe('#handleDragEndTask', () => {
    describe('when the handler is call', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof handleDragEndTask(params)
        const expected = 'function'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('When the function returned is called `result.destination` exists ', () => {
      describe('and `source` and `destination` have the same `droppalbeId`', () => {
        it('should call `reorderTasks` with the correct params', () => {
          // Arrange
          const noop = () => {}
          const event = {
            destination: { index: 1, droppableId: 'foo' },
            source: { index: 0, droppableId: 'foo' },
          }
          const params = {
            tasks: {
              data: [{ status: 'foo' }, { status: 'foo' }, { status: 'bar' }],
              api: { updatePriorities: noop },
              setLocalData: noop,
            },
          }

          // Act
          handleDragEndTask(params)(event)

          // Assert
          expect(reorderTasks).toHaveBeenCalledWith(
            [{ status: 'foo' }, { status: 'foo' }],
            0,
            1,
            'foo'
          )
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
          handleDragEndTask(params)(event)

          // Assert
          expect(setLocalDataMock).toHaveBeenCalledWith(['a', 'b', 'c'])
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

          // Act
          handleDragEndTask(params)(event)

          // Assert
          expect(updatePrioritiesMock).toHaveBeenCalledWith({
            tasks: ['a', 'b', 'c'],
          })
        })
      })
    })

    describe('When the function returned is called and `result.destination` is false ', () => {
      it('should not call `reorderTasks`', () => {
        // Arrange
        const result = {}
        const params = {}

        // Act
        handleDragEndTask(params)(result)

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
        handleDragEndTask(params)(event)

        // Assert
        expect(setLocalDataMock).not.toHaveBeenCalled()
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

        // Act
        handleDragEndTask(params)(event)

        // Assert
        expect(updatePrioritiesMock).not.toHaveBeenCalledWith()
      })
    })
  })

  describe('#handleClickAddTask', () => {
    describe('when the handler is call', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof handleClickAddTask(params)
        const expected = 'function'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('When the function returned is called', () => {
      it('should call `api.create` with the correct args', () => {
        // Arrange

        const createMock = jest.fn()
        const api = { create: createMock }
        const data = [42, 6521, 1264]
        const params = { tasks: { api, data } }
        const value = 'foo'

        // Act
        handleClickAddTask(params)(value)

        // Assert
        expect(createMock).toHaveBeenCalledWith({
          description: 'foo',
          priority: 3,
        })
      })
    })
  })

  describe('#handleClickDeleteTask', () => {
    describe('when the handler is call', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof handleClickDeleteTask(params)
        const expected = 'function'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when the function returned is called', () => {
      it('should call `setShowDialog` with true', () => {
        // Arrange
        const setShowDialog = jest.fn() // Mock/Spie
        const setTaskId = () => {}
        const id = 'foo'
        const params = { deleteConfirmation: { setShowDialog, setTaskId } }

        // Act
        handleClickDeleteTask(params)({ id })

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
        handleClickDeleteTask(params)({ id })

        // Assert
        expect(setTaskId).toHaveBeenCalledWith('foo')
      })
    })
  })

  describe('#handleClickCancelRemove', () => {
    describe('when the handler is call', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof handleClickCancelRemove(params)
        const expected = 'function'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when the function returned is called', () => {
      it('should call `setShowDialog` with false', () => {
        // Arrange
        const setShowDialog = jest.fn() // Mock/Spie
        const setTaskId = () => {}
        const id = 'foo'
        const params = { deleteConfirmation: { setShowDialog, setTaskId } }

        // Act
        handleClickCancelRemove(params)({ id })

        // Assert
        expect(setShowDialog).toHaveBeenCalledWith(false)
      })

      it('should call `setTaskId` with null', () => {
        // Arrange
        const setShowDialog = () => {}
        const setTaskId = jest.fn()
        const params = { deleteConfirmation: { setShowDialog, setTaskId } }

        // Act
        handleClickCancelRemove(params)()

        // Assert
        expect(setTaskId).toHaveBeenCalledWith(null)
      })
    })
  })

  describe('#handleClickConfirmRemove', () => {
    describe('when the handler is call', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof handleClickConfirmRemove(params)
        const expected = 'function'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when the function returned is called', () => {
      it('should call `tasks.api.remove` with the correct id', () => {
        // Arrange
        const noop = () => {}
        const removeMock = jest.fn()
        const tasks = { api: { remove: removeMock } }
        const deleteConfirmation = { taskId: 'foo', setShowDialog: noop }
        const params = { tasks, deleteConfirmation }
        // Act
        handleClickConfirmRemove(params)()

        // Assert
        expect(removeMock).toHaveBeenCalledWith({ id: 'foo' })
      })

      it('should call `setShowDialog` with false', () => {
        // Arrange
        const noop = () => {}
        const setShowDialogMock = jest.fn()
        const tasks = { api: { remove: noop } }
        const deleteConfirmation = {
          taskId: 'foo',
          setShowDialog: setShowDialogMock,
        }
        const params = { tasks, deleteConfirmation }
        // Act
        handleClickConfirmRemove(params)()

        // Assert
        expect(setShowDialogMock).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('#handleClickStartSession', () => {
    describe('when the handler is call', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof handleClickStartSession(params)
        const expected = 'function'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when the function returned is called', () => {
      it('should call `focusSessions.api.create`', () => {
        // Arrange
        const createMock = jest.fn()
        const focusSessions = { api: { create: createMock } }
        const params = { focusSessions }

        // Act
        handleClickStartSession(params)()

        // Assert
        expect(createMock).toHaveBeenCalled()
      })

      it('should call `Router.push` with `/focus-session`', () => {
        // Arrange
        const focusSessions = { api: { create: () => {} } }
        const params = { focusSessions }

        // Act
        handleClickStartSession(params)()

        // Assert
        expect(Router.push).toHaveBeenCalledWith('/focus-session')
      })
    })
  })
})
