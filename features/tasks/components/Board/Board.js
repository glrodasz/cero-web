import React, { useEffect, useState } from 'react'
import { Spacer } from '@glrodasz/components'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-beautiful-dnd'

import Column from '../Column/Column'

import { normalizeData, filterColumns } from '../../helpers'

const Board = ({ tasks, isActive, onDragEnd, actions }) => {
  const [data, setData] = useState(normalizeData(tasks))

  useEffect(() => {
    setData(normalizeData(tasks))
  }, [tasks])

  const tasksLength = tasks.length

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        {!!tasksLength &&
          data.columnOrder
            .filter(filterColumns({ tasksLength, isActive }))
            .map((columnId) => {
              const column = data.columns[columnId]
              const tasks = column.taskIds.map((taskId) => data.tasks[taskId])

              return (
                <React.Fragment key={column.id}>
                  <Spacer.Vertical size="md" />
                  <Column
                    column={column}
                    tasks={tasks}
                    isActive={isActive}
                    actions={actions}
                  />
                </React.Fragment>
              )
            })}
      </DragDropContext>
    </>
  )
}

Board.propTypes = {
  tasks: PropTypes.array,
  isActive: PropTypes.bool,
  onDragEnd: PropTypes.func.isRequired,
  actions: PropTypes.shape({
    onDeleteTask: PropTypes.func,
    onCompleteTask: PropTypes.func,
    onEditTask: PropTypes.func,
  }),
}

export default Board
