import {
  filterColumns,
  getTitle,
  getCurrent,
  reorderTasks,
  getTaskType,
  getTotal,
} from './helpers'

jest.mock('../../config', () => ({
  MAXIMUN_IN_PRIORITY_TASKS: 3,
  MAXIMUM_BACKLOG_QUANTITY: 5,
}))

jest.mock('./constants', () => ({
  IN_PROGRESS_COLUMN_ID: 'IN_PROGRESS_COLUMN_ID',
  PENDING_COLUMN_ID: 'PENDING_COLUMN_ID',
  COMPLETED_COLUMN_ID: 'COMPLETED_COLUMN_ID',
}))

describe('[ features / tasks / helpers ]', () => {
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
    describe('when `index` is bigger than `MAXIMUN_IN_PRIORITY_TASKS - 1`', () => {
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

    describe('when `index` is smaller than `MAXIMUN_IN_PRIORITY_TASKS - 1`', () => {
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

  describe('#getTitle', () => {
    describe('when `isActive`is `true`', () => {
      it('should return `column.title`', () => {
        // Arrange
        const params = {
          isActive: true,
          column: {
            title: 'title',
          },
        }

        // Act
        const result = getTitle(params)
        const expected = 'title'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `isActive`is `false` and `column.id` is `IN_PROGRESS_COLUMN_ID`', () => {
      it('should return `Tareas`', () => {
        // Arrange
        const params = {
          isActive: false,
          column: {
            id: 'IN_PROGRESS_COLUMN_ID',
          },
        }

        // Act
        const result = getTitle(params)
        const expected = 'Tareas'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `isActive`is `false` and `column.id` is `PENDING_COLUMN_ID`', () => {
      it('should return an empty string', () => {
        // Arrange
        const params = {
          isActive: false,
          column: {
            id: 'PENDING_COLUMN_ID',
          },
        }

        // Act
        const result = getTitle(params)
        const expected = ''

        // Assert
        expect(result).toBe(expected)
      })
    })
  })

  describe('#getCurrent', () => {
    describe('when `column.id` is `PENDING_COLUMN_ID` and `isActive` is `false`', () => {
      it('should return `null`', () => {
        // Arrange
        const params = {
          tasks: [],
          isActive: false,
          column: {
            id: 'PENDING_COLUMN_ID',
          },
        }

        // Act
        const result = getCurrent(params)
        const expected = null

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `column.id` is `PENDING_COLUMN_ID` and `isActive` is `true`', () => {
      it('should return the length of the `tasks`', () => {
        // Arrange
        const params = {
          tasks: [null, null],
          isActive: true,
          column: {
            id: 'PENDING_COLUMN_ID',
          },
        }

        // Act
        const result = getCurrent(params)
        const expected = 2

        // Assert
        expect(result).toBe(expected)
      })
    })
  })

  describe('#getTotal', () => {
    describe('when `column.id` is `IN_PROGRESS_COLUMN_ID` and `isActive` is false', () => {
      it('should return `MAXIMUN_IN_PRIORITY_TASKS`', () => {
        // Arrange
        const params = {
          column: {
            id: 'IN_PROGRESS_COLUMN_ID',
          },
          isActive: false,
        }

        // Act
        const result = getTotal(params)
        const expected = 3

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `column.id` is `PENDING_COLUMN_ID` and `isActive` is true', () => {
      it('should return `MAXIMUM_BACKLOG_QUANTITY`', () => {
        // Arrange
        const params = {
          column: {
            id: 'PENDING_COLUMN_ID',
          },
          isActive: true,
        }

        // Act
        const result = getTotal(params)
        const expected = 5

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `column.id` is `OTHER_COLUMN_ID` and `isActive` is true/false', () => {
      it('should return `null`', () => {
        // Arrange
        const params = {
          column: {
            id: 'OTHER_COLUMN_ID',
          },
          isActive: true,
        }

        // Act
        const result = getTotal(params)
        const expected = null

        // Assert
        expect(result).toBe(expected)
      })
    })
  })

  describe('#filterColumns', () => {
    describe('when `isActive` is `true`', () => {
      it('should return `true`', () => {
        // Arrange
        const params = {
          isActive: true,
        }
        const column = 'IN_PROGRESS_COLUMN_ID'

        // Act
        const result = filterColumns(params)(column)
        const expected = true

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `isActive` is `false` and `column` is `IN_PROGRESS_COLUMN_ID`', () => {
      it('should return `true`', () => {
        // Arrange
        const params = {
          isActive: false,
        }
        const column = 'IN_PROGRESS_COLUMN_ID'

        // Act
        const result = filterColumns(params)(column)
        const expected = true

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `isActive` is `false` and `column` is `COMPLETED_COLUMN_ID`', () => {
      it('should return `true`', () => {
        // Arrange
        const params = {
          isActive: false,
        }
        const column = 'COMPLETED_COLUMN_ID'

        // Act
        const result = filterColumns(params)(column)
        const expected = false

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `isActive` is `false`, and `column` is `PENDING_COLUMN_ID`, and `tasksLength` is greater or equal than `MAXIMUN_IN_PRIORITY_TASKS` ', () => {
      it('should return `true`', () => {
        // Arrange
        const params = {
          isActive: false,
          tasksLength: 10,
        }
        const column = 'PENDING_COLUMN_ID'

        // Act
        const result = filterColumns(params)(column)
        const expected = true

        // Assert
        expect(result).toBe(expected)
      })
    })
  })
})
