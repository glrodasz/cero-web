import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Heading, Paragraph } from '@glrodasz/components'

import timeAgo from '../../../utils/timeAgo'

const handleClose =
  ({ onClose }) =>
  () => {
    onClose()
  }

const handleDelete =
  ({ id, onDelete }) =>
  () => {
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
      <div className="container">
        <Heading size="xl">{task?.description}</Heading>
        {task?.createdAt && (
          <Paragraph size="md" color="muted">
            Creada {timeAgo(task?.createdAt)}
          </Paragraph>
        )}
      </div>
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
