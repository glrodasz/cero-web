import React from 'react'
import { Task } from '@glrodasz/components'
import { Draggable } from 'react-beautiful-dnd'
import PropTypes from 'prop-types'

import { getTaskType } from '../../../tasks/helpers'

import {
  createCompleteTaskHandler,
  createDeleteTaskHandler,
  createEditTaskHandler,
} from './handlers'

const DraggableTask = ({ task, index, columnId, isActive, actions }) => {
  const { onDeleteTask, onCompleteTask, onEditTask } = actions

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
            onDelete={createDeleteTaskHandler({ id: task.id, onDeleteTask })}
            isPending={!isActive}
            type={columnId === 'in-progress' && getTaskType(index, columnId)}
            onCheck={createCompleteTaskHandler({
              id: task.id,
              onCompleteTask,
            })}
            onClick={createEditTaskHandler({
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
  task: PropTypes.object.isRequired,
  index: PropTypes.number,
  columnId: PropTypes.string,
  isActive: PropTypes.bool,
  actions: PropTypes.shape({
    onDeleteTask: PropTypes.func,
    onCompleteTask: PropTypes.func,
    onEditTask: PropTypes.func,
  }),
}

DraggableTask.defaultProps = {
  actions: {},
}

export default DraggableTask
