import {
  createDeleteTaskHandler,
  createDragEndTaskHandler,
  createAddTaskHandler,
  createCancelRemoveHandler,
  createConfirmRemoveHandler,
  createStartSessionHandler,
  createChangeTaskDurationHandler,
  createAddSubtaskHandler,
  createToggleSubtaskHandler,
  createRemoveSubtaskHandler,
  createSaveTaskNotesHandler,
} from './handlers'

import { reorderTasks } from './helpers'
jest.mock('./helpers', () => ({
  ...jest.requireActual('./helpers'),
  reorderTasks: jest.fn().mockReturnValue(['a', 'b', 'c']),
}))

import Router from 'next/router'
jest.mock('next/router', () => ({ push: jest.fn() }))

describe('[ features / tasks / handlers ]', () => {
  describe('#createDragEndTaskHandler', () => {
    describe('when the handler is call', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof createDragEndTaskHandler(params)
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
          createDragEndTaskHandler(params)(event)

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
          createDragEndTaskHandler(params)(event)

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
          createDragEndTaskHandler(params)(event)

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
        createDragEndTaskHandler(params)(result)

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
        createDragEndTaskHandler(params)(event)

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
        createDragEndTaskHandler(params)(event)

        // Assert
        expect(updatePrioritiesMock).not.toHaveBeenCalledWith()
      })
    })
  })

  describe('#createAddTaskHandler', () => {
    describe('when the handler is call', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof createAddTaskHandler(params)
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
        createAddTaskHandler(params)({ value })

        // Assert
        expect(createMock).toHaveBeenCalledWith({
          description: 'foo',
        })
      })
    })
  })

  describe('#createDeleteTaskHandler', () => {
    describe('when the handler is call', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof createDeleteTaskHandler(params)
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
        createDeleteTaskHandler(params)({ id })

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
        createDeleteTaskHandler(params)({ id })

        // Assert
        expect(setTaskId).toHaveBeenCalledWith('foo')
      })
    })
  })

  describe('#createCancelRemoveHandler', () => {
    describe('when the handler is call', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof createCancelRemoveHandler(params)
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
        createCancelRemoveHandler(params)({ id })

        // Assert
        expect(setShowDialog).toHaveBeenCalledWith(false)
      })

      it('should call `setTaskId` with null', () => {
        // Arrange
        const setShowDialog = () => {}
        const setTaskId = jest.fn()
        const params = { deleteConfirmation: { setShowDialog, setTaskId } }

        // Act
        createCancelRemoveHandler(params)()

        // Assert
        expect(setTaskId).toHaveBeenCalledWith(null)
      })
    })
  })

  describe('#createConfirmRemoveHandler', () => {
    describe('when the handler is call', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof createConfirmRemoveHandler(params)
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
        createConfirmRemoveHandler(params)()

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
        createConfirmRemoveHandler(params)()

        // Assert
        expect(setShowDialogMock).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('#createStartSessionHandler', () => {
    describe('when the handler is call', () => {
      it('should return a function', () => {
        // Arrange
        const params = {}

        // Act
        const result = typeof createStartSessionHandler(params)
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
        createStartSessionHandler(params)()

        // Assert
        expect(createMock).toHaveBeenCalled()
      })

      it('should call `Router.push` with `/focus-session`', async () => {
        // Arrange
        const focusSessions = { api: { create: () => {} } }
        const params = { focusSessions }

        // Act
        await createStartSessionHandler(params)()

        // Assert
        expect(Router.push).toHaveBeenCalledWith('/focus-session')
      })
    })
  })

  describe('task detail autosave', () => {
    const createTask = (data) => ({
      data: { id: 7, ...data },
      api: { update: jest.fn() },
    })

    describe('#createChangeTaskDurationHandler', () => {
      it('should save the new duration', () => {
        // Arrange
        const task = createTask({ duration: 30 })

        // Act
        createChangeTaskDurationHandler({ task })(60)

        // Assert
        expect(task.api.update).toHaveBeenCalledWith({
          id: 7,
          task: { duration: 60 },
        })
      })

      it('should not save when the duration did not change', () => {
        // Arrange
        const task = createTask({})

        // Act
        createChangeTaskDurationHandler({ task })(null)

        // Assert
        expect(task.api.update).not.toHaveBeenCalled()
      })
    })

    describe('#createAddSubtaskHandler', () => {
      it('should save the list with the new subtask', () => {
        // Arrange
        const task = createTask({})

        // Act
        createAddSubtaskHandler({ task })('Crear plantilla')

        // Assert
        expect(task.api.update).toHaveBeenCalledWith({
          id: 7,
          task: {
            subtasks: [
              {
                id: expect.any(String),
                description: 'Crear plantilla',
                isCompleted: false,
              },
            ],
          },
        })
      })

      it('should not save a blank subtask', () => {
        // Arrange
        const task = createTask({})

        // Act
        createAddSubtaskHandler({ task })('  ')

        // Assert
        expect(task.api.update).not.toHaveBeenCalled()
      })
    })

    describe('#createToggleSubtaskHandler', () => {
      it('should save the list with the subtask toggled', () => {
        // Arrange
        const task = createTask({
          subtasks: [{ id: 'a', description: 'Uno', isCompleted: false }],
        })

        // Act
        createToggleSubtaskHandler({ task })('a')

        // Assert
        expect(task.api.update).toHaveBeenCalledWith({
          id: 7,
          task: {
            subtasks: [{ id: 'a', description: 'Uno', isCompleted: true }],
          },
        })
      })
    })

    describe('#createRemoveSubtaskHandler', () => {
      it('should save the list without the subtask', () => {
        // Arrange
        const task = createTask({
          subtasks: [{ id: 'a', description: 'Uno', isCompleted: false }],
        })

        // Act
        createRemoveSubtaskHandler({ task })('a')

        // Assert
        expect(task.api.update).toHaveBeenCalledWith({
          id: 7,
          task: { subtasks: [] },
        })
      })
    })

    describe('#createSaveTaskNotesHandler', () => {
      it('should save changed notes', () => {
        // Arrange
        const task = createTask({ notes: 'Antes' })

        // Act
        createSaveTaskNotesHandler({ task })('Después')

        // Assert
        expect(task.api.update).toHaveBeenCalledWith({
          id: 7,
          task: { notes: 'Después' },
        })
      })

      it('should not save unchanged notes', () => {
        // Arrange
        const task = createTask({})

        // Act
        createSaveTaskNotesHandler({ task })('')

        // Assert
        expect(task.api.update).not.toHaveBeenCalled()
      })
    })

    describe('when the task has not loaded yet', () => {
      it('should not save anything', () => {
        // Arrange
        const task = { data: undefined, api: { update: jest.fn() } }

        // Act
        createChangeTaskDurationHandler({ task })(60)

        // Assert
        expect(task.api.update).not.toHaveBeenCalled()
      })
    })
  })
})
