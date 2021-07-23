import PropTypes from 'prop-types'
import { Spacer, Button } from '@glrodasz/components'

const FocusSessionFooter = ({ onClickEndSession }) => {
  return (
    <>
      <Spacer.Vertical size="lg" />
      <Button onClick={onClickEndSession} type="primary" isDisabled>
        Finalizar tu sesión
      </Button>
    </>
  )
}

FocusSessionFooter.propTypes = {
  onClickEndSession: PropTypes.func.isRequired,
}

export default FocusSessionFooter
