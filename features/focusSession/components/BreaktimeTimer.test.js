import { formatBreakTime } from './BreaktimeTimer'

const FIFTEEN_MINUTES_IN_MILLISECONDS = 15 * 60 * 1000

describe('[ features / focusSessions / Components / BreaktimeTimer]', () => {
  describe('#formatBreakTime', () => {
    describe('when a time `milliseconds` is provided', () => {
      it('should return a formatted time as `mm:ss`', () => {
        // Arrrange
        const milliseconds = FIFTEEN_MINUTES_IN_MILLISECONDS
        // Act
        const result = formatBreakTime(milliseconds)
        const expected = '15:00'

        // Assert
        expect(result).toBe(expected)
      })
    })
  })
})
