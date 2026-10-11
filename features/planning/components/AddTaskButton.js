import PropTypes from 'prop-types'
import { Spacer, AddButton, Paragraph } from '@glrodasz/components'

const AddTaskButton = ({ id, onAddTask, isShown }) => {
  if (isShown) {
    return (
      <>
        <Spacer.Vertical size="md" />
        <AddButton
          id={id}
          onAdd={onAddTask}
          focusHelpText="Presiona enter"
          blurHelpText="Clic para continuar"
        >
          Toca para agregar la tarea
        </AddButton>
      </>
    )
  }

  // Out of room: say why the button is gone instead of hiding it silently.
  return (
    <>
      <Spacer.Vertical size="md" />
      <Paragraph size="sm" color="muted" isCentered>
        Llegaste al máximo de tareas. Completa o elimina una para agregar otra.
      </Paragraph>
    </>
  )
}

AddTaskButton.defaultProps = {
  id: '',
}

AddTaskButton.propTypes = {
  id: PropTypes.string,
  onAddTask: PropTypes.func.isRequired,
  isShown: PropTypes.bool,
}

export default AddTaskButton
