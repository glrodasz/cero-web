import PropTypes from 'prop-types'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import FocusSessionContainer from '../features/focusSession/containers/FocusSession'
import { resetServerContext } from 'react-beautiful-dnd'
import isEmpty from '../utils/isEmpty'
import httpCodes from '../utils/httpCodes'

import { tasksApi, focusSessionsApi } from '../features/planning/api'

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async ({ res }) => {
    resetServerContext()

    const tasks = await tasksApi.getAll()
    const activeFocusSession = await focusSessionsApi.getActive()

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
