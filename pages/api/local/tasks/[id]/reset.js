import buildLocalApiUrl from '../../../../../utils/buildLocalApiUrl'
import fetchJsonServer from '../../../../../utils/fetchJsonServer'

export default function handler(req, res) {
  // TODO: Make sure that is only in-progress if there is space (MAX 3)
  // if not it should be pending

  // TODO: Update priorities
  const fetchOptions = {
    body: { status: 'in-progress' },
  }

  const { options } = buildLocalApiUrl(req, fetchOptions)

  if (req.method === 'PATCH') {
    const url = `tasks/${req.query.id}`
    fetchJsonServer({ resource: 'task', url, options, res })
  }
}
