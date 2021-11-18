import buildLocalApiUrl from '../../../../../utils/buildLocalApiUrl'
import fetchJsonServer from '../../../../../utils/fetchJsonServer'

export default function handler(req, res) {
  // TODO: Update priorities for all tasks in completed
  const fetchOptions = {
    body: { status: 'completed', priority: 0 },
  }

  const { options } = buildLocalApiUrl(req, fetchOptions)

  if (req.method === 'PATCH') {
    const url = `tasks/${req.query.id}`
    fetchJsonServer({ resource: 'task', url, options, res })
  }
}
