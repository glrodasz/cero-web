import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import {
  Modal,
  CenteredContent,
  Picture,
  Heading,
  Spacer,
  Paragraph,
  Link,
} from '@glrodasz/components'

import { time } from '../../common/constants'

export const formatBreakTime = (milliseconds) => {
  const seconds = milliseconds / 1000
  const currentMinutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  const currentSeconds = String(seconds % 60).padStart(2, '0')

  return `${currentMinutes}:${currentSeconds}`
}

const reverseTick = ({ currentTime, setCurrentTime }) => () => {
  setCurrentTime(currentTime - time.ONE_SECOND_IN_MS)
}

const BreaktimeTimer = ({ onClickClose, breaktime }) => {
  const [currentTime, setCurrentTime] = useState(breaktime)

  useEffect(() => {
    currentTime <= 0 && onClickClose()

    const intervalId = setInterval(
      reverseTick({ currentTime, setCurrentTime }),
      time.ONE_SECOND_IN_MS
    )

    return () => clearInterval(intervalId)
  }, [currentTime])

  return (
    <Modal isCentered onClose={onClickClose}>
      <CenteredContent>
        <Heading size="2xl" color="tertiary" weight="normal">
          {formatBreakTime(currentTime)}
        </Heading>
        <Picture src="/images/yoga-pause.svg" width={200}></Picture>
        <Spacer.Vertical size="md" />
        <Heading size="xl" color="tertiary">
          DESCONÉCTATE
        </Heading>
        <Spacer.Vertical size="sm" />
        <Paragraph color="inverted">
          Trabajar cuando te levantas no te permite despertar completamente. Por
          eso, date un tiempo antes de empezar tu día.
        </Paragraph>
        <Spacer.Vertical size="md" />
        <Link size="lg" color="tertiary">
          Leer más
        </Link>
      </CenteredContent>
    </Modal>
  )
}

BreaktimeTimer.propTypes = {
  onClickClose: PropTypes.func.isRequired,
  breaktime: PropTypes.number.isRequired,
}

export default BreaktimeTimer
