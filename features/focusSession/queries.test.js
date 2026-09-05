jest.mock('../../datasources', () => jest.fn())

import fetchResource from '../../datasources'
import { getActiveFocusSession, readActiveFocusSession } from './queries'

const SESSION_ID = 'session-a'

describe('[ features / focusSession / queries ]', () => {
  beforeEach(() => {
    fetchResource.mockReset()
  })

  describe('getActiveFocusSession', () => {
    it('should ask for the active focus session, singular', async () => {
      // Arrange
      fetchResource.mockResolvedValue({})

      // Act
      await getActiveFocusSession({ options: { sessionId: SESSION_ID } })

      // Assert
      expect(fetchResource).toHaveBeenCalledWith(
        expect.objectContaining({
          resource: 'focus-sessions',
          url: 'focus-sessions?status=active',
          singular: true,
        })
      )
    })
  })

  describe('readActiveFocusSession', () => {
    describe('when there is no active session', () => {
      it('should return an empty object', async () => {
        // Arrange
        fetchResource.mockResolvedValue({})

        // Act & Assert
        await expect(
          readActiveFocusSession({ sessionId: SESSION_ID })
        ).resolves.toEqual({})
      })
    })

    describe('when the session has finished pauses', () => {
      it('should push `startTime` forward by the paused time', async () => {
        // Arrange
        fetchResource.mockResolvedValue({
          id: 1,
          status: 'active',
          startTime: 1000,
          pauses: [{ startTime: 2000, endTime: 2500 }],
        })

        // Act
        const result = await readActiveFocusSession({ sessionId: SESSION_ID })

        // Assert
        expect(result.startTime).toBe(1500)
      })
    })

    describe('when a pause is still open', () => {
      it('should not count it', async () => {
        // Arrange
        fetchResource.mockResolvedValue({
          id: 1,
          status: 'active',
          startTime: 1000,
          pauses: [
            { startTime: 2000, endTime: 2500 },
            { startTime: 3000, endTime: null },
          ],
        })

        // Act
        const result = await readActiveFocusSession({ sessionId: SESSION_ID })

        // Assert
        expect(result.startTime).toBe(1500)
      })
    })
  })
})
