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
    describe('when tasks were completed before and during the session', () => {
      it('should count only the ones completed during it', () => {
        // Arrange
        const focusSession = { startTime: 1000, pauses: [] }
        const tasks = [
          { id: 1, status: 'completed', completedAt: 500 },
          { id: 2, status: 'completed', completedAt: 2000 },
          { id: 3, status: 'completed' },
          { id: 4, status: 'pending', completedAt: null },
        ]
        const expected = { focusedTime: 4000, completedTasks: 1 }

        // Act
        const result = getSessionRecap({ focusSession, tasks, now: 5000 })

        // Assert
        expect(result).toEqual(expected)
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
