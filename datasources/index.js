import { DATA_SOURCES, getDataSource } from '../config/dataSource'
import handleFixturesRequest from './fixtures'
import fetchFromJsonServer from './jsonServer'
import handleMemoryRequest from './memory'

// Which storage answers a request — selected by the same `NEXT_PUBLIC_DATA_SOURCE`
// that `config/index.js` derives the browser's `API_URL` from, so the URL the
// browser calls and the store behind it can never drift apart.
//
// `api` is not served from here. That backend lives in its own repository, and
// nothing in this app talks to it yet: `getServerSideProps` reads storage
// directly rather than over HTTP, so it would land in whichever store this
// picked. Throwing keeps that a loud, obvious failure instead of a preview
// deployment quietly rendering demo seed data as if it were production.
const fetchStorage = ({ resource, url, options }) => {
  const dataSource = getDataSource()

  if (dataSource === DATA_SOURCES.API) {
    throw new Error(
      'The "api" data source is served by the external backend, which is not wired through this app yet.'
    )
  }

  if (dataSource === DATA_SOURCES.JSON_SERVER) {
    return fetchFromJsonServer({ resource, url, options })
  }

  const handleRequest =
    dataSource === DATA_SOURCES.FIXTURES
      ? handleFixturesRequest
      : handleMemoryRequest

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
