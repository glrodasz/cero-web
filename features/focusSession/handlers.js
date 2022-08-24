import Router from 'next/router'

export const handleCheckCompleteTask =
  ({ breaktimeConfirmation, tasks }) =>
  ({ id, isChecked }) => {
    const { setShowDialog } = breaktimeConfirmation
    isChecked && setShowDialog(true)
    tasks.api.updateStatus({ id, isChecked })
  }

export const handleClickCloseBreaktimeConfirmation =
  ({ breaktimeConfirmation }) =>
  () => {
    const { setShowDialog } = breaktimeConfirmation
    setShowDialog(false)
  }

export const handleClickCloseBreaktimeTimer =
  ({ breaktimeTimer, focusSession }) =>
  () => {
    const { setShowDialog } = breaktimeTimer
    setShowDialog(false)
    focusSession.api.resume()
  }

export const createPauseTimerHandlerClose =
  ({ pauseTimer, focusSession }) =>
  async () => {
    await focusSession.api.resume()
    pauseTimer.setShowDialog(false)
  }

export const handleClickChooseBreaktime =
  ({ breaktimeTimer, breaktimeConfirmation, focusSession }) =>
  (time) => {
    breaktimeConfirmation.setShowDialog(false)
    breaktimeTimer.setShowDialog(true)
    breaktimeTimer.setTime(time)
    focusSession.api.pause({ time })
  }

export const handleClickEndSession =
  ({ focusSessions }) =>
  async () => {
    await focusSessions.api.finish()
    Router.push('/planning')
  }

export const createHandlerClickChronometer =
  ({ isPaused, onPause }) =>
  async () => {
    onPause(isPaused)
  }

export const createHandlerPauseChronometer =
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
