export const createCompleteTaskHandler =
  ({ id, onCompleteTask }) =>
  ({ isChecked }) => {
    onCompleteTask({ id, isChecked })
  }

export const createDeleteTaskHandler =
  ({ id, onDeleteTask }) =>
  () => {
    onDeleteTask({ id })
  }

export const createEditTaskHandler =
  ({ id, onEditTask }) =>
  () => {
    onEditTask({ id })
  }
