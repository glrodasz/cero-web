import { reorderTasks, getTaskType } from './helpers'

jest.mock('../../config', () => ({
  maxInProgressTasks: 10,
}))

describe('[ features / planning / helpers ]', () => {
  describe('#reorderTasks', () => {
    describe('when a list of tasks is provided', () => {
      it('should return a reordered tasks list', () => {
        // Arrange
        const tasks = [{ letter: 'a' }, { letter: 'b' }, { letter: 'c' }]

        // Act
        const result = reorderTasks(tasks, 0, 2)
        const expected = [
          { letter: 'b', priority: 0 },
          { letter: 'c', priority: 1 },
          { letter: 'a', priority: 2 },
        ]

        // Assert
        expect(result).toEqual(expected)
      })
    })
  })

  describe('#getTaskType', () => {
    describe('when `index` is bigger than `maxInProgressTasks - 1`', () => {
      it('should return null', () => {
        // Arrange
        const index = 10
        // Act
        const result = getTaskType(index)
        const expected = null

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `index` is 0', () => {
      it('should return "active"', () => {
        // Arrange
        const index = 0
        // Act
        const result = getTaskType(index)
        const expected = 'active'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `index` is smaller than `maxInProgressTasks - 1`', () => {
      it('should return "active"', () => {
        // Arrange
        const index = 1
        // Act
        const result = getTaskType(index)
        const expected = 'standby'

        // Assert
        expect(result).toBe(expected)
      })
    })
  })
})
