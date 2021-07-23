import { renderHook, act } from '@testing-library/react-hooks'
import useBreaktimeConfirmation from './useBreaktimeConfirmation'

describe('[ features / focusSession / hooks / useBreaktimeConfirmation ]', () => {
  describe('when `useBreaktimeConfirmation` is called', () => {
    it('should return a `showDialog` as `false`', () => {
      // Arrange
      const hook = () => useBreaktimeConfirmation()

      // Act
      const { result: hookResult } = renderHook(hook)
      const result = hookResult.current.showDialog
      const expected = false

      // Assert
      expect(result).toBe(expected)
    })

    it('should return a `setShowDialog` as a `function`', () => {
      // Arrange
      const hook = () => useBreaktimeConfirmation()

      // Act
      const { result: hookResult } = renderHook(hook)
      const result = typeof hookResult.current.setShowDialog
      const expected = 'function'

      // Assert
      expect(result).toBe(expected)
    })

    it('should change `showDialog` when `setShowDialog` called', () => {
      // Arrange
      const hook = () => useBreaktimeConfirmation()

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
})
