import React from 'react'
import PropTypes from 'prop-types'
import { Droppable } from 'react-beautiful-dnd'
import { TaskCounter, Spacer } from '@glrodasz/components'

import DraggableTask from '../DraggableTask/DraggableTask'
import { MAXIMUM_BACKLOG_QUANTITY } from '../../../planning/constants'

const Column = ({
  column,
  tasks,
  isActive,
  onClickDeleteTask,
  onCheckCompleteTask,
}) => {
  return (
    <TaskCounter
      title={column.title}
      defaultIsCollapsed={isActive ? column.id !== 'in-progress' : false}
      isToggleable={isActive}
      current={tasks.length}
      total={column.id === 'pending' && MAXIMUM_BACKLOG_QUANTITY}
    >
      <Spacer.Horizontal size="md" />
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
                  onClickDeleteTask={onClickDeleteTask}
                  onCheckCompleteTask={onCheckCompleteTask}
                />
                <Spacer.Horizontal size="sm" />
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
  onClickDeleteTask: PropTypes.func.isRequired,
  onCheckCompleteTask: PropTypes.func.isRequired,
}

export default Column
