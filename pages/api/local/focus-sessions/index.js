import buildLocalApiUrl from '../../../../utils/buildLocalApiUrl'
import fetchJsonServer from '../../../../utils/fetchJsonServer'

export default function handler(req, res) {
  const { options } = buildLocalApiUrl(req)

  if (req.method === 'GET') {
    const url = `focus-sessions`
    fetchJsonServer({
      resource: 'focus-sessions',
      url,
      options,
      res,
      singular: true,
    })
  }

  if (req.method === 'POST') {
    const fetchOptions = {
      ...options,
      body: { status: 'active', startTime: Date.now() },
    }

    return fetchJsonServer({
      resource: 'focus-sessions',
      url: `focus-sessions`,
      options: fetchOptions,
      res,
    })
  }
}
