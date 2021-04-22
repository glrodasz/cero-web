import { useEffect, useState } from 'react'
import { Spacer } from '@glrodasz/components'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-beautiful-dnd'

import Column from '../Column/Column'

// TODO: Move to helpers
const normalizeData = (tasks) => {
  const normalizeTasks = tasks.reduce((prev, cur) => {
    prev[cur.id] = { ...cur }
    return prev
  }, {})

  const columns = {
    'in-progress': {
      id: 'in-progress',
      title: 'En Progreso',
      taskIds: tasks
        .filter(({ status }) => status === 'in-progress')
        .sort((a, b) => a.priority - b.priority)
        .map((task) => task.id),
    },
    pending: {
      id: 'pending',
      title: 'Pendientes',
      taskIds: tasks
        .filter(({ status }) => status === 'pending')
        .sort((a, b) => a.priority - b.priority)
        .map((task) => task.id),
    },
    completed: {
      id: 'completed',
      title: 'Completadas',
      taskIds: tasks
        .filter(({ status }) => status === 'completed')
        .sort((a, b) => a.priority - b.priority)
        .map((task) => task.id),
    },
  }

  const columnOrder = ['in-progress', 'pending', 'completed']

  return { tasks: normalizeTasks, columns, columnOrder }
}

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

  return (
    <>
      <DragDropContext onDragEnd={onDragEndTask}>
        {data.columnOrder
          .filter((column) => (isActive ? true : column !== 'completed'))
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
