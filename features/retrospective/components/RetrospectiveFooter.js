import PropTypes from 'prop-types'
import { Spacer, Button } from '@glrodasz/components'

const RetrospectiveFooter = ({
  onClickRegisterSession,
  onClickSkipRegisterSession,
}) => {
  return (
    <>
      <Spacer.Vertical size="lg" />
      <Button onClick={onClickRegisterSession} type="primary">
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
  onClickRegisterSession: PropTypes.func.isRequired,
  onClickSkipRegisterSession: PropTypes.func.isRequired,
}

export default RetrospectiveFooter
