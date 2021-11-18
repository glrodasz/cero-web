import Router from 'next/router'

export const handleCheckCompleteTask = ({ breaktimeConfirmation, tasks }) => ({
  id,
  isChecked,
}) => {
  const { setShowDialog } = breaktimeConfirmation
  isChecked && setShowDialog(true)
  tasks.api.updateStatus({ id, isChecked })
}

export const handleClickCloseBreaktimeConfirmation = ({
  breaktimeConfirmation,
}) => () => {
  const { setShowDialog } = breaktimeConfirmation
  setShowDialog(false)
}

export const handleClickCloseBreaktimeTimer = ({ breaktimeTimer }) => () => {
  const { setShowDialog } = breaktimeTimer
  setShowDialog(false)
}

export const handleClickChooseBreaktime = ({
  breaktimeTimer,
  breaktimeConfirmation,
}) => (time) => {
  breaktimeConfirmation.setShowDialog(false)
  breaktimeTimer.setShowDialog(true)
  breaktimeTimer.setTime(time)
}

export const handleClickEndSession = ({
  focusSessions,
  initialData,
}) => async () => {
  await focusSessions.api.finish({ id: initialData.activeFocusSession.id })
  Router.push('/planning')
}
