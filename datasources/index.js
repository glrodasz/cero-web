import { DATA_SOURCES, getDataSource } from '../config/dataSource'
import handleFixturesRequest from './fixtures'
import fetchFromJsonServer from './jsonServer'
import handleLocalStorageRequest from './localStorage'

// Which storage answers a request — derived from the same `NEXT_PUBLIC_API_URL`
// the browser calls (`config/dataSource.js`), so the URL and the store behind
// it can never drift apart.
//
// `api` is not served from here: that backend lives elsewhere and the browser
// calls it directly, while server rendering skips its read. Anything that
// still lands here for it throws, a loud failure instead of a deployment
// configured for a real backend quietly reading a local store.
//
// `local-storage` is only ever reached from the browser, through
// `api/browserTransport.js`. Asked from the server, its store throws for the
// same reason: there is nothing there to read.
const fetchStorage = ({ resource, url, options }) => {
  const dataSource = getDataSource()

  if (dataSource === DATA_SOURCES.API) {
    throw new Error(
      'The "api" data source is served by the backend at NEXT_PUBLIC_API_URL, not by this app.'
    )
  }

  if (dataSource === DATA_SOURCES.JSON_SERVER) {
    return fetchFromJsonServer({ resource, url, options })
  }

  const handleRequest =
    dataSource === DATA_SOURCES.FIXTURES
      ? handleFixturesRequest
      : handleLocalStorageRequest

  return handleRequest({ sessionId: options?.sessionId, url, options })
}

const fetchResource = async ({
  resource,
  url,
  options,
  res,
  singular = false,
}) => {
  try {
    let result = await fetchStorage({ resource, url, options })

    if (singular && Array.isArray(result)) {
      result = result[0] ?? {}
    }

    return res ? res.status(200).json(result) : Promise.resolve(result)
  } catch (error) {
    // Without this, the only trace of a storage failure is a confusing
    // downstream crash several layers away (a non-array where an array was
    // expected) — logging here puts the real cause in Vercel's Function Logs.
    console.error('[datasources]', resource, url, error)

    return res
      ? res.status(500).json({ error: error.message })
      : Promise.reject(error)
  }
}

export default fetchResource
