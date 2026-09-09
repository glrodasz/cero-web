export const createToggleDevToolsHandler =
  ({ showDialog, setShowDialog }) =>
  () => {
    setShowDialog(!showDialog)
  }

export const createCloseDevToolsHandler =
  ({ setShowDialog }) =>
  () => {
    setShowDialog(false)
  }
