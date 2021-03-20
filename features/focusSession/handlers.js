export const handleClickCloseBreaktime = ({ breaktimeConfirmation }) => () => {
  const { setShowDialog } = breaktimeConfirmation
  setShowDialog(false)
}
