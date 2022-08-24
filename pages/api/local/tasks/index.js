import { MAXIMUN_IN_PRIORITY_TASKS } from '../../../../config'
import buildLocalApiUrl from '../../../../utils/buildLocalApiUrl'
import fetchJsonServer from '../../../../utils/fetchJsonServer'
import isEmpty from '../../../../utils/isEmpty'

async function getInProgressTasks({ options }) {
  const fetchOptions = {
    ...options,
    method: 'get',
    body: undefined,
  }

  return fetchJsonServer({
    resource: 'task',
    url: 'tasks?status=in-progress',
    options: fetchOptions,
  })
}

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

    let url = `tasks?_sort=priority&_order=asc&focusSessionId=${activeFocusSession?.id}`

    if (isEmpty(activeFocusSession)) {
      url = `tasks?_sort=priority&_order=asc&status_like=in-progress|pending`
    }

    fetchJsonServer({ resource: 'task', url, options, res })
  }

  if (req.method === 'POST') {
    const activeFocusSession = await getActiveFocusSession({ options })
    const inProgressTasks = await getInProgressTasks({ options })

    let status = 'in-progress'

    if (inProgressTasks?.length === MAXIMUN_IN_PRIORITY_TASKS) {
      status = 'pending'
    }

    const { description } = req.body
    const fetchOptions = {
      ...options,
      body: {
        status,
        priority: 0,
        description,
        focusSessionId: activeFocusSession.id,
        createdAt: Date.now(),
      },
    }

    return fetchJsonServer({
      resource: 'task',
      url: `tasks`,
      options: fetchOptions,
      res,
    })
  }
}
