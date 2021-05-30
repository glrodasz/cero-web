import React from 'react'
import { Task } from '@glrodasz/components'
import { Draggable } from 'react-beautiful-dnd'
import PropTypes from 'prop-types'

import { getTaskType } from '../../../planning/helpers'

const DraggableTask = ({
  task,
  index,
  columnId,
  isActive,
  onClickDeleteTask,
  onCheckCompleteTask,
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
            onDelete={() => onClickDeleteTask({ id: task.id })}
            isPending={!isActive}
            type={columnId === 'in-progress' && getTaskType(index, columnId)}
            onCheck={onCheckCompleteTask}
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
  onClickDeleteTask: PropTypes.func.isRequired,
  onCheckCompleteTask: PropTypes.func.isRequired,
}

export default DraggableTask
