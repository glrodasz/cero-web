import formatMilliseconds from './formatMilliseconds'

describe('[ utils / formatMilliseconds ]', () => {
  describe('when a time `milliseconds` are 15 minutes', () => {
    it('should return a formatted time as `15:00`', () => {
      // Arrrange
      const milliseconds = 15 * 60 * 1000

      // Act
      const result = formatMilliseconds(milliseconds)
      const expected = '15:00'

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when a time `milliseconds` are 0 milliseconds', () => {
    it('should return a formatted time as `00:00`', () => {
      // Arrrange
      const milliseconds = 0

      // Act
      const result = formatMilliseconds(milliseconds)
      const expected = '00:00'

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when a time `milliseconds` are 1 hour', () => {
    it('should return a formatted time as `01:00:00`', () => {
      // Arrrange
      const milliseconds = 60 * 60 * 1000

      // Act
      const result = formatMilliseconds(milliseconds)
      const expected = '01:00:00'

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when a time `milliseconds` are 25 hours', () => {
    it('should return a formatted time as `25:00:00`', () => {
      // Arrrange
      const milliseconds = 25 * 60 * 60 * 1000

      // Act
      const result = formatMilliseconds(milliseconds)
      const expected = '25:00:00'

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when a time `milliseconds` are 100 hours', () => {
    it('should return a formatted time as `100:00:00`', () => {
      // Arrrange
      const milliseconds = 100 * 60 * 60 * 1000

      // Act
      const result = formatMilliseconds(milliseconds)
      const expected = '100:00:00'

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when a time `milliseconds` is `undefined`', () => {
    it('should return a formatted time as `00:00`', () => {
      // Arrrange
      const milliseconds = undefined

      // Act
      const result = formatMilliseconds(milliseconds)
      const expected = '00:00'

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when a time `milliseconds` is `null`', () => {
    it('should throw an exception', () => {
      // Arrrange
      const milliseconds = null

      // Act
      const result = () => formatMilliseconds(milliseconds)

      // Assert
      expect(result).toThrow('milliseconds is not a number')
    })
  })

  describe('when a time `milliseconds` is `{}`', () => {
    it('should throw an exception', () => {
      // Arrrange
      const milliseconds = {}

      // Act
      const result = () => formatMilliseconds(milliseconds)

      // Assert
      expect(result).toThrow('milliseconds is not a number')
    })
  })
})
