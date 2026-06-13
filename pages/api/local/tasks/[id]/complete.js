import buildLocalApiUrl from '../../../../../utils/buildLocalApiUrl'
import fetchJsonServer from '../../../../../utils/fetchJsonServer'
import { COMPLETED_COLUMN_ID } from '../../../../../features/tasks/constants'

async function getCompletedTasks({ options }) {
  const fetchOptions = {
    ...options,
    method: 'get',
    body: undefined,
  }

  return fetchJsonServer({
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

      return fetchJsonServer({
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

  return fetchJsonServer({
    resource: 'task',
    url: `tasks/${taskId}`,
    options: fetchOptions,
    res,
  })
}

export default async function handler(req, res) {
  const { options } = buildLocalApiUrl(req)

  if (req.method === 'PATCH') {
    const completedTasks = await getCompletedTasks({ options })
    await updateCompletedTasksPriority({ tasks: completedTasks, options })
    await completeTask({ taskId: req.query.id, options, res })
  }
}
