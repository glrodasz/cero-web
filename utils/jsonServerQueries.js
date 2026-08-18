import fetchJsonServer from './fetchJsonServer'
import {
  IN_PROGRESS_COLUMN_ID,
  PENDING_COLUMN_ID,
} from '../features/tasks/constants'
import { ACTIVE_FOCUS_SESSION_STATUS } from '../features/focusSession/constants'

export async function getActiveFocusSession({ options }) {
  const fetchOptions = {
    ...options,
    method: 'get',
    body: undefined,
  }

  return fetchJsonServer({
    resource: 'focus-sessions',
    url: `focus-sessions?status=${ACTIVE_FOCUS_SESSION_STATUS}`,
    options: fetchOptions,
    singular: true,
  })
}

export async function getInProgressAndPendingTasks({ options }) {
  const fetchOptions = {
    ...options,
    method: 'get',
    body: undefined,
  }

  return fetchJsonServer({
    resource: 'task',
    url: `tasks?status=${IN_PROGRESS_COLUMN_ID}&status=${PENDING_COLUMN_ID}`,
    options: fetchOptions,
  })
}
