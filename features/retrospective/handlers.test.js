import Router from 'next/router'
import {
  createBlockersChangeHandler,
  createRegisterSessionHandler,
  createScoreHandler,
  createSkipRegisterSessionHandler,
} from './handlers'

jest.mock('next/router', () => ({
  push: jest.fn(),
}))

const buildFocusSessions = (finish = jest.fn()) => ({ api: { finish } })

describe('[ features / retrospective / handlers ]', () => {
  beforeEach(() => {
    Router.push.mockClear()
  })

  describe('#createScoreHandler', () => {
    describe('when the returned function is called', () => {
      it('should call `setScore` with the chosen score', () => {
        // Arrange
        const feedback = { setScore: jest.fn() }

        // Act
        createScoreHandler({ feedback })({ score: 2.5 })

        // Assert
        expect(feedback.setScore).toHaveBeenCalledWith(2.5)
      })
    })
  })

  describe('#createBlockersChangeHandler', () => {
    describe('when the returned function is called', () => {
      it('should call `setBlockers` with the typed text', () => {
        // Arrange
        const feedback = { setBlockers: jest.fn() }
        const event = { target: { value: 'Reuniones' } }

        // Act
        createBlockersChangeHandler({ feedback })(event)

        // Assert
        expect(feedback.setBlockers).toHaveBeenCalledWith('Reuniones')
      })
    })
  })

  describe('#createRegisterSessionHandler', () => {
    describe('when no score has been chosen', () => {
      it('should neither finish the session nor navigate', async () => {
        // Arrange
        const focusSessions = buildFocusSessions()
        const feedback = { score: null, blockers: 'Ruido' }

        // Act
        await createRegisterSessionHandler({ focusSessions, feedback })()

        // Assert
        expect(focusSessions.api.finish).not.toHaveBeenCalled()
        expect(Router.push).not.toHaveBeenCalled()
      })
    })

    describe('when a score has been chosen', () => {
      it('should finish the session with the feedback and go to `/planning`', async () => {
        // Arrange
        const focusSessions = buildFocusSessions()
        const feedback = {
          score: 0,
          blockers: 'Ruido',
          setScore: () => {},
          setBlockers: () => {},
        }

        // Act
        await createRegisterSessionHandler({ focusSessions, feedback })()
        const expected = { feedback: { score: 0, blockers: 'Ruido' } }

        // Assert
        expect(focusSessions.api.finish).toHaveBeenCalledWith(expected)
        expect(Router.push).toHaveBeenCalledWith('/planning')
      })
    })

    describe('when finishing fails', () => {
      it('should still go to `/planning`', async () => {
        // Arrange
        jest.spyOn(console, 'error').mockImplementation(() => {})
        const focusSessions = buildFocusSessions(
          jest
            .fn()
            .mockRejectedValue(new Error('There is no active focus session'))
        )
        const feedback = { score: 5, blockers: '' }

        // Act
        await createRegisterSessionHandler({ focusSessions, feedback })()

        // Assert
        expect(Router.push).toHaveBeenCalledWith('/planning')

        console.error.mockRestore()
      })
    })
  })

  describe('#createSkipRegisterSessionHandler', () => {
    describe('when the returned function is called', () => {
      it('should finish the session without feedback and go to `/planning`', async () => {
        // Arrange
        const focusSessions = buildFocusSessions()

        // Act
        await createSkipRegisterSessionHandler({ focusSessions })()

        // Assert
        expect(focusSessions.api.finish).toHaveBeenCalledWith({
          feedback: undefined,
        })
        expect(Router.push).toHaveBeenCalledWith('/planning')
      })
    })
  })
})
