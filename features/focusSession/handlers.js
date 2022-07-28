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
  ({ isPlaying, toggle, onPause }) =>
  async () => {
    onPause(isPlaying)
    toggle()
  }

export const createHandlerPauseChronometer =
  ({ focusSession, clearTime }) =>
  async (isPlaying) => {
    if (isPlaying) {
      await focusSession.api.resume()
    } else {
      await focusSession.api.pause()
      clearTime()
    }
  }
