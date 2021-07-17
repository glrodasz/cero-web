import React from 'react'
import PropTypes from 'prop-types'
import { Droppable } from 'react-beautiful-dnd'
import { TaskCounter, Spacer } from '@glrodasz/components'

import DraggableTask from '../DraggableTask/DraggableTask'
import { getTitle, getTotal, getCurrent } from '../../helpers'

const Column = ({
  column,
  tasks,
  isActive,
  onClickDeleteTask,
  onCheckCompleteTask,
}) => {
  return (
    <TaskCounter
      title={getTitle({ column, isActive })}
      defaultIsCollapsed={isActive ? column.id !== 'in-progress' : false}
      isToggleable={isActive}
      current={getCurrent({ tasks, column, isActive })}
      total={getTotal({ column, isActive })}
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
                  onClickDeleteTask={onClickDeleteTask}
                  onCheckCompleteTask={onCheckCompleteTask}
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
  onClickDeleteTask: PropTypes.func.isRequired,
  onCheckCompleteTask: PropTypes.func.isRequired,
}

export default Column
