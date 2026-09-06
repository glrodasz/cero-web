import { API_URL } from '../config'

// The body of a failed response comes in more than one shape: the app's own
// routes answer with `{ error: 'message' }`, while the hosting platform
// answers a crashed or timed out function with `{ error: { code, message } }`.
// Passing the latter straight to `new Error()` collapses it into the useless
// "[object Object]", which hides the only clue about what actually failed.
const getErrorMessage = ({ data, resource, response }) => {
  const error = data?.error ?? data?.message

  if (typeof error === 'string' && error) return error

  if (error && typeof error === 'object') {
    const details = [error.code, error.message].filter(Boolean).join(': ')

    if (details) return details
  }

  return `Request to "${resource}" failed with status ${response.status}`
}

class Request {
  constructor(resource, baseUrl) {
    this.resource = resource
    this.baseUrl = baseUrl
  }

  fetch(resource = this.resource, options = {}) {
    const method = options.method ? options.method.toUpperCase() : 'GET'
    const requestOptions = { ...options, method }

    requestOptions.headers = new Headers({
      'Content-Type': 'application/json',
      ...options.headers,
    })

    if (options.body) {
      requestOptions.body = JSON.stringify(options.body)
    }

    const baseUrl = this.baseUrl ?? API_URL

    return fetch(`${baseUrl}/${resource}`, requestOptions).then(
      async (response) => {
        const data = await response.json().catch(() => null)

        // A failed request still returns a well formed JSON body
        // (`{ error }`, see `datasources/index.js`), so it has to be
        // checked explicitly — otherwise it gets treated as real data and
        // breaks whatever consumes it several layers downstream, hiding the
        // actual error.
        if (!response.ok) {
          throw new Error(getErrorMessage({ data, resource, response }))
        }

        return data
      }
    )
  }
}

export default Request
