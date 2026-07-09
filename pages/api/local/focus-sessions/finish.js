import buildLocalApiUrl from '../../../../utils/buildLocalApiUrl'
import fetchJsonServer from '../../../../utils/fetchJsonServer'
import isEmpty from '../../../../utils/isEmpty'
import {
  getActiveFocusSession,
  getInProgressAndPendingTasks,
} from '../../../../utils/jsonServerQueries'
import { FINISHED_FOCUS_SESSION_STATUS } from '../../../../features/focusSession/constants'

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

async function updateActiveFocusSession({ activeFocusSession, options, res }) {
  const fetchOptions = {
    ...options,
    body: { status: FINISHED_FOCUS_SESSION_STATUS },
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

    if (isEmpty(activeFocusSession)) {
      return res.status(404).json({ error: 'There is no active focus session' })
    }

    await updateActiveFocusSession({ activeFocusSession, options, res })

    const tasks = await getInProgressAndPendingTasks({ options })
    await updateTasksFocusSessionIdToNull({ tasks, options })
  }
}
