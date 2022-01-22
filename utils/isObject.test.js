import isObject from './isObject'

describe('[ utils / isObject ]', () => {
  describe('when the `param` is an object', () => {
    it('should return `true`', () => {
      // Arrange
      const param = {}

      // Act
      const result = isObject(param)
      const expected = true

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when the `param` is an array', () => {
    it('should return `false`', () => {
      // Arrange
      const param = []

      // Act
      const result = isObject(param)
      const expected = false

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when the `param` is an number', () => {
    it('should return `false`', () => {
      // Arrange
      const param = 42

      // Act
      const result = isObject(param)
      const expected = false

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when the `param` is an string', () => {
    it('should return `false`', () => {
      // Arrange
      const param = ''

      // Act
      const result = isObject(param)
      const expected = false

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when the `param` is an bigint', () => {
    it('should return `false`', () => {
      // Arrange
      const param = 10n

      // Act
      const result = isObject(param)
      const expected = false

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when the `param` is an symbol', () => {
    it('should return `false`', () => {
      // Arrange
      const param = Symbol()

      // Act
      const result = isObject(param)
      const expected = false

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when the `param` is an null', () => {
    it('should return `false`', () => {
      // Arrange
      const param = null

      // Act
      const result = isObject(param)
      const expected = false

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when the `param` is an undefined', () => {
    it('should return `false`', () => {
      // Arrange
      const param = undefined

      // Act
      const result = isObject(param)
      const expected = false

      // Assert
      expect(result).toBe(expected)
    })
  })
})
