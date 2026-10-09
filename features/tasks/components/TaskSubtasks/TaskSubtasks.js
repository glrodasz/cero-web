import { useState } from 'react'
import PropTypes from 'prop-types'
import { Check, Icon, Paragraph } from '@glrodasz/components'

import TaskDetailSection from '../TaskDetailSection'

import styles from './TaskSubtasks.module.css'

const ENTER_KEY = 'Enter'
const ESCAPE_KEY = 'Escape'

const createKeyDownHandler =
  ({ value, setValue, setIsAdding, onAdd }) =>
  (event) => {
    if (event.key === ENTER_KEY) {
      // The library's `AddButton` listens for Enter on `window`, so the board
      // behind this modal would take the focus away from this input.
      event.stopPropagation()
      event.preventDefault()

      if (value.trim()) {
        onAdd(value)
        setValue('')
      } else {
        setIsAdding(false)
      }
    }

    if (event.key === ESCAPE_KEY) {
      setValue('')
      setIsAdding(false)
    }
  }

// Leaving the field keeps what was typed rather than dropping it.
const createBlurHandler =
  ({ value, setValue, setIsAdding, onAdd }) =>
  () => {
    value.trim() && onAdd(value)
    setValue('')
    setIsAdding(false)
  }

const TaskSubtasks = ({ subtasks, onAdd, onToggle, onRemove }) => {
  const [isAdding, setIsAdding] = useState(false)
  const [value, setValue] = useState('')

  return (
    <TaskDetailSection
      isFilled={subtasks.length > 0 || isAdding}
      action={{ label: 'Agregar subtarea', onClick: () => setIsAdding(true) }}
    >
      {subtasks.length > 0 && (
        <ul className={styles.list}>
          {subtasks.map(({ id, description, isCompleted }) => (
            <li key={id} className={styles.subtask}>
              <button
                type="button"
                className={styles['icon-button']}
                aria-label={
                  isCompleted
                    ? `Marcar como pendiente: ${description}`
                    : `Completar: ${description}`
                }
                aria-pressed={isCompleted}
                onClick={() => onToggle(id)}
              >
                <Check isChecked={isCompleted} />
              </button>
              <Paragraph color={isCompleted ? 'muted' : 'base'}>
                {description}
              </Paragraph>
              <button
                type="button"
                className={styles['icon-button']}
                aria-label={`Eliminar: ${description}`}
                onClick={() => onRemove(id)}
              >
                <Icon name="cross" color="primary" size="sm" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {isAdding && (
        <input
          className={styles.input}
          value={value}
          placeholder="Escribe la subtarea"
          aria-label="Nueva subtarea"
          enterKeyHint="enter"
          autoFocus
          onChange={(event) => setValue(event.currentTarget.value)}
          onKeyDown={createKeyDownHandler({
            value,
            setValue,
            setIsAdding,
            onAdd,
          })}
          onBlur={createBlurHandler({ value, setValue, setIsAdding, onAdd })}
        />
      )}
    </TaskDetailSection>
  )
}

TaskSubtasks.propTypes = {
  subtasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      isCompleted: PropTypes.bool,
    })
  ),
  onAdd: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}

TaskSubtasks.defaultProps = {
  subtasks: [],
}

export default TaskSubtasks
