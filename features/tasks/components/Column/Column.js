import React from 'react'
import PropTypes from 'prop-types'
import { Droppable } from 'react-beautiful-dnd'
import { TaskCounter, Spacer } from '@glrodasz/components'

import DraggableTask from '../DraggableTask/DraggableTask'
import { getTitle, getTotal, getCurrent } from '../../helpers'

import { COMPLETED_COLUMN_ID } from '../../constants'

const Column = ({
  column,
  tasks,
  isActive,
  onDeleteTask,
  onCompleteTask,
  onEditTask,
}) => {
  return (
    <TaskCounter
      title={getTitle({ column, isActive })}
      defaultIsCollapsed={isActive && column.id === COMPLETED_COLUMN_ID}
      current={getCurrent({ tasks, column, isActive })}
      total={getTotal({ column, isActive })}
      isToggleable={isActive}
    >
      <Spacer.Vertical size="md" />
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <>
                <DraggableTask
                  columnId={column.id}
                  key={task.id}
                  task={task}
                  index={index}
                  isActive={isActive}
                  onDeleteTask={onDeleteTask}
                  onEditTask={onEditTask}
                  onCompleteTask={onCompleteTask}
                />
                <Spacer.Vertical size="sm" />
              </>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </TaskCounter>
  )
}

Column.propTypes = {
  column: PropTypes.object,
  tasks: PropTypes.array,
  isActive: PropTypes.bool,
  onDeleteTask: PropTypes.func.isRequired,
  onCompleteTask: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
}

export default Column
