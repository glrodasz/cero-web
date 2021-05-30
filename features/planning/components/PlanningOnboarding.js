import PropTypes from 'prop-types'
import { Spacer, Heading } from '@glrodasz/components'

const PlanningOnboarding = ({ tasksLength, children }) => {
  return (
    <>
      {tasksLength == 0 && (
        <>
          <Spacer.Horizontal size="lg" />
          <Heading size="lg">
            Ahora dime, ¿cuál es la primera tarea en la que trabajarás hoy?
          </Heading>
        </>
      )}
      {children}
      {tasksLength === 1 && (
        <>
          <Spacer.Horizontal size="md" />
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
