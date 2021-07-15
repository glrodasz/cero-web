import PropTypes from 'prop-types'
import { Spacer, AddButton } from '@glrodasz/components'

import { MAXIMUM_BACKLOG_QUANTITY } from '../constants'

const AddTaskButton = ({ id, tasksLength, onClickAddTask }) => {
  if (tasksLength < MAXIMUM_BACKLOG_QUANTITY) {
    return (
      <>
        <Spacer.Horizontal size="md" />
        <AddButton
          id={id}
          onAdd={onClickAddTask}
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
  onClickAddTask: PropTypes.func.isRequired,
  tasksLength: PropTypes.number,
}

export default AddTaskButton
