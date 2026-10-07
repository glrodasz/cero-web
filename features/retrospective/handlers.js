import Router from 'next/router'

const finishAndLeave = async ({ focusSessions, feedback }) => {
  try {
    await focusSessions.api.finish({ feedback })
  } catch (error) {
    // Finishing answers 404 when there is no active session -- a second tab,
    // or a double click on the same button. The user asked to leave the
    // session and that is already true, so the navigation below is still the
    // right outcome. Letting this reject would strand them on a dead session
    // with no way out.
    console.error('[retrospective] could not finish the session', error)
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

// A score is what makes it feedback: until one is chosen the button stays
// muted and does nothing.
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
