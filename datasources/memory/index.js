import createCollectionsHandler from '../collections'
import { getCollections, saveCollections } from './store'

// Preview deployments: `NEXT_PUBLIC_DATA_SOURCE=memory` (see
// `datasources/index.js`), so `/api/demo` reads and writes a per-session
// document in Upstash Redis, emulating the `json-server` REST and query subset
// the app uses.
const handleMemoryRequest = createCollectionsHandler({
  getCollections,
  saveCollections,
})

export default handleMemoryRequest
