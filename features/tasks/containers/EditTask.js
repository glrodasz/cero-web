import React from 'react'
import PropTypes from 'prop-types'
import EditTaskModal from '../components/EditTaskModal'
import useTask from '../hooks/useTask'

import {
  createDeleteTaskHandler,
  createCloseEditTaskModalHandler,
  createUpdateTaskHandler,
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
          onClose={createCloseEditTaskModalHandler({ editTaskModal })}
          onDelete={createDeleteTaskHandler({
            deleteConfirmation,
          })}
          onUpdate={createUpdateTaskHandler({
            task,
          })}
        />
      )}
    </>
  )
}

EditTask.propTypes = {
  editTaskModal: PropTypes.shape({
    taskId: PropTypes.string,
    setTaskId: PropTypes.func.isRequired,
    showDialog: PropTypes.bool.isRequired,
    setShowDialog: PropTypes.func.isRequired,
  }).isRequired,
  deleteConfirmation: PropTypes.shape({
    taskId: PropTypes.string,
    setTaskId: PropTypes.func.isRequired,
    showDialog: PropTypes.bool.isRequired,
    setShowDialog: PropTypes.func.isRequired,
  }).isRequired,
}

export default EditTask
