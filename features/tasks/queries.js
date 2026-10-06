import fetchResource from '../../datasources'
import isEmpty from '../../utils/isEmpty'
import { getActiveFocusSession } from '../focusSession/queries'
import { IN_PROGRESS_COLUMN_ID, PENDING_COLUMN_ID } from './constants'

// Reads of this feature's domain data. Shared by `getServerSideProps`
// (`pages/focus-session.js`, `pages/planning.js`), the matching
// `pages/api/[source]/tasks/*` routes and the commands, so every path stays in
// sync — including `api/browserTransport.js`, which runs them in the browser
// when the data lives there.

export async function getInProgressAndPendingTasks({ options }) {
  const fetchOptions = {
    ...options,
    method: 'get',
    body: undefined,
  }

  return fetchResource({
    resource: 'task',
    url: `tasks?status=${IN_PROGRESS_COLUMN_ID}&status=${PENDING_COLUMN_ID}`,
    options: fetchOptions,
  })
}

export async function readTasks({ sessionId }) {
  const options = { sessionId, method: 'get', body: undefined }
  const activeFocusSession = await getActiveFocusSession({ options })

  const url = isEmpty(activeFocusSession)
    ? `tasks?_sort=priority&_order=asc&status_like=${IN_PROGRESS_COLUMN_ID}|${PENDING_COLUMN_ID}`
    : `tasks?_sort=priority&_order=asc&focusSessionId=${activeFocusSession.id}`

  return fetchResource({ resource: 'task', url, options })
}
