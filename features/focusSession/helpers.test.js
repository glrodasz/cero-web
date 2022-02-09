import dateNowMock from '../../utils/testUtils/dateNowMock'
import time from '../../utils/time'
import { getBarWidth, getChronometerStartTime } from './helpers'

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

  describe('#getChronometerStartTime', () => {
    describe('when `startTime` is 1 hour ago', () => {
      it('should return `3_600_000` ms', () => {
        // Arrange
        Date.now = dateNowMock()
        const params = {
          startTime: new Date('1970-01-01T01:00:00.000Z').getTime(),
        }

        // Act
        const result = getChronometerStartTime(params)
        const expected = time.ONE_HOUR_IN_MS

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `startTime` is 1 hour ago and `pauseStarTime` is 30 min ago', () => {
      it('should return `1_800_000` ms', () => {
        // Arrange
        Date.now = jest.fn(() => new Date('1970-01-01T02:00:00.000Z').getTime())
        const params = {
          startTime: new Date('1970-01-01T01:00:00.000Z').getTime(),
          pauseStartTime: new Date('1970-01-01T01:30:00.000Z').getTime(),
        }

        // Act
        const result = getChronometerStartTime(params)
        const expected = time.HALF_HOUR_IN_MS

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when `startTime` is `undefined`', () => {
      it('should return `0` ms', () => {
        // Arrange
        const params = {
          startTime: undefined,
        }

        // Act
        const result = getChronometerStartTime(params)
        const expected = 0

        // Assert
        expect(result).toBe(expected)
      })
    })
  })
})
