import buildLocalApiUrl from '../../../../utils/buildLocalApiUrl'
import fetchJsonServer from '../../../../utils/fetchJsonServer'

export default function handler(req, res) {
  const { options } = buildLocalApiUrl(req)

  if (req.method === 'GET') {
    const url = `tasks?_sort=priority&_order=asc`
    fetchJsonServer({ resource: 'task', url, options, res })
  }
}
