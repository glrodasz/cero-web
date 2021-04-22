import Router from 'next/router'

export const handleCheckCompleteTask = ({ breaktimeConfirmation }) => () => {
  breaktimeConfirmation.setShowDialog(true)
}

export const handleClickCloseBreaktime = ({ breaktimeConfirmation }) => () => {
  const { setShowDialog } = breaktimeConfirmation
  setShowDialog(false)
}

export const handleClickEndSession = ({ focusSessions, initialData }) => () => {
  focusSessions.api.finish({ id: initialData.activeFocusSession.id })
  Router.push('/planning')
}
