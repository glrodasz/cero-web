import buildLocalApiUrl from '../../../../utils/buildLocalApiUrl'
import fetchJsonServer from '../../../../utils/fetchJsonServer'

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

export async function resumeActiveFocusSession({
  activeFocusSession,
  options,
  res,
}) {
  const currentPauses = activeFocusSession.pauses ?? []

  const activePause = currentPauses.find((pause) => pause.endTime === null)
  const resumedPauses = currentPauses.filter((pause) => pause.endTime !== null)

  if (!activePause) {
    return res.status(200).json(activeFocusSession)
  }

  const pauseToResume = {
    ...activePause,
    endTime: Date.now(),
  }

  const fetchOptions = {
    ...options,
    body: { pauses: [...resumedPauses, pauseToResume] },
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
    await resumeActiveFocusSession({ activeFocusSession, options, res })
  }
}
