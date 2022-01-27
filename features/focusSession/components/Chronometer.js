import { Icon, Paragraph, Spacer } from '@glrodasz/components'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import formatMilliseconds from '../../../utils/formatMilliseconds'
import useTime from '../../common/hooks/useTime'
import useToggle from '../../common/hooks/useToggle'

import { getBarWidth } from '../helpers'
import useFocusSession from '../hooks/useFocusSession'

const createHandleClick = ({
  isPlaying,
  toggle,
  focusSession,
  clearTime,
}) => async () => {
  if (isPlaying) {
    await focusSession.api.resume()
  } else {
    await focusSession.api.pause()
    clearTime()
  }

  toggle()
}

const getActivePause = ({ focusSession }) => {
  return focusSession?.data?.pauses?.some((pause) => pause.endTime === null)
}

const Chronometer = ({ activeFocusSession, startTime }) => {
  const { currentTime, clearTime, resumeTime } = useTime({
    startTime,
  })
  // TODO: See if we can move the whole react-query logic to the
  const focusSession = useFocusSession({
    initialData: activeFocusSession,
    onResume: () => resumeTime(),
  })
  const activePause = getActivePause({ focusSession })
  const { isOn: isPlaying, toggle } = useToggle(activePause)

  const barWidth = getBarWidth(currentTime)

  useEffect(() => {
    if (activePause) {
      clearTime()
    }
  }, [activePause])

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
          onClick={createHandleClick({
            isPlaying,
            toggle,
            focusSession,
            clearTime,
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
  startTime: PropTypes.number,
  activeFocusSession: PropTypes.object,
}

Chronometer.defaultProps = {
  startTime: 0,
}

export default Chronometer
