import { handleDeleteTask } from './handlers'

describe('[ features / plannning / handlers ]', () => {
  describe('#handleDragEnd', () => {})

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

      it('should call `setTaskId` with the provided `id`', () => {
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
