import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Heading } from '@glrodasz/components'

const handleClose = ({ onClose }) => () => {
  onClose()
}

const EditTaskModal = ({ task, onClose }) => {
  return (
    <Modal type="secondary" onClose={handleClose({ onClose })}>
      <Heading size="xl">{task?.description}</Heading>
    </Modal>
  )
}

EditTaskModal.propTypes = {
  task: PropTypes.object,
  onClose: PropTypes.func,
}

EditTaskModal.defaultProps = {
  onClose: () => {},
}

export default EditTaskModal
