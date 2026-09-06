// The single switch for "which backend is this deployment talking to".
//
// Everything else derives from it: the base URL the browser calls
// (`config/index.js`), and the storage the API routes and `getServerSideProps`
// read (`datasources/index.js`). Before this existed the two were decided
// separately — `NEXT_PUBLIC_API_URL` for the browser and the mere presence of
// `JSON_SERVER_URL` for the server — so `/api/local` meant json-server in
// development and Redis in a preview, with nothing tying the two together.
export const DATA_SOURCES = {
  API: 'api',
  JSON_SERVER: 'json-server',
  MEMORY: 'memory',
  FIXTURES: 'fixtures',
}

// The URL namespace each self-hosted source answers on, so the path itself says
// which backend is behind it. `api` has none: that one is the real backend,
// living in its own repository.
export const API_NAMESPACE = {
  [DATA_SOURCES.JSON_SERVER]: 'local',
  [DATA_SOURCES.MEMORY]: 'demo',
  [DATA_SOURCES.FIXTURES]: 'test',
}

const SUPPORTED = Object.values(DATA_SOURCES)

// Unset means a plain Vercel deployment with no dashboard override, which is
// the demo. A value that is set but unrecognized is a typo, and since
// `NEXT_PUBLIC_*` is baked at build time, throwing here surfaces it during the
// build instead of as a confusing 500 at request time.
export const getDataSource = () => {
  const configured = (process.env.NEXT_PUBLIC_DATA_SOURCE ?? '').trim()

  if (!configured) return DATA_SOURCES.MEMORY

  if (!SUPPORTED.includes(configured)) {
    throw new Error(
      `Unknown NEXT_PUBLIC_DATA_SOURCE "${configured}". Expected one of: ${SUPPORTED.join(
        ', '
      )}.`
    )
  }

  return configured
}

export default getDataSource
