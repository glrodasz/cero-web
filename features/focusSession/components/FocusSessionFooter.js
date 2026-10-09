import PropTypes from 'prop-types'
import { Button } from '@glrodasz/components'

const FocusSessionFooter = ({ onClickEndSession }) => {
  return (
    <Button onClick={onClickEndSession} type="primary" isDisabled>
      Finalizar tu sesión
    </Button>
  )
}

FocusSessionFooter.propTypes = {
  onClickEndSession: PropTypes.func.isRequired,
}

export default FocusSessionFooter
