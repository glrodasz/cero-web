import {
  formatCompletedTasks,
  formatFocusedTime,
  getSessionRecap,
  getTaskSections,
} from './helpers'

describe('[ features / retrospective / helpers ]', () => {
  describe('#getTaskSections', () => {
    describe('when there are tasks in every status', () => {
      it('should group them under their section, in board order', () => {
        // Arrange
        const tasks = [
          { id: 1, status: 'completed' },
          { id: 2, status: 'pending' },
          { id: 3, status: 'in-progress' },
          { id: 4, status: 'pending' },
        ]

        // Act
        const result = getTaskSections(tasks)
        const expected = [
          {
            status: 'in-progress',
            title: 'En progreso',
            tasks: [{ id: 3, status: 'in-progress' }],
          },
          {
            status: 'pending',
            title: 'Pendientes',
            tasks: [
              { id: 2, status: 'pending' },
              { id: 4, status: 'pending' },
            ],
          },
          {
            status: 'completed',
            title: 'Completadas',
            tasks: [{ id: 1, status: 'completed' }],
          },
        ]

        // Assert
        expect(result).toEqual(expected)
      })
    })

    describe('when the tasks have not loaded yet', () => {
      it('should return every section empty', () => {
        // Act
        const result = getTaskSections(undefined).map(({ tasks }) => tasks)
        const expected = [[], [], []]

        // Assert
        expect(result).toEqual(expected)
      })
    })
  })

  describe('#getSessionRecap', () => {
    beforeEach(() => {
      jest.spyOn(Date, 'now').mockReturnValue(5000)
    })

    afterEach(() => {
      Date.now.mockRestore()
    })

    describe('when tasks were completed in this and other sessions', () => {
      it('should count only the ones completed in this one', () => {
        // Arrange
        const focusSession = { id: 9, startTime: 1000, pauses: [] }
        const tasks = [
          { id: 1, status: 'completed', focusSessionId: 9 },
          { id: 2, status: 'completed', focusSessionId: 3 },
          { id: 3, status: 'completed', focusSessionId: null },
          { id: 4, status: 'pending', focusSessionId: 9 },
        ]
        const expected = { focusedTime: 4000, completedTasks: 1 }

        // Act
        const result = getSessionRecap({ focusSession, tasks })

        // Assert
        expect(result).toEqual(expected)
      })
    })

    describe('when the session is paused', () => {
      it('should stop the time where the pause began', () => {
        // Arrange
        const focusSession = {
          id: 9,
          startTime: 1000,
          pauses: [{ startTime: 3000, endTime: null }],
        }
        const expected = 2000

        // Act
        const result = getSessionRecap({ focusSession }).focusedTime

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when there is no session yet', () => {
      it('should recap nothing', () => {
        // Act
        const result = getSessionRecap({ focusSession: undefined })

        // Assert
        expect(result).toEqual({ focusedTime: 0, completedTasks: 0 })
      })
    })
  })

  describe('#formatFocusedTime', () => {
    it.each([
      [30 * 1000, 'menos de 1 min'],
      [42 * 60000, '42 min'],
      [60 * 60000, '1 h'],
      [95 * 60000, '1 h 35 min'],
    ])('should format %d ms as "%s"', (milliseconds, expected) => {
      // Act
      const result = formatFocusedTime(milliseconds)

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('#formatCompletedTasks', () => {
    it.each([
      [0, '0 tareas'],
      [1, '1 tarea'],
      [3, '3 tareas'],
    ])('should format %d as "%s"', (count, expected) => {
      // Act
      const result = formatCompletedTasks(count)

      // Assert
      expect(result).toBe(expected)
    })
  })
})
