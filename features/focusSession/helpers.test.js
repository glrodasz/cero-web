import dateNowMock from '../../utils/testUtils/dateNowMock'
import time from '../../utils/time'
import { getBarWidth, getChronometerStartTime, parseFeedback } from './helpers'

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

  describe('#parseFeedback', () => {
    describe('when no feedback is sent', () => {
      it('should return `null` feedback', () => {
        // Act
        const result = parseFeedback(undefined)
        const expected = { feedback: null }

        // Assert
        expect(result).toEqual(expected)
      })
    })

    describe('when the score is a known one', () => {
      it('should keep only the score and the trimmed blockers', () => {
        // Arrange
        const params = { score: 5, blockers: ' Ruido \n', extra: 'ignored' }

        // Act
        const result = parseFeedback(params)
        const expected = { feedback: { score: 5, blockers: 'Ruido' } }

        // Assert
        expect(result).toEqual(expected)
      })
    })

    describe('when the blockers are not a string', () => {
      it('should store them as empty', () => {
        // Arrange
        const params = { score: 0, blockers: { not: 'text' } }

        // Act
        const result = parseFeedback(params)
        const expected = { feedback: { score: 0, blockers: '' } }

        // Assert
        expect(result).toEqual(expected)
      })
    })

    describe('when the score is unknown', () => {
      it('should return an error', () => {
        // Arrange
        const params = { score: '5', blockers: '' }

        // Act
        const result = parseFeedback(params)

        // Assert
        expect(result).toEqual({ error: expect.any(String) })
      })
    })
  })
})
