import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import TaskDetailSection from '../TaskDetailSection'

import styles from './TaskNotes.module.css'

const ENTER_KEY = 'Enter'
const ESCAPE_KEY = 'Escape'

// Saves while typing too, not only on blur: a phone can lock or switch apps
// without ever blurring the field.
const AUTOSAVE_DELAY_IN_MS = 800

const growToContent = (textarea) => {
  if (!textarea) return
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
}

const createKeyDownHandler = () => (event) => {
  // A new line, not the library `AddButton`'s window-level Enter listener.
  event.key === ENTER_KEY && event.stopPropagation()
  event.key === ESCAPE_KEY && event.currentTarget.blur()
}

const TaskNotes = ({ notes, onSave }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(notes)
  const textareaRef = useRef(null)
  const onSaveRef = useRef(onSave)
  onSaveRef.current = onSave

  useEffect(() => {
    if (!isEditing) return
    const timeout = setTimeout(
      () => onSaveRef.current(draft),
      AUTOSAVE_DELAY_IN_MS
    )
    return () => clearTimeout(timeout)
  }, [draft, isEditing])

  useEffect(() => {
    isEditing && growToContent(textareaRef.current)
  }, [isEditing])

  const startEditing = () => {
    setDraft(notes)
    setIsEditing(true)
  }

  const finishEditing = () => {
    onSave(draft)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <TaskDetailSection isFilled>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={draft}
          placeholder="Escribe tus notas"
          aria-label="Notas"
          rows={1}
          autoFocus
          onChange={(event) => {
            setDraft(event.currentTarget.value)
            growToContent(event.currentTarget)
          }}
          onKeyDown={createKeyDownHandler()}
          onBlur={finishEditing}
        />
      </TaskDetailSection>
    )
  }

  if (!notes) {
    return (
      <TaskDetailSection
        action={{ label: 'Agregar notas', onClick: startEditing }}
      />
    )
  }

  return (
    <TaskDetailSection isFilled>
      <button
        type="button"
        className={styles.notes}
        aria-label="Editar notas"
        onClick={startEditing}
      >
        {notes}
      </button>
    </TaskDetailSection>
  )
}

TaskNotes.propTypes = {
  notes: PropTypes.string,
  onSave: PropTypes.func.isRequired,
}

TaskNotes.defaultProps = {
  notes: '',
}

export default TaskNotes
