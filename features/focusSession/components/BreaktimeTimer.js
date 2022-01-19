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

import useTime from '../../common/hooks/useTime'
import formatMilliseconds from '../../../utils/formatMilliseconds'

const createHandleClose = ({ onClose }) => () => {
  onClose()
}

const BreaktimeTimer = ({ onClose, breaktime }) => {
  const { currentTime } = useTime({
    isTimer: true,
    startTime: breaktime,
    callback: onClose,
  })

  return (
    <Modal isCentered onClose={createHandleClose({ onClose })}>
      <CenteredContent>
        <Heading size="2xl" color="tertiary" weight="normal">
          {formatMilliseconds(currentTime)}
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
  onClose: PropTypes.func.isRequired,
  breaktime: PropTypes.number.isRequired,
}

export default BreaktimeTimer
