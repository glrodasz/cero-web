import { useEffect, useState } from 'react'
import { Spacer } from '@glrodasz/components'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-beautiful-dnd'

import Column from '../Column/Column'

import { normalizeData, filterColumns } from '../../helpers'

const Board = ({
  tasks,
  isActive,
  onDragEndTask,
  onClickDeleteTask,
  onCheckCompleteTask,
}) => {
  const [data, setData] = useState(normalizeData(tasks))

  useEffect(() => {
    setData(normalizeData(tasks))
  }, [tasks])

  const tasksLength = tasks.length

  return (
    <>
      <DragDropContext onDragEnd={onDragEndTask}>
        {!!tasksLength &&
          data.columnOrder
            .filter(filterColumns({ tasksLength, isActive }))
            .map((columnId) => {
              const column = data.columns[columnId]
              const tasks = column.taskIds.map((taskId) => data.tasks[taskId])

              return (
                <>
                  <Spacer.Horizontal size="md" />
                  <Column
                    key={column.id}
                    column={column}
                    tasks={tasks}
                    isActive={isActive}
                    onClickDeleteTask={onClickDeleteTask}
                    onCheckCompleteTask={onCheckCompleteTask}
                  />
                  <Spacer.Horizontal size="md" />
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
  onDragEndTask: PropTypes.bool,
  onClickDeleteTask: PropTypes.func.isRequired,
  onCheckCompleteTask: PropTypes.func.isRequired,
}

export default Board
