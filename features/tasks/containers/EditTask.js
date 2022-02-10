import React from 'react'
import PropTypes from 'prop-types'
import EditTaskModal from '../components/EditTaskModal'
import useTask from '../hooks/useTask'

import {
  handleDeleteTask,
  handleCloseEditTaskModal,
} from '../../tasks/handlers'

const EditTask = ({ editTaskModal, deleteConfirmation }) => {
  const task = useTask({
    id: editTaskModal.taskId,
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
