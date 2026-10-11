import PropTypes from 'prop-types'
import { Paragraph } from '@glrodasz/components'

import { formatCompletedTasks, formatFocusedTime } from '../../helpers'

const SessionRecap = ({ focusedTime, completedTasks }) => {
  return (
    <Paragraph size="lg" weight="medium">
      {`Trabajaste ${formatFocusedTime(
        focusedTime
      )} · completaste ${formatCompletedTasks(completedTasks)}`}
    </Paragraph>
  )
}

SessionRecap.propTypes = {
  focusedTime: PropTypes.number.isRequired,
  completedTasks: PropTypes.number.isRequired,
}

export default SessionRecap
