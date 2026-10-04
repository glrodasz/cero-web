import createCollectionsHandler from '../collections'
import { getCollections, saveCollections } from './store'

// Demo deployments: `NEXT_PUBLIC_DATA_SOURCE=local-storage` (see
// `datasources/index.js`), so every read and write lands in the visitor's own
// browser. Requests never leave it: `api/browserTransport.js` runs the same
// commands the API routes would, and they reach storage through here.
const handleLocalStorageRequest = createCollectionsHandler({
  getCollections,
  saveCollections,
})

export default handleLocalStorageRequest
