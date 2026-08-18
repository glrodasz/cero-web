import PropTypes from 'prop-types'

import {
  Modal,
  CenteredContent,
  Picture,
  Heading,
  Spacer,
  Paragraph,
  Button,
} from '@glrodasz/components'

import time from '../../../utils/time'

const createCloseHandler =
  ({ onClose }) =>
  () => {
    onClose()
  }

const createChooseHandler =
  ({ onChoose }) =>
  (time) =>
  () => {
    onChoose(time)
  }

const BreaktimeConfirmation = ({ onClose, onChoose }) => {
  const createChooseBreaktimeHandler = createChooseHandler({ onChoose })

  return (
    <Modal isCentered onClose={createCloseHandler({ onClose })}>
      <CenteredContent>
        <Picture src="/images/couch-pause.svg" width={200}></Picture>
        <Spacer.Vertical size="md" />
        <Heading size="xl" color="tertiary" isCentered>
          Tomate un tiempo para refrescarte
        </Heading>
        <Spacer.Vertical size="sm" />
        <Paragraph color="inverted" isCentered>
          Siempre hay que celebrar los pequeños triunfos, por eso te invitamos a
          tomar un descanso para despejar tu mente.
        </Paragraph>
        <Spacer.Vertical size="lg" />
        <div style={{ display: 'flex', gap: '0 20px', width: '100%' }}>
          <Button
            onClick={createChooseBreaktimeHandler(time.FIVE_MINUTES_IN_MS)}
            isMuted
          >
            5 min
          </Button>
          <Button
            onClick={createChooseBreaktimeHandler(time.TEN_MINUTES_IN_MS)}
            isMuted
          >
            10 min
          </Button>
          <Button
            onClick={createChooseBreaktimeHandler(time.FIFTEEN_MINUTES_IN_MS)}
            isMuted
          >
            15 min
          </Button>
        </div>
      </CenteredContent>
    </Modal>
  )
}

BreaktimeConfirmation.propTypes = {
  onClose: PropTypes.func.isRequired,
  onChoose: PropTypes.func.isRequired,
}

export default BreaktimeConfirmation
