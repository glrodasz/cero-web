import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Heading, Paragraph } from '@glrodasz/components'

import timeAgo from '../../../utils/timeAgo'

const createCloseHandler =
  ({ onClose }) =>
  () => {
    onClose()
  }

const createDeleteHandler =
  ({ id, onDelete }) =>
  () => {
    onDelete({ id })
  }

const createUpdateHandler =
  ({ id, onUpdate }) =>
  (event) => {
    const description = event.currentTarget.textContent
    onUpdate({ id, data: { description } })
  }

const EditTaskModal = ({ task, onClose, onDelete, onUpdate }) => {
  return (
    <Modal
      type="secondary"
      onClose={createCloseHandler({ onClose })}
      secondaryAction={{
        icon: 'trash',
        handler: createDeleteHandler({ id: task?.id, onDelete }),
      }}
    >
      <div className="container">
        <Heading
          size="xl"
          onBlur={createUpdateHandler({ id: task?.id, onUpdate })}
          isEditable
        >
          {task?.description || ''}
        </Heading>
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
  task: PropTypes.shape({}),
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
}

EditTaskModal.defaultProps = {
  onClose: () => {},
  onDelete: () => {},
}

export default EditTaskModal
