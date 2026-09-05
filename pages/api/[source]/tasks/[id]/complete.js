import buildApiUrl from '../../../../../datasources/buildApiUrl'
import fetchResource from '../../../../../datasources'
import { COMPLETED_COLUMN_ID } from '../../../../../features/tasks/constants'
import withApiRoute from '../../../../../datasources/withApiRoute'

async function getCompletedTasks({ options }) {
  const fetchOptions = {
    ...options,
    method: 'get',
    body: undefined,
  }

  return fetchResource({
    resource: 'task',
    url: `tasks?status=${COMPLETED_COLUMN_ID}`,
    options: fetchOptions,
  })
}

async function updateCompletedTasksPriority({ tasks, options }) {
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

async function completeTask({ taskId, options, res }) {
  const fetchOptions = {
    ...options,
    body: { status: COMPLETED_COLUMN_ID, priority: 0 },
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
    const completedTasks = await getCompletedTasks({ options })
    await updateCompletedTasksPriority({ tasks: completedTasks, options })
    await completeTask({ taskId: req.query.id, options, res })
  }
}

export default withApiRoute(handler)
