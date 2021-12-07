import React from 'react'
import { Task } from '@glrodasz/components'
import { Draggable } from 'react-beautiful-dnd'
import PropTypes from 'prop-types'

import { getTaskType } from '../../../tasks/helpers'

const handleCompleteTask = ({ id, onCompleteTask }) => ({ isChecked }) => {
  onCompleteTask({ id, isChecked })
}

const handleDeleteTask = ({ id, onDeleteTask }) => () => {
  onDeleteTask({ id })
}

const handleEditTask = ({ id, onEditTask }) => () => {
  onEditTask({ id })
}

const DraggableTask = ({
  task,
  index,
  columnId,
  isActive,
  onDeleteTask,
  onCompleteTask,
  onEditTask,
}) => {
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Task
            key={task.id}
            onDelete={handleDeleteTask({ id: task.id, onDeleteTask })}
            isPending={!isActive}
            type={columnId === 'in-progress' && getTaskType(index, columnId)}
            onCheck={handleCompleteTask({
              id: task.id,
              onCompleteTask,
            })}
            onClick={handleEditTask({
              id: task.id,
              onEditTask,
            })}
            defaultIsChecked={columnId === 'completed'}
          >
            {task.description}
          </Task>
        </div>
      )}
    </Draggable>
  )
}

DraggableTask.propTypes = {
  task: PropTypes.array,
  index: PropTypes.number,
  columnId: PropTypes.string,
  isActive: PropTypes.bool,
  onDeleteTask: PropTypes.func.isRequired,
  onCompleteTask: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
}

export default DraggableTask
