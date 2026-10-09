import PropTypes from 'prop-types'
import { Icon, Paragraph } from '@glrodasz/components'

import formatMinutes from '../../../../utils/formatMinutes'
import { TASK_DURATION_OPTIONS } from '../../constants'

import styles from './TaskDuration.module.css'

const NO_DURATION = ''

const createChangeHandler =
  ({ onChange }) =>
  (event) => {
    const { value } = event.currentTarget
    onChange(value === NO_DURATION ? null : Number(value))
  }

const getLabel = (duration) =>
  duration === null ? 'Sin definir' : formatMinutes(duration)

// The pill shows the current value; a transparent native select covers it, so
// phones still open their own picker and the pill fits its value instead of
// the longest option. Not the library's `Dropdown`: no room for the clock.
const TaskDuration = ({ duration, onChange }) => {
  return (
    <div className={styles['task-duration']}>
      <div className={styles.picker}>
        <Icon name="clock" color="muted" />
        <span className={styles.value} aria-hidden="true">
          {getLabel(duration)}
        </span>
        <Icon name="angleDown" background="highlight" />
        <select
          className={styles.select}
          value={duration ?? NO_DURATION}
          onChange={createChangeHandler({ onChange })}
          aria-label="Duración de la tarea"
        >
          <option value={NO_DURATION}>{getLabel(null)}</option>
          {TASK_DURATION_OPTIONS.map((minutes) => (
            <option key={minutes} value={minutes}>
              {getLabel(minutes)}
            </option>
          ))}
        </select>
      </div>
      <Paragraph size="sm">Define la duración de esta tarea</Paragraph>
    </div>
  )
}

TaskDuration.propTypes = {
  duration: PropTypes.number,
  onChange: PropTypes.func.isRequired,
}

TaskDuration.defaultProps = {
  duration: null,
}

export default TaskDuration
