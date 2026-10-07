import PropTypes from 'prop-types'
import { withPageAuthRequired } from '../features/common/auth'
import RetrospectiveContainer from '../features/retrospective/containers/Retrospective'
import useFocusSessionRedirect from '../features/focusSession/hooks/useFocusSessionRedirect'
import isEmpty from '../utils/isEmpty'
import { isServerDataSource } from '../config/dataSource'
import { getOrCreateSessionId } from '../datasources/session'
import { readActiveFocusSession } from '../features/focusSession/queries'
import { readTasks } from '../features/tasks/queries'
import httpCodes from '../utils/httpCodes'

// The retrospective closes the active focus session, so without one there is
// nothing to look back on: like the focus session itself, it sends the user
// back to planning.
export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async ({ req, res }) => {
    // Nothing here to read when the data lives in the browser or behind a
    // backend elsewhere: the page loads it and redirects on its own once it is
    // in the browser (`useFocusSessionRedirect`).
    if (!isServerDataSource()) return { props: {} }

    const sessionId = getOrCreateSessionId(req, res)
    const activeFocusSession = await readActiveFocusSession({ sessionId })

    if (isEmpty(activeFocusSession)) {
      res.statusCode = httpCodes.FOUND
      res.setHeader('Location', '/planning')

      return { props: {} }
    }

    const tasks = await readTasks({ sessionId })

    return { props: { tasks } }
  },
})

const Retrospective = ({ tasks }) => {
  const { isReady } = useFocusSessionRedirect({
    redirectWhenActive: false,
    to: '/planning',
  })

  if (!isReady) return null

  return <RetrospectiveContainer initialData={{ tasks }} />
}

Retrospective.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
  ),
}

export default Retrospective
