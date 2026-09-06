import buildApiUrl from '../../../../datasources/buildApiUrl'
import fetchResource from '../../../../datasources'
import { getInProgressAndPendingTasks } from '../../../../features/tasks/queries'
import { ACTIVE_FOCUS_SESSION_STATUS } from '../../../../features/focusSession/constants'
import withApiRoute from '../../../../datasources/withApiRoute'

async function updateTasksFocusSessionId({ tasks, focusSessionId, options }) {
  return await Promise.all(
    tasks.map(({ id, ...body }) => {
      const fetchOptions = {
        ...options,
        method: 'patch',
        body: { ...body, focusSessionId },
      }

      return fetchResource({
        resource: 'task',
        url: `tasks/${id}`,
        options: fetchOptions,
      })
    })
  )
}

async function handler(req, res) {
  const { options } = buildApiUrl(req, res)

  if (req.method === 'GET') {
    const url = `focus-sessions`

    return fetchResource({
      resource: 'focus-sessions',
      url,
      options,
      res,
    })
  }

  if (req.method === 'POST') {
    const tasks = await getInProgressAndPendingTasks({ options })

    const fetchOptions = {
      ...options,
      body: {
        status: ACTIVE_FOCUS_SESSION_STATUS,
        startTime: Date.now(),
        tasks: tasks.map((task) => task.id),
      },
    }

    const focusSession = await fetchResource({
      resource: 'focus-sessions',
      url: `focus-sessions`,
      options: fetchOptions,
    })

    const focusSessionId = focusSession.id
    await updateTasksFocusSessionId({ tasks, focusSessionId, options })

    return res.status(201).json(focusSession)
  }
}

export default withApiRoute(handler)
