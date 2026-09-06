import { getOrCreateSessionId } from './session'

// The routes live under a `[source]` segment (`/api/local`, `/api/demo`), so the
// namespace is matched rather than hardcoded — only the resource and its query
// string are meaningful to a data source.
const API_BASENAME = /^\/api\/[^/]+\//

const buildApiUrl = (req, res, fetchOptions = {}) => {
  const url = `${req.url.replace(API_BASENAME, '')}`
  // https://fetch.spec.whatwg.org/#methods
  const normalizedMethod = req.method.toUpperCase()

  const options = {
    method: normalizedMethod,
    body: normalizedMethod !== 'GET' ? req.body : undefined,
    // Every handler spreads `options` into its data source calls, so carrying
    // the session here reaches the whole route surface. The key is ignored when
    // `json-server` is in use.
    sessionId: getOrCreateSessionId(req, res),
    ...fetchOptions,
  }

  return { url, options }
}

export default buildApiUrl
