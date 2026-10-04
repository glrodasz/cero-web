import buildApiUrl from '../../../../datasources/buildApiUrl'
import withApiRoute from '../../../../datasources/withApiRoute'
import { createTask } from '../../../../features/tasks/commands'
import { readTasks } from '../../../../features/tasks/queries'

async function handler(req, res) {
  const { options } = buildApiUrl(req, res)

  if (req.method === 'GET') {
    const tasks = await readTasks({ sessionId: options.sessionId })

    return res.status(200).json(tasks)
  }

  if (req.method === 'POST') {
    const { status, body } = await createTask({ options })

    return res.status(status).json(body)
  }
}

export default withApiRoute(handler)
