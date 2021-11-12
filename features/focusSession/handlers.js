import Router from 'next/router'

export const handleCheckCompleteTask = ({ breaktimeConfirmation }) => () => {
  const { setShowDialog } = breaktimeConfirmation
  setShowDialog(true)
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
