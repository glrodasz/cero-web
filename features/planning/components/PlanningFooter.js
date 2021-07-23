import PropTypes from 'prop-types'
import { Spacer, Paragraph, Button } from '@glrodasz/components'

const PlanningFooter = ({ tasksLength, onClickStartSession }) => {
  if (!!tasksLength >= 1) {
    return (
      <>
        <Spacer.Vertical size="lg" />
        <Paragraph size="sm">
          Basados en la matriz de Eisenhower priorizamos tus tareas evitando
          listas de pendientes saturadas.
        </Paragraph>
        <Spacer.Vertical size="sm" />
        <Button onClick={onClickStartSession} isDisabled type="primary">
          Empieza ahora
        </Button>
      </>
    )
  }

  return null
}

PlanningFooter.propTypes = {
  onClickStartSession: PropTypes.func.isRequired,
  tasksLength: PropTypes.number,
}

export default PlanningFooter
