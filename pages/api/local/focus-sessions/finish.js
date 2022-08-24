import buildLocalApiUrl from '../../../../utils/buildLocalApiUrl'
import fetchJsonServer from '../../../../utils/fetchJsonServer'

async function updateTasksFocusSessionIdToNull({ tasks, options }) {
  return await Promise.all(
    tasks.map(({ id, ...body }) => {
      const fetchOptions = {
        ...options,
        method: 'patch',
        body: { ...body, focusSessionId: null },
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

async function updateActiveFocusSession({ activeFocusSession, options, res }) {
  const fetchOptions = {
    ...options,
    body: { status: 'finished' },
  }

  return fetchJsonServer({
    resource: 'focus-sessions',
    url: `focus-sessions/${activeFocusSession.id}`,
    options: fetchOptions,
    res,
  })
}

export default async function handler(req, res) {
  const { options } = buildLocalApiUrl(req)

  if (req.method === 'PATCH') {
    const activeFocusSession = await getActiveFocusSession({ options })
    await updateActiveFocusSession({ activeFocusSession, options, res })

    const tasks = await getInProgressAndPedingTasks({ options })
    await updateTasksFocusSessionIdToNull({ tasks, options })
  }
}
