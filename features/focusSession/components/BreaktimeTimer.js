import PropTypes from 'prop-types'

import {
  Modal,
  CenteredContent,
  Picture,
  Heading,
  Spacer,
  Paragraph,
} from '@glrodasz/components'

import useTime from '../../common/hooks/useTime'
import formatMilliseconds from '../../../utils/formatMilliseconds'

const createHandleClose =
  ({ onClose }) =>
  () => {
    onClose()
  }

const BreaktimeTimer = ({ onClose, breaktime }) => {
  const { currentTime } = useTime({
    isTimer: true,
    startTime: breaktime,
    callback: onClose,
  })

  return (
    <Modal onClose={createHandleClose({ onClose })}>
      <CenteredContent>
        <Heading size="2xl" color="tertiary" weight="normal" isCentered>
          {formatMilliseconds(currentTime)}
        </Heading>
        <Spacer.Vertical size="lg" />
        <Picture src="/images/yoga-pause.svg" width={200}></Picture>
        <Spacer.Vertical size="md" />
        <Heading size="xl" color="tertiary">
          DESCONÉCTATE
        </Heading>
        <Spacer.Vertical size="sm" />
        <Paragraph color="inverted">
          Aléjate de la pantalla, estira el cuerpo y respira. Cuando termine el
          tiempo volverás a tus tareas.
        </Paragraph>
      </CenteredContent>
    </Modal>
  )
}

BreaktimeTimer.propTypes = {
  onClose: PropTypes.func.isRequired,
  breaktime: PropTypes.number.isRequired,
}

export default BreaktimeTimer
