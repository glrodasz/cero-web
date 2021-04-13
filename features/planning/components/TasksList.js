import React from 'react'
import PropTypes from 'prop-types'
import { Task, Spacer, Divider, TaskCounter } from '@glrodasz/components'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { PRIOTIY_TASKS_QUANTITY, MAXIMUM_BACKLOG_QUANTITY } from '../constants'
import { getTaskType } from '../helpers'

const TasksList = ({
  tasks,
  onDragEndTask,
  onClickDeleteTask,
  onCheckCompleteTask,
  isActive,
}) => {
  return (
    <>
      {!!tasks?.length && (
        <>
          <Spacer.Horizontal size="md" />
          <TaskCounter
            title={isActive ? 'En Progreso' : 'Tareas pendientes'}
            isToggleable={isActive}
            current={!isActive && tasks.length}
            total={!isActive && MAXIMUM_BACKLOG_QUANTITY}
            defaultIsCollapsed={false}
          >
            <Spacer.Horizontal size="md" />
            <DragDropContext onDragEnd={onDragEndTask}>
              <Droppable droppableId="planning">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {tasks?.map((task, index) => {
                      return (
                        <>
                          <Draggable
                            key={task.id}
                            draggableId={String(task.id)}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={provided.draggableProps.style}
                              >
                                <Task
                                  key={task.id}
                                  onDelete={() =>
                                    onClickDeleteTask({ id: task.id })
                                  }
                                  isPending={!isActive}
                                  type={getTaskType(index)}
                                  onCheck={onCheckCompleteTask}
                                >
                                  {task.description}
                                </Task>
                              </div>
                            )}
                          </Draggable>
                          <Spacer.Horizontal size="sm" />
                          {index === PRIOTIY_TASKS_QUANTITY - 1 && (
                            <>
                              <Divider />
                              <Spacer.Horizontal size="sm" />
                            </>
                          )}
                        </>
                      )
                    })}
                  </div>
                )}
              </Droppable>
              {/* <Droppable droppableId="otherthing">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <div style={{ border: '2px solid tomato', height: 50 }}></div>
            </div>
          )}
        </Droppable> */}
            </DragDropContext>
          </TaskCounter>
          <Spacer.Horizontal size="md" />
        </>
      )}
      {isActive && (
        <>
          <TaskCounter
            title="Pendientes"
            current={tasks.length}
            total={MAXIMUM_BACKLOG_QUANTITY}
            isToggleable
          >
            <Spacer.Horizontal size="sm" />
          </TaskCounter>
          <Spacer.Horizontal size="sm" />
          <TaskCounter
            title="Completos"
            current={tasks.length}
            total={MAXIMUM_BACKLOG_QUANTITY}
            isToggleable
          >
            <Spacer.Horizontal size="sm" />
          </TaskCounter>
        </>
      )}
    </>
  )
}

TasksList.propTypes = {
  onCheckCompleteTask: PropTypes.func.isRequired,
  onDragEndTask: PropTypes.func.isRequired,
  onClickDeleteTask: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      priority: PropTypes.number.isRequired,
    })
  ),
}

export default TasksList
