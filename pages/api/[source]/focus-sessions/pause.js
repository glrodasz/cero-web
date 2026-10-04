import buildApiUrl from '../../../../datasources/buildApiUrl'
import withApiRoute from '../../../../datasources/withApiRoute'
import { pauseFocusSession } from '../../../../features/focusSession/commands'

async function handler(req, res) {
  const { options } = buildApiUrl(req, res)

  if (req.method === 'PATCH') {
    const { status, body } = await pauseFocusSession({ options })

    return res.status(status).json(body)
  }
}

export default withApiRoute(handler)
