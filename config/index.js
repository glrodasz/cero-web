import { API_NAMESPACE, DATA_SOURCES, getDataSource } from './dataSource'

// Where the browser sends its requests. This is derived from the data source
// rather than configured separately, so the URL and the storage behind it can
// never disagree.
//
// `api` is the only source that needs an explicit URL: it is the real backend,
// in its own repository. The self-hosted sources answer on this deployment's
// own `/api/<namespace>` routes — relative in the browser, absolute as a
// fallback for any other server-side caller. `getServerSideProps` needs
// neither: it reads storage directly through `features/*/queries.js` instead
// of fetching these API routes over HTTP.
const getApiUrl = () => {
  const dataSource = getDataSource()

  if (dataSource === DATA_SOURCES.API) {
    const externalApiUrl = process.env.NEXT_PUBLIC_API_URL

    if (!externalApiUrl) {
      throw new Error(
        'NEXT_PUBLIC_DATA_SOURCE is "api", so NEXT_PUBLIC_API_URL must point at the backend.'
      )
    }

    return externalApiUrl
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
