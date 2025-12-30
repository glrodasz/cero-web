import React from 'react'
import PropTypes from 'prop-types'
import { Droppable } from 'react-beautiful-dnd'
import { TaskCounter, Spacer } from '@glrodasz/components'

import DraggableTask from '../DraggableTask/DraggableTask'
import { getTitle, getTotal, getCurrent } from '../../helpers'

import { COMPLETED_COLUMN_ID } from '../../constants'

const Column = ({ column, tasks, isActive, actions }) => {
  const current = getCurrent({ tasks, column, isActive })
  const total = getTotal({ column, isActive })

  return (
    <TaskCounter
      title={getTitle({ column, isActive })}
      defaultIsCollapsed={isActive && column.id === COMPLETED_COLUMN_ID}
      current={current ?? 0}
      total={total ?? 0}
      isToggleable={isActive}
    >
      <Spacer.Vertical size="md" />
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <React.Fragment key={task.id}>
                <DraggableTask
                  columnId={column.id}
                  task={task}
                  index={index}
                  isActive={isActive}
                  actions={actions}
                />
                <Spacer.Vertical size="sm" />
              </React.Fragment>
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
  actions: PropTypes.shape({
    onDeleteTask: PropTypes.func,
    onCompleteTask: PropTypes.func,
    onEditTask: PropTypes.func,
  }),
}

export default Column
