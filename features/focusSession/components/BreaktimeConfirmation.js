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

import { time } from '../../common/constants'

const handleClickChoose = ({ onClickChoose }) => (time) => () => {
  onClickChoose(time)
}

const BreaktimeConfirmation = ({ onClickClose, onClickChoose }) => {
  const handleChooseBreaktime = handleClickChoose({ onClickChoose })

  return (
    <Modal isCentered onClose={onClickClose}>
      <CenteredContent>
        <Picture src="/images/couch-pause.svg" width={200}></Picture>
        <Spacer.Horizontal size="md" />
        <Heading size="xl" color="tertiary">
          Tomate un tiempo para refrescarte
        </Heading>
        <Spacer.Horizontal size="sm" />
        <Paragraph>
          Siempre hay que celebrar los pequeños triunfos, por eso te invitamos a
          tomar un descanso para despejar tu mente.
        </Paragraph>
        <Spacer.Horizontal size="md" />
        <div style={{ display: 'flex', gap: '0 20px' }}>
          <Button
            onClick={handleChooseBreaktime(time.FIVE_MINUTES_IN_MS)}
            isMuted
          >
            5 min
          </Button>
          <Button
            onClick={handleChooseBreaktime(time.TEN_MINUTES_IN_MS)}
            isMuted
          >
            10 min
          </Button>
          <Button
            onClick={handleChooseBreaktime(time.FIFTY_MINUTES_IN_MS)}
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
  onClickClose: PropTypes.func.isRequired,
  onClickChoose: PropTypes.func.isRequired,
}

export default BreaktimeConfirmation
