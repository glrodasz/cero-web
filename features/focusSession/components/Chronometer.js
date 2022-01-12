import { Icon, Paragraph, Spacer } from '@glrodasz/components'
import React from 'react'
import formatMilliseconds from '../../../utils/formatMilliseconds'
import useTime from '../../common/hooks/useTime'
import { time } from '../../common/constants'

// TODO: Create tests and refactor to use mod (%)
const getBarWidth = (currentTime, filledBarTime = time.ONE_HOUR_IN_MS) => {
  const filledBarTimeElapsed = Math.floor(currentTime / filledBarTime)
  const barWidth = (currentTime * 100) / filledBarTime
  return filledBarTimeElapsed ? barWidth - filledBarTimeElapsed * 100 : barWidth
}

const Chronometer = () => {
  const { currentTime } = useTime()
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
        <Icon name="pauseCircle" size="lg" isClickable />
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

export default Chronometer
