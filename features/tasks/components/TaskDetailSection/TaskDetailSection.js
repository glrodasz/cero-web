import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Icon } from '@glrodasz/components'

import styles from './TaskDetailSection.module.css'

// A box in the task detail: dashed while it is an invitation to add something,
// solid once it holds content.
const TaskDetailSection = ({ action, isFilled, children }) => {
  return (
    <section
      className={classNames(styles.section, {
        [styles['is-filled']]: isFilled,
      })}
    >
      <span className={styles.icon} aria-hidden="true">
        <Icon name="tag" color="muted" />
      </span>
      <div className={styles.body}>
        {action && (
          <button
            type="button"
            className={styles.action}
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )}
        {children}
      </div>
    </section>
  )
}

TaskDetailSection.propTypes = {
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
  isFilled: PropTypes.bool,
  children: PropTypes.node,
}

TaskDetailSection.defaultProps = {
  isFilled: false,
}

export default TaskDetailSection
