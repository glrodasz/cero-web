import PropTypes from 'prop-types'
import { Spacer, Button } from '@glrodasz/components'

const RetrospectiveFooter = ({
  isRegisterMuted,
  onClickRegisterSession,
  onClickSkipRegisterSession,
}) => {
  return (
    <>
      <Spacer.Vertical size="lg" />
      <Button
        onClick={onClickRegisterSession}
        type="primary"
        isMuted={isRegisterMuted}
      >
        Registrar sesión
      </Button>
      <Spacer.Vertical size="md" />
      <Button type="tertiary" onClick={onClickSkipRegisterSession}>
        No registrar esta sesión
      </Button>
    </>
  )
}

RetrospectiveFooter.propTypes = {
  isRegisterMuted: PropTypes.bool,
  onClickRegisterSession: PropTypes.func.isRequired,
  onClickSkipRegisterSession: PropTypes.func.isRequired,
}

RetrospectiveFooter.defaultProps = {
  isRegisterMuted: false,
}

export default RetrospectiveFooter
