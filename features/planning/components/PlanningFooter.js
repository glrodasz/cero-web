import PropTypes from 'prop-types'
import { Button, Paragraph, Spacer } from '@glrodasz/components'

const noop = () => {}

const PlanningFooter = ({
  tasksLength,
  isStarting,
  hasStartError,
  onClickStartSession,
}) => {
  if (tasksLength >= 1) {
    return (
      <>
        <Button
          onClick={isStarting ? noop : onClickStartSession}
          type="primary"
          isDisabled={isStarting}
        >
          {isStarting ? 'Empezando…' : 'Empieza ahora'}
        </Button>
        {hasStartError && (
          <div role="alert">
            <Spacer.Vertical size="xs" />
            <Paragraph size="sm" color="primary" isCentered>
              No pudimos empezar la sesión. Inténtalo de nuevo.
            </Paragraph>
          </div>
        )}
      </>
    )
  }

  return null
}

PlanningFooter.propTypes = {
  onClickStartSession: PropTypes.func.isRequired,
  tasksLength: PropTypes.number,
  isStarting: PropTypes.bool,
  hasStartError: PropTypes.bool,
}

PlanningFooter.defaultProps = {
  isStarting: false,
  hasStartError: false,
}

export default PlanningFooter
