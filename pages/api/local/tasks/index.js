import buildLocalApiUrl from '../../../../utils/buildLocalApiUrl'
import fetchJsonServer from '../../../../utils/fetchJsonServer'
import isEmpty from '../../../../utils/isEmpty'

async function getActiveFocusSession({ options }) {
  const fetchOptions = {
    ...options,
    method: 'get',
    body: undefined,
  }

  return fetchJsonServer({
    resource: 'focus-sessions',
    url: 'focus-sessions?status=active',
    options: fetchOptions,
    singular: true,
  })
}

export default async function handler(req, res) {
  const { options } = buildLocalApiUrl(req)

  if (req.method === 'GET') {
    const activeFocusSession = await getActiveFocusSession({ options })

    let url = `tasks?_sort=priority&_order=asc`

    if (isEmpty(activeFocusSession)) {
      url = `tasks?_sort=priority&_order=asc&status_like=in-progress|pending`
    }

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
