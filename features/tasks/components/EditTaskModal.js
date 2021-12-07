import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Heading } from '@glrodasz/components'

const handleClose = ({ onClose }) => () => {
  onClose()
}

const handleDelete = ({ id, onDelete }) => () => {
  onDelete({ id })
}

const EditTaskModal = ({ task, onClose, onDelete }) => {
  return (
    <Modal
      type="secondary"
      onClose={handleClose({ onClose })}
      secondaryAction={{
        icon: 'trash',
        handler: handleDelete({ id: task?.id, onDelete }),
      }}
    >
      <Heading size="xl">{task?.description}</Heading>
    </Modal>
  )
}

EditTaskModal.propTypes = {
  task: PropTypes.object,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
}

EditTaskModal.defaultProps = {
  onClose: () => {},
  onDelete: () => {},
}

export default EditTaskModal
