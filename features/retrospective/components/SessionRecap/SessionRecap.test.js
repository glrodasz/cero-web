import { render, screen } from '@testing-library/react'
import SessionRecap from './SessionRecap'

describe('[ features / retrospective / components / SessionRecap ]', () => {
  describe('when `SessionRecap` is mounted', () => {
    it('should sum up the session', () => {
      // Arrange
      const props = { focusedTime: 42 * 60000, completedTasks: 2 }
      const expected = 'Trabajaste 42 min · completaste 2 tareas'

      // Act
      render(<SessionRecap {...props} />)
      const result = screen.queryByText(expected)

      // Assert
      expect(result).not.toBeNull()
    })
  })
})
