import buildLocalApiUrl from '../../../../utils/buildLocalApiUrl'
import fetchJsonServer from '../../../../utils/fetchJsonServer'

export default function handler(req, res) {
  const { options } = buildLocalApiUrl(req)

  if (req.method === 'GET') {
    const url = `focus-sessions?status=active`
    fetchJsonServer({
      resource: 'focus-sessions',
      url,
      options,
      res,
      singular: true,
    })
  }
}
