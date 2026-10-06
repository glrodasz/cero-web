import PropTypes from 'prop-types'
import { withPageAuthRequired } from '../features/common/auth'
import FocusSessionContainer from '../features/focusSession/containers/FocusSession'
import useFocusSessionRedirect from '../features/focusSession/hooks/useFocusSessionRedirect'
import { resetServerContext } from 'react-beautiful-dnd'
import isEmpty from '../utils/isEmpty'
import { isServerDataSource } from '../config/dataSource'
import { getOrCreateSessionId } from '../datasources/session'
import { readActiveFocusSession } from '../features/focusSession/queries'
import { readTasks } from '../features/tasks/queries'
import httpCodes from '../utils/httpCodes'

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async ({ req, res }) => {
    resetServerContext()

    // Nothing here to read when the data lives in the browser or behind a
    // backend elsewhere: the page loads it and redirects on its own once it is
    // in the browser (`useFocusSessionRedirect`).
    if (!isServerDataSource()) return { props: {} }

    const sessionId = getOrCreateSessionId(req, res)
    const tasks = await readTasks({ sessionId })
    const activeFocusSession = await readActiveFocusSession({ sessionId })

    if (isEmpty(activeFocusSession)) {
      res.statusCode = httpCodes.FOUND
      res.setHeader('Location', '/planning')

      return { props: {} }
    }

    return { props: { tasks, activeFocusSession } }
  },
})

const FocusSession = ({ tasks, activeFocusSession }) => {
  const { isReady } = useFocusSessionRedirect({
    redirectWhenActive: false,
    to: '/planning',
  })

  // Held back until there is a session to show, so the chronometer never
  // starts from a missing one.
  if (!isReady) return null

  return <FocusSessionContainer initialData={{ tasks, activeFocusSession }} />
}

FocusSession.propTypes = {
  tasks: PropTypes.array,
  activeFocusSession: PropTypes.object,
}

export default FocusSession
