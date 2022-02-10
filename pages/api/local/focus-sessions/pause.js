import crypto from 'crypto'

import buildLocalApiUrl from '../../../../utils/buildLocalApiUrl'
import fetchJsonServer from '../../../../utils/fetchJsonServer'
import { resumeActiveFocusSession } from './resume'

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
    await pauseActiveFocusSession({ activeFocusSession, options, res })
  }
}
