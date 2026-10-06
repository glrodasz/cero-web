import buildApiUrl from '../../../../../datasources/buildApiUrl'
import withApiRoute from '../../../../../datasources/withApiRoute'
import { resetTask } from '../../../../../features/tasks/commands'

async function handler(req, res) {
  const { options } = buildApiUrl(req, res)

  if (req.method === 'PATCH') {
    const { status, body } = await resetTask({ id: req.query.id, options })

    return res.status(status).json(body)
  }
}

export default withApiRoute(handler)
