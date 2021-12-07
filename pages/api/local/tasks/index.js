import buildLocalApiUrl from '../../../../utils/buildLocalApiUrl'
import fetchJsonServer from '../../../../utils/fetchJsonServer'

export default function handler(req, res) {
  const { options } = buildLocalApiUrl(req)

  if (req.method === 'GET') {
    const url = `tasks?_sort=priority&_order=asc`
    fetchJsonServer({ resource: 'task', url, options, res })
  }

  // TODO: Make sure we just allow `maxInProgressTasks` in progress and then
  // the rest need to be in the backlog
  if (req.method === 'POST') {
    const { description } = req.body
    const fetchOptions = {
      ...options,
      body: { status: 'in-progress', priority: 0, description },
    }

    return fetchJsonServer({
      resource: 'task',
      url: `tasks`,
      options: fetchOptions,
      res,
    })
  }
}
