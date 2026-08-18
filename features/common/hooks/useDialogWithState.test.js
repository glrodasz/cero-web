/* eslint-disable react-hooks/rules-of-hooks */
import { renderHook, act } from '@testing-library/react-hooks'
import useDialogWithState from './useDialogWithState'

describe('[ features / common / hooks / useDialogWithState ]', () => {
  describe('when `useDialogWithState` is called without an initial value', () => {
    it('should return a `showDialog` as `false`', () => {
      // Arrange
      const hook = () => useDialogWithState()

      // Act
      const { result: hookResult } = renderHook(hook)
      const result = hookResult.current.showDialog
      const expected = false

      // Assert
      expect(result).toBe(expected)
    })

    it('should return a `value` as `null`', () => {
      // Arrange
      const hook = () => useDialogWithState()

      // Act
      const { result: hookResult } = renderHook(hook)
      const result = hookResult.current.value
      const expected = null

      // Assert
      expect(result).toBe(expected)
    })

    it('should return a `setShowDialog` as a `function`', () => {
      // Arrange
      const hook = () => useDialogWithState()

      // Act
      const { result: hookResult } = renderHook(hook)
      const result = typeof hookResult.current.setShowDialog
      const expected = 'function'

      // Assert
      expect(result).toBe(expected)
    })

    it('should return a `setValue` as a `function`', () => {
      // Arrange
      const hook = () => useDialogWithState()

      // Act
      const { result: hookResult } = renderHook(hook)
      const result = typeof hookResult.current.setValue
      const expected = 'function'

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when `useDialogWithState` is called with an initial value', () => {
    it('should return the initial value as `value`', () => {
      // Arrange
      const hook = () => useDialogWithState(15)

      // Act
      const { result: hookResult } = renderHook(hook)
      const result = hookResult.current.value
      const expected = 15

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when `setShowDialog` is called', () => {
    it('should change `showDialog`', () => {
      // Arrange
      const hook = () => useDialogWithState()

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
  })

  describe('when `setValue` is called', () => {
    it('should change `value`', () => {
      // Arrange
      const hook = () => useDialogWithState()

      // Act
      const { result: hookResult } = renderHook(hook)
      act(() => {
        hookResult.current.setValue('task-1')
      })
      const result = hookResult.current.value
      const expected = 'task-1'

      // Assert
      expect(result).toBe(expected)
    })
  })
})
