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

const BreaktimeModal = ({ onClickClose }) => {
  return (
    <Modal isCentered onClose={onClickClose}>
      <CenteredContent>
        <Picture src="/images/couch-pause.svg" width={200}></Picture>
        <Heading size="xl" color="tertiary" isInline>
          Tomate un tiempo para refrescarte
        </Heading>
        <Spacer.Horizontal size=" sm" />
        <Paragraph>
          Siempre hay que celebrar los pequeños triunfos, por eso te invitamos a
          tomar un descanso para despejar tu mente.
        </Paragraph>
        <Spacer.Horizontal size="md" />
        <div style={{ display: 'flex', gap: '0 20px' }}>
          <Button isMuted>5 min</Button>
          <Button isMuted>10 min</Button>
          <Button isMuted>15 min</Button>
        </div>
      </CenteredContent>
    </Modal>
  )
}

BreaktimeModal.propTypes = {
  onClickClose: PropTypes.func.isRequired,
}

export default BreaktimeModal
