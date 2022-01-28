import { Icon, Paragraph, Spacer } from '@glrodasz/components'
import PropTypes from 'prop-types'
import formatMilliseconds from '../../../utils/formatMilliseconds'
import useToggle from '../../common/hooks/useToggle'

import { createHandlerClickChronometer } from '../handlers'
import { getBarWidth } from '../helpers'

const Chronometer = ({ currentTime, isPaused, onPause }) => {
  const { isOn: isPlaying, toggle } = useToggle(isPaused)
  const barWidth = getBarWidth(currentTime)

  return (
    <>
      <div className="chronometer">
        <div className="time">
          <Paragraph
            color="muted"
            weight="medium"
            size="lg"
            isInline
            isMonospace
          >
            {formatMilliseconds(currentTime)}
          </Paragraph>
        </div>
        <Spacer.Horizontal size="sm" />
        <div className="bar">
          <div
            className="inner-bar"
            style={{ width: `${parseInt(barWidth)}%` }}
          ></div>
        </div>
        <Spacer.Horizontal size="sm" />
        <Icon
          name={isPlaying ? 'play' : 'pauseCircle'}
          size="lg"
          onClick={createHandlerClickChronometer({
            isPlaying,
            toggle,
            onPause,
          })}
          isClickable
        />
      </div>
      <style jsx>{`
        .chronometer {
          display: flex;
          align-items: center;
        }

        .bar {
          width: 100%;
          height: var(--chronometer-height);
          background: var(--chronometer-background-color);
          border-radius: var(--chronometer-border-radius);
        }

        .inner-bar {
          background: var(--chronometer-color);
          height: var(--chronometer-height);
          border-radius: var(--chronometer-border-radius);
        }
      `}</style>
    </>
  )
}

Chronometer.propTypes = {
  currentTime: PropTypes.number,
  isPaused: PropTypes.bool,
  onPause: PropTypes.func.isRequired,
}

Chronometer.defaultProps = {
  currentTime: 0,
  isPaused: false,
}

export default Chronometer
