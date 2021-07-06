import { filterColumns, getTitle } from './helpers'

jest.mock('./constants', () => ({
  IN_PROGRESS_COLUMN_ID: 'IN_PROGRESS_COLUMN_ID',
  PENDING_COLUMN_ID: 'PENDING_COLUMN_ID',
  COMPLETED_COLUMN_ID: 'COMPLETED_COLUMN_ID',
}))

describe('[ features / tasks / helpers ]', () => {
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

  describe('#getCurrent', () => {})

  describe('#getTotal', () => {})

  describe('#normalizeData', () => {})

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

    describe('when `isActive` is `false`, and `column` is `PENDING_COLUMN_ID`, and `tasksLength` is greater or equal than `3` ', () => {
      it('should return `true`', () => {
        // Arrange
        const params = {
          isActive: false,
          tasksLength: 3,
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
