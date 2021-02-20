import FocusSessionContainer from '../features/focusSession/containers/FocusSessionContainer'
import { resetServerContext } from 'react-beautiful-dnd'

import { tasksApi, focusSessionsApi } from '../features/planning/api'

const HTTP_FOUND = 302

export async function getServerSideProps({ res }) {
  const tasks = await tasksApi.getAll()
  const [activeFocusSession] = await focusSessionsApi.getActives()

  // FIXME: Evaluate when this resetServerContext is necessary.
  resetServerContext()

  if (!activeFocusSession) {
    res.statusCode = HTTP_FOUND
    res.setHeader('Location', '/planning')

    // TODO:
    // return { props: { tasks, activeFocusSession } }
    return { props: {} }
  }

  return { props: { tasks, activeFocusSession } }
}

const FocusSession = ({ tasks, activeFocusSessiom }) => {
  return <FocusSessionContainer initialData={{ tasks, activeFocusSessiom }} />
}

export default FocusSession
