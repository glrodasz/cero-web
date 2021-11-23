const API_BASENAME = '/api/local/'

const buildLocalApiUrl = (req, fetchOptions = {}) => {
  const url = `${req.url.replace(API_BASENAME, '')}`

  const options = {
    method: req.method.toUpperCase(),
    body: req.method !== 'GET' ? req.body : undefined,
    ...fetchOptions,
  }

  return { url, options }
}

export default buildLocalApiUrl
