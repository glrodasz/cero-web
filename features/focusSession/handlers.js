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

export const handleClickCloseBreaktimeModal = ({ breaktime }) => () => {
  const { setShowDialog } = breaktime
  setShowDialog(false)
}

export const handleClickChooseBreaktime = ({
  breaktime,
  breaktimeConfirmation,
}) => (time) => {
  breaktimeConfirmation.setShowDialog(false)
  breaktime.setShowDialog(true)
  breaktime.setTime(time)
}

export const handleClickEndSession = ({ focusSessions, initialData }) => () => {
  focusSessions.api.finish({ id: initialData.activeFocusSession.id })
  Router.push('/planning')
}
