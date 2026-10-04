import {
  getCollections,
  resetCollections,
} from '../../datasources/fixtures/store'
import {
  finishFocusSession,
  pauseFocusSession,
  resumeFocusSession,
  startFocusSession,
} from './commands'

const SESSION_ID = 'session-a'
const IN_PROGRESS_AND_PENDING_IDS = [2, 32, 33, 5, 6, 7]
const COMPLETED_ID = 1

const buildOptions = ({ method = 'PATCH', body } = {}) => ({
  sessionId: SESSION_ID,
  method,
  body,
})

const getTasks = async () => (await getCollections(SESSION_ID)).tasks

const start = () =>
  startFocusSession({ options: buildOptions({ method: 'POST' }) })

// Run against the real fixtures store rather than a mocked `fetchResource`, so
// these pin down what the commands do to the data — the same thing whether
// they're reached through an API route or `api/browserTransport.js`.
describe('[ features / focusSession / commands ]', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, NEXT_PUBLIC_DATA_SOURCE: 'fixtures' }
    resetCollections()
  })

  afterAll(() => {
    process.env = ORIGINAL_ENV
  })

  describe('startFocusSession', () => {
    it('should create an active session holding the open tasks', async () => {
      // Act
      const result = await start()

      // Assert
      expect(result.status).toBe(201)
      expect(result.body).toEqual(
        expect.objectContaining({
          status: 'active',
          startTime: expect.any(Number),
          tasks: IN_PROGRESS_AND_PENDING_IDS,
        })
      )
    })

    it('should attach the open tasks to it, and only those', async () => {
      // Act
      const { body } = await start()
      const tasks = await getTasks()

      // Assert
      expect(
        tasks
          .filter((task) => task.focusSessionId === body.id)
          .map((task) => task.id)
      ).toEqual(IN_PROGRESS_AND_PENDING_IDS)
      expect(
        tasks.find((task) => task.id === COMPLETED_ID).focusSessionId
      ).toBeUndefined()
    })
  })

  describe('finishFocusSession', () => {
    describe('when there is no active session', () => {
      it('should answer 404', async () => {
        // Act
        const result = await finishFocusSession({ options: buildOptions() })

        // Assert
        expect(result).toEqual({
          status: 404,
          body: { error: 'There is no active focus session' },
        })
      })
    })

    describe('when a session is active', () => {
      it('should finish it and detach its tasks', async () => {
        // Arrange
        await start()

        // Act
        const result = await finishFocusSession({ options: buildOptions() })
        const tasks = await getTasks()

        // Assert
        expect(result.status).toBe(200)
        expect(result.body.status).toBe('finished')
        expect(
          tasks
            .filter((task) => IN_PROGRESS_AND_PENDING_IDS.includes(task.id))
            .every((task) => task.focusSessionId === null)
        ).toBe(true)
      })
    })
  })

  describe('pauseFocusSession', () => {
    beforeEach(start)

    it('should open a pause', async () => {
      // Act
      const result = await pauseFocusSession({ options: buildOptions() })

      // Assert
      expect(result.status).toBe(200)
      expect(result.body.pauses).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          startTime: expect.any(Number),
          endTime: null,
        }),
      ])
    })

    it('should leave an open pause alone when given no length', async () => {
      // Arrange
      const { body: paused } = await pauseFocusSession({
        options: buildOptions(),
      })

      // Act
      const result = await pauseFocusSession({ options: buildOptions() })

      // Assert
      expect(result.body.pauses).toEqual(paused.pauses)
    })

    it('should close an open pause before opening one with a length', async () => {
      // Arrange
      await pauseFocusSession({ options: buildOptions() })

      // Act
      const result = await pauseFocusSession({
        options: buildOptions({ body: { time: '300000' } }),
      })

      // Assert
      expect(result.body.pauses).toEqual([
        expect.objectContaining({ endTime: expect.any(Number) }),
        expect.objectContaining({ endTime: null, time: 300000 }),
      ])
    })
  })

  describe('resumeFocusSession', () => {
    beforeEach(start)

    it('should close the open pause', async () => {
      // Arrange
      await pauseFocusSession({ options: buildOptions() })

      // Act
      const result = await resumeFocusSession({ options: buildOptions() })

      // Assert
      expect(result.status).toBe(200)
      expect(result.body.pauses).toEqual([
        expect.objectContaining({ endTime: expect.any(Number) }),
      ])
    })

    it('should answer the session unchanged when nothing is paused', async () => {
      // Act
      const result = await resumeFocusSession({ options: buildOptions() })

      // Assert
      expect(result.body).toEqual(expect.objectContaining({ status: 'active' }))
      expect(result.body.pauses).toBeUndefined()
    })
  })
})
