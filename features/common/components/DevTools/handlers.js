import { resetCollections } from '../../../../datasources/localStorage/store'
import { RESET_DATA_CONFIRMATION } from './constants'

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

// Demo data in the browser never expires, so this is the way back to the seed
// short of clearing the site's data. A full load of `/planning` rather than a
// refetch: every cached query, and any open session, goes with the old data.
// Asks first: it sits one tap away from the links, and there is no undo.
export const createResetDataHandler = () => () => {
  if (!window.confirm(RESET_DATA_CONFIRMATION)) return

  resetCollections()
  window.location.assign('/planning')
}
