import buildLocalApiUrl from '../../../../utils/buildLocalApiUrl'
import fetchJsonServer from '../../../../utils/fetchJsonServer'

async function updateTasksFocusSessionId({ tasks, focusSessionId, options }) {
  return await Promise.all(
    tasks.map(({ id, ...body }) => {
      const fetchOptions = {
        ...options,
        method: 'patch',
        body: { ...body, focusSessionId },
      }

      return fetchJsonServer({
        resource: 'task',
        url: `tasks/${id}`,
        options: fetchOptions,
      })
    })
  )
}

async function getInProgressAndPedingTasks({ options }) {
  const fetchOptions = {
    ...options,
    method: 'get',
    body: undefined,
  }

  return fetchJsonServer({
    resource: 'task',
    url: 'tasks?status=in-progress&status=pending',
    options: fetchOptions,
  })
}

export default async function handler(req, res) {
  const { options } = buildLocalApiUrl(req)

  if (req.method === 'GET') {
    const url = `focus-sessions`
    fetchJsonServer({
      resource: 'focus-sessions',
      url,
      options,
      res,
    })
  }

  if (req.method === 'POST') {
    const tasks = await getInProgressAndPedingTasks({ options })

    const fetchOptions = {
      ...options,
      body: {
        status: 'active',
        startTime: Date.now(),
        tasks: tasks.map((task) => task.id),
      },
    }

    const focusSession = await fetchJsonServer({
      resource: 'focus-sessions',
      url: `focus-sessions`,
      options: fetchOptions,
    })

    const focusSessionId = focusSession.id
    await updateTasksFocusSessionId({ tasks, focusSessionId, options })

    return res.status(201).json(focusSession)
  }
}
