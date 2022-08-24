import React from 'react'

import {
  Modal,
  CenteredContent,
  Picture,
  Spacer,
  Heading,
  Paragraph,
  Button,
} from '@glrodasz/components'

import useTime from '../../common/hooks/useTime'
import formatMilliseconds from '../../../utils/formatMilliseconds'

const createHandleClose =
  ({ onClose }) =>
  () => {
    onClose()
  }

const PauseTimer = ({ onClose }) => {
  const { currentTime } = useTime({
    isTimer: false, // TODO: type: { isTimer: true, isStopwatch: false }
  })

  return (
    <Modal>
      <CenteredContent>
        <Heading size="2xl" color="tertiary" weight="normal" isCentered>
          {formatMilliseconds(currentTime)}
        </Heading>
        <Spacer.Vertical size="lg" />
        <Picture src="/images/forest-pause.svg" width={200}></Picture>
        <Spacer.Vertical size="md" />
        <Heading size="xl" color="tertiary">
          TU RETO ESTA EN PAUSA
        </Heading>
        <Spacer.Vertical size="sm" />
        <Paragraph color="inverted">
          Durante esta pausa tu tiempo de productividad no será registrado.
        </Paragraph>
        <Spacer.Vertical size="md" />
        <Button type="primary" onClick={createHandleClose({ onClose })} isMuted>
          Volver a mis tareas
        </Button>
      </CenteredContent>
    </Modal>
  )
}

export default PauseTimer
