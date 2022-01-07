import { Icon, Paragraph, Spacer } from '@glrodasz/components'
import React from 'react'
import formatMilliseconds from '../../../utils/formatMilliseconds'
import useTime from '../../common/hooks/useTime'

const TWENTY_FIVE_MINUTES_IN_MS = 1 * 60 * 1000

const Chronometer = () => {
  const { currentTime } = useTime({ endTime: TWENTY_FIVE_MINUTES_IN_MS })

  const currentBarWidth = (currentTime * 100) / TWENTY_FIVE_MINUTES_IN_MS

  return (
    <>
      <div className="chronometer">
        <div className="time">
          <Paragraph color="muted" weight="medium" size="lg" isInline>
            {formatMilliseconds(currentTime)}
          </Paragraph>
        </div>
        <Spacer.Horizontal size="sm" />
        <div className="bar">
          <div
            className="inner-bar"
            style={{ width: `${parseInt(currentBarWidth)}%` }}
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

        .time {
          width: 100%;
          max-width: 60px;
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
