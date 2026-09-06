import PropTypes from 'prop-types'
import { withPageAuthRequired } from '../features/common/auth'
import FocusSessionContainer from '../features/focusSession/containers/FocusSession'
import { resetServerContext } from 'react-beautiful-dnd'
import isEmpty from '../utils/isEmpty'
import { getOrCreateSessionId } from '../datasources/session'
import { readActiveFocusSession } from '../features/focusSession/queries'
import { readTasks } from '../features/tasks/queries'
import httpCodes from '../utils/httpCodes'

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async ({ req, res }) => {
    resetServerContext()

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
  return <FocusSessionContainer initialData={{ tasks, activeFocusSession }} />
}

FocusSession.propTypes = {
  tasks: PropTypes.array,
  activeFocusSession: PropTypes.object,
}

export default FocusSession
