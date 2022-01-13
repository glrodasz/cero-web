import { getBarWidth } from './helpers'

describe('[ features / focusSession / helpers ]', () => {
  describe('#getBarWidth', () => {
    describe('when `currentTime` is 30 minutes', () => {
      it('should return `50` percent of the width', () => {
        // Arrange
        const params = 30 * 60 * 1000

        // Act
        const result = getBarWidth(params)
        const expected = 50

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `currentTime` is 1 hour', () => {
      it('should return `0` percent of the width', () => {
        // Arrange
        const params = 60 * 60 * 1000

        // Act
        const result = getBarWidth(params)
        const expected = 0

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `currentTime` is 2 hours', () => {
      it('should return `0` percent of the width', () => {
        // Arrange
        const params = 2 * 60 * 60 * 1000

        // Act
        const result = getBarWidth(params)
        const expected = 0

        // Assert
        expect(result).toBe(expected)
      })
    })
  })
})
