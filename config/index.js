import {
  API_NAMESPACE,
  DATA_SOURCES,
  getDataSource,
  isBrowserDataSource,
} from './dataSource'

// Where the browser sends its requests: `NEXT_PUBLIC_API_URL`, the one switch
// `config/dataSource.js` derives everything else from.
//
// A backend living elsewhere is called at its URL as configured. This app's
// own routes (`/api/local`, `/api/test`) are relative in the browser, and
// absolute as a fallback for any other server-side caller. `getServerSideProps`
// needs neither: it reads storage directly through `features/*/queries.js`
// instead of fetching these API routes over HTTP.
//
// `null` means there is nothing to call: with no URL configured the data lives
// in the browser, which answers its own requests (`api/browserTransport.js`).
const getApiUrl = () => {
  const dataSource = getDataSource()

  if (isBrowserDataSource(dataSource)) return null

  if (dataSource === DATA_SOURCES.API) {
    return process.env.NEXT_PUBLIC_API_URL.trim()
  }

  const pathname = `/api/${API_NAMESPACE[dataSource]}`

  if (typeof window !== 'undefined') return pathname

  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}${pathname}`
    : `http://localhost:3000${pathname}`
}

export const API_URL = getApiUrl()
export const MAXIMUM_IN_PRIORITY_TASKS = Number(
  process.env.NEXT_PUBLIC_MAXIMUM_IN_PRIORITY_TASKS ??
    process.env.NEXT_PUBLIC_MAXIMUN_IN_PRIORITY_TASKS
)
export const MAXIMUM_BACKLOG_QUANTITY = Number(
  process.env.NEXT_PUBLIC_MAXIMUM_BACKLOG_QUANTITY
)
