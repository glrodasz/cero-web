import PropTypes from 'prop-types'
import { Button } from '@glrodasz/components'

const PlanningFooter = ({ tasksLength, onClickStartSession }) => {
  if (tasksLength >= 1) {
    return (
      <Button onClick={onClickStartSession} isDisabled type="primary">
        Empieza ahora
      </Button>
    )
  }

  return null
}

PlanningFooter.propTypes = {
  onClickStartSession: PropTypes.func.isRequired,
  tasksLength: PropTypes.number,
}

export default PlanningFooter
