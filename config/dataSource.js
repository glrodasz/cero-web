// The single switch for "which backend is this deployment talking to".
//
// Everything else derives from it: where the browser sends its requests
// (`config/index.js`, `api/index.js`), and the storage the API routes and
// `getServerSideProps` read (`datasources/index.js`). Before this existed the
// two were decided separately — `NEXT_PUBLIC_API_URL` for the browser and the
// mere presence of `JSON_SERVER_URL` for the server — so `/api/local` meant
// json-server in development and Redis in a preview, with nothing tying the two
// together.
export const DATA_SOURCES = {
  API: 'api',
  JSON_SERVER: 'json-server',
  LOCAL_STORAGE: 'local-storage',
  FIXTURES: 'fixtures',
}

// The URL namespace each source served by this app's API routes answers on, so
// the path itself says which backend is behind it. `api` has none: that one is
// the real backend, living in its own repository. `local-storage` has none
// either: its data lives in the visitor's browser, where no route can reach it.
export const API_NAMESPACE = {
  [DATA_SOURCES.JSON_SERVER]: 'local',
  [DATA_SOURCES.FIXTURES]: 'test',
}

const SUPPORTED = Object.values(DATA_SOURCES)

// Unset means a plain Vercel deployment with no dashboard override, which is
// the demo. A value that is set but unrecognized is a typo, and since
// `NEXT_PUBLIC_*` is baked at build time, throwing here surfaces it during the
// build instead of as a confusing 500 at request time.
export const getDataSource = () => {
  const configured = (process.env.NEXT_PUBLIC_DATA_SOURCE ?? '').trim()

  if (!configured) return DATA_SOURCES.LOCAL_STORAGE

  if (!SUPPORTED.includes(configured)) {
    throw new Error(
      `Unknown NEXT_PUBLIC_DATA_SOURCE "${configured}". Expected one of: ${SUPPORTED.join(
        ', '
      )}.`
    )
  }

  return configured
}

// Whether the data lives in the visitor's browser. Nothing on the server can
// read it, so server rendering has nothing to prefetch and the browser answers
// its own requests (`api/browserTransport.js`) instead of calling a route.
export const isBrowserDataSource = (dataSource = getDataSource()) =>
  dataSource === DATA_SOURCES.LOCAL_STORAGE

export default getDataSource
