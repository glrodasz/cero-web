import { handleDeleteTask } from './handlers'

describe('[ features / plannning / handlers ]', () => {
  describe('#handleDragEnd', () => {})

  describe('#handleDeleteTask', () => {
    describe('when the handler is call', () => {
      it('should return a function', () => {
        // Arrange
        const param = {}

        // Act
        const result = typeof handleDeleteTask(param)
        const expected = 'function'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('When the function returned is called', () => {
      it('should call `setShowDeleteConfirmation` with true', () => {
        // Arrange
        const setShowDeleteConfirmation = jest.fn() // Stub/Spie
        const setCurrentTaskId = () => {}
        const id = 'foo'
        const params = { setShowDeleteConfirmation, setCurrentTaskId }

        // Act
        handleDeleteTask(params)({ id })

        // Assert
        expect(setShowDeleteConfirmation).toHaveBeenCalledWith(true)
      })

      it('should call `setCurrentTaskId` with the provided `id`', () => {
        // Arrange
        const setShowDeleteConfirmation = () => {}
        const setCurrentTaskId = jest.fn()
        const id = 'foo'
        const params = { setShowDeleteConfirmation, setCurrentTaskId }

        // Act
        handleDeleteTask(params)({ id })

        // Assert
        expect(setCurrentTaskId).toHaveBeenCalledWith('foo')
      })
    })
  })
})
