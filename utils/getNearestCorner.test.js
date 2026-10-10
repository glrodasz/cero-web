import getNearestCorner from './getNearestCorner'

const AREA = { width: 400, height: 800 }

describe('[ utils / getNearestCorner ]', () => {
  describe.each([
    [{ x: 10, y: 10 }, 'top-left'],
    [{ x: 390, y: 10 }, 'top-right'],
    [{ x: 10, y: 790 }, 'bottom-left'],
    [{ x: 390, y: 790 }, 'bottom-right'],
  ])('when the point is %j', (point, expected) => {
    it(`should return \`${expected}\``, () => {
      // Act
      const result = getNearestCorner({ ...point, ...AREA })

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when the point is exactly on both midlines', () => {
    it('should return `top-left`', () => {
      // Act
      const result = getNearestCorner({ x: 200, y: 400, ...AREA })
      const expected = 'top-left'

      // Assert
      expect(result).toBe(expected)
    })
  })
})
