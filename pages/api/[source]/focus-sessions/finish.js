import buildApiUrl from '../../../../datasources/buildApiUrl'
import fetchResource from '../../../../datasources'
import isEmpty from '../../../../utils/isEmpty'
import { getActiveFocusSession } from '../../../../features/focusSession/queries'
import { getInProgressAndPendingTasks } from '../../../../features/tasks/queries'
import { FINISHED_FOCUS_SESSION_STATUS } from '../../../../features/focusSession/constants'
import withApiRoute from '../../../../datasources/withApiRoute'

async function updateTasksFocusSessionIdToNull({ tasks, options }) {
  return await Promise.all(
    tasks.map(({ id, ...body }) => {
      const fetchOptions = {
        ...options,
        method: 'patch',
        body: { ...body, focusSessionId: null },
      }

      return fetchResource({
        resource: 'task',
        url: `tasks/${id}`,
        options: fetchOptions,
      })
    })
  )
}

async function updateActiveFocusSession({ activeFocusSession, options }) {
  const fetchOptions = {
    ...options,
    body: { status: FINISHED_FOCUS_SESSION_STATUS },
  }

  return fetchResource({
    resource: 'focus-sessions',
    url: `focus-sessions/${activeFocusSession.id}`,
    options: fetchOptions,
  })
}

async function handler(req, res) {
  const { options } = buildApiUrl(req, res)

  if (req.method === 'PATCH') {
    const activeFocusSession = await getActiveFocusSession({ options })

    if (isEmpty(activeFocusSession)) {
      return res.status(404).json({ error: 'There is no active focus session' })
    }

    // Not passed `res` here: a data source call writes the response and
    // resolves even on failure when `res` is passed, so a failed update would
    // silently let the steps below detach tasks from a session that was never
    // actually marked finished. Left to throw, a failure now stops the
    // handler here and `withApiRoute` reports it — the response is sent
    // once, at the end, after every step has actually succeeded.
    const finishedFocusSession = await updateActiveFocusSession({
      activeFocusSession,
      options,
    })

    const tasks = await getInProgressAndPendingTasks({ options })
    await updateTasksFocusSessionIdToNull({ tasks, options })

    return res.status(200).json(finishedFocusSession)
  }
}

export default withApiRoute(handler)
