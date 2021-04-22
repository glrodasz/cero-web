import PropTypes from 'prop-types'
import FocusSessionContainer from '../features/focusSession/containers/FocusSession'
import { resetServerContext } from 'react-beautiful-dnd'

import { tasksApi, focusSessionsApi } from '../features/planning/api'

const HTTP_FOUND = 302

export async function getServerSideProps({ res }) {
  resetServerContext()

  const tasks = await tasksApi.getAll()
  const [activeFocusSession] = await focusSessionsApi.getActives()

  if (!activeFocusSession) {
    res.statusCode = HTTP_FOUND
    res.setHeader('Location', '/planning')

    return { props: {} }
  }

  return { props: { tasks, activeFocusSession } }
}

const FocusSession = ({ tasks, activeFocusSession }) => {
  return <FocusSessionContainer initialData={{ tasks, activeFocusSession }} />
}

FocusSession.propTypes = {
  tasks: PropTypes.array,
  activeFocusSession: PropTypes.object,
}

export default FocusSession
