import PropTypes from 'prop-types'
import { resetServerContext } from 'react-beautiful-dnd'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

import PlanningContainer from '../features/planning/containers/Planning'
import { tasksApi, focusSessionsApi } from '../features/planning/api'
import isEmpty from '../utils/isEmpty'
import httpCodes from '../utils/httpCodes'

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async ({ res }) => {
    resetServerContext()

    const activeFocusSession = await focusSessionsApi.getActive()

    if (!isEmpty(activeFocusSession)) {
      res.statusCode = httpCodes.FOUND
      res.setHeader('Location', '/focus-session')
      return { props: {} }
    }

    const tasks = await tasksApi.getAll()
    return { props: { tasks } }
  },
})

function Planning({ tasks }) {
  return <PlanningContainer initialData={{ tasks }} />
}

Planning.propTypes = {
  tasks: PropTypes.array,
}

export default Planning
