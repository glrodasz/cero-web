export const handleCompleteTask = ({ id, onCompleteTask }) => ({
  isChecked,
}) => {
  onCompleteTask({ id, isChecked })
}

export const handleDeleteTask = ({ id, onDeleteTask }) => () => {
  onDeleteTask({ id })
}

export const handleEditTask = ({ id, onEditTask }) => () => {
  onEditTask({ id })
}
