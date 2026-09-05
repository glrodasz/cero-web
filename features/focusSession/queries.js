import fetchResource from '../../datasources'
import isEmpty from '../../utils/isEmpty'
import { ACTIVE_FOCUS_SESSION_STATUS } from './constants'

// Server-side reads of this feature's domain data. Shared by `getServerSideProps`
// (`pages/focus-session.js`, `pages/planning.js`) and the matching
// `/api/local/focus-sessions/*` routes, so both paths stay in sync.

export async function getActiveFocusSession({ options }) {
  const fetchOptions = {
    ...options,
    method: 'get',
    body: undefined,
  }

  return fetchResource({
    resource: 'focus-sessions',
    url: `focus-sessions?status=${ACTIVE_FOCUS_SESSION_STATUS}`,
    options: fetchOptions,
    singular: true,
  })
}

const getTotalPauseTime = (totalPauseTime, pause) =>
  pause.endTime == null
    ? totalPauseTime
    : totalPauseTime + (pause.endTime - pause.startTime)

export async function readActiveFocusSession({ sessionId }) {
  const options = { sessionId, method: 'get', body: undefined }
  const activeFocusSession = await getActiveFocusSession({ options })

  if (isEmpty(activeFocusSession)) return {}

  const pauses = activeFocusSession.pauses ?? []

  return {
    ...activeFocusSession,
    startTime:
      activeFocusSession.startTime + pauses.reduce(getTotalPauseTime, 0),
  }
}
