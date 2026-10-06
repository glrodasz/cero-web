// The single switch for "which backend is this deployment talking to" is
// `NEXT_PUBLIC_API_URL`: the frontend calls that API, and with none configured
// it falls back to the visitor's own browser.
//
// The data source is derived from it rather than configured next to it, so
// the URL the browser calls and the storage behind it can never disagree.
// Everything else reads the derived value: where requests go (`config/index.js`,
// `api/index.js`) and which store the API routes and `getServerSideProps` read
// (`datasources/index.js`). Before this existed the two were decided separately
// — the browser's URL by one variable and the server's store by the mere
// presence of `JSON_SERVER_URL` — so `/api/local` meant json-server in
// development and Redis in a preview, with nothing tying the two together.
export const DATA_SOURCES = {
  API: 'api',
  JSON_SERVER: 'json-server',
  LOCAL_STORAGE: 'local-storage',
  FIXTURES: 'fixtures',
}

// This app's own API routes, by the namespace in their path — the path itself
// says which store is behind it. `api` has none: that one is a backend living
// elsewhere. `local-storage` has none either: its data lives in the visitor's
// browser, where no route can reach it.
export const API_NAMESPACE = {
  [DATA_SOURCES.JSON_SERVER]: 'local',
  [DATA_SOURCES.FIXTURES]: 'test',
}

const OWN_API_PATH = /^\/api\/([^/?#]+)\/?$/

const findSourceByNamespace = (namespace) =>
  Object.keys(API_NAMESPACE).find(
    (dataSource) => API_NAMESPACE[dataSource] === namespace
  )

// `NEXT_PUBLIC_*` is baked at build time, so every throw here fails the build
// instead of surfacing as a confusing 500 at request time.
export const getDataSource = () => {
  if (process.env.NEXT_PUBLIC_DATA_SOURCE !== undefined) {
    // Retired rather than ignored: left in place, a `json-server` here would
    // quietly turn into the browser store.
    throw new Error(
      'NEXT_PUBLIC_DATA_SOURCE was removed. Set NEXT_PUBLIC_API_URL instead (`/api/local`, `/api/test` or a backend URL), or leave it unset for localStorage.'
    )
  }

  const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? '').trim()

  // Unset means a plain deployment with no dashboard config: the demo.
  if (!apiUrl) return DATA_SOURCES.LOCAL_STORAGE

  const [, namespace] = apiUrl.match(OWN_API_PATH) ?? []

  if (namespace === undefined) return DATA_SOURCES.API

  const dataSource = findSourceByNamespace(namespace)

  if (!dataSource) {
    throw new Error(
      `NEXT_PUBLIC_API_URL "${apiUrl}" names no API this app serves. Expected one of: ${Object.values(
        API_NAMESPACE
      )
        .map((name) => `/api/${name}`)
        .join(', ')}, a backend URL, or nothing for localStorage.`
    )
  }

  return dataSource
}

// Whether the data lives in the visitor's browser: the browser answers its own
// requests (`api/browserTransport.js`) instead of calling anything.
export const isBrowserDataSource = (dataSource = getDataSource()) =>
  dataSource === DATA_SOURCES.LOCAL_STORAGE

// Whether this app's own server holds the data, so its API routes and server
// rendering can read it. Otherwise — the browser store, or a backend living
// elsewhere — server rendering has nothing to prefetch and the page loads its
// data once it is in the browser.
export const isServerDataSource = (dataSource = getDataSource()) =>
  dataSource in API_NAMESPACE

export default getDataSource
