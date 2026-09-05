import { MAXIMUM_IN_PRIORITY_TASKS } from '../../../../config'
import buildApiUrl from '../../../../datasources/buildApiUrl'
import fetchResource from '../../../../datasources'
import { getActiveFocusSession } from '../../../../features/focusSession/queries'
import { readTasks } from '../../../../features/tasks/queries'
import withApiRoute from '../../../../datasources/withApiRoute'
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

  return fetchResource({
    resource: 'task',
    url: `tasks?status=${IN_PROGRESS_COLUMN_ID}`,
    options: fetchOptions,
  })
}

async function handler(req, res) {
  const { options } = buildApiUrl(req, res)

  if (req.method === 'GET') {
    const tasks = await readTasks({ sessionId: options.sessionId })

    return res.status(200).json(tasks)
  }

  if (req.method === 'POST') {
    const activeFocusSession = await getActiveFocusSession({ options })
    const inProgressTasks = await getInProgressTasks({ options })

    let status = IN_PROGRESS_COLUMN_ID

    if (inProgressTasks?.length >= MAXIMUM_IN_PRIORITY_TASKS) {
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

    return fetchResource({
      resource: 'task',
      url: `tasks`,
      options: fetchOptions,
      res,
    })
  }
}

export default withApiRoute(handler)
