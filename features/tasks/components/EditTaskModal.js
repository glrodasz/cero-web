import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Heading, Paragraph } from '@glrodasz/components'

import timeAgo from '../../../utils/timeAgo'

import TaskDuration from './TaskDuration'
import TaskSubtasks from './TaskSubtasks'
import TaskNotes from './TaskNotes'

import styles from './EditTaskModal.module.css'

const ENTER_KEY = 'Enter'

// Every field saves itself, some on blur. Tapping the back button doesn't blur
// the focused field on iOS, so blur it first to let that last edit save.
const createCloseHandler =
  ({ onClose }) =>
  () => {
    document.activeElement?.blur?.()
    onClose()
  }

const createDeleteHandler =
  ({ id, onDelete }) =>
  () => {
    onDelete({ id })
  }

const createUpdateHandler =
  ({ task, onUpdate }) =>
  (event) => {
    const element = event.currentTarget
    const description = element.textContent.trim()

    // A task can't be left without a name: put the last one back.
    if (!description) {
      element.textContent = task?.description ?? ''
      return
    }

    description !== task?.description &&
      onUpdate({ id: task?.id, data: { description } })
  }

// Enter finishes editing the title instead of adding a line break, and stays
// away from the library `AddButton`'s window-level Enter listener.
const createTitleKeyDownHandler = () => (event) => {
  if (event.key !== ENTER_KEY) return
  event.preventDefault()
  event.stopPropagation()
  event.target.blur()
}

const EditTaskModal = ({
  task,
  hasSaveError,
  onClose,
  onDelete,
  onUpdate,
  onChangeDuration,
  onAddSubtask,
  onToggleSubtask,
  onRemoveSubtask,
  onSaveNotes,
}) => {
  return (
    <Modal
      type="secondary"
      onClose={createCloseHandler({ onClose })}
      secondaryAction={{
        icon: 'trash',
        handler: createDeleteHandler({ id: task?.id, onDelete }),
      }}
    >
      <div className={styles['edit-task']}>
        <header>
          <div onKeyDown={createTitleKeyDownHandler()}>
            <Heading
              size="xl"
              onBlur={createUpdateHandler({ task, onUpdate })}
              isEditable
            >
              {task?.description || ''}
            </Heading>
          </div>
          {task?.createdAt && (
            <Paragraph size="md" color="muted">
              Creada {timeAgo(task?.createdAt)}
            </Paragraph>
          )}
        </header>
        <TaskDuration duration={task?.duration} onChange={onChangeDuration} />
        <TaskSubtasks
          subtasks={task?.subtasks}
          onAdd={onAddSubtask}
          onToggle={onToggleSubtask}
          onRemove={onRemoveSubtask}
        />
        <TaskNotes notes={task?.notes} onSave={onSaveNotes} />
        {hasSaveError && (
          <div role="alert">
            <Paragraph size="sm" color="primary">
              No pudimos guardar el último cambio. Inténtalo de nuevo.
            </Paragraph>
          </div>
        )}
      </div>
    </Modal>
  )
}

EditTaskModal.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    description: PropTypes.string,
    createdAt: PropTypes.number,
    duration: PropTypes.number,
    subtasks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        description: PropTypes.string,
        isCompleted: PropTypes.bool,
      })
    ),
    notes: PropTypes.string,
  }),
  hasSaveError: PropTypes.bool,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  onChangeDuration: PropTypes.func,
  onAddSubtask: PropTypes.func,
  onToggleSubtask: PropTypes.func,
  onRemoveSubtask: PropTypes.func,
  onSaveNotes: PropTypes.func,
}

EditTaskModal.defaultProps = {
  hasSaveError: false,
  onClose: () => {},
  onDelete: () => {},
  onUpdate: () => {},
  onChangeDuration: () => {},
  onAddSubtask: () => {},
  onToggleSubtask: () => {},
  onRemoveSubtask: () => {},
  onSaveNotes: () => {},
}

export default EditTaskModal
