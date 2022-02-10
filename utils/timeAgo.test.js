import time from './time'
import timeAgo from './timeAgo'
import dateNowMock from './testUtils/dateNowMock'

Date.now = dateNowMock()

describe('[ utils / timeAgo ]', () => {
  describe('when the `timestamp` is a zero seconds ago', () => {
    it('should return `hace 0 segundos`', () => {
      // Arrange
      const timestamp = Date.now()

      // Act
      const result = timeAgo(timestamp)
      const expected = 'hace 0 segundos'

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when the `timestamp` is a second ago', () => {
    it('should return `hace 1 segundo`', () => {
      // Arrange
      const timestamp = Date.now() - time.ONE_SECOND_IN_MS

      // Act
      const result = timeAgo(timestamp)
      const expected = 'hace 1 segundo'

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when the `timestamp` is a minute', () => {
    it('should return `hace 1 minuto`', () => {
      // Arrange
      const timestamp = Date.now() - time.ONE_MINUTE_IN_MS

      // Act
      const result = timeAgo(timestamp)
      const expected = 'hace 1 minuto'

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when the `timestamp` is an hour ago', () => {
    it('should return `hace 1 hora`', () => {
      // Arrange
      const timestamp = Date.now() - time.ONE_HOUR_IN_MS

      // Act
      const result = timeAgo(timestamp)
      const expected = 'hace 1 hora'

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when the `timestamp` is a day ago', () => {
    it('should return `hace 1 día`', () => {
      // Arrange
      const timestamp = Date.now() - time.ONE_DAY_IN_MS

      // Act
      const result = timeAgo(timestamp)
      const expected = 'hace 1 día'

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when the `timestamp` is 2 days ago and `locale` is `en-US`', () => {
    it('should return `2 days ago`', () => {
      // Arrange
      const timestamp = Date.now() - time.ONE_DAY_IN_MS * 2
      const locale = 'en-US'

      // Actz
      const result = timeAgo(timestamp, locale)
      const expected = '2 days ago'

      // Assert
      expect(result).toBe(expected)
    })
  })
})
