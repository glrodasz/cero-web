import Router from 'next/router'
import httpCodes from '../../utils/httpCodes'

const finishAndLeave = async ({ focusSessions, feedback }) => {
  try {
    await focusSessions.api.finish({ feedback })
  } catch (error) {
    // Finishing answers 404 when there is no active session -- a second tab,
    // or a double click on the same button. The user asked to leave the
    // session and that is already true, so going to planning is still the
    // right outcome. Any other failure keeps them here, with their feedback,
    // and the footer says so.
    if (error?.status !== httpCodes.NOT_FOUND) return
  }

  Router.push('/planning')
}

export const createScoreHandler =
  ({ feedback }) =>
  ({ score }) => {
    feedback.setScore(score)
  }

export const createBlockersChangeHandler =
  ({ feedback }) =>
  (event) => {
    feedback.setBlockers(event.target.value)
  }

// A score is what makes it feedback: until one is chosen the button is
// disabled, with a hint saying why, and does nothing.
export const createRegisterSessionHandler =
  ({ focusSessions, feedback }) =>
  async () => {
    const { score, blockers } = feedback

    if (score === null) return

    await finishAndLeave({ focusSessions, feedback: { score, blockers } })
  }

export const createSkipRegisterSessionHandler =
  ({ focusSessions }) =>
  async () => {
    await finishAndLeave({ focusSessions })
  }
