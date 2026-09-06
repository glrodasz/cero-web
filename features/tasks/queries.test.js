jest.mock('../../datasources', () => jest.fn())

import fetchResource from '../../datasources'
import { getInProgressAndPendingTasks, readTasks } from './queries'

const SESSION_ID = 'session-a'

describe('[ features / tasks / queries ]', () => {
  beforeEach(() => {
    fetchResource.mockReset()
  })

  describe('getInProgressAndPendingTasks', () => {
    it('should ask for in-progress and pending tasks', async () => {
      // Arrange
      fetchResource.mockResolvedValue([])

      // Act
      await getInProgressAndPendingTasks({ options: { sessionId: SESSION_ID } })

      // Assert
      expect(fetchResource).toHaveBeenCalledWith(
        expect.objectContaining({
          resource: 'task',
          url: 'tasks?status=in-progress&status=pending',
        })
      )
    })
  })

  describe('readTasks', () => {
    describe('when there is no active session', () => {
      it('should ask for the in-progress and pending tasks', async () => {
        // Arrange
        fetchResource.mockResolvedValueOnce({}).mockResolvedValueOnce([])

        // Act
        await readTasks({ sessionId: SESSION_ID })

        // Assert
        expect(fetchResource).toHaveBeenLastCalledWith(
          expect.objectContaining({
            url: 'tasks?_sort=priority&_order=asc&status_like=in-progress|pending',
          })
        )
      })
    })

    describe('when a session is active', () => {
      it('should ask for that session’s tasks', async () => {
        // Arrange
        fetchResource
          .mockResolvedValueOnce({ id: 7, status: 'active', startTime: 0 })
          .mockResolvedValueOnce([])

        // Act
        await readTasks({ sessionId: SESSION_ID })

        // Assert
        expect(fetchResource).toHaveBeenLastCalledWith(
          expect.objectContaining({
            url: 'tasks?_sort=priority&_order=asc&focusSessionId=7',
          })
        )
      })
    })

    it('should scope every read to the given session', async () => {
      // Arrange
      fetchResource.mockResolvedValueOnce({}).mockResolvedValueOnce([])

      // Act
      await readTasks({ sessionId: SESSION_ID })

      // Assert
      expect(fetchResource).toHaveBeenLastCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({ sessionId: SESSION_ID }),
        })
      )
    })
  })
})
