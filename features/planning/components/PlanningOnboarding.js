import PropTypes from 'prop-types'
import { Spacer, Heading } from '@glrodasz/components'

const PlanningOnboarding = ({ tasksLength, children }) => {
  return (
    <>
      {tasksLength == 0 && (
        <>
          <Spacer.Vertical size="lg" />
          <Heading size="lg">
            ¿Cuál es la primera tarea en la que trabajarás hoy?
          </Heading>
        </>
      )}
      {children}
      {tasksLength === 1 && (
        <>
          <Spacer.Vertical size="md" />
          <Heading size="lg">
            Continúa listando las demás tareas de tu día...
          </Heading>
        </>
      )}
    </>
  )
}

PlanningOnboarding.propTypes = {
  children: PropTypes.node.isRequired,
  tasksLength: PropTypes.number,
}

export default PlanningOnboarding
