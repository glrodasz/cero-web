const API_BASENAME = '/api/local/'

const buildLocalApiUrl = (req, fetchOptions = {}) => {
  const url = `${req.url.replace(API_BASENAME, '')}`
  // https://fetch.spec.whatwg.org/#methods
  const normalizedMethod = req.method.toUpperCase()

  const options = {
    method: normalizedMethod,
    body: normalizedMethod !== 'GET' ? req.body : undefined,
    ...fetchOptions,
  }

  return { url, options }
}

export default buildLocalApiUrl
