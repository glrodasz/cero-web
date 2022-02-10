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

async function updateActiveFocusSession({ activeFocusSession, options, res }) {
  const fetchOptions = {
    ...options,
    body: { status: 'finished' },
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
    await updateActiveFocusSession({ activeFocusSession, options, res })
  }
}
