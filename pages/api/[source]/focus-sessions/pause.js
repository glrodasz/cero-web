import crypto from 'crypto'

import buildApiUrl from '../../../../datasources/buildApiUrl'
import fetchResource from '../../../../datasources'
import { resumeActiveFocusSession } from './resume'
import { getActiveFocusSession } from '../../../../features/focusSession/queries'
import withApiRoute from '../../../../datasources/withApiRoute'

async function pauseActiveFocusSession({ activeFocusSession, options, res }) {
  const { time } = options.body
  let currentPauses = activeFocusSession.pauses ?? []
  const activePause = currentPauses.find((pause) => pause.endTime === null)

  if (activePause && time) {
    const { pauses } = await resumeActiveFocusSession({
      activeFocusSession,
      options,
    })
    currentPauses = pauses
  } else if (activePause) {
    return res.status(200).json(activeFocusSession)
  }

  const newPause = {
    id: crypto.randomUUID(),
    startTime: Date.now(),
    endTime: null,
    time: time ? Number(time) : undefined,
  }

  const fetchOptions = {
    ...options,
    body: { pauses: [...currentPauses, newPause] },
  }

  return fetchResource({
    resource: 'focus-sessions',
    url: `focus-sessions/${activeFocusSession.id}`,
    options: fetchOptions,
    res,
  })
}

async function handler(req, res) {
  const { options } = buildApiUrl(req, res)

  if (req.method === 'PATCH') {
    const activeFocusSession = await getActiveFocusSession({ options })
    await pauseActiveFocusSession({ activeFocusSession, options, res })
  }
}

export default withApiRoute(handler)
