import { reorderTasks } from './helpers'

export const handleDragEndTask = ({ tasks }) => ({
  source,
  destination,
  draggableId,
}) => {
  const hasBeenMoveOutsideAColumn = !destination
  const hasBeenMovedToSamePlace =
    destination?.droppableId === source?.droppableId &&
    destination?.index === source?.index

  if (hasBeenMoveOutsideAColumn || hasBeenMovedToSamePlace) {
    return
  }

  const hasBeenMovedToSameColumn =
    source.droppableId === destination.droppableId

  if (hasBeenMovedToSameColumn) {
    const { data, api, setLocalData } = tasks
    const currentColumnId = destination.droppableId

    const otherTasks = data.filter((task) => task.status !== currentColumnId)

    const orderedTasks = reorderTasks(
      data.filter((task) => task.status === currentColumnId),
      source.index,
      destination.index,
      destination.droppableId
    )

    const concatenatedTasks = [...otherTasks, ...orderedTasks]

    setLocalData(concatenatedTasks)
    return api.updatePriorities({ tasks: concatenatedTasks })
  }

  const { data, api, setLocalData } = tasks
  const sourceColumnId = source.droppableId
  const destinationColumnId = destination.droppableId

  const startTasks = data.filter(
    (task) => task.status === sourceColumnId && String(task.id) !== draggableId
  )
  const orderedStartTasks = reorderTasks(
    startTasks,
    source.index,
    null,
    source.droppableId
  )

  const destinationTasks = data.filter(
    (task) => task.status === destinationColumnId
  )
  const orderedDestionationTasks = reorderTasks(
    destinationTasks,
    null,
    destination.index,
    destination.droppableId,
    data.find((task) => String(task.id) === draggableId)
  )

  const otherTasks = data.filter(
    (task) =>
      task.status !== sourceColumnId && task.status !== destinationColumnId
  )

  const concatenatedTasks = [
    ...reorderTasks(otherTasks, null, null),
    ...orderedStartTasks,
    ...orderedDestionationTasks,
  ]

  setLocalData(concatenatedTasks)
  return api.updatePriorities({ tasks: concatenatedTasks })
}

export const handleClickAddTask = ({ tasks }) => (value) => {
  const { api, data } = tasks
  api.create({ description: value, priority: data.length })
}

export const handleClickDeleteTask = ({ deleteConfirmation }) => ({ id }) => {
  const { setTaskId, setShowDialog } = deleteConfirmation
  setTaskId(id)
  setShowDialog(true)
}

export const handleClickCancelRemove = ({ deleteConfirmation }) => () => {
  const { setTaskId, setShowDialog } = deleteConfirmation
  setTaskId(null)
  setShowDialog(false)
}

export const handleClickConfirmRemove = ({
  tasks,
  deleteConfirmation,
}) => () => {
  const { taskId, setShowDialog } = deleteConfirmation
  tasks.api.remove({ id: taskId })
  setShowDialog(false)
}

export const handleClickStartSession = ({ focusSessions }) => () => {
  focusSessions.api.create()
}
