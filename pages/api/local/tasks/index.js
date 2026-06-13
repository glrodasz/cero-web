import { MAXIMUM_IN_PRIORITY_TASKS } from '../../../../config'
import buildLocalApiUrl from '../../../../utils/buildLocalApiUrl'
import fetchJsonServer from '../../../../utils/fetchJsonServer'
import isEmpty from '../../../../utils/isEmpty'
import { getActiveFocusSession } from '../../../../utils/jsonServerQueries'
import {
  IN_PROGRESS_COLUMN_ID,
  PENDING_COLUMN_ID,
} from '../../../../features/tasks/constants'

async function getInProgressTasks({ options }) {
  const fetchOptions = {
    ...options,
    method: 'get',
    body: undefined,
  }

  return fetchJsonServer({
    resource: 'task',
    url: `tasks?status=${IN_PROGRESS_COLUMN_ID}`,
    options: fetchOptions,
  })
}

export default async function handler(req, res) {
  const { options } = buildLocalApiUrl(req)

  if (req.method === 'GET') {
    const activeFocusSession = await getActiveFocusSession({ options })

    let url = `tasks?_sort=priority&_order=asc&focusSessionId=${activeFocusSession?.id}`

    if (isEmpty(activeFocusSession)) {
      url = `tasks?_sort=priority&_order=asc&status_like=${IN_PROGRESS_COLUMN_ID}|${PENDING_COLUMN_ID}`
    }

    fetchJsonServer({ resource: 'task', url, options, res })
  }

  if (req.method === 'POST') {
    const activeFocusSession = await getActiveFocusSession({ options })
    const inProgressTasks = await getInProgressTasks({ options })

    let status = IN_PROGRESS_COLUMN_ID

    if (inProgressTasks?.length === MAXIMUM_IN_PRIORITY_TASKS) {
      status = PENDING_COLUMN_ID
    }

    const { description } = req.body
    const fetchOptions = {
      ...options,
      body: {
        status,
        priority: 0,
        description,
        focusSessionId: activeFocusSession?.id ?? null,
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
