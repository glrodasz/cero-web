import { render, screen, fireEvent } from '@testing-library/react'
import PausedBanner from './PausedBanner'

describe('[ features / focusSession / components / PausedBanner ]', () => {
  describe('when "Reanudar" is clicked', () => {
    it('should call `onResume`', () => {
      // Arrange
      const onResume = jest.fn()
      render(<PausedBanner onResume={onResume} />)

      // Act
      fireEvent.click(screen.getByText('Reanudar'))

      // Assert
      expect(onResume).toHaveBeenCalled()
    })
  })
})
