import fetchResource from '../../datasources'
import isEmpty from '../../utils/isEmpty'
import { getInProgressAndPendingTasks } from '../tasks/queries'
import {
  ACTIVE_FOCUS_SESSION_STATUS,
  FINISHED_FOCUS_SESSION_STATUS,
} from './constants'
import { getActiveFocusSession } from './queries'

// The writes behind this feature's API routes, with no `req` or `res` in
// sight: each takes the `options` `buildApiUrl` builds and answers
// `{ status, body }`. `pages/api/[source]/focus-sessions/**` adapts HTTP to
// these, and `api/browserTransport.js` calls the very same functions when the
// data lives in the browser, so the two paths can't drift apart.
//
// Every step throws on failure rather than answering, so a failed write stops
// the command where it happened — e.g. finishing never goes on to detach tasks
// from a session that was never actually marked finished.

const updateFocusSession = ({ id, body, options }) =>
  fetchResource({
    resource: 'focus-sessions',
    url: `focus-sessions/${id}`,
    options: { ...options, method: 'patch', body },
  })

const setTasksFocusSessionId = ({ tasks, focusSessionId, options }) =>
  Promise.all(
    tasks.map(({ id, ...body }) =>
      fetchResource({
        resource: 'task',
        url: `tasks/${id}`,
        options: {
          ...options,
          method: 'patch',
          body: { ...body, focusSessionId },
        },
      })
    )
  )

const getActivePause = (pauses) =>
  pauses.find((pause) => pause.endTime === null)

const resumeActivePause = async ({ activeFocusSession, options }) => {
  const pauses = activeFocusSession.pauses ?? []
  const activePause = getActivePause(pauses)

  if (!activePause) return activeFocusSession

  const resumedPauses = pauses.filter((pause) => pause.endTime !== null)

  return updateFocusSession({
    id: activeFocusSession.id,
    body: {
      pauses: [...resumedPauses, { ...activePause, endTime: Date.now() }],
    },
    options,
  })
}

export async function startFocusSession({ options }) {
  const tasks = await getInProgressAndPendingTasks({ options })

  const focusSession = await fetchResource({
    resource: 'focus-sessions',
    url: 'focus-sessions',
    options: {
      ...options,
      method: 'post',
      body: {
        status: ACTIVE_FOCUS_SESSION_STATUS,
        startTime: Date.now(),
        tasks: tasks.map((task) => task.id),
      },
    },
  })

  await setTasksFocusSessionId({
    tasks,
    focusSessionId: focusSession.id,
    options,
  })

  return { status: 201, body: focusSession }
}

export async function finishFocusSession({ options }) {
  const activeFocusSession = await getActiveFocusSession({ options })

  if (isEmpty(activeFocusSession)) {
    return { status: 404, body: { error: 'There is no active focus session' } }
  }

  const finishedFocusSession = await updateFocusSession({
    id: activeFocusSession.id,
    body: { status: FINISHED_FOCUS_SESSION_STATUS },
    options,
  })

  const tasks = await getInProgressAndPendingTasks({ options })
  await setTasksFocusSessionId({ tasks, focusSessionId: null, options })

  return { status: 200, body: finishedFocusSession }
}

export async function pauseFocusSession({ options }) {
  const { time } = options.body ?? {}
  const activeFocusSession = await getActiveFocusSession({ options })
  let currentPauses = activeFocusSession.pauses ?? []
  const activePause = getActivePause(currentPauses)

  if (activePause && !time) {
    return { status: 200, body: activeFocusSession }
  }

  // A pause with a set length replaces an open one, so that one is closed
  // first.
  if (activePause) {
    const { pauses } = await resumeActivePause({ activeFocusSession, options })
    currentPauses = pauses
  }

  const newPause = {
    id: crypto.randomUUID(),
    startTime: Date.now(),
    endTime: null,
    time: time ? Number(time) : undefined,
  }

  const focusSession = await updateFocusSession({
    id: activeFocusSession.id,
    body: { pauses: [...currentPauses, newPause] },
    options,
  })

  return { status: 200, body: focusSession }
}

export async function resumeFocusSession({ options }) {
  const activeFocusSession = await getActiveFocusSession({ options })
  const focusSession = await resumeActivePause({ activeFocusSession, options })

  return { status: 200, body: focusSession }
}
