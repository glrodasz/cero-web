import buildLocalApiUrl from '../../../../../utils/buildLocalApiUrl'
import fetchJsonServer from '../../../../../utils/fetchJsonServer'

export default function handler(req, res) {
  const { options } = buildLocalApiUrl(req)

  if (req.method === 'GET') {
    const url = `tasks/${req.query.id}`
    fetchJsonServer({ resource: 'task', url, options, res })
  }

  if (req.method === 'DELETE') {
    const url = `tasks/${req.query.id}`
    fetchJsonServer({ resource: 'task', url, options, res })
  }
}
