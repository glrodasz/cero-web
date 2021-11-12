import PropTypes from 'prop-types'
import {
  Modal,
  CenteredContent,
  Heading,
  Button,
  Spacer,
  Paragraph,
} from '@glrodasz/components'

const DeleteTaskModal = ({ onClickCancel, onClickConfirm }) => {
  return (
    <Modal type="secondary">
      <CenteredContent>
        <Heading size="xl">
          ¿Estás seguro de querer eliminar esta tarea?
        </Heading>
        <Spacer.Vertical size="md" />
        <Paragraph>La tarea se eliminará de manera permanente.</Paragraph>
        <Spacer.Vertical size="sm" />
        <Button type="secondary" onClick={onClickCancel}>
          No, Regresar
        </Button>
        <Spacer.Vertical size="xs" />
        <Button type="primary" onClick={onClickConfirm}>
          Sí, eliminar
        </Button>
      </CenteredContent>
    </Modal>
  )
}

DeleteTaskModal.propTypes = {
  onClickCancel: PropTypes.func.isRequired,
  onClickConfirm: PropTypes.func.isRequired,
}

export default DeleteTaskModal
