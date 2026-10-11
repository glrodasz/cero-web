import PropTypes from 'prop-types'
import { Spacer, Button, Paragraph } from '@glrodasz/components'

const noop = () => {}

const RetrospectiveFooter = ({
  isRegisterDisabled,
  isRegistering,
  hasRegisterError,
  onClickRegisterSession,
  onClickSkipRegisterSession,
}) => {
  return (
    <>
      <Button
        onClick={isRegistering ? noop : onClickRegisterSession}
        type="primary"
        isDisabled={isRegisterDisabled || isRegistering}
      >
        {isRegistering ? 'Registrando…' : 'Registrar sesión'}
      </Button>
      {isRegisterDisabled && (
        <>
          <Spacer.Vertical size="xs" />
          <Paragraph size="sm" isCentered>
            Elige cómo te sentiste para registrar la sesión
          </Paragraph>
        </>
      )}
      {hasRegisterError && (
        <div role="alert">
          <Spacer.Vertical size="xs" />
          <Paragraph size="sm" color="primary" isCentered>
            No pudimos registrar la sesión. Inténtalo de nuevo.
          </Paragraph>
        </div>
      )}
      <Spacer.Vertical size="md" />
      <Button
        type="tertiary"
        onClick={isRegistering ? noop : onClickSkipRegisterSession}
      >
        No registrar esta sesión
      </Button>
    </>
  )
}

RetrospectiveFooter.propTypes = {
  isRegisterDisabled: PropTypes.bool,
  isRegistering: PropTypes.bool,
  hasRegisterError: PropTypes.bool,
  onClickRegisterSession: PropTypes.func.isRequired,
  onClickSkipRegisterSession: PropTypes.func.isRequired,
}

RetrospectiveFooter.defaultProps = {
  isRegisterDisabled: false,
  isRegistering: false,
  hasRegisterError: false,
}

export default RetrospectiveFooter
