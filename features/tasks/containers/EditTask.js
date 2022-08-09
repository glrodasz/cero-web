import React from 'react'
import PropTypes from 'prop-types'
import EditTaskModal from '../components/EditTaskModal'
import useTask from '../hooks/useTask'

import {
  handleDeleteTask,
  handleCloseEditTaskModal,
  handleUpdateTask,
} from '../../tasks/handlers'

const EditTask = ({ editTaskModal, deleteConfirmation }) => {
  const { taskId } = editTaskModal
  const task = useTask({
    id: taskId,
  })

  return (
    <>
      {editTaskModal.showDialog && (
        <EditTaskModal
          task={task?.data}
          onClose={handleCloseEditTaskModal({ editTaskModal })}
          onDelete={handleDeleteTask({
            deleteConfirmation,
          })}
          onUpdate={handleUpdateTask({
            task,
          })}
        />
      )}
    </>
  )
}

EditTask.propTypes = {
  editTaskModal: PropTypes.shape({
    taskId: PropTypes.string.isRequired,
    setTaskId: PropTypes.func.isRequired,
    showDialog: PropTypes.bool.isRequired,
    setShowDialog: PropTypes.func.isRequired,
  }).isRequired,
  deleteConfirmation: PropTypes.shape({
    taskId: PropTypes.string.isRequired,
    setTaskId: PropTypes.func.isRequired,
    showDialog: PropTypes.bool.isRequired,
    setShowDialog: PropTypes.func.isRequired,
  }).isRequired,
}

export default EditTask
