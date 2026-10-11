import { MAXIMUM_IN_PRIORITY_TASKS } from '../../config'
import fetchResource from '../../datasources'
import { getActiveFocusSession } from '../focusSession/queries'
import {
  COMPLETED_COLUMN_ID,
  IN_PROGRESS_COLUMN_ID,
  PENDING_COLUMN_ID,
} from './constants'

// The writes behind this feature's API routes, with no `req` or `res` in
// sight: each takes the `options` `buildApiUrl` builds and answers
// `{ status, body }`. `pages/api/[source]/tasks/**` adapts HTTP to these, and
// `api/browserTransport.js` calls the very same functions when the data lives
// in the browser, so the two paths can't drift apart.

const getTasksWithStatus = ({ status, options }) =>
  fetchResource({
    resource: 'task',
    url: `tasks?status=${status}`,
    options: { ...options, method: 'get', body: undefined },
  })

const updateTask = ({ id, body, options }) =>
  fetchResource({
    resource: 'task',
    url: `tasks/${id}`,
    options: { ...options, method: 'patch', body },
  })

// Puts the task first in the `status` column (priority 0) and renumbers the
// tasks already there from 1, keeping their order.
const moveTaskToTopOfColumn = async ({ id, status, options }) => {
  const tasks = await getTasksWithStatus({ status, options })

  await Promise.all(
    tasks.map(({ id: taskId, ...body }, index) =>
      updateTask({
        id: taskId,
        body: { ...body, priority: index + 1 },
        options,
      })
    )
  )

  const task = await updateTask({ id, body: { status, priority: 0 }, options })

  return { status: 200, body: task }
}

export async function createTask({ options }) {
  const activeFocusSession = await getActiveFocusSession({ options })
  const inProgressTasks = await getTasksWithStatus({
    status: IN_PROGRESS_COLUMN_ID,
    options,
  })

  const status =
    inProgressTasks?.length >= MAXIMUM_IN_PRIORITY_TASKS
      ? PENDING_COLUMN_ID
      : IN_PROGRESS_COLUMN_ID

  const task = await fetchResource({
    resource: 'task',
    url: 'tasks',
    options: {
      ...options,
      method: 'post',
      body: {
        status,
        priority: 0,
        description: options.body?.description,
        focusSessionId: activeFocusSession?.id ?? null,
        createdAt: Date.now(),
      },
    },
  })

  return { status: 200, body: task }
}

export const completeTask = ({ id, options }) =>
  moveTaskToTopOfColumn({ id, status: COMPLETED_COLUMN_ID, options })

export const resetTask = ({ id, options }) =>
  moveTaskToTopOfColumn({ id, status: PENDING_COLUMN_ID, options })
