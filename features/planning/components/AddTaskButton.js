import PropTypes from 'prop-types'
import { Spacer, AddButton } from '@glrodasz/components'

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

  return null
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
