import PropTypes from 'prop-types'
import { resetServerContext } from 'react-beautiful-dnd'
import { withPageAuthRequired } from '../features/common/auth'

import PlanningContainer from '../features/planning/containers/Planning'
import useFocusSessionRedirect from '../features/focusSession/hooks/useFocusSessionRedirect'
import isEmpty from '../utils/isEmpty'
import { isBrowserDataSource } from '../config/dataSource'
import { getOrCreateSessionId } from '../datasources/session'
import { readActiveFocusSession } from '../features/focusSession/queries'
import { readTasks } from '../features/tasks/queries'
import httpCodes from '../utils/httpCodes'

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async ({ req, res }) => {
    resetServerContext()

    // Nothing here to read: the browser loads the data and redirects on its
    // own (`useFocusSessionRedirect`).
    if (isBrowserDataSource()) return { props: {} }

    const sessionId = getOrCreateSessionId(req, res)
    const activeFocusSession = await readActiveFocusSession({ sessionId })

    if (!isEmpty(activeFocusSession)) {
      res.statusCode = httpCodes.FOUND
      res.setHeader('Location', '/focus-session')
      return { props: {} }
    }

    const tasks = await readTasks({ sessionId })
    return { props: { tasks } }
  },
})

function Planning({ tasks }) {
  const { isReady } = useFocusSessionRedirect({
    redirectWhenActive: true,
    to: '/focus-session',
  })

  if (!isReady) return null

  return <PlanningContainer initialData={{ tasks }} />
}

Planning.propTypes = {
  tasks: PropTypes.array,
}

export default Planning
