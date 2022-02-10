import buildLocalApiUrl from '../../../../../utils/buildLocalApiUrl'
import fetchJsonServer from '../../../../../utils/fetchJsonServer'

async function getPendingTasks({ options }) {
  const fetchOptions = {
    ...options,
    method: 'get',
    body: undefined,
  }

  return fetchJsonServer({
    resource: 'task',
    url: 'tasks?status=pending',
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

      return fetchJsonServer({
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
    body: { status: 'pending', priority: 0 },
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
    const pendingTasks = await getPendingTasks({ options })
    await updatePendingTasksPriority({ tasks: pendingTasks, options })
    await resetTask({ taskId: req.query.id, options, res })
  }
}
