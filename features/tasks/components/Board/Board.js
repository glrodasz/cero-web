import { useEffect, useState } from 'react'
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
                <>
                  <Spacer.Vertical size="md" />
                  <Column
                    key={column.id}
                    column={column}
                    tasks={tasks}
                    isActive={isActive}
                    actions={actions}
                  />
                  <Spacer.Vertical size="md" />
                </>
              )
            })}
      </DragDropContext>
    </>
  )
}

Board.propTypes = {
  tasks: PropTypes.object,
  isActive: PropTypes.bool,
  onDragEnd: PropTypes.bool,
  actions: PropTypes.shape({
    onDeleteTask: PropTypes.func.isRequired,
    onCompleteTask: PropTypes.func.isRequired,
    onEditTask: PropTypes.func.isRequired,
  }).isRequired,
}

export default Board
