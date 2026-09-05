import createCollectionsHandler from '../collections'
import { getCollections, saveCollections } from './store'

// Integration tests: `NEXT_PUBLIC_DATA_SOURCE=fixtures` (see
// `datasources/index.js`), so `/api/test` answers from the committed arrays in
// this folder. It goes through the same CRUD as the demo store, so the routes
// and `getServerSideProps` behave identically -- only the data is fixed and
// the storage is per process.
const handleFixturesRequest = createCollectionsHandler({
  getCollections,
  saveCollections,
})

export default handleFixturesRequest
