import PropTypes from 'prop-types'
import { resetServerContext } from 'react-beautiful-dnd'

import PlanningContainer from '../features/planning/containers/Planning'
import { tasksApi, focusSessionsApi } from '../features/planning/api'
import isEmpty from '../utils/isEmpty'

const HTTP_FOUND = 302

export async function getServerSideProps({ res }) {
  resetServerContext()

  const activeFocusSession = await focusSessionsApi.getActive()

  if (!isEmpty(activeFocusSession)) {
    res.statusCode = HTTP_FOUND
    res.setHeader('Location', '/focus-session')
    return { props: {} }
  }

  const tasks = await tasksApi.getAll()
  return { props: { tasks } }
}

function Planning({ tasks }) {
  return <PlanningContainer initialData={{ tasks }} />
}

Planning.propTypes = {
  tasks: PropTypes.array,
}

export default Planning
