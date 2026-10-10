import {
  reorderTasks,
  addSubtask,
  toggleSubtask,
  removeSubtask,
} from './helpers'
import Router from 'next/router'
import isEmpty from '../../utils/isEmpty'

export const createDragEndTaskHandler =
  ({ tasks }) =>
  ({ source, destination, draggableId }) => {
    const hasBeenMovedOutsideAColumn = !destination
    const hasBeenMovedToSamePlace =
      destination?.droppableId === source?.droppableId &&
      destination?.index === source?.index

    if (hasBeenMovedOutsideAColumn || hasBeenMovedToSamePlace) {
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
      (task) =>
        task.status === sourceColumnId && String(task.id) !== draggableId
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
    const orderedDestinationTasks = reorderTasks(
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
      ...orderedDestinationTasks,
    ]

    setLocalData(concatenatedTasks)
    return api.updatePriorities({ tasks: concatenatedTasks })
  }

export const createAddTaskHandler =
  ({ tasks }) =>
  ({ value }) => {
    const { api } = tasks
    !isEmpty(value) && api.create({ description: value })
  }

export const createDeleteTaskHandler =
  ({ deleteConfirmation }) =>
  ({ id }) => {
    const { setTaskId, setShowDialog } = deleteConfirmation
    setTaskId(id)
    setShowDialog(true)
  }

export const createCancelRemoveHandler =
  ({ deleteConfirmation }) =>
  () => {
    const { setTaskId, setShowDialog } = deleteConfirmation
    setTaskId(null)
    setShowDialog(false)
  }

export const createConfirmRemoveHandler =
  ({ tasks, deleteConfirmation }) =>
  () => {
    const { taskId, setShowDialog } = deleteConfirmation
    tasks.api.remove({ id: taskId })
    setShowDialog(false)
  }

export const createStartSessionHandler =
  ({ focusSessions }) =>
  async () => {
    await focusSessions.api.create()
    Router.push('/focus-session')
  }

export const createOpenEditTaskModalHandler =
  ({ editTaskModal }) =>
  ({ id }) => {
    const { setTaskId, setShowDialog } = editTaskModal
    setTaskId(id)
    setShowDialog(true)
  }

export const createCloseEditTaskModalHandler =
  ({ editTaskModal }) =>
  () => {
    const { setTaskId, setShowDialog } = editTaskModal
    setTaskId(null)
    setShowDialog(false)
  }

// TODO: Rethink the whole useTask, useTasks naming
// maybe change task to taskApi? to be more specific
export const createUpdateTaskHandler =
  ({ task }) =>
  ({ id, data }) => {
    task.api.update({ id, task: data })
  }

// The task detail saves each change as it happens (`useTask` makes it
// optimistic), sending only the fields that changed.
const updateTaskFields = ({ task }, fields) => {
  const id = task.data?.id
  id !== undefined && task.api.update({ id, task: fields })
}

export const createChangeTaskDurationHandler =
  ({ task }) =>
  (duration) => {
    duration !== (task.data?.duration ?? null) &&
      updateTaskFields({ task }, { duration })
  }

export const createAddSubtaskHandler =
  ({ task }) =>
  (description) => {
    const subtasks = task.data?.subtasks ?? []
    const nextSubtasks = addSubtask(subtasks, description)
    nextSubtasks !== subtasks &&
      updateTaskFields({ task }, { subtasks: nextSubtasks })
  }

export const createToggleSubtaskHandler =
  ({ task }) =>
  (id) => {
    updateTaskFields(
      { task },
      { subtasks: toggleSubtask(task.data?.subtasks, id) }
    )
  }

export const createRemoveSubtaskHandler =
  ({ task }) =>
  (id) => {
    updateTaskFields(
      { task },
      { subtasks: removeSubtask(task.data?.subtasks, id) }
    )
  }

export const createSaveTaskNotesHandler =
  ({ task }) =>
  (notes) => {
    notes !== (task.data?.notes ?? '') && updateTaskFields({ task }, { notes })
  }
