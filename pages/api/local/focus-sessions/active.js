import buildLocalApiUrl from '../../../../utils/buildLocalApiUrl'
import isEmpty from '../../../../utils/isEmpty'
import { getActiveFocusSession } from '../../../../utils/jsonServerQueries'

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
