import buildLocalApiUrl from '../../../../utils/buildLocalApiUrl'
import fetchJsonServer from '../../../../utils/fetchJsonServer'
import isEmpty from '../../../../utils/isEmpty'

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

function getTotalPauseTime(totalPauseTime, pause) {
  if (pause.endTime != null) {
    const pauseTime = pause.endTime - pause.startTime
    return totalPauseTime + pauseTime
  }
  return totalPauseTime
}

function getActiveFocusSessionWithPauseTime({ activeFocusSession, res }) {
  const currentPauses = activeFocusSession?.pauses ?? []
  const totalPauseTime = currentPauses.reduce(getTotalPauseTime, 0)

  const calculatedActiveFocusSession = {
    ...activeFocusSession,
    startTime: activeFocusSession.startTime + totalPauseTime,
  }

  res.status(200).json(calculatedActiveFocusSession)
}

export default async function handler(req, res) {
  const { options } = buildLocalApiUrl(req)

  if (req.method === 'GET') {
    const activeFocusSession = await getActiveFocusSession({ options })
    if (isEmpty(activeFocusSession)) {
      res.status(200).json({})
    } else {
      getActiveFocusSessionWithPauseTime({ activeFocusSession, res })
    }
  }
}
