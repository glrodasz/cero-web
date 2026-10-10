import formatMinutes from './formatMinutes'

describe('[ utils / formatMinutes ]', () => {
  describe('when the minutes are less than an hour', () => {
    it('should return only minutes', () => {
      // Arrange
      const minutes = 30

      // Act
      const result = formatMinutes(minutes)
      const expected = '30m'

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when the minutes are whole hours', () => {
    it('should return only hours', () => {
      // Arrange
      const minutes = 120

      // Act
      const result = formatMinutes(minutes)
      const expected = '2h'

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when the minutes are hours and minutes', () => {
    it('should return both', () => {
      // Arrange
      const minutes = 90

      // Act
      const result = formatMinutes(minutes)
      const expected = '1h 30m'

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when the minutes are zero', () => {
    it('should return `0m`', () => {
      // Arrange
      const minutes = 0

      // Act
      const result = formatMinutes(minutes)
      const expected = '0m'

      // Assert
      expect(result).toBe(expected)
    })
  })
})
