import Router from 'next/router'

export const createCheckCompleteTaskHandler =
  ({ breaktimeConfirmation, tasks }) =>
  ({ id, isChecked }) => {
    const { setShowDialog } = breaktimeConfirmation
    isChecked && setShowDialog(true)
    tasks.api.updateStatus({ id, isChecked })
  }

export const createCloseBreaktimeConfirmationHandler =
  ({ breaktimeConfirmation }) =>
  () => {
    const { setShowDialog } = breaktimeConfirmation
    setShowDialog(false)
  }

export const createCloseBreaktimeTimerHandler =
  ({ breaktimeTimer, focusSession }) =>
  () => {
    const { setShowDialog } = breaktimeTimer
    setShowDialog(false)
    focusSession.api.resume()
  }

export const createClosePauseTimerHandler =
  ({ pauseTimer, focusSession }) =>
  async () => {
    await focusSession.api.resume()
    pauseTimer.setShowDialog(false)
  }

export const createChooseBreaktimeHandler =
  ({ breaktimeTimer, breaktimeConfirmation, focusSession }) =>
  (time) => {
    breaktimeConfirmation.setShowDialog(false)
    breaktimeTimer.setShowDialog(true)
    breaktimeTimer.setTime(time)
    focusSession.api.pause({ time })
  }

export const createEndSessionHandler =
  ({ focusSessions }) =>
  async () => {
    await focusSessions.api.finish()
    Router.push('/planning')
  }

export const createClickChronometerHandler =
  ({ isPaused, onPause }) =>
  async () => {
    onPause(isPaused)
  }

export const createPauseChronometerHandler =
  ({ focusSession, pauseTimer, clearTime }) =>
  async (isPaused) => {
    if (isPaused) {
      await focusSession.api.resume()
    } else {
      pauseTimer.setShowDialog(true)
      await focusSession.api.pause()
      clearTime()
    }
  }
