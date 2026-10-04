jest.mock('../../config', () => ({ MAXIMUM_IN_PRIORITY_TASKS: 3 }))

import {
  getCollections,
  resetCollections,
  saveCollections,
} from '../../datasources/fixtures/store'
import { completeTask, createTask, resetTask } from './commands'

const SESSION_ID = 'session-a'

const buildOptions = ({ method, body } = {}) => ({
  sessionId: SESSION_ID,
  method,
  body,
})

const findTask = async (id) => {
  const { tasks } = await getCollections(SESSION_ID)

  return tasks.find((task) => task.id === id)
}

// Run against the real fixtures store rather than a mocked `fetchResource`, so
// these pin down what the commands do to the data — the same thing whether
// they're reached through an API route or `api/browserTransport.js`.
describe('[ features / tasks / commands ]', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, NEXT_PUBLIC_DATA_SOURCE: 'fixtures' }
    resetCollections()
  })

  afterAll(() => {
    process.env = ORIGINAL_ENV
  })

  describe('createTask', () => {
    describe('when the in-progress column is full', () => {
      it('should add the task to pending', async () => {
        // Act
        const result = await createTask({
          options: buildOptions({
            method: 'POST',
            body: { description: 'New task' },
          }),
        })

        // Assert
        expect(result.status).toBe(200)
        expect(result.body).toEqual(
          expect.objectContaining({
            description: 'New task',
            status: 'pending',
            priority: 0,
            focusSessionId: null,
            createdAt: expect.any(Number),
          })
        )
        expect(await findTask(result.body.id)).toEqual(result.body)
      })
    })

    describe('when the in-progress column has room', () => {
      it('should add the task to in-progress', async () => {
        // Arrange
        await completeTask({
          id: 2,
          options: buildOptions({ method: 'PATCH' }),
        })

        // Act
        const result = await createTask({
          options: buildOptions({
            method: 'POST',
            body: { description: 'New task' },
          }),
        })

        // Assert
        expect(result.body.status).toBe('in-progress')
      })
    })

    describe('when a focus session is active', () => {
      it('should attach the task to it', async () => {
        // Arrange
        const collections = await getCollections(SESSION_ID)
        collections['focus-sessions'].push({ id: 9, status: 'active' })
        await saveCollections(SESSION_ID, collections)

        // Act
        const result = await createTask({
          options: buildOptions({
            method: 'POST',
            body: { description: 'New task' },
          }),
        })

        // Assert
        expect(result.body.focusSessionId).toBe(9)
      })
    })
  })

  describe('completeTask', () => {
    it('should put the task first among the completed ones', async () => {
      // Act
      const result = await completeTask({
        id: 2,
        options: buildOptions({ method: 'PATCH' }),
      })

      // Assert
      expect(result.status).toBe(200)
      expect(result.body).toEqual(
        expect.objectContaining({ id: 2, status: 'completed', priority: 0 })
      )
      expect(await findTask(1)).toEqual(
        expect.objectContaining({ status: 'completed', priority: 1 })
      )
    })
  })

  describe('resetTask', () => {
    it('should put the task first among the pending ones', async () => {
      // Act
      const result = await resetTask({
        id: 1,
        options: buildOptions({ method: 'PATCH' }),
      })

      // Assert
      expect(result.status).toBe(200)
      expect(result.body).toEqual(
        expect.objectContaining({ id: 1, status: 'pending', priority: 0 })
      )
      expect(
        await Promise.all([findTask(5), findTask(6), findTask(7)])
      ).toEqual([
        expect.objectContaining({ priority: 1 }),
        expect.objectContaining({ priority: 2 }),
        expect.objectContaining({ priority: 3 }),
      ])
    })
  })
})
