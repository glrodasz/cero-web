import PropTypes from 'prop-types'
import { resetServerContext } from 'react-beautiful-dnd'

import PlanningContainer from '../features/planning/containers/PlanningContainer'

import { tasksApi, focusSessionsApi } from '../features/planning/api'

const HTTP_FOUND = 302

export async function getServerSideProps({ res }) {
  const tasks = await tasksApi.getAll()
  const [activeFocusSession] = await focusSessionsApi.getActives()

  // FIXME: Evaluate when this resetServerContext is necessary.
  resetServerContext()

  if (activeFocusSession) {
    res.statusCode = HTTP_FOUND
    res.setHeader('Location', '/focus-session')

    // TODO:
    // return { props: { tasks, activeFocusSession } }
    return { props: {} }
  }

  return { props: { tasks } }
}

function Planning({ tasks }) {
  // TODO: change initial data for an object
  return <PlanningContainer initialData={tasks} />
}

Planning.propTypes = {
  // FIXME: Don't be fucking lazy and put the shape
  tasks: PropTypes.array,
}

export default Planning
