import PropTypes from 'prop-types'
import { Spacer, Paragraph } from '@glrodasz/components'

const PlanningMethodology = ({ tasksLength }) => {
  if (tasksLength >= 1) {
    return (
      <>
        <Spacer.Vertical size="lg" />
        <Paragraph size="sm" isCentered>
          Basados en la matriz de Eisenhower priorizamos tus tareas evitando
          listas de pendientes saturadas.
        </Paragraph>
      </>
    )
  }

  return null
}

PlanningMethodology.propTypes = {
  tasksLength: PropTypes.number,
}

export default PlanningMethodology
