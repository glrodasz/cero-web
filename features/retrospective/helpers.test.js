import { getTaskSections } from './helpers'

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
})
