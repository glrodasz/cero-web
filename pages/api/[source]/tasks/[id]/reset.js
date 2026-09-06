import buildApiUrl from '../../../../../datasources/buildApiUrl'
import fetchResource from '../../../../../datasources'
import { PENDING_COLUMN_ID } from '../../../../../features/tasks/constants'
import withApiRoute from '../../../../../datasources/withApiRoute'

async function getPendingTasks({ options }) {
  const fetchOptions = {
    ...options,
    method: 'get',
    body: undefined,
  }

  return fetchResource({
    resource: 'task',
    url: `tasks?status=${PENDING_COLUMN_ID}`,
    options: fetchOptions,
  })
}

async function updatePendingTasksPriority({ tasks, options }) {
  return await Promise.all(
    tasks.map(({ id, ...body }, index) => {
      const fetchOptions = {
        ...options,
        method: 'patch',
        body: { ...body, priority: index + 1 },
      }

      return fetchResource({
        resource: 'task',
        url: `tasks/${id}`,
        options: fetchOptions,
      })
    })
  )
}

async function resetTask({ taskId, options, res }) {
  const fetchOptions = {
    ...options,
    body: { status: PENDING_COLUMN_ID, priority: 0 },
  }
  return fetchResource({
    resource: 'task',
    url: `tasks/${taskId}`,
    options: fetchOptions,
    res,
  })
}

async function handler(req, res) {
  const { options } = buildApiUrl(req, res)

  if (req.method === 'PATCH') {
    const pendingTasks = await getPendingTasks({ options })
    await updatePendingTasksPriority({ tasks: pendingTasks, options })
    await resetTask({ taskId: req.query.id, options, res })
  }
}

export default withApiRoute(handler)
