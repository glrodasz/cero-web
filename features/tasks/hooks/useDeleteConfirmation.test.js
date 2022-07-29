/* eslint-disable react-hooks/rules-of-hooks */
import { renderHook, act } from '@testing-library/react-hooks'
import useDeleteConfirmation from './useDeleteConfirmation'

describe('[ features / tasks / hooks / useDeleteConfirmation ]', () => {
  describe('when `useDeleteConfirmation` is called', () => {
    it('should return a `showDialog` as `false`', () => {
      // Arrange
      const hook = () => useDeleteConfirmation()

      // Act
      const { result: hookResult } = renderHook(hook)
      const result = hookResult.current.showDialog
      const expected = false

      // Assert
      expect(result).toBe(expected)
    })

    it('should return a `setShowDialog` as a `function`', () => {
      // Arrange
      const hook = () => useDeleteConfirmation()

      // Act
      const { result: hookResult } = renderHook(hook)
      const result = typeof hookResult.current.setShowDialog
      const expected = 'function'

      // Assert
      expect(result).toBe(expected)
    })

    it('should change `showDialog` when `setShowDialog` called', () => {
      // Arrange
      const hook = () => useDeleteConfirmation()

      // Act
      const { result: hookResult } = renderHook(hook)
      act(() => {
        hookResult.current.setShowDialog(true)
      })
      const result = hookResult.current.showDialog
      const expected = true

      // Assert
      expect(result).toBe(expected)
    })

    it('should return a `taskId` as `null`', () => {
      // Arrange
      const hook = () => useDeleteConfirmation()

      // Act
      const { result: hookResult } = renderHook(hook)
      const result = hookResult.current.taskId
      const expected = null

      // Assert
      expect(result).toBe(expected)
    })

    it('should return a `setTaskId` as a `function`', () => {
      // Arrange
      const hook = () => useDeleteConfirmation()

      // Act
      const { result: hookResult } = renderHook(hook)
      const result = typeof hookResult.current.setTaskId
      const expected = 'function'

      // Assert
      expect(result).toBe(expected)
    })

    it('should change `taskId` when `setTaskId` called', () => {
      // Arrange
      const hook = () => useDeleteConfirmation()

      // Act
      const { result: hookResult } = renderHook(hook)
      act(() => {
        hookResult.current.setTaskId('foo')
      })
      const result = hookResult.current.taskId
      const expected = 'foo'

      // Assert
      expect(result).toBe(expected)
    })
  })
})
